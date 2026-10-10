from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Report, User, SafetyScore, Achievement, QuizResult
from sqlalchemy import func, extract
from datetime import datetime, timedelta

dashboard_bp = Blueprint("dashboard", __name__, url_prefix="/api/dashboard")


@dashboard_bp.route("/stats", methods=["GET"])
@jwt_required()
def get_stats():
    try:
        total_reports = Report.query.count()
        pending_reports = Report.query.filter_by(status="pending").count()
        verified_reports = Report.query.filter_by(status="verified").count()
        resolved_reports = Report.query.filter_by(status="resolved").count()
        total_users = User.query.count()

        report_types = (
            db.session.query(Report.type, func.count(Report.id))
            .group_by(Report.type)
            .all()
        )
        type_distribution = {t: count for t, count in report_types}

        severity_counts = (
            db.session.query(Report.severity, func.count(Report.id))
            .group_by(Report.severity)
            .all()
        )
        severity_distribution = {s: count for s, count in severity_counts}

        return (
            jsonify(
                {
                    "total_reports": total_reports,
                    "pending_reports": pending_reports,
                    "verified_reports": verified_reports,
                    "resolved_reports": resolved_reports,
                    "total_users": total_users,
                    "type_distribution": type_distribution,
                    "severity_distribution": severity_distribution,
                }
            ),
            200,
        )
    except Exception as e:
        return jsonify({"error": f"Failed to get stats: {str(e)}"}), 500


@dashboard_bp.route("/reports-trend", methods=["GET"])
@jwt_required()
def reports_trend():
    try:
        days = request.args.get("days", 7, type=int)
        since = datetime.utcnow() - timedelta(days=days)

        trend = (
            db.session.query(
                func.date(Report.created_at).label("date"),
                func.count(Report.id).label("count"),
            )
            .filter(Report.created_at >= since)
            .group_by(func.date(Report.created_at))
            .order_by(func.date(Report.created_at))
            .all()
        )

        result = [{"date": str(row.date), "count": row.count} for row in trend]

        return jsonify({"trend": result, "days": days}), 200
    except Exception as e:
        return jsonify({"error": f"Failed to get trend: {str(e)}"}), 500


@dashboard_bp.route("/hazard-density", methods=["GET"])
@jwt_required()
def hazard_density():
    try:
        reports = Report.query.filter(
            Report.status.in_(["pending", "verified"])
        ).all()

        points = [
            {
                "lat": r.location_lat,
                "lng": r.location_lng,
                "type": r.type,
                "severity": r.severity,
                "address": r.address,
                "id": r.id,
            }
            for r in reports
        ]

        type_counts = (
            db.session.query(Report.type, func.count(Report.id))
            .group_by(Report.type)
            .all()
        )
        distribution = {t: count for t, count in type_counts}

        return jsonify({"points": points, "distribution": distribution}), 200
    except Exception as e:
        return jsonify({"error": f"Failed to get density data: {str(e)}"}), 500


@dashboard_bp.route("/risk-categories", methods=["GET"])
@jwt_required()
def risk_categories():
    try:
        user_id = int(get_jwt_identity())
        scores = (
            SafetyScore.query.filter_by(user_id=user_id)
            .order_by(SafetyScore.created_at.desc())
            .limit(30)
            .all()
        )

        high_risk = sum(1 for s in scores if s.score < 40) if scores else 0
        medium_risk = sum(1 for s in scores if 40 <= s.score < 70) if scores else 0
        low_risk = sum(1 for s in scores if s.score >= 70) if scores else 0

        avg_score = (
            db.session.query(func.avg(SafetyScore.score))
            .filter(SafetyScore.user_id == user_id)
            .scalar()
        )

        return (
            jsonify(
                {
                    "high_risk": high_risk,
                    "medium_risk": medium_risk,
                    "low_risk": low_risk,
                    "average_score": round(avg_score, 1) if avg_score else 70,
                    "total_assessments": len(scores),
                }
            ),
            200,
        )
    except Exception as e:
        return jsonify({"error": f"Failed to get risk categories: {str(e)}"}), 500


@dashboard_bp.route("/safety-score", methods=["GET"])
@jwt_required()
def safety_score():
    try:
        user_id = int(get_jwt_identity())

        last_12 = (
            SafetyScore.query.filter_by(user_id=user_id)
            .order_by(SafetyScore.created_at.desc())
            .limit(12)
        ).all()

        current_month = datetime.utcnow().month
        current_year = datetime.utcnow().year

        this_month = SafetyScore.query.filter_by(
            user_id=user_id, month=current_month, year=current_year
        ).first()

        current_score = this_month.score if this_month else 70

        quiz_avg = (
            db.session.query(func.avg(QuizResult.score * 100.0 / QuizResult.total))
            .filter(QuizResult.user_id == user_id)
            .scalar()
        )

        achievements_count = Achievement.query.filter_by(user_id=user_id).count()

        trend = [
            {"month": s.month, "year": s.year, "score": s.score}
            for s in reversed(last_12)
        ]

        return (
            jsonify(
                {
                    "current_score": current_score,
                    "quiz_average": round(quiz_avg, 1) if quiz_avg else 0,
                    "achievements": achievements_count,
                    "monthly_trend": trend,
                }
            ),
            200,
        )
    except Exception as e:
        return jsonify({"error": f"Failed to get safety score: {str(e)}"}), 500


@dashboard_bp.route("/leaderboard", methods=["GET"])
@jwt_required()
def leaderboard():
    try:
        users = User.query.all()
        leaderboard_data = []

        for user in users:
            avg_score = (
                db.session.query(func.avg(SafetyScore.score))
                .filter(SafetyScore.user_id == user.id)
                .scalar()
            )
            report_count = Report.query.filter_by(user_id=user.id).count()
            achievement_count = Achievement.query.filter_by(user_id=user.id).count()

            leaderboard_data.append(
                {
                    "user_id": user.id,
                    "name": user.name,
                    "avatar": user.avatar,
                    "average_safety_score": round(avg_score, 1) if avg_score else 0,
                    "reports_count": report_count,
                    "achievements_count": achievement_count,
                }
            )

        leaderboard_data.sort(
            key=lambda x: (x["average_safety_score"], x["achievements_count"]),
            reverse=True,
        )

        for idx, entry in enumerate(leaderboard_data, 1):
            entry["rank"] = idx

        return jsonify({"leaderboard": leaderboard_data}), 200
    except Exception as e:
        return jsonify({"error": f"Failed to get leaderboard: {str(e)}"}), 500
