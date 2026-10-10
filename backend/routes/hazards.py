from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Report
from utils.helpers import allowed_file, save_uploaded_file
from config import Config
import os
from math import radians, sin, cos, sqrt, atan2

hazards_bp = Blueprint("hazards", __name__, url_prefix="/api/hazards")


def haversine(lat1, lon1, lat2, lon2):
    R = 6371000
    phi1 = radians(lat1)
    phi2 = radians(lat2)
    dphi = radians(lat2 - lat1)
    dlambda = radians(lon2 - lon1)
    a = sin(dphi / 2) ** 2 + cos(phi1) * cos(phi2) * sin(dlambda / 2) ** 2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))
    return R * c


@hazards_bp.route("/report", methods=["POST"])
@jwt_required()
def create_report():
    try:
        user_id = int(get_jwt_identity())

        hazard_type = request.form.get("type", "").strip()
        description = request.form.get("description", "").strip()
        location_lat = request.form.get("location_lat", type=float)
        location_lng = request.form.get("location_lng", type=float)
        address = request.form.get("address", "").strip()
        severity = request.form.get("severity", "medium").strip()

        valid_types = [
            "pothole",
            "signal",
            "damage",
            "waterlogging",
            "accident",
            "missing_sign",
        ]
        if hazard_type not in valid_types:
            return jsonify({"error": f"Invalid type. Must be one of: {', '.join(valid_types)}"}), 400

        if location_lat is None or location_lng is None:
            return jsonify({"error": "Location coordinates are required"}), 400

        image_url = None
        if "image" in request.files:
            file = request.files["image"]
            if file and allowed_file(file.filename):
                upload_folder = Config.UPLOAD_FOLDER
                os.makedirs(upload_folder, exist_ok=True)
                filename = save_uploaded_file(file, upload_folder)
                if filename:
                    image_url = f"/static/uploads/{filename}"

        report = Report(
            user_id=user_id,
            type=hazard_type,
            description=description,
            location_lat=location_lat,
            location_lng=location_lng,
            address=address,
            image_url=image_url,
            severity=severity,
            status="pending",
        )
        db.session.add(report)
        db.session.commit()

        return jsonify({"message": "Report created", "report": report.serialize()}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Failed to create report: {str(e)}"}), 500


@hazards_bp.route("", methods=["GET"])
@jwt_required()
def list_reports():
    try:
        page = request.args.get("page", 1, type=int)
        per_page = request.args.get("per_page", 10, type=int)
        status_filter = request.args.get("status")
        type_filter = request.args.get("type")
        severity_filter = request.args.get("severity")

        query = Report.query

        if status_filter:
            query = query.filter(Report.status == status_filter)
        if type_filter:
            query = query.filter(Report.type == type_filter)
        if severity_filter:
            query = query.filter(Report.severity == severity_filter)

        pagination = (
            query.order_by(Report.created_at.desc())
            .paginate(page=page, per_page=per_page, error_out=False)
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


@hazards_bp.route("/<int:report_id>", methods=["GET"])
@jwt_required()
def get_report(report_id):
    try:
        report = Report.query.get(report_id)
        if not report:
            return jsonify({"error": "Report not found"}), 404
        return jsonify({"report": report.serialize()}), 200
    except Exception as e:
        return jsonify({"error": f"Failed to fetch report: {str(e)}"}), 500


@hazards_bp.route("/<int:report_id>", methods=["PUT"])
@jwt_required()
def update_report(report_id):
    try:
        user_id = int(get_jwt_identity())
        report = Report.query.get(report_id)

        if not report:
            return jsonify({"error": "Report not found"}), 404

        if report.user_id != user_id:
            return jsonify({"error": "Unauthorized to update this report"}), 403

        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400

        if "description" in data:
            report.description = data["description"].strip()
        if "address" in data:
            report.address = data["address"].strip()
        if "severity" in data:
            valid_severities = ["low", "medium", "high", "critical"]
            if data["severity"] in valid_severities:
                report.severity = data["severity"]

        db.session.commit()
        return jsonify({"message": "Report updated", "report": report.serialize()}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Failed to update report: {str(e)}"}), 500


@hazards_bp.route("/<int:report_id>", methods=["DELETE"])
@jwt_required()
def delete_report(report_id):
    try:
        user_id = int(get_jwt_identity())
        report = Report.query.get(report_id)

        if not report:
            return jsonify({"error": "Report not found"}), 404

        if report.user_id != user_id:
            return jsonify({"error": "Unauthorized to delete this report"}), 403

        db.session.delete(report)
        db.session.commit()
        return jsonify({"message": "Report deleted"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Failed to delete report: {str(e)}"}), 500


@hazards_bp.route("/nearby", methods=["GET"])
@jwt_required()
def nearby_reports():
    try:
        lat = request.args.get("lat", type=float)
        lng = request.args.get("lng", type=float)
        radius = request.args.get("radius", 1000, type=float)

        if lat is None or lng is None:
            return jsonify({"error": "Latitude and longitude are required"}), 400

        all_reports = Report.query.filter(Report.status.in_(["pending", "verified"])).all()

        nearby = []
        for report in all_reports:
            distance = haversine(lat, lng, report.location_lat, report.location_lng)
            if distance <= radius:
                r = report.serialize()
                r["distance_meters"] = round(distance, 1)
                nearby.append(r)

        nearby.sort(key=lambda r: r["distance_meters"])

        return jsonify({"reports": nearby, "count": len(nearby), "radius_meters": radius}), 200
    except Exception as e:
        return jsonify({"error": f"Failed to fetch nearby reports: {str(e)}"}), 500
