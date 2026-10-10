import os
import json
import random


import re

MOCK_RESPONSES = [
    (["night", "dark", "evening", "after dark"], [
        "For night driving: ensure your headlights are clean and properly aligned. Reduce speed by 10-15 km/h and increase following distance to 4 seconds. Watch for pedestrians, cyclists, and animals that are harder to spot after dark.",
        "Night driving tip: Keep your windshield and mirrors clean to reduce glare from oncoming headlights. If an approaching vehicle's brights are on, look slightly to the right edge of your lane to avoid being blinded.",
        "Stay safe at night by: (1) Using high beams on unlit roads but dimming for oncoming traffic, (2) Watching for drunk drivers especially on weekends, (3) Taking breaks every 2 hours as fatigue sets in faster at night.",
    ]),
    (["sign", "road sign", "traffic sign", "sign color", "sign mean", "road marking"], [
        "Road sign colors guide you: **RED** = stop/prohibition (stop signs, yield), **YELLOW** = warning (curves, pedestrian crossings), **GREEN** = guidance (distance, directions), **BLUE** = motorist services (gas, food, hospitals), **BROWN** = recreational/cultural sites, **ORANGE** = construction zones.",
        "Key road signs: **Stop sign** (octagonal, red) — come to a complete stop. **Yield** (triangle, red/white) — give way to traffic. **Speed limit** (white rectangle) — do not exceed posted speed. **No entry** (red circle with white bar) — do not enter, it's a restricted road.",
        "Regulatory signs are usually circular with red borders (mandatory) or blue circles (prohibition lifted). Warning signs are diamond-shaped with yellow backgrounds. Informatory signs are rectangular with blue or green backgrounds.",
    ]),
    (["right of way", "right-of-way", "who goes first", "intersection priority", "who has priority"], [
        "Right-of-way rules: At an uncontrolled intersection, the vehicle to your right has priority. When turning left, yield to oncoming traffic. At a T-junction, the terminating road must yield to the through road.",
        "At a **4-way stop**: the first vehicle to arrive goes first. If two arrive simultaneously, the vehicle on the right has priority. Always make eye contact with other drivers when in doubt.",
        "Emergency vehicles (ambulance, fire, police with lights/sirens) always have right-of-way. Pull over to the right and stop until they pass. Never block an intersection when emergency vehicles are approaching.",
    ]),
    (["fog", "foggy", "mist", "low visibility"], [
        "In foggy weather: Reduce speed drastically (max 30 km/h in dense fog). Use **low beam headlights** or fog lights — high beams reflect off fog and make visibility worse. Increase following distance to at least 5 seconds. Use windshield defroster and wipers as needed.",
        "Fog driving tips: (1) Use fog lights if available, (2) Follow the right edge line or road markings as a guide, (3) Listen for traffic you cannot see, (4) Do not stop on the road — if visibility is near zero, pull completely off the road and turn off all lights except hazards.",
        "Avoid driving in fog if visibility is less than 100 meters unless necessary. If caught in fog, roll down your window at intersections to listen for approaching vehicles. Never accelerate to 'get out of it' — fog patches can be unpredictable.",
    ]),
    (["tire", "tyre", "blowout", "flat tire", "burst"], [
        "If you have a **tire blowout**: (1) Do NOT slam the brakes — it will cause you to spin. (2) Grip the steering wheel firmly and keep the vehicle straight. (3) Gradually take your foot off the accelerator. (4) Allow the vehicle to slow down naturally. (5) Once below 30 km/h, gently brake and pull to a safe location.",
        "Prevent blowouts by: checking tire pressure monthly (including the spare), inspecting for cuts/bulges, rotating tires every 10,000 km, and replacing tires when tread depth is below 1.6 mm. Under-inflated tires generate more heat and are prone to blowouts at high speed.",
    ]),
    (["accident", "crash", "collision", "minor accident", "fender bender"], [
        "If you're in a minor accident: (1) Move to a safe location if possible, (2) Turn on hazard lights, (3) Check for injuries — call emergency services if anyone is hurt, (4) Exchange information (name, insurance, license plate, contact), (5) Take photos of the scene, (6) Report to police if required by law, (7) Notify your insurance company.",
        "After an accident: Do not admit fault or apologize — it can be used against you. Do not leave the scene (hit-and-run is a criminal offense). If the other driver is uncooperative, stay in your vehicle with doors locked and call the police.",
    ]),
    (["speed", "speeding", "speed limit", "over speed"], [
        "Speed management: Always follow posted speed limits — they are set based on road design, traffic patterns, and hazard analysis. In residential areas, keep below 30 km/h. On highways, 80-100 km/h is typical unless otherwise posted. Reduce speed by 20% in rain and 40% in fog.",
        "Speeding consequences: Fines range from Rs. 400-1000 depending on over-speed. More importantly, higher speed means longer stopping distance and more severe injuries in a crash. At 60 km/h, stopping distance is ~23 meters; at 80 km/h, it's ~36 meters.",
    ]),
    (["rain", "raining", "wet", "waterlog", "flood", "heavy rain"], [
        "Driving in rain: Reduce speed by 20%, increase following distance to 5 seconds, turn on headlights (not just DRLs), avoid standing water deeper than 15 cm, and watch for hydroplaning — if the steering feels light, ease off the accelerator and do not brake suddenly.",
        "Waterlogged roads: Do not drive through water if you cannot see the road surface. If you must cross water, drive slowly in first gear, keep the engine revs high, and test your brakes immediately after exiting. Standing water can hide potholes, debris, or washed-out roads.",
    ]),
    (["emergency", "hospital", "ambulance", "first aid", "medical", "injury"], [
        "In a road emergency: First, ensure scene safety — turn on hazard lights, set up a warning triangle 50 meters behind the vehicle. Check for injuries — do not move an injured person unless there is immediate danger (fire, flooding). Call emergency services (108 in India, 911/112 in most countries).",
        "Essential first aid for road accidents: (1) Control bleeding with direct pressure using a clean cloth, (2) Keep the person warm and still, (3) Do not remove a helmet from a motorcyclist, (4) If unconscious but breathing, place in recovery position, (5) Do not give food or water — the person may need surgery.",
    ]),
    (["pothole", "road damage", "hazard", "dangerous road"], [
        "To report a pothole or road hazard: Use the **Hazard Reporting** feature in this app. Take a photo, note the exact location, and describe the severity. Local authorities are notified through the platform. Your report helps other drivers and contributes to city-wide safety data.",
        "When you encounter a road hazard: Slow down gradually — do not swerve suddenly as it may cause loss of control. If you cannot avoid a pothole, brake just before impact and release the brakes as you hit it to prevent suspension damage. Report it afterward through the app.",
    ]),
    (["score", "safety score", "rating", "improve", "driving score"], [
        "Your safety score is calculated based on quiz performance, risk assessments, hazard reports, and driving habits. To improve: complete daily quizzes, use risk prediction before long drives, report hazards you encounter, and review first aid guides regularly.",
        "Tips to boost your safety score: (1) Maintain consistent speed — sudden acceleration and braking reduce your score, (2) Take defensive driving quizzes weekly, (3) Report at least 2 hazards per week, (4) Review emergency procedures monthly.",
    ]),
    (["break", "rest", "fatigue", "tired", "long drive", "highway drive"], [
        "Combat driving fatigue: Take a 15-minute break every 2 hours or every 150 km. Stop at a rest area, stretch your legs, have a caffeinated drink, and splash cold water on your face. If you feel drowsy, pull over immediately — microsleeps at 80 km/h mean you travel 22 meters per second unchecked.",
        "Signs of driver fatigue: Frequent yawning, drifting between lanes, missing exits, difficulty remembering the last few kilometers driven, heavy eyelids. Do not rely on coffee alone — 20-minute power naps are more effective. Share driving duties if possible on long journeys.",
    ]),
    (["tip", "advice", "guideline", "safe driving", "defensive"], [
        "Defensive driving tips: Always scan 12-15 seconds ahead, keep a 3-second following distance (increase to 5 in poor weather), check mirrors every 5-8 seconds, have an escape route in mind, and avoid driving in others' blind spots. Assume other drivers will make mistakes.",
        "Essential safe driving habits: (1) Wear your seatbelt — it reduces fatal injury risk by 45%, (2) Never text and drive — reading one text takes your eyes off the road for 5 seconds at 50 km/h = 70 meters blind, (3) Check tire pressure monthly, (4) Keep a first-aid kit and emergency triangle in your vehicle.",
    ]),
    (["park", "parking", "reverse park", "parallel park"], [
        "Parking tips: Use your mirrors and look over your shoulder — do not rely solely on cameras. When parallel parking, leave enough space (60 cm) from the curb. Always park in designated areas — parking on blind corners or near intersections is illegal and dangerous.",
        "Safe parking: Use your parking brake even on flat ground. Turn your wheels toward the curb when parking uphill (so the car rolls into the curb if brakes fail). In a parking lot, park away from other cars if possible to avoid door dings.",
    ]),
    (["phone", "mobile", "text", "distracted", "distraction"], [
        "Distracted driving is a leading cause of accidents. Never use your phone while driving. If you must take a call, pull over safely. Use hands-free only for emergencies — studies show hands-free calls are still distracting. Set your GPS and playlist before starting the trip.",
        "The **3-second rule**: If you need to check your phone, find a safe spot to pull over within 3 seconds. At 60 km/h, 3 seconds = 50 meters traveled. No message is worth that risk. Use 'Do Not Disturb While Driving' mode available on most smartphones.",
    ]),
    (["seatbelt", "seat belt", "belt"], [
        "Always wear your seatbelt — front AND back seats. In a crash at 50 km/h, an unbelted passenger weighing 70 kg hits the seat in front with a force of over 3 tonnes. Seatbelts reduce the risk of fatal injury by 45% for front-seat occupants and by 75% for rear-seat occupants.",
        "Seatbelt law: In India, not wearing a seatbelt carries a fine of Rs. 1,000. Children under 14 must be in the back seat. Children under 4 must be in a proper child safety seat. Ensure the belt lies flat across your chest and low across your hips (not across your stomach).",
    ]),
    (["drink", "drunk", "alcohol", "drunken", "dui", "dwi"], [
        "Never drink and drive. In India, the legal BAC limit is 0.03% (30 mg per 100 ml of blood). Even one drink can impair judgment. Penalties include a fine of Rs. 10,000 and/or imprisonment up to 6 months. Use a designated driver, cab service, or public transport after drinking.",
        "Alcohol impairs: reaction time (20% slower at 0.05% BAC), coordination, vision (reduced peripheral vision), and judgment (you may take risks you normally wouldn't). There is no safe level of alcohol for driving. If you've been drinking, wait at least 1 hour per standard drink before considering driving.",
    ]),
    (["helmet", "bike", "motorcycle", "scooter", "two wheeler", "two-wheeler"], [
        "Always wear a **full-face helmet** even for short rides — 80% of motorcycle crash impacts are to the chin and forehead area. Ensure the helmet is ISI/DOT/ECE certified. A proper helmet reduces head injury risk by 69% and fatal injury risk by 42%.",
        "Two-wheeler safety: Wear protective gear (helmet, gloves, jacket, knee pads), use headlights at all times (even during the day), avoid riding in the blind spots of larger vehicles, and brake progressively — use both front and rear brakes for maximum stopping power.",
    ]),
    (["hi", "hello", "hey", "good morning", "good evening", "good afternoon"], [
        "Hello! I'm SafeGuard AI, your road safety assistant. I can help you with: **Driving tips** (night driving, fog, rain), **Traffic rules** (right-of-way, road signs), **Emergency procedures** (blowouts, accidents), **Hazard reporting**, **Safety tips**, and more. How can I help you today?",
        "Hi there! I'm SafeGuard AI. Ready to help with road safety. Ask me about driving techniques, traffic rules, emergency procedures, or anything road-safety related. Stay safe out there!",
    ]),
]

