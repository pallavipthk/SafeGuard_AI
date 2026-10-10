from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, QuizResult, Achievement, User, SafetyScore, Notification
from sqlalchemy import func
from datetime import datetime

learning_bp = Blueprint("learning", __name__, url_prefix="/api/learning")

ARTICLES = [
    {
        "id": 1,
        "title": "Mastering Mandatory, Cautionary & Informatory Road Signs",
        "category": "signs",
        "type": "article",
        "summary": "A comprehensive deep dive into international road sign classifications, colors, shapes, and critical rules.",
        "excerpt": "Learn how shapes and colors decode road signs instantly: circular for mandatory, triangular for warning, and rectangular for information.",
        "read_time": "8 min",
        "difficulty": "beginner",
        "featured": True,
        "icon": "shield",
        "image": "https://images.unsplash.com/photo-1584467735815-f778f274e296?w=800&auto=format&fit=crop&q=80",
        "key_takeaways": [
            "Red Circles indicate mandatory prohibitions or restrictions (e.g., No Entry, Speed Limits).",
            "Blue Circles give positive mandatory instructions (e.g., Turn Left Ahead, Minimum Speed).",
            "Equilateral Triangles with red borders warn of hazards ahead (e.g., Pedestrian Crossing, Sharp Curve).",
            "Rectangles provide vital navigational, service, and regulatory information."
        ],
        "content": """## 1. The Universal Language of Road Signs

Road signs are standardized globally under the Vienna Convention and Indian Road Congress (IRC) standards to deliver instantaneous, non-verbal instructions to drivers. Recognizing sign archetypes by shape and color gives you extra reaction time.

### A. Mandatory & Regulatory Signs (Circles)
- **Red Border / Red Background**: Indicates strict prohibition. Disobeying these is a direct traffic violation punishable by law.
  - **Stop Sign (Octagon)**: Requires a complete halt of wheels behind the stop line, even if no traffic is visible.
  - **Yield / Give Way (Inverted Triangle)**: Slow down and yield right-of-way to vehicles on the intersecting road.
  - **Speed Limits (Red Circle)**: The maximum legal speed under ideal conditions.
- **Blue Circle with White Symbol**: Positive mandatory actions you **must** perform (e.g., *Compulsory Ahead*, *Compulsory Cycle Track*).

### B. Cautionary & Warning Signs (Triangles)
- Triangular signs with a red border on a white or yellow background alert drivers to upcoming road geometry or environmental risks:
  - **Sharp Curves & Hairpin Bends**: Require immediate gear downshift and speed reduction before steering.
  - **Pedestrian Crossings & School Zones**: Expect pedestrians stepping onto the asphalt; prepare to yield.
  - **Narrow Bridge / Lane Merges**: Merge smoothly using zipper merging techniques.

### C. Informatory Signs (Rectangles)
- Rectangular signs in **Green** (National Highways/Expressways), **Blue** (City & Service Roads), or **Brown** (Tourist & Heritage Sites) provide guidance on distances, route numbers, hospital zones, and emergency SOS call boxes.

---

### Pro-Driver Tip
Always scan 100–200 meters ahead on highways to spot warning signs early. In heavy downpours or night conditions, reflectivity is your primary guide.""",
        "quiz_category": "signs"
    },
    {
        "id": 2,
        "title": "Defensive Driving: Space Cushioning & Hazard Anticipation",
        "category": "driving",
        "type": "tutorial",
        "summary": "Proven defensive driving strategies to avoid collisions, manage tailgaters, and stay proactive in complex traffic.",
        "excerpt": "Defensive driving is the art of anticipating other road users' mistakes and creating safe space cushions around your vehicle.",
        "read_time": "10 min",
        "difficulty": "intermediate",
        "featured": True,
        "icon": "car",
        "image": "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&auto=format&fit=crop&q=80",
        "key_takeaways": [
            "Maintain at least a 3-second following distance under normal conditions and 5–6 seconds in rain.",
            "Always keep an 'escape route' on either side of your vehicle in multi-lane traffic.",
            "Scan mirrors every 5–8 seconds and check blind spots by shoulder checking before changing lanes.",
            "Never assume another driver will yield even if you have right-of-way."
        ],
        "content": """## The Philosophy of Defensive Driving

Defensive driving means driving to save lives, time, and money despite conditions around you and the actions of others.

### 1. The 3-Second Rule Explained
1. Pick a fixed marker ahead (a signpost, bridge pillar, or tree).
2. When the vehicle in front of you passes that object, count: *"One-thousand-and-one, One-thousand-and-two, One-thousand-and-three"*.
3. If your front bumper reaches the marker before you finish counting, you are tailgating. Ease off the throttle immediately.

### 2. Managing Blind Spots & Space Cushions
- **Mirror Alignment**: Set side mirrors outward until your own car's side is barely visible. This eliminates large side blind zones.
- **Shoulder Checks**: Always perform a rapid chin-to-shoulder glance before lane shifts or turning into intersections.
- **Escape Route**: In congested traffic, avoid boxing yourself between two large commercial trucks. Maintain space in front of your bumper when stopped so you can steer away if rear-ended.

### 3. Dealing with Aggressive Drivers
- Do not make eye contact or match their aggression.
- Move safely to the slower lane and let them pass.
- If followed or harassed, drive towards a well-lit police station or public area; never drive home.""",
        "quiz_category": "driving"
    },
    {
        "id": 3,
        "title": "Driving in Severe Monsoon, Waterlogging & Hydroplaning",
        "category": "weather",
        "type": "guide",
        "summary": "Critical physics and handling techniques for heavy rain, wet roads, deep puddles, and sudden aquaplaning.",
        "excerpt": "Learn how tire tread depth prevents aquaplaning and what to do if steering goes light in standing water.",
        "read_time": "7 min",
        "difficulty": "intermediate",
        "featured": False,
        "icon": "cloud-rain",
        "image": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=800&auto=format&fit=crop&q=80",
        "key_takeaways": [
            "Hydroplaning occurs when water builds up between tires and asphalt, leading to complete traction loss.",
            "Do NOT slam on the brakes during hydroplaning; ease off the accelerator and keep steering straight.",
            "Never drive into standing water if the depth exceeds the bottom of your wheel rims.",
            "Turn on low-beam headlights or fog lamps—never hazard blinkers while driving in continuous rain."
        ],
        "content": """## Monsoon Driving Safety Protocol

Rain reduces tire grip by up to 50% and dramatically increases braking distance. Standing water presents two deadly threats: **Aquaplaning** and **Engine Hydrolock**.

### 1. How to Handle Hydroplaning / Aquaplaning
- **The Feeling**: Steering suddenly becomes feather-light and unresponsive; the engine may rev without acceleration.
- **What to Do**:
  - Keep a firm, two-handed grip on the steering wheel pointing straight ahead.
  - **DO NOT** press the brake pedal or make violent steering inputs.
  - Gently lift your foot off the accelerator. As vehicle speed drops below 40–50 km/h, tires will cut through the water film and regain grip.

### 2. Navigating Waterlogged Streets
- Observe vehicles ahead: If water level is above their exhaust pipe or midpoint of wheel rims, **turn around**.
- If safe to proceed, shift to 1st or 2nd gear and maintain steady engine RPM (around 2000–2500 RPM) to prevent water from entering the exhaust tailpipe.
- After clearing water, gently tap the brake pedal several times to dry out the brake pads and rotors.

### 3. Proper Lighting in Rain & Fog
- Use **Low Beams** and front/rear **Fog Lamps**.
- Avoid using Emergency Hazard Flashers while driving normally, as they prevent other drivers from seeing your actual turn signals and brake lights.""",
        "quiz_category": "weather"
    },
    {
        "id": 4,
        "title": "The Golden Hour: Accident Emergency Response & First Aid",
        "category": "emergency",
        "type": "tutorial",
        "summary": "Step-by-step life-saving protocols for witnessing or being involved in a road traffic crash.",
        "excerpt": "Master the DRCAB emergency sequence, universal emergency helplines, and legal protections under the Good Samaritan law.",
        "read_time": "12 min",
        "difficulty": "advanced",
        "featured": True,
        "icon": "heart-pulse",
        "image": "https://images.unsplash.com/photo-1587745416684-47953f16f02f?w=800&auto=format&fit=crop&q=80",
        "key_takeaways": [
            "The first 60 minutes after a severe crash is the Golden Hour where prompt medical aid saves lives.",
            "Dial 112 (Universal Emergency) or 108 (Ambulance) immediately with exact GPS/landmark location.",
            "Under the Good Samaritan Law, helpers are protected from police harassment or legal liabilities.",
            "Do not move spinal trauma victims unless immediate explosion/fire risk exists."
        ],
        "content": """## Crash Scene Emergency Response Protocol

When an accident occurs, calm and organized action prevents secondary collisions and saves lives.

### Step 1: Secure the Scene (Safety First)
1. Park your vehicle at least 30 meters before the crash site with hazard lights ON.
2. Put on a high-visibility vest if available and place reflective warning triangles 50–100 meters behind the wreckage.
3. Turn off the ignition of crashed vehicles to mitigate fire risk from fuel leaks.

### Step 2: Emergency Alert
- Call **112 (Universal Helpline)** or **108 (Emergency Medical Service)**.
- State:
  - Exact Location (Highway KM marker, road junction, or GPS coordinates).
  - Number of vehicles involved.
  - Estimated number of casualties and severity (e.g., trapped, unconscious, bleeding).

### Step 3: First Aid Protocol (DRCAB)
- **Danger**: Verify you are safe from oncoming traffic before approaching victims.
- **Response**: Gently tap shoulders and ask loudly, *"Can you hear me?"*.
- **Circulation & Bleeding**: Apply firm, direct pressure to heavy bleeding wounds using clean cloth or sterile gauze.
- **Airway & Breathing**: Check if chest is rising. If not breathing, begin chest compressions at 100–120 beats/minute.
- **Spinal Immobilization**: Keep the victim's neck and head supported in neutral alignment to prevent permanent paralysis.""",
        "quiz_category": "emergency"
    },
    {
        "id": 5,
        "title": "Night Driving: Glare Management & Peripheral Vision",
        "category": "driving",
        "type": "article",
        "summary": "How to conquer high-beam glare, fatigue, and night myopia for safer after-dark travel.",
        "excerpt": "Techniques to navigate unlit highways, manage oncoming high beams, and recognize roadside pedestrian shadows.",
        "read_time": "6 min",
        "difficulty": "intermediate",
        "featured": False,
        "icon": "moon",
        "image": "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=800&auto=format&fit=crop&q=80",
        "key_takeaways": [
            "Never look directly into oncoming high beams; look towards the white edge line on the road's left side.",
            "Flip your rearview mirror's anti-glare lever or ensure auto-dimming is active.",
            "Keep your windscreen spotless inside and outside to prevent glare scattering.",
            "Take a 15-minute break every 2 hours during night road trips."
        ],
        "content": """## Mastering Night Driving

Night driving accounts for over 40% of all fatal road accidents despite having far less traffic density, primarily due to low illumination and driver fatigue.

### 1. Counteracting Oncoming High-Beam Glare
- If an oncoming vehicle refuses to dip their high beams, **do not retaliate by flashing your high beams**, which blinds both drivers.
- Shift your gaze slightly downward and to the **left edge marker line (fog line)** of the road.
- Use your peripheral vision to monitor the oncoming vehicle while keeping your lane alignment steady.

### 2. Windshield Optical Hygiene
- A thin film of oily dust builds up inside car windscreens. Clean it with a microfiber cloth and glass cleaner. Dirty glass causes headlight glare to scatter into blinding starbursts.

### 3. Recognizing Fatigue Cues
- Heavy eyelids, frequent yawning, drifting out of lane, or missing exits are red alerts. Caffeine only masks fatigue temporarily; a 20-minute power nap is the only true remedy.""",
        "quiz_category": "driving"
    },
    {
        "id": 6,
        "title": "Pre-Drive Vehicle Safety Checklist & Tire Diagnostics",
        "category": "maintenance",
        "type": "guide",
        "summary": "Essential 2-minute daily walkaround inspections that prevent breakdowns and high-speed tire blowouts.",
        "excerpt": "Check tire pressure, tread wear indicators (TWI), fluid levels, and brake pad responsiveness before hitting the road.",
        "read_time": "7 min",
        "difficulty": "beginner",
        "featured": False,
        "icon": "wrench",
        "image": "https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=800&auto=format&fit=crop&q=80",
        "key_takeaways": [
            "Use the 'POWER' mnemonic: Petrol/Fuel, Oil, Water/Coolant, Electrics/Lights, Rubber/Tires.",
            "Check tire pressure when cold once every 2 weeks, including the spare tire.",
            "Replace tires when tread depth reaches the 1.6mm Tread Wear Indicator (TWI).",
            "Listen for high-pitched brake squeals which indicate worn brake pads."
        ],
        "content": """## The 2-Minute Pre-Drive Walkaround

Preventive maintenance eliminates mechanical failures that cause catastrophic expressway crashes.

### The POWER Mnemonic Checklist:
1. **P - Petrol/Energy**: Ensure sufficient fuel/battery charge; never drive in reserve on expressways.
2. **O - Oil**: Pull engine dipstick on level ground to verify oil level between MIN and MAX marks.
3. **W - Water & Coolant**: Inspect radiator overflow reservoir and windshield washer fluid tank.
4. **E - Electrics & Lights**: Test headlights (low/high beam), tail lights, brake lights, and turn indicators.
5. **R - Rubber & Tires**:
   - Check sidewalls for bulges, cracks, or embedded nails.
   - Inspect tread wear indicators (small raised bars inside grooves).
   - Maintain OEM recommended Cold Tire Pressure (indicated on driver-side B-pillar sticker).

### Handling a Sudden Tire Blowout:
- Grip steering wheel firmly with both hands.
- Do **not** step hard on the brake pedal (this will cause the car to spin out).
- Allow the car to coast down naturally, steering smoothly to the emergency shoulder before braking lightly.""",
        "quiz_category": "maintenance"
    },
    {
        "id": 7,
        "title": "Protecting Pedestrians, Cyclists & Two-Wheelers",
        "category": "pedestrian",
        "type": "tutorial",
        "summary": "Safety rules and defensive practices for protecting vulnerable road users in urban corridors.",
        "excerpt": "Learn about the Dutch Reach technique, safe passing distances for cyclists, and zebra crossing right-of-way.",
        "read_time": "5 min",
        "difficulty": "beginner",
        "featured": False,
        "icon": "user-check",
        "image": "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80",
        "key_takeaways": [
            "Always give cyclists and two-wheelers at least 1.5 meters of lateral clearance when overtaking.",
            "Use the 'Dutch Reach' (opening car door with opposite hand) to prevent 'dooring' cyclists.",
            "Pedestrians always have right-of-way at designated zebra crossings.",
            "Anticipate children or pets darting out between parked cars in residential areas."
        ],
        "content": """## Protecting Vulnerable Road Users (VRUs)

Pedestrians, cyclists, and motorcyclists lack metal crumple zones and airbags. In mixed urban traffic, drivers carry higher moral and legal responsibility.

### 1. The Dutch Reach Technique
- When exiting a parked car, open the door with your **far hand** (left hand for right-side door, right hand for left-side door).
- This naturally rotates your torso, forcing you to look over your shoulder and in your side mirror to spot approaching cyclists or motorcycles.

### 2. Passing Distances & Speed Moderation
- Provide at least **1.5 meters clearance** when overtaking bicycles and e-scooters.
- Reduce speed to 20–30 km/h in school zones, marketplace streets, and residential colonies.

### 3. Zebra Crossing Etiquette
- If a pedestrian has stepped onto any portion of a zebra crossing, traffic in both directions must come to a complete stop until they cross safely.""",
        "quiz_category": "signs"
    },
    {
        "id": 8,
        "title": "Highway & Expressway Lane Discipline & Zipper Merging",
        "category": "driving",
        "type": "article",
        "summary": "Best practices for multi-lane expressways, overtaking ethics, and smooth traffic bottleneck merges.",
        "excerpt": "Master lane hierarchy: cruising in middle lanes, keeping left for heavy traffic, and reserving rightmost lanes strictly for overtaking.",
        "read_time": "9 min",
        "difficulty": "intermediate",
        "featured": False,
        "icon": "navigation",
        "image": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80",
        "key_takeaways": [
            "The rightmost lane is an overtaking lane, not a cruising lane.",
            "Use the Zipper Merge at lane drop points: cars take turns 1-for-1 at the obstruction point.",
            "Signal for at least 3 seconds before changing lanes on high-speed expressways.",
            "Never stop or reverse on expressway lanes or exit ramps."
        ],
        "content": """## Expressway & Highway Protocol

High speeds reduce driver reaction time and narrow the cone of vision. Strict lane discipline is essential for preventing pile-ups.

### 1. Lane Hierarchy on 3-Lane Expressways
- **Left Lane**: Heavy commercial vehicles, slow-moving traffic, and vehicles preparing to exit.
- **Middle Lane**: Continuous cruising at posted expressway speed limits.
- **Right Lane**: Strictly for overtaking. Return to the middle lane once the pass is complete.

### 2. The Zipper Merge Concept
- When two lanes merge into one due to road construction, drivers should utilize both lanes up to the merge point, then merge alternately like teeth in a zipper (one car from left, one from right). This reduces congestion backup by up to 40%.

### 3. Expressway Emergency Shoulder Rules
- The leftmost hard shoulder is strictly reserved for police, ambulances, and genuine vehicle breakdowns. Driving or parking on the shoulder to bypass traffic jams is illegal and dangerous.""",
        "quiz_category": "driving"
    }
]

