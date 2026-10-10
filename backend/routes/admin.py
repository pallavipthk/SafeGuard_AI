from flask import Blueprint, request, jsonify, Response
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, User, Report, Achievement, SafetyScore, QuizResult, Contact
from sqlalchemy import func
from datetime import datetime
import csv
import io

try:
    from reportlab.lib.pagesizes import letter
    from reportlab.lib.units import inch
    from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
    from reportlab.lib.styles import getSampleStyleSheet
    from reportlab.lib import colors
    REPORTLAB_AVAILABLE = True
except ImportError:
    REPORTLAB_AVAILABLE = False

admin_bp = Blueprint("admin", __name__, url_prefix="/api/admin")


def admin_required(f):
    from functools import wraps

    @wraps(f)
    def decorated(*args, **kwargs):
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        if not user or user.role != "admin":
            return jsonify({"error": "Admin access required"}), 403
        return f(*args, **kwargs)

    return decorated


@admin_bp.route("/users", methods=["GET"])
@jwt_required()
@admin_required
def list_users():
    try:
        page = request.args.get("page", 1, type=int)
        per_page = request.args.get("per_page", 20, type=int)
        search = request.args.get("search", "").strip()

        query = User.query
        if search:
            query = query.filter(
                User.name.ilike(f"%{search}%") | User.email.ilike(f"%{search}%")
            )

        pagination = query.order_by(User.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )

        users_data = []
        for u in pagination.items:
            data = u.serialize()
            data["reports_count"] = Report.query.filter_by(user_id=u.id).count()
            data["achievements_count"] = Achievement.query.filter_by(user_id=u.id).count()
            users_data.append(data)

        return (
            jsonify(
                {
                    "users": users_data,
                    "total": pagination.total,
                    "pages": pagination.pages,
                    "current_page": page,
                }
            ),
            200,
        )
    except Exception as e:
        return jsonify({"error": f"Failed to fetch users: {str(e)}"}), 500


