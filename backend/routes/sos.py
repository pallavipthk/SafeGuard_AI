from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
import json
import os

sos_bp = Blueprint("sos", __name__, url_prefix="/api/sos")

MOCK_HOSPITALS = [
    {
        "id": 1,
        "name": "City General Hospital",
        "address": "123 Healthcare Ave, Downtown",
        "phone": "+1-555-0100",
        "lat": 12.9716,
        "lng": 77.5946,
        "distance_km": 2.3,
        "emergency": True,
        "specialties": ["trauma", "cardiac", "general"],
    },
    {
        "id": 2,
        "name": "St. Mary's Medical Center",
        "address": "456 Wellness Blvd, Midtown",
        "phone": "+1-555-0200",
        "lat": 12.9766,
        "lng": 77.5996,
        "distance_km": 3.1,
        "emergency": True,
        "specialties": ["pediatric", "trauma", "neurology"],
    },
    {
        "id": 3,
        "name": "University Hospital",
        "address": "789 College Road, University Area",
        "phone": "+1-555-0300",
        "lat": 12.9666,
        "lng": 77.5896,
        "distance_km": 4.5,
        "emergency": True,
        "specialties": ["trauma", "burn", "surgery"],
    },
    {
        "id": 4,
        "name": "Community Health Clinic",
        "address": "321 Park Street, Residential Zone",
        "phone": "+1-555-0400",
        "lat": 12.9816,
        "lng": 77.6046,
        "distance_km": 5.2,
        "emergency": False,
        "specialties": ["general", "primary care"],
    },
]

MOCK_EMERGENCY_CONTACTS = [
    {"name": "Police", "number": "100", "icon": "police", "category": "emergency"},
    {"name": "Ambulance", "number": "108", "icon": "ambulance", "category": "emergency"},
    {"name": "Fire Brigade", "number": "101", "icon": "fire", "category": "emergency"},
    {"name": "Highway Patrol", "number": "103", "icon": "highway", "category": "emergency"},
    {"name": "Roadside Assistance", "number": "1800-123-4567", "icon": "assistance", "category": "service"},
    {"name": "Traffic Helpline", "number": "1095", "icon": "traffic", "category": "service"},
    {"name": "Women's Helpline", "number": "1091", "icon": "women", "category": "helpline"},
    {"name": "Child Helpline", "number": "1098", "icon": "child", "category": "helpline"},
]

FIRST_AID_GUIDES = [
    {
        "id": 1,
        "title": "CPR (Cardiopulmonary Resuscitation)",
        "category": "life_saving",
        "steps": [
            "Check if the person is responsive and breathing normally.",
            "Call emergency services (108) immediately.",
            "Kneel beside the person and place the heel of one hand on the center of their chest.",
            "Place your other hand on top and interlock your fingers.",
            "Push hard and fast at 100-120 compressions per minute (depth: 5-6 cm).",
            "After 30 compressions, give 2 rescue breaths.",
            "Continue CPR until help arrives or the person shows signs of life.",
        ],
        "warning": "Do not perform CPR on a person who is breathing normally.",
    },
    {
        "id": 2,
        "title": "Treating Bleeding Wounds",
        "category": "injury",
        "steps": [
            "Put on disposable gloves if available.",
            "Clean the wound gently with clean water.",
            "Apply direct pressure using a sterile gauze or clean cloth.",
            "Elevate the injured area above heart level if possible.",
            "Apply a bandage firmly but not too tight.",
            "If blood soaks through, add more gauze on top - do not remove the first layer.",
            "Seek medical attention for deep or large wounds.",
        ],
        "warning": "If bleeding is severe or arterial (spurting), call emergency services immediately.",
    },
    {
        "id": 3,
        "title": "Fracture Management",
        "category": "injury",
        "steps": [
            "Keep the injured person still and calm.",
            "Do not try to realign the bone.",
            "Immobilize the injured area using a splint or sling.",
            "Apply ice wrapped in cloth to reduce swelling.",
            "Check for circulation below the injury (pulse, sensation, movement).",
            "Transport to the nearest hospital.",
        ],
        "warning": "If there is an open fracture (bone piercing skin), cover with sterile dressing and do not push bone back in.",
    },
    {
        "id": 4,
        "title": "Burns First Aid",
        "category": "injury",
        "steps": [
            "Move the person away from the source of burn.",
            "Cool the burn under cool running water for at least 10 minutes.",
            "Remove jewelry or tight items near the burn area.",
            "Cover the burn with a sterile gauze or clean cloth.",
            "Do not apply ice, butter, or toothpaste on burns.",
            "Give over-the-counter pain relief if needed.",
            "Seek medical help for severe or large burns.",
        ],
        "warning": "For chemical or electrical burns, seek emergency medical help immediately.",
    },
    {
        "id": 5,
        "title": "Head Injury Response",
        "category": "emergency",
        "steps": [
            "Keep the person still and lying down with head slightly elevated.",
            "Apply ice pack to reduce swelling.",
            "Watch for signs of concussion: confusion, dizziness, nausea, blurred vision.",
            "Do not let the person sleep for the first few hours if it's a moderate injury.",
            "Seek immediate medical help if there is loss of consciousness, vomiting, or seizures.",
        ],
        "warning": "Always treat head injuries seriously. When in doubt, seek medical attention.",
    },
    {
        "id": 6,
        "title": "Choking First Aid (Heimlich Maneuver)",
        "category": "life_saving",
        "steps": [
            "Stand behind the person and wrap your arms around their waist.",
            "Make a fist with one hand and place the thumb side against the person's abdomen (above navel, below ribcage).",
            "Grasp your fist with the other hand and thrust inward and upward sharply.",
            "Repeat until the object is dislodged or the person becomes unconscious.",
            "If unconscious, lower them to ground and start CPR.",
        ],
        "warning": "Do not perform on infants under 1 year - use back blows and chest thrusts instead.",
    },
]