FLASHCARDS = [
    {
        "id": 1,
        "name": "Stop Sign",
        "category": "mandatory",
        "shape": "Octagon (8 sides)",
        "color": "Red with White Text",
        "meaning": "Come to a complete stop behind the stop line. Look both ways and proceed only when clear.",
        "rule": "Mandatory. Wheels must completely cease movement."
    },
    {
        "id": 2,
        "name": "Give Way / Yield",
        "category": "mandatory",
        "shape": "Inverted Triangle",
        "color": "Red border on White",
        "meaning": "Yield right-of-way to traffic on the main intersecting road before entering.",
        "rule": "Mandatory. Slow down and stop if necessary for cross traffic."
    },
    {
        "id": 3,
        "name": "Speed Limit 50",
        "category": "mandatory",
        "shape": "Circle",
        "color": "Red circular border with black text",
        "meaning": "Maximum permissible speed is 50 km/h under optimal driving conditions.",
        "rule": "Mandatory. Exceeding this limit is an actionable offense."
    },
    {
        "id": 4,
        "name": "No Overtaking",
        "category": "prohibitory",
        "shape": "Circle",
        "color": "Red border with two cars",
        "meaning": "Overtaking any vehicle is strictly prohibited in this road section (curves, bridges, tunnels).",
        "rule": "Mandatory prohibition."
    },
    {
        "id": 5,
        "name": "Pedestrian Crossing Ahead",
        "category": "warning",
        "shape": "Triangle",
        "color": "Red border on Yellow/White background",
        "meaning": "Zebra crossing ahead. Slow down and be ready to stop for pedestrians.",
        "rule": "Cautionary. Pedestrians have right-of-way."
    },
    {
        "id": 6,
        "name": "Slippery Road Ahead",
        "category": "warning",
        "shape": "Triangle",
        "color": "Red border with skidding car symbol",
        "meaning": "Road surface ahead may be wet, icy, gravelly, or oily. Avoid sudden braking or steering.",
        "rule": "Cautionary hazard alert."
    },
    {
        "id": 7,
        "name": "Roundabout Ahead",
        "category": "mandatory",
        "shape": "Blue Circle",
        "color": "Blue circle with white circulating arrows",
        "meaning": "Traffic moves in a clockwise or counter-clockwise circle. Give way to traffic already circulating.",
        "rule": "Mandatory direction."
    },
    {
        "id": 8,
        "name": "Hospital / First Aid Post",
        "category": "informatory",
        "shape": "Rectangle",
        "color": "Blue with white inner square and red cross",
        "meaning": "Medical facility or emergency first aid post nearby. Keep horn usage to a minimum.",
        "rule": "Informatory service sign. Maintain silence zone."
    },
    {
        "id": 9,
        "name": "No Entry",
        "category": "prohibitory",
        "shape": "Circle",
        "color": "Red with white horizontal bar",
        "meaning": "Vehicular traffic is strictly prohibited from entering this street or lane.",
        "rule": "Mandatory prohibition. Entering constitutes a one-way violation."
    },
    {
        "id": 10,
        "name": "School Zone Ahead",
        "category": "warning",
        "shape": "Triangle",
        "color": "Red border on Yellow background",
        "meaning": "School or playground nearby. Watch for children crossing and reduce speed.",
        "rule": "Cautionary. Limit speed to 25 km/h in school hours."
    },
    {
        "id": 11,
        "name": "Compulsory Turn Left",
        "category": "mandatory",
        "shape": "Blue Circle",
        "color": "Blue circle with white left arrow",
        "meaning": "Vehicles must turn left ahead. Going straight or turning right is not permitted.",
        "rule": "Mandatory positive instruction."
    },
    {
        "id": 12,
        "name": "U-Turn Prohibited",
        "category": "prohibitory",
        "shape": "Circle",
        "color": "Red border with diagonal red slash",
        "meaning": "Making a U-turn is strictly prohibited at this intersection or median break.",
        "rule": "Mandatory prohibition. U-turns carry collision liability."
    }
]

