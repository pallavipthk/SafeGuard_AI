from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ai.vision import detect_sign, analyze_hazard_severity
from ai.gemini import VisionAnalysis
from utils.helpers import allowed_file, save_uploaded_file
from config import Config
import os

vision_bp = Blueprint("vision", __name__, url_prefix="/api/vision")


@vision_bp.route("/analyze", methods=["POST"])
@jwt_required()
def analyze():
    try:
        user_id = int(get_jwt_identity())

        if "image" not in request.files:
            return jsonify({"error": "No image file provided"}), 400

        file = request.files["image"]
        if file.filename == "":
            return jsonify({"error": "No selected file"}), 400

        if not allowed_file(file.filename):
            return jsonify({"error": "File type not allowed. Use jpg, png, or jpeg"}), 400

        upload_folder = Config.UPLOAD_FOLDER
        os.makedirs(upload_folder, exist_ok=True)

        filename = save_uploaded_file(file, upload_folder)
        if not filename:
            return jsonify({"error": "Failed to save file"}), 500

        image_path = os.path.join(upload_folder, filename)

        sign_result = detect_sign(image_path)

        severity_result = analyze_hazard_severity(image_path)

        gemini_vision = VisionAnalysis()
        gemini_result = gemini_vision.analyze_road_sign(image_path)
        import json as json_module

        try:
            gemini_data = json_module.loads(gemini_result) if isinstance(gemini_result, str) else gemini_result
        except Exception:
            gemini_data = {"raw": gemini_result}

        return (
            jsonify(
                {
                    "success": True,
                    "image_url": f"/static/uploads/{filename}",
                    "sign_detection": sign_result,
                    "hazard_analysis": severity_result,
                    "ai_analysis": gemini_data,
                }
            ),
            200,
        )
    except Exception as e:
        return jsonify({"error": f"Analysis failed: {str(e)}"}), 500