def find_mock_response(message):
    """Find the most relevant mock response based on keyword matching in the user's message."""
    message_lower = message.lower()
    best_match = None
    best_count = 0
    best_responses = MOCK_RESPONSES[-1][1]  # default to greeting responses
    
    for keywords, responses in MOCK_RESPONSES:
        count = sum(1 for kw in keywords if kw in message_lower)
        if count > best_count:
            best_count = count
            best_match = responses
    
    if best_match:
        return random.choice(best_match)
    # fallback: general safety tip
    return random.choice([
        "Here's a road safety tip: Always scan 12-15 seconds ahead of your vehicle, keep a 3-second following distance, and check your mirrors every 5-8 seconds. Stay alert and drive defensively!",
        "Safety first: Ensure your vehicle is in good condition before every trip — check tire pressure, lights, fluids, and brakes. A well-maintained vehicle is less likely to be involved in an accident.",
        "Remember: The safest driver is one who is predictable. Use your indicators well in advance, maintain consistent speed, avoid sudden lane changes, and always be aware of other road users around you.",
    ])

MOCK_VISION_RESPONSES = {
    "stop_sign": {
        "sign": "Stop Sign",
        "instruction": "Come to a complete stop at the marked stop line. Look left, right, and left again before proceeding.",
        "penalty": "Rs. 100-300 fine for jumping a stop sign",
    },
    "speed_limit": {
        "sign": "Speed Limit Sign",
        "instruction": "Do not exceed the posted speed limit. Adjust speed according to road and weather conditions.",
        "penalty": "Rs. 400-1000 fine depending on overspeed",
    },
    "no_entry": {
        "sign": "No Entry",
        "instruction": "Do not enter this road. Find an alternate route. This is a one-way or restricted road.",
        "penalty": "Rs. 500-1500 fine for wrong-way driving",
    },
    "school_zone": {
        "sign": "School Zone",
        "instruction": "Reduce speed to 25 km/h. Watch for children crossing. Be prepared to stop.",
        "penalty": "Rs. 1000 fine for overspeeding in school zone",
    },
    "zebra_crossing": {
        "sign": "Zebra Crossing",
        "instruction": "Stop for pedestrians at the crossing. Do not block the crossing during traffic jams.",
        "penalty": "Rs. 500 fine for not yielding at pedestrian crossing",
    },
    "traffic_lights": {
        "sign": "Traffic Lights",
        "instruction": "Stop on red, prepare on yellow, go on green. Do not jump the red light.",
        "penalty": "Rs. 500-1500 fine for red light violation",
    },
}