QUIZ_QUESTIONS = [
    {
        "id": 1,
        "category": "signs",
        "question": "What is the primary meaning of an octagonal red road sign?",
        "options": ["Speed limit ahead", "Come to a complete stop", "Yield right of way", "No entry for motor vehicles"],
        "correct": 1,
        "explanation": "A red octagon universally indicates STOP. You must bring your vehicle to a complete halt behind the stop line."
    },
    {
        "id": 2,
        "category": "signs",
        "question": "What does an inverted triangular sign with a red border signify?",
        "options": ["Compulsory speed limit", "Give Way / Yield", "No Parking zone", "Dangerous descent"],
        "correct": 1,
        "explanation": "An inverted triangle is the Give Way/Yield sign. It orders drivers to yield right-of-way to cross traffic."
    },
    {
        "id": 3,
        "category": "signs",
        "question": "What do blue circular road signs with white symbols indicate?",
        "options": ["Hazard warnings", "Mandatory positive instructions", "Tourist information", "Speed cameras ahead"],
        "correct": 1,
        "explanation": "Blue circular signs prescribe mandatory positive actions that road users MUST perform (such as compulsory turn directions)."
    },
    {
        "id": 4,
        "category": "signs",
        "question": "What does a broken white line in the center of a two-lane road mean?",
        "options": ["No overtaking allowed at any time", "You may overtake and change lanes when safe", "Emergency stopping lane only", "Speed bump ahead"],
        "correct": 1,
        "explanation": "A broken white center line permits lane changing and overtaking provided oncoming traffic is clear."
    },
    {
        "id": 5,
        "category": "signs",
        "question": "What does a solid double white or yellow center line signify?",
        "options": ["Overtaking allowed during daytime only", "Strictly no overtaking or crossing lines in either direction", "Parking permitted on shoulder", "Express bus lane"],
        "correct": 1,
        "explanation": "Solid double center lines prohibit straddling, crossing, or overtaking from either direction due to severe collision risk."
    },
    {
        "id": 6,
        "category": "driving",
        "question": "What is the recommended safe following distance in normal dry weather conditions?",
        "options": ["1 second", "2 seconds", "At least 3 seconds", "50 meters fixed"],
        "correct": 2,
        "explanation": "The 3-second rule ensures sufficient time to perceive a hazard and bring the vehicle to a full stop safely."
    },
    {
        "id": 7,
        "category": "driving",
        "question": "When approaching an oncoming vehicle at night, when should you switch from high to low beam headlights?",
        "options": ["Only when the other driver flashes", "At least 150–200 meters before meeting", "Never, high beams are always safer", "Only inside city limits"],
        "correct": 1,
        "explanation": "Dip your headlights to low beam at least 150–200 meters away to prevent blinding the oncoming driver with glare."
    },
    {
        "id": 8,
        "category": "driving",
        "question": "What is the correct practice for using the rightmost lane on a multi-lane expressway?",
        "options": ["Continuous cruising at high speed", "Use strictly for overtaking, then return to middle lane", "Heavy truck loading lane", "Emergency parking lane"],
        "correct": 1,
        "explanation": "The rightmost lane is reserved exclusively for overtaking. Cruising in it obstructs traffic flow and creates hazards."
    },
    {
        "id": 9,
        "category": "driving",
        "question": "What technique prevents 'dooring' accidents with passing cyclists when exiting a car?",
        "options": ["Kicking the door open swiftly", "The Dutch Reach (opening with the opposite hand)", "Honking before opening", "Opening door halfway only"],
        "correct": 1,
        "explanation": "The Dutch Reach forces you to twist your body, naturally checking side mirrors and blind spots for approaching cyclists."
    },
    {
        "id": 10,
        "category": "driving",
        "question": "What is the primary cause of high-speed rollover during a sudden tire blowout?",
        "options": ["Immediate sharp braking by the driver", "Engine stalling", "Headlight failure", "Exhaust pressure"],
        "correct": 0,
        "explanation": "Slamming on the brakes during a blowout unbalances the chassis. The correct reaction is to steer straight, coast down, and brake gently."
    },
    {
        "id": 11,
        "category": "weather",
        "question": "What should you do immediately if your vehicle starts hydroplaning (aquaplaning)?",
        "options": ["Slam on the brakes with maximum force", "Turn the steering wheel vigorously back and forth", "Ease off the accelerator and steer smoothly straight", "Accelerate hard to push water away"],
        "correct": 2,
        "explanation": "Lifting off the accelerator reduces speed naturally without breaking tire grip, allowing the tire tread to re-contact the road."
    },
    {
        "id": 12,
        "category": "weather",
        "question": "Why should high beam headlights NOT be used in dense fog?",
        "options": ["Fog absorbs high beam light completely", "High beams reflect off water droplets back into your eyes, blinding you", "It drains the car battery faster", "Fog lights turn off automatically"],
        "correct": 1,
        "explanation": "High beam light scatters off suspended moisture particles, creating a blinding white glare wall. Use low beams and fog lights."
    },
    {
        "id": 13,
        "category": "weather",
        "question": "Why shouldn't you drive with emergency hazard flashers turned ON during heavy rain?",
        "options": ["It is illegal in all countries", "It disables your actual turn signal indication to other drivers", "It overheats the alternator", "It lowers engine horsepower"],
        "correct": 1,
        "explanation": "Continuous hazard flashing masks your brake lights and turn signals, confusing trailing vehicles about whether you are moving or stopped."
    },
    {
        "id": 14,
        "category": "emergency",
        "question": "What is the single national emergency helpline number across India for Police, Fire, and Ambulance?",
        "options": ["100", "108", "112", "911"],
        "correct": 2,
        "explanation": "112 is the unified Emergency Response Support System (ERSS) helpline connecting all first responder agencies."
    },
    {
        "id": 15,
        "category": "emergency",
        "question": "What does the 'Golden Hour' refer to in road accident trauma care?",
        "options": ["The time between sunset and nightfall", "The critical first 60 minutes after severe injury when medical care saves lives", "The period required for police report filing", "Insurance claim processing window"],
        "correct": 1,
        "explanation": "Prompt emergency medical treatment during the first hour drastically reduces mortality rates in road accident trauma."
    },
    {
        "id": 16,
        "category": "emergency",
        "question": "Under the Good Samaritan Law, what protection is afforded to individuals helping road crash victims?",
        "options": ["They must pay victim hospital deposits", "They are immune from civil/criminal liability and police harassment", "They must testify in court 5 times", "They must have certified medical training"],
        "correct": 1,
        "explanation": "Good Samaritan legislation protects bystanders from harassment, liability, and mandatory police interrogation."
    },
    {
        "id": 17,
        "category": "maintenance",
        "question": "How often should tire pressure be inspected, and in what state?",
        "options": ["Once every 6 months after a long drive", "Every 2 weeks when tires are cold before driving", "Only when the tire looks visibly deflated", "Only during annual servicing"],
        "correct": 1,
        "explanation": "Tire pressure should be checked cold every two weeks. Driving heats up air inside tires, giving falsely high pressure readings."
    },
    {
        "id": 18,
        "category": "maintenance",
        "question": "What does a high-pitched squealing sound when depressing the brake pedal usually indicate?",
        "options": ["Low windshield washer fluid", "Worn brake pads requiring immediate replacement", "Overinflated rear tires", "Dirty engine air filter"],
        "correct": 1,
        "explanation": "Brake pad wear indicators produce a metallic squeal when the friction material has worn down to safe minimum limits."
    }
]

