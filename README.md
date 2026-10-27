<div align="center">

<table align="center">
<tr>
<td align="center">
<br>
<h1 align="center">🛡️ S A F E G U A R D &nbsp; A I</h1>
<b>Intelligent Road Safety &amp; Accident Prevention</b>
<br><br>
</td>
</tr>
</table>

### 🚦 Making every journey safer, with AI 🚦

**An AI-powered SaaS platform that helps drivers, pedestrians, students, transport authorities, and smart cities prevent accidents through AI chat, predictive analytics, computer vision, hazard reporting, and emergency assistance.**

<br>

`⚛️ React 18` &nbsp;•&nbsp; `⚡ Vite` &nbsp;•&nbsp; `🎨 Tailwind CSS` &nbsp;•&nbsp; `🐍 Flask` &nbsp;•&nbsp; `🤖 Gemini AI` &nbsp;•&nbsp; `📜 MIT License`

<br>

[✨ Features](#-features) &nbsp;│&nbsp; [🧰 Tech Stack](#-tech-stack) &nbsp;│&nbsp; [🚀 Quick Start](#-quick-start) &nbsp;│&nbsp; [🔌 API](#-api-overview) &nbsp;│&nbsp; [🌐 Deploy](#-deployment) &nbsp;│&nbsp; [🤝 Contribute](#-contributing)

</div>

<br>

---

## 📖 Overview

> **Road accidents are largely preventable.** SafeGuard AI brings together artificial intelligence, computer vision, and community reporting in one platform.

| 👤 Who | 💡 What they get |
|:------|:----------------|
| 🚗 **Drivers & Pedestrians** | Instant safety guidance and real-time risk awareness |
| 🎓 **Students** | Road safety learning through quizzes, badges, and leaderboards |
| 🏛️ **Authorities & Smart Cities** | Live hazard maps, analytics, and tools to verify and act on incidents |

> [!TIP]
> **No API key? No problem!** The app ships with intelligent mock AI responses, so you can run and demo everything locally without any paid service.

<br>

## 🎯 Platform Highlights

<div align="center">

| 🤖 **AI Chat** | 👁️ **Sign Detection** | 📍 **Hazard Reports** |
|:---:|:---:|:---:|
| Ask anything about road safety | Recognize signs from photos | Report issues with GPS & photos |
| 📊 **Risk Gauge** | 🗺️ **Live Heatmaps** | 🚨 **Emergency SOS** |
| Predict accident risk | See danger zones on a map | One-click emergency help |
| 🎓 **Learning Hub** | 🏆 **Safety Score** | 🛠️ **Admin Panel** |
| Quizzes, badges, rankings | Track your driving habits | Verify, manage, and export |

</div>

<br>

---

## ✨ Features

### 🤖 1. AI Road Safety Assistant
> Your 24/7 road safety companion.

Chatbot for **traffic rules**, **road signs**, **safe driving advice**, and **emergency help**, with 🎙️ voice support and 🌍 multi-language capabilities.

### 👁️ 2. Road Sign Recognition
> Snap it. Upload it. Understand it.

Upload an image to detect signs with **confidence scores**:

`🛑 Stop` &nbsp; `🚸 School Zone` &nbsp; `⛔ No Entry` &nbsp; `🔢 Speed Limit` &nbsp; `🚶 Zebra Crossing` &nbsp; `🚦 Traffic Lights`

### 📍 3. Smart Hazard Reporting
> Crowdsourced road safety.

Report **potholes**, **broken signals**, **road damage**, **waterlogging**, **accidents**, and **missing signs** with photo upload, 📡 GPS auto-detection, and severity tracking.

### 📊 4. Accident Risk Prediction
> Know the danger before you drive.

Predict risk from **speed**, **weather**, **traffic density**, **road condition**, and **time of day**, with interactive gauge charts and actionable recommendations.

### 🗺️ 5. Smart City Dashboard
> The city's safety, at a glance.

Interactive map with hazard markers, accident heatmaps, density analysis, and real-time safety insights.

### 🚨 6. Emergency SOS
> Help in one tap.

One-click emergency mode with 🏥 nearby hospitals, 🚑 ambulance info, 🩹 first-aid guides, 📍 GPS sharing, and 📞 emergency contacts.

### 🎓 7. Safety Learning Hub
> Learn. Play. Get safer.

Articles, videos, tutorials, and quizzes with 🏅 gamified badges and a leaderboard.

### 🏆 8. Driver Safety Score
> A rating that grows with you.

Personalized score based on quiz performance, risk assessments, and driving habits, with monthly progress tracking.

### 📈 9. AI Analytics Engine
> Data turned into decisions.

Insights on dangerous roads, peak accident times, risk categories, and user safety trends.

### 🛠️ 10. Authority / Admin Panel
> Full control for transport authorities.

Manage users and reports, verify incidents, view analytics, and export **CSV / PDF** reports.

<br>

---

## 🧰 Tech Stack

| Layer | Purpose | Technology |
|:-----:|:--------|:-----------|
| 🎨 **Frontend** | Framework | React 18 + Vite |
| | Styling | Tailwind CSS + PostCSS |
| | Animation | Framer Motion |
| | Routing | React Router |
| | Charts | Chart.js |
| | Maps | Leaflet |
| | State | Zustand |
| | Data fetching | React Query |
| ⚙️ **Backend** | Framework | Python Flask |
| | ORM | SQLAlchemy |
| | Database | SQLite |
| | Auth | JWT |
| 🧠 **AI** | Chat & NLP | Google Gemini API |
| | Vision | Computer vision pipeline |
| | Predictions | Predictive analytics |

<br>

---

## 🏗️ Architecture

```text
┌──────────────────────┐        REST / JSON         ┌──────────────────────┐
│  React + Vite SPA    │ ─────────────────────────► │      Flask API       │
│  (localhost:3000)    │ ◄───────────────────────── │   (localhost:5000)   │
└──────────────────────┘        JWT in header       └──────────┬───────────┘
                                                               │
                                   ┌───────────────────────────┼──────────────────┐
                                   ▼                           ▼                  ▼
                            ┌─────────────┐            ┌──────────────┐    ┌──────────────┐
                            │  SQLite DB  │            │  Gemini API  │    │Vision Module │
                            │ (SQLAlchemy)│            │ (or mock AI) │    │              │
                            └─────────────┘            └──────────────┘    └──────────────┘
```

<br>

---

## 🚀 Quick Start

> [!NOTE]
> **Prerequisites:** &nbsp; 🟢 Node.js **18+** &nbsp;•&nbsp; 🐍 Python **3.9+** &nbsp;•&nbsp; 📦 pip

### 📥 Step 1: Clone

```bash
git clone https://github.com/<your-username>/safeguard-ai.git
cd safeguard-ai
```

### ⚙️ Step 2: Start the Backend

```bash
cd backend

# (Recommended) create a virtual environment
python -m venv venv
source venv/bin/activate        # macOS / Linux
venv\Scripts\activate           # Windows

pip install -r requirements.txt
python app.py
```

✅ Backend running at **http://localhost:5000**

### 🎨 Step 3: Start the Frontend

Open a **second terminal**:

```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```

✅ Frontend running at **http://localhost:3000**

### 🔐 Step 4: Log In

Open **http://localhost:3000** and use the default admin account:

| Field | Value |
|:------|:------|
| 📧 Email | `admin@safeguard.ai` |
| 🔑 Password | `Admin@123` |

> [!WARNING]
> **Change these credentials immediately before deploying to any public environment.**

<details>
<summary><b>⚡ Windows shortcut (click to expand)</b></summary>

<br>

From the project root, skip the manual steps:

| Script | What it does |
|:-------|:-------------|
| `run.bat` | ▶️ Starts the app |
| `launch.bat` | 🚀 Launches the app |
| `stop.bat` | ⏹️ Stops the running servers |

Double-click a file, or run it from a terminal, e.g. `run.bat`.

</details>

<br>

---

## 🔑 Environment Variables

Create a `.env` file inside `backend/` *(never commit it)*:

```env
# 🤖 AI (optional - the app falls back to mock responses without these)
GEMINI_API_KEY=your_gemini_api_key
OPENAI_API_KEY=your_openai_api_key

# 🔒 Security (strongly recommended for production)
SECRET_KEY=change-me
JWT_SECRET_KEY=change-me-too
```

| Variable | Required | Description |
|:---------|:--------:|:------------|
| `GEMINI_API_KEY` | 🟡 Optional | Enables real Gemini-powered chat and insights. Get one from [Google AI Studio](https://aistudio.google.com/) |
| `OPENAI_API_KEY` | 🟡 Optional | Alternative AI provider |
| `SECRET_KEY` | 🟢 Recommended | Flask secret key |
| `JWT_SECRET_KEY` | 🟢 Recommended | Key used to sign JWT tokens |

> [!TIP]
> Generate strong secrets with:
> `python -c "import secrets; print(secrets.token_hex(32))"`

<br>

---

## 🔌 API Overview

Each backend route module maps to a feature area:

| 📦 Module | 🎯 Purpose |
|:----------|:-----------|
| `auth.py` | Register, login, and token handling |
| `chat.py` | AI road safety chat |
| `vision.py` | Road sign image recognition |
| `hazards.py` | Create, list, and update hazard reports |
| `risk.py` | Accident risk prediction |
| `dashboard.py` | Map data, heatmaps, and analytics |
| `sos.py` | Emergency contacts, hospitals, and first aid |
| `learning.py` | Articles, quizzes, badges, and leaderboard |
| `admin.py` | User management, verification, and exports |

Protected endpoints expect a JWT in the request header:

```http
Authorization: Bearer <your_token>
```

<details>
<summary><b>📡 Example: authenticated request</b></summary>

<br>

> Adjust the paths below to match your actual route definitions.

```bash
# 1. Log in and receive a token
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@safeguard.ai", "password": "Admin@123"}'

# 2. Use the token on a protected endpoint
curl http://localhost:5000/api/hazards \
  -H "Authorization: Bearer <your_token>"
```

</details>

<br>

---

## 📁 Project Structure

<details>
<summary><b>📂 Click to expand</b></summary>

```text
safeguard-ai/
├── 🐍 backend/
│   ├── app.py                # Flask application factory
│   ├── config.py             # Configuration settings
│   ├── models.py             # SQLAlchemy database models
│   ├── requirements.txt      # Python dependencies
│   ├── ai/
│   │   ├── gemini.py         # Gemini AI integration
│   │   └── vision.py         # Computer vision processing
│   ├── routes/
│   │   ├── auth.py           # Authentication
│   │   ├── chat.py           # AI chat
│   │   ├── vision.py         # Sign recognition
│   │   ├── hazards.py        # Hazard reporting
│   │   ├── risk.py           # Risk prediction
│   │   ├── dashboard.py      # Dashboard analytics
│   │   ├── sos.py            # Emergency SOS
│   │   ├── learning.py       # Learning hub & quizzes
│   │   └── admin.py          # Admin panel
│   └── utils/
│       └── helpers.py        # Utility functions
│
├── ⚛️ frontend/
│   ├── public/               # Static assets
│   ├── src/
│   │   ├── App.jsx           # Main app with routes
│   │   ├── main.jsx          # Entry point
│   │   ├── index.css         # Global styles + Tailwind
│   │   ├── components/
│   │   │   ├── landing/      # Landing page sections
│   │   │   ├── dashboard/    # Dashboard layout & shared
│   │   │   ├── admin/        # Admin layout
│   │   │   └── ui/           # UI primitives
│   │   ├── pages/            # Route pages (incl. admin/)
│   │   ├── store/            # Zustand state management
│   │   ├── services/         # API service layer
│   │   ├── hooks/            # Custom React hooks
│   │   └── lib/              # Utilities
│   ├── index.html            # HTML entry point
│   ├── package.json
│   ├── postcss.config.js     # PostCSS configuration
│   ├── tailwind.config.js    # Tailwind configuration
│   └── vite.config.js        # Vite configuration
│
├── launch.bat                # Windows launcher script
├── run.bat                   # Windows run script
├── stop.bat                  # Windows stop script
└── README.md
```

</details>

<br>

---

## 🌐 Deployment

### ▲ Frontend → Vercel

```bash
cd frontend
npm run build
vercel deploy
```

Set your backend URL as an environment variable in Vercel so the frontend can reach the API.

### 🚂 Backend → Render

```bash
cd backend
gunicorn app:app
```

| Setting | Value |
|:--------|:------|
| Root directory | `backend` |
| Build command | `pip install -r requirements.txt` |
| Start command | `gunicorn app:app` |

Add your environment variables in the Render dashboard.

> [!NOTE]
> SQLite is great for development, but for production consider **PostgreSQL**, since many hosts use ephemeral file systems.

### ✅ Production Checklist

- [ ] Change the default admin credentials
- [ ] Set strong `SECRET_KEY` and `JWT_SECRET_KEY`
- [ ] Restrict CORS to your frontend domain
- [ ] Switch from SQLite to PostgreSQL
- [ ] Serve everything over HTTPS

<br>

---

## 🔒 Security

| | Protection |
|:-:|:-----------|
| 🔑 | JWT authentication with 24-hour token expiry |
| 🔐 | Password hashing with bcrypt |
| ✅ | Input validation on all endpoints |
| 👮 | Role-based access control (`user` / `admin`) |
| 🌐 | CORS protection |
| ⏱️ | Rate limiting on auth routes |

> [!IMPORTANT]
> Found a vulnerability? Please open a **private security advisory** instead of a public issue.

<br>

---

## 🩺 Troubleshooting

| ❌ Problem | ✅ Fix |
|:-----------|:-------|
| `npm install` fails with peer dependency errors | Use `npm install --legacy-peer-deps` |
| Frontend can't reach the API | Confirm the backend runs on port `5000` and CORS allows `localhost:3000` |
| Port already in use | Stop the other process, or run `stop.bat` on Windows |
| AI replies look generic | No API key is set, so mock responses are active. Add `GEMINI_API_KEY` to `backend/.env` |
| `ModuleNotFoundError` in backend | Activate your virtual environment and re-run `pip install -r requirements.txt` |

<br>

---

## 🗺️ Roadmap

| Status | Planned feature |
|:------:|:----------------|
| 🔜 | 📱 Mobile app (React Native) |
| 🔜 | ⚡ Real-time alerts via WebSockets |
| 🔜 | 🌦️ Live traffic and weather API integration |
| 🔜 | 🧠 Trained deep-learning model for sign detection |
| 🔜 | 🐘 PostgreSQL support |
| 🔜 | 📴 Offline-first SOS mode |

<br>

---

## 🤝 Contributing

Contributions are welcome and appreciated! 💙

```bash
# 1. Fork the repo, then create your feature branch
git checkout -b feature/amazing-feature

# 2. Commit your changes
git commit -m "Add amazing feature"

# 3. Push to your branch
git push origin feature/amazing-feature
```

**4.** Open a **Pull Request** 🎉

<br>

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for details.

<br>

<div align="center">

### 🛡️ Built with ❤️ to make every journey safer.

**⭐ If you find this project useful, please consider giving it a star! ⭐**

</div>
