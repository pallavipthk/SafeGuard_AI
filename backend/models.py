from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=True)
    name = db.Column(db.String(100), nullable=False)
    avatar = db.Column(db.String(256), nullable=True)
    role = db.Column(db.String(20), default="user")
    google_id = db.Column(db.String(100), nullable=True, unique=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    reports = db.relationship("Report", backref="author", lazy="dynamic")
    chat_histories = db.relationship("ChatHistory", backref="user", lazy="dynamic")
    quiz_results = db.relationship("QuizResult", backref="user", lazy="dynamic")
    safety_scores = db.relationship("SafetyScore", backref="user", lazy="dynamic")
    achievements = db.relationship("Achievement", backref="user", lazy="dynamic")
    notifications = db.relationship("Notification", backref="user", lazy="dynamic")

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        if self.password_hash is None:
            return False
        return check_password_hash(self.password_hash, password)

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "name": self.name,
            "avatar": self.avatar,
            "role": self.role,
            "google_id": self.google_id,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }

    def to_dict(self):
        return self.serialize()


class Report(db.Model):
    __tablename__ = "reports"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    type = db.Column(
        db.String(50),
        nullable=False,
    )
    description = db.Column(db.Text, nullable=True)
    location_lat = db.Column(db.Float, nullable=False)
    location_lng = db.Column(db.Float, nullable=False)
    address = db.Column(db.String(500), nullable=True)
    image_url = db.Column(db.String(256), nullable=True)
    severity = db.Column(
        db.String(20),
        default="medium",
    )
    status = db.Column(
        db.String(20),
        default="pending",
    )
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "type": self.type,
            "description": self.description,
            "location_lat": self.location_lat,
            "location_lng": self.location_lng,
            "address": self.address,
            "image_url": self.image_url,
            "severity": self.severity,
            "status": self.status,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "author_name": self.author.name if self.author else None,
        }


class ChatHistory(db.Model):
    __tablename__ = "chat_history"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    message = db.Column(db.Text, nullable=False)
    response = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "message": self.message,
            "response": self.response,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }


class QuizResult(db.Model):
    __tablename__ = "quiz_results"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    score = db.Column(db.Integer, nullable=False)
    total = db.Column(db.Integer, nullable=False)
    category = db.Column(db.String(100), nullable=True)
    completed_at = db.Column(db.DateTime, default=datetime.utcnow)

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "score": self.score,
            "total": self.total,
            "percentage": round((self.score / self.total) * 100, 1) if self.total > 0 else 0,
            "category": self.category,
            "completed_at": self.completed_at.isoformat() if self.completed_at else None,
        }


class SafetyScore(db.Model):
    __tablename__ = "safety_scores"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    score = db.Column(db.Float, nullable=False)
    quiz_performance = db.Column(db.Float, nullable=True)
    risk_assessments = db.Column(db.Float, nullable=True)
    driving_habits = db.Column(db.Float, nullable=True)
    month = db.Column(db.Integer, nullable=False)
    year = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "score": self.score,
            "quiz_performance": self.quiz_performance,
            "risk_assessments": self.risk_assessments,
            "driving_habits": self.driving_habits,
            "month": self.month,
            "year": self.year,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }


class Achievement(db.Model):
    __tablename__ = "achievements"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    badge_type = db.Column(
        db.String(50),
        nullable=False,
    )
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    earned_at = db.Column(db.DateTime, default=datetime.utcnow)

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "badge_type": self.badge_type,
            "name": self.name,
            "description": self.description,
            "earned_at": self.earned_at.isoformat() if self.earned_at else None,
        }


class Notification(db.Model):
    __tablename__ = "notifications"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    message = db.Column(db.Text, nullable=False)
    type = db.Column(
        db.String(30),
        default="info",
    )
    read = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "title": self.title,
            "message": self.message,
            "type": self.type,
            "read": self.read,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }


class Contact(db.Model):
    __tablename__ = "contacts"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    subject = db.Column(db.String(200), nullable=True)
    message = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "subject": self.subject,
            "message": self.message,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