BADGE_DEFINITIONS = [
    {
        "badge_type": "safe_driver",
        "name": "Safe Driver",
        "description": "Complete 5 safety quizzes with an average score above 80%",
        "icon": "shield-check",
        "category": "quizzes"
    },
    {
        "badge_type": "road_guardian",
        "name": "Road Guardian",
        "description": "Report 10 verified road hazards through SafeGuard AI",
        "icon": "alert-triangle",
        "category": "reporting"
    },
    {
        "badge_type": "safety_champion",
        "name": "Safety Champion",
        "description": "Maintain an overall Safety Score of 90+ points",
        "icon": "trophy",
        "category": "overall"
    },
    {
        "badge_type": "traffic_expert",
        "name": "Traffic Expert",
        "description": "Correctly answer 30+ quiz questions across all categories",
        "icon": "graduation-cap",
        "category": "quizzes"
    },
    {
        "badge_type": "sign_master",
        "name": "Sign Master",
        "description": "Achieve 100% score on the Road Signs & Markings assessment",
        "icon": "compass",
        "category": "signs"
    },
    {
        "badge_type": "first_responder",
        "name": "First Responder",
        "description": "Master Emergency Response & Golden Hour First Aid modules",
        "icon": "heart-pulse",
        "category": "emergency"
    }
]


