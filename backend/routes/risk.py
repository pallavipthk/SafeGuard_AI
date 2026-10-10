from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, SafetyScore
from ai.gemini import SafeTextGeneration
from utils.helpers import calculate_safety_score
from datetime import datetime

risk_bp = Blueprint("risk", __name__, url_prefix="/api/risk")
text_gen = SafeTextGeneration()


@risk_bp.route("/predict", methods=["POST"])
@jwt_required()
def predict_risk():
    try:
        user_id = int(get_jwt_identity())
        data = request.get_json()

        if not data:
            return jsonify({"error": "No data provided"}), 400

        speed = data.get("speed", 0)
        weather = data.get("weather", "clear")
        traffic = data.get("traffic", "low")
        road = data.get("road", "highway")
        time_of_day = data.get("time_of_day", 12)

        if not isinstance(speed, (int, float)) or speed < 0:
            return jsonify({"error": "Speed must be a non-negative number"}), 400

        valid_weather = ["clear", "rainy", "foggy", "snowy"]
        valid_traffic = ["low", "moderate", "heavy"]
        valid_road = ["highway", "city", "rural", "construction"]

        if weather not in valid_weather:
            return jsonify({"error": f"Weather must be one of: {', '.join(valid_weather)}"}), 400
        if traffic not in valid_traffic:
            return jsonify({"error": f"Traffic must be one of: {', '.join(valid_traffic)}"}), 400
        if road not in valid_road:
            return jsonify({"error": f"Road must be one of: {', '.join(valid_road)}"}), 400

        analysis = text_gen.analyze_risk(speed, weather, traffic, road, time_of_day)

        user_score = calculate_safety_score(
            risk_assessments=[analysis["probability"]]
        )

        now = datetime.utcnow()
        safety_record = SafetyScore(
            user_id=user_id,
            score=user_score,
            risk_assessments=analysis["risk_score"],
            month=now.month,
            year=now.year,
        )
        db.session.add(safety_record)
        db.session.commit()

        return (
            jsonify(
                {
                    "risk_analysis": analysis,
                    "safety_score": user_score,
                    "inputs": {
                        "speed": speed,
                        "weather": weather,
                        "traffic": traffic,
                        "road": road,
                        "time_of_day": time_of_day,
                    },
                }
            ),
            200,
        )
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Risk prediction failed: {str(e)}"}), 500


@risk_bp.route("/history", methods=["GET"])
@jwt_required()
def risk_history():
    try:
        user_id = int(get_jwt_identity())
        limit = request.args.get("limit", 10, type=int)

        scores = (
            SafetyScore.query.filter_by(user_id=user_id)
            .order_by(SafetyScore.created_at.desc())
            .limit(limit)
            .all()
        )

        return jsonify({"history": [s.serialize() for s in scores]}), 200
    except Exception as e:
        return jsonify({"error": f"Failed to fetch history: {str(e)}"}), 500
