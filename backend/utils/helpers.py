import os
import uuid
import re
from datetime import datetime
from werkzeug.utils import secure_filename

ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif", "webp"}


def allowed_file(filename):
    return (
        "." in filename
        and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS
    )


def save_uploaded_file(file, upload_folder):
    if file and allowed_file(file.filename):
        ext = file.filename.rsplit(".", 1)[1].lower()
        unique_name = generate_unique_filename(ext)
        filepath = os.path.join(upload_folder, unique_name)
        file.save(filepath)
        return unique_name
    return None


def generate_unique_filename(extension):
    timestamp = datetime.utcnow().strftime("%Y%m%d%H%M%S")
    return f"{timestamp}_{uuid.uuid4().hex[:8]}.{extension}"


def validate_email(email):
    pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
    return re.match(pattern, email) is not None


def calculate_safety_score(
    quiz_performance=None,
    risk_assessments=None,
    driving_habits=None,
):
    score = 70
    if quiz_performance is not None:
        score += (quiz_performance - 50) * 0.3
    if risk_assessments is not None:
        avg_risk = sum(risk_assessments) / len(risk_assessments) if risk_assessments else 0
        score -= avg_risk * 5
        score = max(score, 0)
    if driving_habits is not None:
        score += min(driving_habits * 2, 20)
    return max(0, min(100, round(score, 1)))


SEVERITY_COLORS = {
    "low": "#4CAF50",
    "medium": "#FF9800",
    "high": "#F44336",
    "critical": "#9C27B0",
}


def get_severity_color(severity):
    return SEVERITY_COLORS.get(severity.lower(), "#757575")


def format_datetime(dt):
    if dt is None:
        return None
    return dt.strftime("%Y-%m-%d %H:%M:%S")
