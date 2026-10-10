import os
from flask import Flask, send_from_directory, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

from config import Config
from models import db, User, Report, Achievement, SafetyScore, Notification

jwt = JWTManager()
limiter = Limiter(key_func=get_remote_address, storage_uri="memory://")
_initialized = False


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(
        app,
        resources={
            r"/api/*": {
                "origins": "*",
                "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
                "allow_headers": ["Content-Type", "Authorization"],
            }
        },
    )

    db.init_app(app)
    jwt.init_app(app)
    limiter.init_app(app)

    os.makedirs(Config.UPLOAD_FOLDER, exist_ok=True)

    from routes.auth import auth_bp
    from routes.chat import chat_bp
    from routes.vision import vision_bp
    from routes.hazards import hazards_bp
    from routes.risk import risk_bp
    from routes.dashboard import dashboard_bp
    from routes.sos import sos_bp
    from routes.learning import learning_bp
    from routes.admin import admin_bp
    from routes.notifications import notifications_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(chat_bp)
    app.register_blueprint(vision_bp)
    app.register_blueprint(hazards_bp)
    app.register_blueprint(risk_bp)
    app.register_blueprint(dashboard_bp)
    app.register_blueprint(sos_bp)
    app.register_blueprint(learning_bp)
    app.register_blueprint(admin_bp)
    app.register_blueprint(notifications_bp)

    @app.route("/static/uploads/<filename>")
    def uploaded_file(filename):
        return send_from_directory(Config.UPLOAD_FOLDER, filename)

    @app.route("/api/health")
    def health_check():
        return jsonify({"status": "healthy", "message": "SafeGuard AI API is running"}), 200

    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        return jsonify({"error": "Invalid token", "message": str(error)}), 401

    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return jsonify({"error": "Token has expired"}), 401

    @jwt.unauthorized_loader
    def missing_token_callback(error):
        return jsonify({"error": "Authorization token is required"}), 401

    @app.errorhandler(404)
    def not_found(error):
        return jsonify({"error": "Endpoint not found"}), 404

    @app.errorhandler(405)
    def method_not_allowed(error):
        return jsonify({"error": "Method not allowed"}), 405

    @app.errorhandler(413)
    def too_large(error):
        return jsonify({"error": "File too large. Maximum size is 16MB"}), 413

    @app.errorhandler(500)
    def server_error(error):
        return jsonify({"error": "Internal server error"}), 500

    with app.app_context():
        db.create_all()
        seed_data()

    return app