class SafeTextGeneration:
    def __init__(self, api_key=None):
        self.api_key = api_key or os.environ.get("GEMINI_API_KEY", "")
        self.model = None
        if self.api_key:
            try:
                import google.generativeai as genai

                genai.configure(api_key=self.api_key)
                self.model = genai.GenerativeModel("gemini-pro")
            except Exception:
                self.model = None

    def chat(self, message, history=None):
        if self.model:
            try:
                context = []
                if history:
                    for h in history[-5:]:
                        context.append({"role": "user", "parts": [h.get("message", "")]})
                        context.append(
                            {"role": "model", "parts": [h.get("response", "")]}
                        )
                prompt = f"""You are SafeGuard AI, a road safety assistant. Answer helpfully and concisely.

User: {message}
Assistant:"""
                response = self.model.generate_content(prompt)
                return response.text
            except Exception:
                pass
        return find_mock_response(message)

    def suggest_safety_tips(self, context=None):
        tips = [
            "Always wear your seatbelt, even for short drives.",
            "Maintain a 3-second following distance from the vehicle ahead.",
            "Check your tire pressure monthly for better fuel efficiency and safety.",
            "Never use your phone while driving. Pull over if you need to take a call.",
            "Keep a first-aid kit and emergency triangle in your vehicle at all times.",
            "Use your indicators well in advance before turning or changing lanes.",
            "Avoid driving during heavy rain if visibility is less than 100 meters.",
            "Get your vehicle serviced regularly to avoid breakdowns.",
            "Learn basic road signs and their meanings to be a safer driver.",
            "Always park in designated areas. Avoid parking on blind corners.",
            "Do not drink and drive. Use a designated driver or cab service.",
            "Keep your headlights on low beam in foggy conditions.",
            "Be extra cautious at intersections - look both ways before crossing.",
            "Ensure all passengers are seated before moving the vehicle.",
            "Stay calm in traffic. Road rage leads to poor decision-making.",
        ]
        return random.sample(tips, min(3, len(tips)))

    def analyze_risk(self, speed, weather, traffic, road, time_of_day):
        risk_score = 0
        factors = []

        if speed > 80:
            risk_score += 30
            factors.append("High speed detected")
        elif speed > 60:
            risk_score += 15
            factors.append("Moderate speed")

        weather_risk = {"clear": 0, "rainy": 20, "foggy": 35, "snowy": 45}
        risk_score += weather_risk.get(weather.lower(), 10)
        if weather.lower() in weather_risk and weather.lower() != "clear":
            factors.append(f"{weather.capitalize()} weather conditions")

        traffic_risk = {"low": 5, "moderate": 15, "heavy": 30}
        risk_score += traffic_risk.get(traffic.lower(), 10)
        if traffic.lower() == "heavy":
            factors.append("Heavy traffic")

        road_risk = {"highway": 5, "city": 15, "rural": 20, "construction": 35}
        risk_score += road_risk.get(road.lower(), 10)
        if road.lower() in ("rural", "construction"):
            factors.append(f"{road.capitalize()} road conditions")

        night_hours = [22, 23, 0, 1, 2, 3, 4, 5]
        if time_of_day in night_hours:
            risk_score += 15
            factors.append("Night driving")

        risk_score = min(risk_score, 100)
        probability = round(risk_score / 100, 2)

        if risk_score >= 70:
            recommendation = "High risk. Consider postponing your trip or taking extreme caution."
        elif risk_score >= 40:
            recommendation = "Moderate risk. Drive carefully and stay alert."
        else:
            recommendation = "Low risk. Drive safe and follow traffic rules."

        return {
            "risk_score": risk_score,
            "probability": probability,
            "factors": factors,
            "recommendation": recommendation,
            "level": "high" if risk_score >= 70 else "medium" if risk_score >= 40 else "low",
        }


class VisionAnalysis:
    def __init__(self, api_key=None):
        self.api_key = api_key or os.environ.get("GEMINI_API_KEY", "")
        self.model = None
        if self.api_key:
            try:
                import google.generativeai as genai

                genai.configure(api_key=self.api_key)
                self.model = genai.GenerativeModel("gemini-pro-vision")
            except Exception:
                self.model = None

    def analyze_road_sign(self, image_path):
        if self.model:
            try:
                import PIL.Image

                img = PIL.Image.open(image_path)
                response = self.model.generate_content(
                    [
                        "Identify any road signs in this image. "
                        "Return JSON with sign type, confidence score (0-100), "
                        "safety instruction, and penalty for violation.",
                        img,
                    ]
                )
                return response.text
            except Exception:
                pass

        sign_keys = list(MOCK_VISION_RESPONSES.keys())
        detected = random.choice(sign_keys)
        sign_data = MOCK_VISION_RESPONSES[detected]
        confidence = round(random.uniform(0.75, 0.99), 2)

        return json.dumps(
            {
                "sign": sign_data["sign"],
                "confidence": confidence,
                "instruction": sign_data["instruction"],
                "penalty": sign_data["penalty"],
            }
        )