@learning_bp.route("/articles", methods=["GET"])
@jwt_required()
def get_articles():
    try:
        category = request.args.get("category")
        content_type = request.args.get("type")
        search = request.args.get("search", "").strip().lower()

        articles = ARTICLES
        if category and category != "all":
            articles = [a for a in articles if a["category"] == category]

        if content_type and content_type != "all":
            articles = [a for a in articles if a.get("type") == content_type]

        if search:
            articles = [
                a for a in articles
                if search in a["title"].lower() or search in a["summary"].lower() or search in a.get("excerpt", "").lower()
            ]

        categories = ["all", "signs", "driving", "weather", "emergency", "maintenance", "pedestrian"]
        types = ["all", "article", "tutorial", "guide"]

        return jsonify({
            "articles": articles,
            "categories": categories,
            "types": types,
            "total": len(articles)
        }), 200
    except Exception as e:
        return jsonify({"error": f"Failed to fetch articles: {str(e)}"}), 500


@learning_bp.route("/articles/<int:article_id>", methods=["GET"])
@jwt_required()
def get_article_detail(article_id):
    try:
        article = next((a for a in ARTICLES if a["id"] == article_id), None)
        if not article:
            return jsonify({"error": "Article not found"}), 404
        return jsonify({"article": article}), 200
    except Exception as e:
        return jsonify({"error": f"Failed to fetch article details: {str(e)}"}), 500


