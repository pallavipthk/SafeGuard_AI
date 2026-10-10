from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, ChatHistory
from ai.gemini import SafeTextGeneration
import os

chat_bp = Blueprint("chat", __name__, url_prefix="/api/chat")
text_gen = SafeTextGeneration()


@chat_bp.route("/send", methods=["POST"])
@jwt_required()
def send_message():
    try:
        user_id = int(get_jwt_identity())
        data = request.get_json()

        if not data or not data.get("message", "").strip():
            return jsonify({"error": "Message is required"}), 400

        message = data["message"].strip()

        history = ChatHistory.query.filter_by(user_id=user_id).order_by(
            ChatHistory.created_at.desc()
        ).limit(5).all()

        history_data = [h.serialize() for h in reversed(history)]

        response_text = text_gen.chat(message, history=history_data)

        chat_entry = ChatHistory(
            user_id=user_id, message=message, response=response_text
        )
        db.session.add(chat_entry)
        db.session.commit()

        return (
            jsonify(
                {
                    "response": response_text,
                    "chat_id": chat_entry.id,
                    "created_at": chat_entry.created_at.isoformat(),
                }
            ),
            200,
        )
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Chat failed: {str(e)}"}), 500


@chat_bp.route("/history", methods=["GET"])
@jwt_required()
def get_history():
    try:
        user_id = int(get_jwt_identity())
        page = request.args.get("page", 1, type=int)
        per_page = request.args.get("per_page", 20, type=int)

        pagination = (
            ChatHistory.query.filter_by(user_id=user_id)
            .order_by(ChatHistory.created_at.desc())
            .paginate(page=page, per_page=per_page, error_out=False)
        )

        return (
            jsonify(
                {
                    "history": [h.serialize() for h in pagination.items],
                    "total": pagination.total,
                    "pages": pagination.pages,
                    "current_page": page,
                }
            ),
            200,
        )
    except Exception as e:
        return jsonify({"error": f"Failed to get history: {str(e)}"}), 500


@chat_bp.route("/history/<int:chat_id>", methods=["DELETE"])
@jwt_required()
def delete_history(chat_id):
    try:
        user_id = int(get_jwt_identity())
        chat = ChatHistory.query.filter_by(id=chat_id, user_id=user_id).first()

        if not chat:
            return jsonify({"error": "Chat entry not found"}), 404

        db.session.delete(chat)
        db.session.commit()

        return jsonify({"message": "Chat entry deleted"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Failed to delete: {str(e)}"}), 500


@chat_bp.route("/suggest", methods=["POST"])
@jwt_required()
def suggest():
    try:
        user_id = int(get_jwt_identity())
        data = request.get_json()
        context = data.get("context", "") if data else ""

        tips = text_gen.suggest_safety_tips(context)

        return jsonify({"tips": tips}), 200
    except Exception as e:
        return jsonify({"error": f"Failed to get suggestions: {str(e)}"}), 500