def seed_data():
    global _initialized
    if _initialized:
        return

    seed_notifications()

    if User.query.filter_by(email="admin@safeguard.ai").first():
        _initialized = True
        return

    admin = User(
        email="admin@safeguard.ai",
        name="Admin",
        role="admin",
    )
    admin.set_password("Admin@123")
    db.session.add(admin)

    demo_user = User(
        email="user@safeguard.ai",
        name="Demo User",
        role="user",
    )
    demo_user.set_password("User@123")
    db.session.add(demo_user)
    db.session.flush()

    sample_reports = [
        Report(
            user_id=demo_user.id,
            type="pothole",
            description="Large pothole on MG Road near the signal, causing tire damage",
            location_lat=12.9716,
            location_lng=77.5946,
            address="MG Road, Bangalore",
            severity="high",
            status="verified",
        ),
        Report(
            user_id=demo_user.id,
            type="signal",
            description="Traffic signal not working at junction",
            location_lat=12.9766,
            location_lng=77.5996,
            address="Brigade Road Junction, Bangalore",
            severity="medium",
            status="pending",
        ),
        Report(
            user_id=demo_user.id,
            type="waterlogging",
            description="Severe water logging after rain, road blocked",
            location_lat=12.9616,
            location_lng=77.5846,
            address="Old Airport Road, Bangalore",
            severity="critical",
            status="verified",
        ),
        Report(
            user_id=demo_user.id,
            type="damage",
            description="Road damaged near the construction site",
            location_lat=12.9666,
            location_lng=77.5896,
            address="Outer Ring Road, Bangalore",
            severity="medium",
            status="pending",
        ),
        Report(
            user_id=demo_user.id,
            type="accident",
            description="Minor accident reported, needs traffic management",
            location_lat=12.9816,
            location_lng=77.6046,
            address="Silk Board Junction, Bangalore",
            severity="high",
            status="resolved",
        ),
        Report(
            user_id=demo_user.id,
            type="missing_sign",
            description="Stop sign missing at the intersection",
            location_lat=12.9685,
            location_lng=77.5932,
            address="Koramangala 4th Block, Bangalore",
            severity="low",
            status="pending",
        ),
    ]
    for r in sample_reports:
        db.session.add(r)

    sample_achievements = [
        Achievement(
            user_id=admin.id,
            badge_type="safe_driver",
            name="Safe Driver",
            description="Completed 5 safety quizzes with 80%+ average",
        ),
        Achievement(
            user_id=admin.id,
            badge_type="safety_champion",
            name="Safety Champion",
            description="Achieved safety score of 90+ for 3 months",
        ),
        Achievement(
            user_id=demo_user.id,
            badge_type="road_guardian",
            name="Road Guardian",
            description="Reported 10 road hazards",
        ),
        Achievement(
            user_id=demo_user.id,
            badge_type="traffic_expert",
            name="Traffic Expert",
            description="Answered 50+ quiz questions correctly",
        ),
    ]
    for a in sample_achievements:
        db.session.add(a)

    sample_scores = [
        SafetyScore(
            user_id=demo_user.id,
            score=85.0,
            quiz_performance=80.0,
            risk_assessments=20.0,
            driving_habits=75.0,
            month=1,
            year=2024,
        ),
        SafetyScore(
            user_id=demo_user.id,
            score=78.0,
            quiz_performance=75.0,
            risk_assessments=25.0,
            driving_habits=70.0,
            month=2,
            year=2024,
        ),
        SafetyScore(
            user_id=demo_user.id,
            score=92.0,
            quiz_performance=90.0,
            risk_assessments=15.0,
            driving_habits=85.0,
            month=3,
            year=2024,
        ),
        SafetyScore(
            user_id=admin.id,
            score=95.0,
            quiz_performance=95.0,
            risk_assessments=10.0,
            driving_habits=90.0,
            month=3,
            year=2024,
        ),
    ]
    for s in sample_scores:
        db.session.add(s)

    db.session.commit()
    _initialized = True


def seed_notifications():
    try:
        if Notification.query.count() == 0:
            admin_user = User.query.filter_by(email="admin@safeguard.ai").first()
            demo_user_obj = User.query.filter_by(email="user@safeguard.ai").first()
            if admin_user:
                db.session.add(Notification(
                    user_id=admin_user.id,
                    title="System Alert: High Severity Hazard",
                    message="Critical waterlogging reported on Old Airport Road requires inspection.",
                    type="warning",
                    read=False
                ))
                db.session.add(Notification(
                    user_id=admin_user.id,
                    title="New Driver Registered",
                    message="A new driver joined the SafeGuard AI platform.",
                    type="info",
                    read=False
                ))
                db.session.add(Notification(
                    user_id=admin_user.id,
                    title="Monthly Analytics Ready",
                    message="City traffic hazard analytics report is ready for export.",
                    type="success",
                    read=True
                ))
            if demo_user_obj:
                db.session.add(Notification(
                    user_id=demo_user_obj.id,
                    title="Hazard Report Verified",
                    message="Your report for 'Pothole on MG Road' was verified by city authorities.",
                    type="success",
                    read=False
                ))
                db.session.add(Notification(
                    user_id=demo_user_obj.id,
                    title="New Safety Badge Earned!",
                    message="Congratulations! You earned the 'Road Guardian' achievement badge.",
                    type="info",
                    read=False
                ))
                db.session.add(Notification(
                    user_id=demo_user_obj.id,
                    title="Adverse Weather Warning",
                    message="Rain alert in your zone. AI recommends reducing speed by 15 km/h.",
                    type="warning",
                    read=False
                ))
            db.session.commit()
    except Exception as e:
        db.session.rollback()
        print(f"Error seeding notifications: {e}")


if __name__ == "__main__":
    app = create_app()
    app.run(debug=False, host="0.0.0.0", port=5000)