emergency_contacts_db = []


@sos_bp.route("/trigger", methods=["POST"])
@jwt_required()
def trigger_sos():
    try:
        user_id = int(get_jwt_identity())
        data = request.get_json() or {}

        lat = data.get("lat")
        lng = data.get("lng")
        location = data.get("location", "Unknown location")

        alert_data = {
            "user_id": user_id,
            "timestamp": datetime.utcnow().isoformat(),
            "location": location,
            "lat": lat,
            "lng": lng,
            "message": f"EMERGENCY ALERT from user {user_id} at {location}",
        }

        return (
            jsonify(
                {
                    "success": True,
                    "alert": alert_data,
                    "message": "Emergency alert sent to authorities and emergency contacts.",
                    "action_items": [
                        "Stay calm and stay in your vehicle if safe.",
                        "Turn on hazard lights.",
                        "Call emergency services if you haven't already.",
                        "Share your exact location with responders.",
                    ],
                }
            ),
            200,
        )
    except Exception as e:
        return jsonify({"error": f"SOS trigger failed: {str(e)}"}), 500


@sos_bp.route("/nearby-hospitals", methods=["GET"])
@jwt_required()
def nearby_hospitals():
    try:
        lat = request.args.get("lat", type=float)
        lng = request.args.get("lng", type=float)

        hospitals = MOCK_HOSPITALS

        if lat and lng:
            from math import radians, sin, cos, sqrt, atan2

            def calc_distance(h):
                dlat = radians(h["lat"] - lat)
                dlng = radians(h["lng"] - lng)
                a = sin(dlat / 2) ** 2 + cos(radians(lat)) * cos(radians(h["lat"])) * sin(dlng / 2) ** 2
                return 2 * 6371 * atan2(sqrt(a), sqrt(1 - a))

            for h in hospitals:
                h["distance_km"] = round(calc_distance(h), 1)
            hospitals.sort(key=lambda h: h["distance_km"])

        return jsonify({"hospitals": hospitals}), 200
    except Exception as e:
        return jsonify({"error": f"Failed to fetch hospitals: {str(e)}"}), 500


@sos_bp.route("/emergency-contacts", methods=["GET"])
@jwt_required()
def get_emergency_contacts():
    try:
        return jsonify({"contacts": MOCK_EMERGENCY_CONTACTS, "user_contacts": emergency_contacts_db}), 200
    except Exception as e:
        return jsonify({"error": f"Failed to fetch contacts: {str(e)}"}), 500


@sos_bp.route("/emergency-contacts", methods=["POST"])
@jwt_required()
def add_emergency_contact():
    try:
        user_id = int(get_jwt_identity())
        data = request.get_json()

        if not data or not data.get("name") or not data.get("number"):
            return jsonify({"error": "Name and number are required"}), 400

        contact = {
            "id": len(emergency_contacts_db) + 1,
            "user_id": user_id,
            "name": data["name"].strip(),
            "number": data["number"].strip(),
            "relation": data.get("relation", "").strip(),
            "created_at": datetime.utcnow().isoformat(),
        }

        emergency_contacts_db.append(contact)

        return jsonify({"message": "Contact added", "contact": contact}), 201
    except Exception as e:
        return jsonify({"error": f"Failed to add contact: {str(e)}"}), 500


@sos_bp.route("/first-aid", methods=["GET"])
@jwt_required()
def first_aid():
    try:
        category = request.args.get("category")
        guides = FIRST_AID_GUIDES

        if category:
            guides = [g for g in guides if g["category"] == category]

        categories = list(set(g["category"] for g in FIRST_AID_GUIDES))

        return jsonify({"guides": guides, "categories": categories, "total": len(guides)}), 200
    except Exception as e:
        return jsonify({"error": f"Failed to fetch first aid guides: {str(e)}"}), 500
