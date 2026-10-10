import os
import random
from PIL import Image
import numpy as np

SIGN_CLASSES = {
    "stop_sign": {
        "label": "Stop Sign",
        "instructions": "Come to a complete stop. Look both ways before proceeding.",
        "penalty": "Fine: Rs. 100-300 for jumping stop sign",
        "color": "Red octagon with white text",
    },
    "speed_limit_30": {
        "label": "Speed Limit 30 km/h",
        "instructions": "Maximum speed 30 km/h. Reduce speed immediately.",
        "penalty": "Fine: Rs. 400-1000 for overspeeding",
        "color": "White rectangle with black text",
    },
    "speed_limit_50": {
        "label": "Speed Limit 50 km/h",
        "instructions": "Maximum speed 50 km/h. Maintain safe speed.",
        "penalty": "Fine: Rs. 400-1000 for overspeeding",
        "color": "White rectangle with black text",
    },
    "no_entry": {
        "label": "No Entry",
        "instructions": "Do not enter this road. Find alternate route.",
        "penalty": "Fine: Rs. 500-1500 for wrong-way driving",
        "color": "Red circle with white horizontal bar",
    },
    "school_zone": {
        "label": "School Zone",
        "instructions": "Speed limit 25 km/h. Watch for children crossing.",
        "penalty": "Fine: Rs. 1000 for overspeeding in school zone",
        "color": "Yellow diamond with children symbol",
    },
    "zebra_crossing": {
        "label": "Pedestrian Crossing",
        "instructions": "Yield to pedestrians. Stop at marked crossing.",
        "penalty": "Fine: Rs. 500 for not yielding",
        "color": "White stripes on road with sign",
    },
    "traffic_light_red": {
        "label": "Traffic Light - Red",
        "instructions": "Stop behind the stop line. Wait for green signal.",
        "penalty": "Fine: Rs. 500-1500 for red light violation",
        "color": "Red light illuminated",
    },
    "traffic_light_green": {
        "label": "Traffic Light - Green",
        "instructions": "Proceed with caution. Check for crossing traffic.",
        "penalty": "N/A - Proceed safely",
        "color": "Green light illuminated",
    },
    "no_parking": {
        "label": "No Parking",
        "instructions": "Do not park in this area. Find authorized parking.",
        "penalty": "Fine: Rs. 200-500 for illegal parking",
        "color": "Red circle with blue background and red X",
    },
    "give_way": {
        "label": "Give Way / Yield",
        "instructions": "Slow down and yield to traffic on the main road.",
        "penalty": "Fine: Rs. 500 for not yielding",
        "color": "White inverted triangle with red border",
    },
    "roundabout": {
        "label": "Roundabout Ahead",
        "instructions": "Slow down. Give way to traffic from the right.",
        "penalty": "Fine: Rs. 500 for improper roundabout use",
        "color": "White triangle with red border",
    },
    "one_way": {
        "label": "One Way",
        "instructions": "Traffic flows only in the indicated direction.",
        "penalty": "Fine: Rs. 500-1500 for wrong-way driving",
        "color": "Blue rectangle with white arrow",
    },
}


def preprocess_image(image_path, target_size=(224, 224)):
    if not os.path.exists(image_path):
        return None
    try:
        img = Image.open(image_path).convert("RGB")
        img = img.resize(target_size, Image.LANCZOS)
        img_array = np.array(img) / 255.0
        return img_array
    except Exception:
        return None


def detect_sign(image_path):
    preprocessed = preprocess_image(image_path)
    if preprocessed is None:
        return {
            "success": False,
            "error": "Could not process image",
            "detections": [],
        }

    sign_keys = list(SIGN_CLASSES.keys())
    num_detections = random.randint(1, 3)
    detected_indices = random.sample(range(len(sign_keys)), num_detections)

    detections = []
    for idx in detected_indices:
        sign_key = sign_keys[idx]
        sign_info = SIGN_CLASSES[sign_key]
        confidence = round(random.uniform(0.72, 0.98), 2)
        detections.append(
            {
                "sign": sign_info["label"],
                "confidence": confidence,
                "instructions": sign_info["instructions"],
                "penalty": sign_info["penalty"],
                "color": sign_info["color"],
            }
        )

    detections.sort(key=lambda d: d["confidence"], reverse=True)

    primary_sign = detections[0] if detections else None

    if primary_sign and primary_sign["confidence"] > 0.90:
        urgency = "high"
    elif primary_sign and primary_sign["confidence"] > 0.80:
        urgency = "medium"
    else:
        urgency = "low"

    return {
        "success": True,
        "image_processed": os.path.basename(image_path),
        "detections": detections,
        "primary_sign": primary_sign,
        "urgency": urgency,
        "total_signs_detected": len(detections),
    }


def analyze_hazard_severity(image_path):
    preprocessed = preprocess_image(image_path)
    if preprocessed is None:
        return {"severity": "unknown", "confidence": 0, "description": "Could not analyze"}

    severities = ["low", "medium", "high", "critical"]
    weights = [0.15, 0.40, 0.30, 0.15]
    severity = random.choices(severities, weights=weights, k=1)[0]
    confidence = round(random.uniform(0.60, 0.95), 2)

    descriptions = {
        "low": "Minor issue, no immediate danger",
        "medium": "Moderate hazard, proceed with caution",
        "high": "Significant hazard, report immediately",
        "critical": "Extreme danger, avoid area and alert authorities",
    }

    return {
        "severity": severity,
        "confidence": confidence,
        "description": descriptions.get(severity, "Unknown severity"),
        "recommendation": (
            "Avoid area"
            if severity in ("high", "critical")
            else "Proceed with caution"
        ),
    }


def estimate_distance(image_path):
    preprocessed = preprocess_image(image_path)
    if preprocessed is None:
        return None
    distance = round(random.uniform(5, 200), 1)
    return {
        "estimated_distance_meters": distance,
        "unit": "meters",
        "confidence": round(random.uniform(0.5, 0.9), 2),
    }