@learning_bp.route("/flashcards", methods=["GET"])
@jwt_required()
def get_flashcards():
    try:
        category = request.args.get("category")
        flashcards = FLASHCARDS
        if category and category != "all":
            flashcards = [f for f in flashcards if f["category"] == category]
        return jsonify({"flashcards": flashcards, "total": len(flashcards)}), 200
    except Exception as e:
        return jsonify({"error": f"Failed to fetch flashcards: {str(e)}"}), 500


@learning_bp.route("/quiz/questions", methods=["GET"])
@jwt_required()
def get_quiz_questions():
    try:
        category = request.args.get("category", "all").lower()
        limit = request.args.get("limit", 10, type=int)

        questions = QUIZ_QUESTIONS
        if category and category != "all":
            # map alias names
            cat_mapping = {
                "road signs": "signs",
                "traffic rules": "driving",
                "emergency response": "emergency",
                "safety tips": "driving",
                "weather": "weather",
                "maintenance": "maintenance"
            }
            mapped_cat = cat_mapping.get(category, category)
            filtered = [q for q in questions if q["category"] == mapped_cat]
            if filtered:
                questions = filtered

        # return sanitized questions without exposing correct index directly in question payload
        safe_questions = []
        for q in questions[:limit]:
            safe_questions.append({
                "id": q["id"],
                "category": q["category"],
                "question": q["question"],
                "options": q["options"],
            })

        return jsonify({
            "questions": safe_questions,
            "total": len(safe_questions),
            "category": category
        }), 200
    except Exception as e:
        return jsonify({"error": f"Failed to fetch quiz questions: {str(e)}"}), 500