@admin_bp.route("/users/<int:user_id>", methods=["PUT"])
@jwt_required()
@admin_required
def update_user(user_id):
    try:
        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404

        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400

        if "role" in data and data["role"] in ("user", "admin"):
            user.role = data["role"]
        if "name" in data and data["name"].strip():
            user.name = data["name"].strip()
        if "email" in data and data["email"].strip():
            user.email = data["email"].strip().lower()

        db.session.commit()
        return jsonify({"message": "User updated", "user": user.serialize()}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Failed to update user: {str(e)}"}), 500


@admin_bp.route("/users/<int:user_id>", methods=["DELETE"])
@jwt_required()
@admin_required
def delete_user(user_id):
    try:
        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404

        Report.query.filter_by(user_id=user.id).delete()
        Achievement.query.filter_by(user_id=user.id).delete()
        SafetyScore.query.filter_by(user_id=user.id).delete()
        QuizResult.query.filter_by(user_id=user.id).delete()

        db.session.delete(user)
        db.session.commit()

        return jsonify({"message": "User and all associated data deleted"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Failed to delete user: {str(e)}"}), 500


@admin_bp.route("/reports", methods=["GET"])
@jwt_required()
@admin_required
def list_reports():
    try:
        page = request.args.get("page", 1, type=int)
        per_page = request.args.get("per_page", 20, type=int)
        status_filter = request.args.get("status")
        type_filter = request.args.get("type")

        query = Report.query
        if status_filter:
            query = query.filter(Report.status == status_filter)
        if type_filter:
            query = query.filter(Report.type == type_filter)

        pagination = query.order_by(Report.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )

        return (
            jsonify(
                {
                    "reports": [r.serialize() for r in pagination.items],
                    "total": pagination.total,
                    "pages": pagination.pages,
                    "current_page": page,
                }
            ),
            200,
        )
    except Exception as e:
        return jsonify({"error": f"Failed to fetch reports: {str(e)}"}), 500


@admin_bp.route("/reports/<int:report_id>/verify", methods=["PUT"])
@jwt_required()
@admin_required
def verify_report(report_id):
    try:
        report = Report.query.get(report_id)
        if not report:
            return jsonify({"error": "Report not found"}), 404

        data = request.get_json() or {}
        action = data.get("action", "verify")

        if action == "verify":
            report.status = "verified"
            message = "Report verified"
        elif action == "resolve":
            report.status = "resolved"
            message = "Report marked as resolved"
        else:
            report.status = "pending"
            message = "Report status reset"

        if "severity" in data:
            valid = ["low", "medium", "high", "critical"]
            if data["severity"] in valid:
                report.severity = data["severity"]

        db.session.commit()

        report_counts = (
            db.session.query(Report.status, func.count(Report.id))
            .group_by(Report.status)
            .all()
        )

        return (
            jsonify(
                {
                    "message": message,
                    "report": report.serialize(),
                    "report_counts": {s: c for s, c in report_counts},
                }
            ),
            200,
        )
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Failed to verify report: {str(e)}"}), 500


@admin_bp.route("/reports/<int:report_id>", methods=["DELETE"])
@jwt_required()
@admin_required
def delete_report(report_id):
    try:
        report = Report.query.get(report_id)
        if not report:
            return jsonify({"error": "Report not found"}), 404

        db.session.delete(report)
        db.session.commit()

        return jsonify({"message": "Report deleted"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Failed to delete report: {str(e)}"}), 500


@admin_bp.route("/analytics", methods=["GET"])
@jwt_required()
@admin_required
def analytics():
    try:
        total_users = User.query.count()
        total_reports = Report.query.count()
        total_quizzes = QuizResult.query.count()
        total_achievements = Achievement.query.count()

        reports_by_type = (
            db.session.query(Report.type, func.count(Report.id))
            .group_by(Report.type)
            .all()
        )

        reports_by_status = (
            db.session.query(Report.status, func.count(Report.id))
            .group_by(Report.status)
            .all()
        )

        reports_by_severity = (
            db.session.query(Report.severity, func.count(Report.id))
            .group_by(Report.severity)
            .all()
        )

        avg_safety_score = db.session.query(func.avg(SafetyScore.score)).scalar()

        avg_quiz_score = db.session.query(
            func.avg(QuizResult.score * 100.0 / QuizResult.total)
        ).scalar()

        recent_reports = (
            Report.query.order_by(Report.created_at.desc()).limit(5).all()
        )

        return (
            jsonify(
                {
                    "overview": {
                        "total_users": total_users,
                        "total_reports": total_reports,
                        "total_quizzes": total_quizzes,
                        "total_achievements": total_achievements,
                        "average_safety_score": round(avg_safety_score, 1) if avg_safety_score else 0,
                        "average_quiz_score": round(avg_quiz_score, 1) if avg_quiz_score else 0,
                    },
                    "reports_by_type": {t: c for t, c in reports_by_type},
                    "reports_by_status": {s: c for s, c in reports_by_status},
                    "reports_by_severity": {s: c for s, c in reports_by_severity},
                    "recent_reports": [r.serialize() for r in recent_reports],
                }
            ),
            200,
        )
    except Exception as e:
        return jsonify({"error": f"Failed to fetch analytics: {str(e)}"}), 500


@admin_bp.route("/export/csv", methods=["GET"])
@jwt_required()
@admin_required
def export_csv():
    try:
        export_type = request.args.get("type", "reports")

        output = io.StringIO()
        writer = csv.writer(output)

        if export_type == "reports":
            writer.writerow(
                ["ID", "User ID", "Type", "Description", "Lat", "Lng", "Address", "Severity", "Status", "Created At"]
            )
            reports = Report.query.order_by(Report.created_at.desc()).all()
            for r in reports:
                writer.writerow(
                    [
                        r.id,
                        r.user_id,
                        r.type,
                        r.description,
                        r.location_lat,
                        r.location_lng,
                        r.address,
                        r.severity,
                        r.status,
                        r.created_at,
                    ]
                )

        elif export_type == "users":
            writer.writerow(["ID", "Name", "Email", "Role", "Created At"])
            users = User.query.order_by(User.created_at.desc()).all()
            for u in users:
                writer.writerow([u.id, u.name, u.email, u.role, u.created_at])

        else:
            return jsonify({"error": "Invalid export type. Use 'reports' or 'users'"}), 400

        csv_content = output.getvalue()
        output.close()

        return Response(
            csv_content,
            mimetype="text/csv",
            headers={
                "Content-Disposition": f"attachment; filename={export_type}_{datetime.utcnow().strftime('%Y%m%d')}.csv",
                "Content-Type": "text/csv",
            },
        )
    except Exception as e:
        return jsonify({"error": f"CSV export failed: {str(e)}"}), 500


@admin_bp.route("/export/pdf", methods=["GET"])
@jwt_required()
@admin_required
def export_pdf():
    try:
        export_type = request.args.get("type", "reports")

        if not REPORTLAB_AVAILABLE:
            return jsonify({"error": "ReportLab is not installed. Cannot generate PDF."}), 500

        buffer = io.BytesIO()

        doc = SimpleDocTemplate(buffer, pagesize=letter)
        styles = getSampleStyleSheet()
        elements = []

        elements.append(Paragraph(f"SafeGuard AI - {export_type.title()} Export", styles["Title"]))
        elements.append(Spacer(1, 0.25 * inch))
        elements.append(
            Paragraph(f"Generated on: {datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S UTC')}", styles["Normal"])
        )
        elements.append(Spacer(1, 0.5 * inch))

        if export_type == "reports":
            header = ["ID", "Type", "Severity", "Status", "Date"]
            reports = Report.query.order_by(Report.created_at.desc()).limit(100).all()
            data = [header]
            for r in reports:
                data.append(
                    [
                        str(r.id),
                        r.type,
                        r.severity,
                        r.status,
                        r.created_at.strftime("%Y-%m-%d") if r.created_at else "",
                    ]
                )

            table = Table(data)
            table.setStyle(
                TableStyle(
                    [
                        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#1a73e8")),
                        ("TEXTCOLOR", (0, 0), (-1, 0), colors.whitesmoke),
                        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
                        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                        ("FONTSIZE", (0, 0), (-1, -1), 10),
                        ("BOTTOMPADDING", (0, 0), (-1, 0), 12),
                        ("GRID", (0, 0), (-1, -1), 1, colors.black),
                    ]
                )
            )
            elements.append(table)

        elif export_type == "users":
            header = ["ID", "Name", "Email", "Role", "Date"]
            users = User.query.order_by(User.created_at.desc()).limit(100).all()
            data = [header]
            for u in users:
                data.append(
                    [
                        str(u.id),
                        u.name,
                        u.email,
                        u.role,
                        u.created_at.strftime("%Y-%m-%d") if u.created_at else "",
                    ]
                )

            table = Table(data)
            table.setStyle(
                TableStyle(
                    [
                        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#1a73e8")),
                        ("TEXTCOLOR", (0, 0), (-1, 0), colors.whitesmoke),
                        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
                        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                        ("FONTSIZE", (0, 0), (-1, -1), 10),
                        ("BOTTOMPADDING", (0, 0), (-1, 0), 12),
                        ("GRID", (0, 0), (-1, -1), 1, colors.black),
                    ]
                )
            )
            elements.append(table)

        else:
            return jsonify({"error": "Invalid export type. Use 'reports' or 'users'"}), 400

        doc.build(elements)
        pdf_content = buffer.getvalue()
        buffer.close()

        return Response(
            pdf_content,
            mimetype="application/pdf",
            headers={
                "Content-Disposition": f"attachment; filename={export_type}_{datetime.utcnow().strftime('%Y%m%d')}.pdf",
                "Content-Type": "application/pdf",
            },
        )
    except Exception as e:
        return jsonify({"error": f"PDF export failed: {str(e)}"}), 500
