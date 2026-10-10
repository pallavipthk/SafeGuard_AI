from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    create_access_token,
    jwt_required,
    get_jwt_identity,
)
from models import db, User
from utils.helpers import validate_email
import re

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")


@auth_bp.route("/register", methods=["POST"])
def register():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400

        name = data.get("name", "").strip()
        email = data.get("email", "").strip().lower()
        password = data.get("password", "")

        if not name or not email or not password:
            return jsonify({"error": "Name, email, and password are required"}), 400

        if not validate_email(email):
            return jsonify({"error": "Invalid email format"}), 400

        if len(password) < 6:
            return jsonify({"error": "Password must be at least 6 characters"}), 400

        if User.query.filter_by(email=email).first():
            return jsonify({"error": "Email already registered"}), 409

        user = User(name=name, email=email)
        user.set_password(password)
        db.session.add(user)
        db.session.commit()

        token = create_access_token(identity=str(user.id))

        return (
            jsonify(
                {
                    "message": "Registration successful",
                    "token": token,
                    "user": user.serialize(),
                }
            ),
            201,
        )
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Registration failed: {str(e)}"}), 500


@auth_bp.route("/login", methods=["POST"])
def login():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400

        email = data.get("email", "").strip().lower()
        password = data.get("password", "")

        if not email or not password:
            return jsonify({"error": "Email and password are required"}), 400

        user = User.query.filter_by(email=email).first()
        if not user or not user.check_password(password):
            return jsonify({"error": "Invalid email or password"}), 401

        token = create_access_token(identity=str(user.id))

        return jsonify({"message": "Login successful", "token": token, "user": user.serialize()}), 200
    except Exception as e:
        return jsonify({"error": f"Login failed: {str(e)}"}), 500


@auth_bp.route("/profile", methods=["GET"])
@jwt_required()
def get_profile():
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404

        return jsonify({"user": user.serialize()}), 200
    except Exception as e:
        return jsonify({"error": f"Failed to get profile: {str(e)}"}), 500


@auth_bp.route("/profile", methods=["PUT"])
@jwt_required()
def update_profile():
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404

        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400

        if "name" in data and data["name"].strip():
            user.name = data["name"].strip()
        if "email" in data and data["email"].strip():
            new_email = data["email"].strip().lower()
            if not validate_email(new_email):
                return jsonify({"error": "Invalid email format"}), 400
            existing = User.query.filter(
                User.email == new_email, User.id != user_id
            ).first()
            if existing:
                return jsonify({"error": "Email already in use"}), 409
            user.email = new_email
        if "avatar" in data:
            user.avatar = data["avatar"]

        db.session.commit()
        return jsonify({"message": "Profile updated", "user": user.serialize()}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Failed to update profile: {str(e)}"}), 500


@auth_bp.route("/change-password", methods=["POST"])
@jwt_required()
def change_password():
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404

        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400

        current_password = data.get("current_password", "")
        new_password = data.get("new_password", "")

        if not current_password or not new_password:
            return jsonify({"error": "Current and new password are required"}), 400

        if not user.check_password(current_password):
            return jsonify({"error": "Current password is incorrect"}), 401

        if len(new_password) < 6:
            return jsonify({"error": "New password must be at least 6 characters"}), 400

        user.set_password(new_password)
        db.session.commit()

        return jsonify({"message": "Password changed successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Failed to change password: {str(e)}"}), 500