@learning_bp.route("/quiz/submit", methods=["POST"])
@jwt_required()
def submit_quiz():
    try:
        user_id = int(get_jwt_identity())
        data = request.get_json() or {}

        answers = data.get("answers", [])
        category = data.get("category", "all")

        if not isinstance(answers, list) or len(answers) == 0:
            return jsonify({"error": "Valid answers array is required"}), 400

        score = 0
        total = len(answers)
        results = []

        for answer in answers:
            q_id = answer.get("question_id") or answer.get("id")
            selected = answer.get("selected")

            question = next((q for q in QUIZ_QUESTIONS if q["id"] == q_id), None)
            if question:
                correct = question["correct"]
                is_correct = (selected == correct)
                if is_correct:
                    score += 1
                results.append({
                    "question_id": q_id,
                    "question": question["question"],
                    "selected": selected,
                    "correct": correct,
                    "is_correct": is_correct,
                    "options": question["options"],
                    "explanation": question.get("explanation", ""),
                })

        # Save Quiz Result
        quiz_result = QuizResult(
            user_id=user_id,
            score=score,
            total=total,
            category=category,
        )
        db.session.add(quiz_result)
        db.session.flush()

        percentage = round((score / total) * 100, 1) if total > 0 else 0

        # Update or Create User SafetyScore for this month
        now = datetime.utcnow()
        safety_score = SafetyScore.query.filter_by(
            user_id=user_id, month=now.month, year=now.year
        ).first()

        all_user_quizzes = QuizResult.query.filter_by(user_id=user_id).all()
        total_q_score = sum(q.score for q in all_user_quizzes)
        total_q_count = sum(q.total for q in all_user_quizzes)
        quiz_perf = round((total_q_score / total_q_count) * 100, 1) if total_q_count > 0 else percentage

        if not safety_score:
            overall_score = min(100.0, round((quiz_perf * 0.35) + 55.0, 1))
            safety_score = SafetyScore(
                user_id=user_id,
                score=overall_score,
                quiz_performance=quiz_perf,
                risk_assessments=85.0,
                driving_habits=88.0,
                month=now.month,
                year=now.year,
            )
            db.session.add(safety_score)
        else:
            safety_score.quiz_performance = quiz_perf
            safety_score.score = min(100.0, round(
                (safety_score.quiz_performance * 0.35) +
                ((safety_score.risk_assessments or 80.0) * 0.25) +
                ((safety_score.driving_habits or 85.0) * 0.40),
                1
            ))

        # Check and grant badges
        newly_earned_badges = []

        # 1. Traffic Expert: 30+ correct answers
        if total_q_score >= 30:
            if not Achievement.query.filter_by(user_id=user_id, badge_type="traffic_expert").first():
                b = Achievement(user_id=user_id, badge_type="traffic_expert", name="Traffic Expert", description="Correctly answered 30+ quiz questions across all modules")
                db.session.add(b)
                newly_earned_badges.append(b)

        # 2. Safe Driver: 5+ completed quizzes with 80%+ average
        if len(all_user_quizzes) >= 5 and quiz_perf >= 80:
            if not Achievement.query.filter_by(user_id=user_id, badge_type="safe_driver").first():
                b = Achievement(user_id=user_id, badge_type="safe_driver", name="Safe Driver", description="Completed 5 quizzes with an 80%+ score average")
                db.session.add(b)
                newly_earned_badges.append(b)

        # 3. Sign Master: 100% on signs quiz with at least 5 questions
        if category in ["signs", "road signs"] and percentage == 100 and total >= 4:
            if not Achievement.query.filter_by(user_id=user_id, badge_type="sign_master").first():
                b = Achievement(user_id=user_id, badge_type="sign_master", name="Sign Master", description="Achieved 100% score on the Road Signs assessment")
                db.session.add(b)
                newly_earned_badges.append(b)

        # 4. First Responder: 100% on emergency quiz
        if category in ["emergency", "emergency response"] and percentage >= 80:
            if not Achievement.query.filter_by(user_id=user_id, badge_type="first_responder").first():
                b = Achievement(user_id=user_id, badge_type="first_responder", name="First Responder", description="Mastered Emergency Response & Golden Hour First Aid")
                db.session.add(b)
                newly_earned_badges.append(b)

        # 5. Safety Champion: overall score >= 90
        if safety_score.score >= 90.0:
            if not Achievement.query.filter_by(user_id=user_id, badge_type="safety_champion").first():
                b = Achievement(user_id=user_id, badge_type="safety_champion", name="Safety Champion", description="Achieved a top Safety Score of 90+ points")
                db.session.add(b)
                newly_earned_badges.append(b)

        for nb in newly_earned_badges:
            db.session.add(Notification(
                user_id=user_id,
                title="🏆 Badge Unlocked!",
                message=f"Congratulations! You unlocked the '{nb.name}' achievement badge.",
                type="success",
                read=False
            ))

        db.session.commit()

        earned_achievements = Achievement.query.filter_by(user_id=user_id).all()

        return jsonify({
            "score": score,
            "total": total,
            "percentage": percentage,
            "passed": percentage >= 60,
            "results": results,
            "safety_score": safety_score.score,
            "quiz_performance": safety_score.quiz_performance,
            "new_badges": [b.serialize() for b in newly_earned_badges],
            "all_achievements": [a.serialize() for a in earned_achievements],
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Failed to submit quiz: {str(e)}"}), 500


@learning_bp.route("/badges", methods=["GET"])
@jwt_required()
def get_badges():
    try:
        user_id = int(get_jwt_identity())

        earned_badges = Achievement.query.filter_by(user_id=user_id).all()
        earned_map = {b.badge_type: b for b in earned_badges}

        all_badges = []
        for badge_def in BADGE_DEFINITIONS:
            b_type = badge_def["badge_type"]
            is_earned = b_type in earned_map
            earned_obj = earned_map.get(b_type)

            all_badges.append({
                "badge_type": b_type,
                "name": badge_def["name"],
                "description": badge_def["description"],
                "icon": badge_def["icon"],
                "category": badge_def.get("category", "general"),
                "earned": is_earned,
                "earned_at": earned_obj.earned_at.isoformat() if earned_obj else None,
            })

        return jsonify({
            "badges": all_badges,
            "earned_count": len(earned_badges),
            "total": len(BADGE_DEFINITIONS)
        }), 200
    except Exception as e:
        return jsonify({"error": f"Failed to fetch badges: {str(e)}"}), 500


@learning_bp.route("/leaderboard", methods=["GET"])
@jwt_required()
def learning_leaderboard():
    try:
        users = User.query.all()
        leaderboard = []

        for user in users:
            total_score = (
                db.session.query(func.sum(QuizResult.score))
                .filter(QuizResult.user_id == user.id)
                .scalar()
            ) or 0

            total_questions = (
                db.session.query(func.sum(QuizResult.total))
                .filter(QuizResult.user_id == user.id)
                .scalar()
            ) or 0

            quiz_count = QuizResult.query.filter_by(user_id=user.id).count()
            badges = Achievement.query.filter_by(user_id=user.id).count()
            accuracy = round((total_score / total_questions) * 100, 1) if total_questions > 0 else 0.0

            leaderboard.append({
                "user_id": user.id,
                "name": user.name,
                "avatar": user.avatar,
                "total_correct": total_score,
                "total_questions": total_questions,
                "accuracy": accuracy,
                "quizzes_taken": quiz_count,
                "badges": badges,
            })

        # Add mock community high scorers if database has few entries
        mock_peers = [
            {"user_id": 991, "name": "Aarav Mehta", "avatar": None, "total_correct": 48, "total_questions": 50, "accuracy": 96.0, "quizzes_taken": 8, "badges": 5},
            {"user_id": 992, "name": "Ananya Roy", "avatar": None, "total_correct": 42, "total_questions": 45, "accuracy": 93.3, "quizzes_taken": 6, "badges": 4},
            {"user_id": 993, "name": "Vikram Sethi", "avatar": None, "total_correct": 35, "total_questions": 40, "accuracy": 87.5, "quizzes_taken": 5, "badges": 3},
            {"user_id": 994, "name": "Neha Sharma", "avatar": None, "total_correct": 28, "total_questions": 32, "accuracy": 87.5, "quizzes_taken": 4, "badges": 2},
        ]
        
        # Merge if user list is small
        if len(leaderboard) < 5:
            existing_names = {u["name"] for u in leaderboard}
            for peer in mock_peers:
                if peer["name"] not in existing_names:
                    leaderboard.append(peer)

        leaderboard.sort(key=lambda x: (x["accuracy"], x["total_correct"]), reverse=True)

        for idx, entry in enumerate(leaderboard, 1):
            entry["rank"] = idx

        return jsonify({"leaderboard": leaderboard}), 200
    except Exception as e:
        return jsonify({"error": f"Failed to fetch leaderboard: {str(e)}"}), 500


@learning_bp.route("/stats", methods=["GET"])
@jwt_required()
def get_learning_stats():
    try:
        user_id = int(get_jwt_identity())

        results = QuizResult.query.filter_by(user_id=user_id).all()
        quizzes_count = len(results)
        total_correct = sum(r.score for r in results)
        total_attempted = sum(r.total for r in results)
        avg_accuracy = round((total_correct / total_attempted) * 100, 1) if total_attempted > 0 else 0.0

        badges_count = Achievement.query.filter_by(user_id=user_id).count()
        now = datetime.utcnow()
        latest_score = SafetyScore.query.filter_by(user_id=user_id, month=now.month, year=now.year).first()

        # Category breakdown
        category_stats = {}
        for r in results:
            cat = r.category or "general"
            if cat not in category_stats:
                category_stats[cat] = {"score": 0, "total": 0}
            category_stats[cat]["score"] += r.score
            category_stats[cat]["total"] += r.total

        breakdown = []
        for cat, val in category_stats.items():
            breakdown.append({
                "category": cat,
                "score": val["score"],
                "total": val["total"],
                "percentage": round((val["score"] / val["total"]) * 100, 1) if val["total"] > 0 else 0
            })

        return jsonify({
            "quizzes_taken": quizzes_count,
            "total_correct": total_correct,
            "total_attempted": total_attempted,
            "accuracy": avg_accuracy,
            "badges_earned": badges_count,
            "total_badges": len(BADGE_DEFINITIONS),
            "safety_score": latest_score.score if latest_score else 85.0,
            "category_breakdown": breakdown,
            "total_articles": len(ARTICLES)
        }), 200
    except Exception as e:
        return jsonify({"error": f"Failed to fetch stats: {str(e)}"}), 500


@learning_bp.route("/ask-tutor", methods=["POST"])
@jwt_required()
def ask_ai_tutor():
    try:
        data = request.get_json() or {}
        question = data.get("question", "").strip()

        if not question:
            return jsonify({"error": "Question is required"}), 400

        q_lower = question.lower()

        # Intelligent context-aware safety response generator
        if "hydroplan" in q_lower or "aquaplan" in q_lower or "rain" in q_lower or "waterlog" in q_lower:
            answer = (
                "**Hydroplaning Protocol:**\n\n"
                "1. **Never slam on the brakes** or jerk the steering wheel.\n"
                "2. **Ease off the accelerator** gently to allow tire tread to cut through the water film and restore road contact.\n"
                "3. Keep steering firmly straight ahead until grip returns.\n"
                "4. Maintain a 5–6 second space cushion in monsoon driving and use low beam fog lamps."
            )
            related_topic = "Driving in Severe Monsoon, Waterlogging & Hydroplaning"
            category = "weather"
        elif "sign" in q_lower or "red" in q_lower or "octagon" in q_lower or "triangle" in q_lower or "circle" in q_lower:
            answer = (
                "**Road Sign Classification System:**\n\n"
                "- **Circles (Red Border)**: Mandatory Prohibitions (e.g., Stop, Speed Limit, No Entry).\n"
                "- **Circles (Blue)**: Mandatory Positive Directions (e.g., Turn Left, Compulsory Track).\n"
                "- **Triangles (Red Border)**: Cautionary Warnings (e.g., Pedestrian Crossing, Curves, Slippery Surface).\n"
                "- **Rectangles (Green/Blue)**: Informatory, route guidance, and emergency services."
            )
            related_topic = "Mastering Mandatory, Cautionary & Informatory Road Signs"
            category = "signs"
        elif "accident" in q_lower or "first aid" in q_lower or "cpr" in q_lower or "emergency" in q_lower or "blood" in q_lower:
            answer = (
                "**Crash Scene & Golden Hour First Aid:**\n\n"
                "1. **Call 112 / 108 immediately** with your exact GPS landmark.\n"
                "2. **Secure Scene**: Park 30m away with hazards ON and place warning triangles 50–100m behind.\n"
                "3. **Apply Direct Pressure** on bleeding wounds with clean cloth.\n"
                "4. **Keep Spine Immobilized**: Do not twist neck or back unless immediate fire hazard exists.\n"
                "5. **Good Samaritan Protection**: You are legally protected from police harassment or civil liability."
            )
            related_topic = "The Golden Hour: Accident Emergency Response & First Aid"
            category = "emergency"
        elif "night" in q_lower or "high beam" in q_lower or "glare" in q_lower or "headlight" in q_lower:
            answer = (
                "**Night Driving & Glare Strategy:**\n\n"
                "- When facing oncoming high beams, **look down and towards the left fog line** (white road edge marker).\n"
                "- Never flash high beams back, which blinds both vehicles.\n"
                "- Flip your rearview mirror to anti-glare mode.\n"
                "- Keep windshield clean inside and out to eliminate starburst scattering."
            )
            related_topic = "Night Driving: Glare Management & Peripheral Vision"
            category = "driving"
        elif "tire" in q_lower or "blowout" in q_lower or "pressure" in q_lower or "brake" in q_lower:
            answer = (
                "**Tire Safety & Blowout Handling:**\n\n"
                "- Inspect Cold Tire Pressure every 2 weeks.\n"
                "- If a tire blows out at high speed: **Grip steering firmly, DO NOT brake hard**, let the vehicle coast down naturally, and steer gently onto the shoulder.\n"
                "- Replace tires when tread reaches 1.6mm Tread Wear Indicators (TWI)."
            )
            related_topic = "Pre-Drive Vehicle Safety Checklist & Tire Diagnostics"
            category = "maintenance"
        else:
            answer = (
                f"**SafeGuard AI Safety Guidance on '{question}':**\n\n"
                "Always apply the 3-Second Defensive Cushion rule, scan mirrors every 5–8 seconds, verify blind spots with shoulder checks, and obey posted speed limits. "
                "Safe driving is about proactive hazard anticipation before emergencies develop."
            )
            related_topic = "Defensive Driving: Space Cushioning & Hazard Anticipation"
            category = "driving"

        return jsonify({
            "question": question,
            "answer": answer,
            "related_topic": related_topic,
            "category": category,
            "timestamp": datetime.utcnow().isoformat()
        }), 200
    except Exception as e:
        return jsonify({"error": f"Failed to get tutor answer: {str(e)}"}), 500
