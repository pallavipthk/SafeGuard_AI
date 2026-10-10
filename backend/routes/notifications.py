from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Notification
from datetime import datetime

notifications_bp = Blueprint("notifications", __name__, url_prefix="/api/notifications")


@notifications_bp.route("", methods=["GET"])
@jwt_required()
def get_notifications():
    try:
        user_id = int(get_jwt_identity())
        notifications = (
            Notification.query.filter_by(user_id=user_id)
            .order_by(Notification.created_at.desc())
            .limit(50)
            .all()
        )
        unread_count = Notification.query.filter_by(user_id=user_id, read=False).count()

        return (
            jsonify(
                {
                    "notifications": [n.serialize() for n in notifications],
                    "unread_count": unread_count,
                }
            ),
            200,
        )
    except Exception as e:
        return jsonify({"error": f"Failed to fetch notifications: {str(e)}"}), 500


@notifications_bp.route("/<int:notification_id>/read", methods=["PUT"])
@jwt_required()
def mark_read(notification_id):
    try:
        user_id = int(get_jwt_identity())
        notification = Notification.query.filter_by(id=notification_id, user_id=user_id).first()
        if not notification:
            return jsonify({"error": "Notification not found"}), 404

        notification.read = True
        db.session.commit()

        unread_count = Notification.query.filter_by(user_id=user_id, read=False).count()
        return jsonify({"message": "Marked as read", "notification": notification.serialize(), "unread_count": unread_count}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Failed to mark as read: {str(e)}"}), 500


@notifications_bp.route("/read-all", methods=["PUT"])
@jwt_required()
def mark_all_read():
    try:
        user_id = int(get_jwt_identity())
        Notification.query.filter_by(user_id=user_id, read=False).update({"read": True})
        db.session.commit()

        return jsonify({"message": "All notifications marked as read", "unread_count": 0}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Failed to mark all as read: {str(e)}"}), 500


@notifications_bp.route("/<int:notification_id>", methods=["DELETE"])
@jwt_required()
def delete_notification(notification_id):
    try:
        user_id = int(get_jwt_identity())
        notification = Notification.query.filter_by(id=notification_id, user_id=user_id).first()
        if not notification:
            return jsonify({"error": "Notification not found"}), 404

        db.session.delete(notification)
        db.session.commit()

        unread_count = Notification.query.filter_by(user_id=user_id, read=False).count()
        return jsonify({"message": "Notification deleted", "unread_count": unread_count}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Failed to delete notification: {str(e)}"}), 500


@notifications_bp.route("", methods=["POST"])
@jwt_required()
def create_notification():
    try:
        user_id = int(get_jwt_identity())
        data = request.get_json()
        if not data or "title" not in data or "message" not in data:
            return jsonify({"error": "Title and message are required"}), 400

        target_user_id = data.get("user_id", user_id)
        notification = Notification(
            user_id=target_user_id,
            title=data["title"].strip(),
            message=data["message"].strip(),
            type=data.get("type", "info"),
            read=False,
            created_at=datetime.utcnow(),
        )
        db.session.add(notification)
        db.session.commit()

        return jsonify({"message": "Notification created", "notification": notification.serialize()}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Failed to create notification: {str(e)}"}), 500
