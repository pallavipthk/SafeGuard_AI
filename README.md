
<div align="center">

# 🛡️ SafeGuard AI

### Intelligent Road Safety & Accident Prevention Platform

An AI-powered SaaS platform that helps drivers, pedestrians, students, transport authorities, and smart cities make roads safer through AI chatbots, predictive analytics, computer vision, hazard reporting, and emergency assistance.

⚛️ React 18 &nbsp;•&nbsp; ⚡ Vite &nbsp;•&nbsp; 🎨 Tailwind CSS &nbsp;•&nbsp; 🐍 Flask &nbsp;•&nbsp; 🤖 Gemini AI &nbsp;•&nbsp; 📜 MIT License

[Features](#-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [API Overview](#-api-overview) • [Deployment](#-deployment) • [Contributing](#-contributing)

</div>

---

## 📖 Overview

Road accidents are largely preventable. **SafeGuard AI** brings together artificial intelligence, computer vision, and community reporting in one platform so that:

- **Drivers & pedestrians** get instant safety guidance and risk awareness
- **Students** learn road safety through quizzes, badges, and leaderboards
- **Authorities & smart cities** get live hazard maps, analytics, and tools to verify and act on incidents

> 💡 **No API key? No problem.** The app ships with intelligent mock AI responses, so you can run and demo everything locally without any paid service.

---

## 🎯 Platform Highlights

| | | |
|:---:|:---:|:---:|
| 🤖 **AI Chat** | 👁️ **Sign Detection** | 📍 **Hazard Reports** |
| 📊 **Risk Gauge** | 🗺️ **Live Heatmaps** | 🚨 **Emergency SOS** |
| 🎓 **Learning Hub** | 🏆 **Safety Score** | 🛠️ **Admin Panel** |

---

## ✨ Features

| # | Feature | Description |
|---|---------|-------------|
| 1 | 🤖 **AI Road Safety Assistant** | Chatbot for traffic rules, road signs, safe driving advice, and emergency help, with voice support and multi-language capabilities |
| 2 | 👁️ **Road Sign Recognition** | Upload an image to detect signs (Stop, Speed Limit, No Entry, School Zone, Zebra Crossing, Traffic Lights) with confidence scores |
| 3 | 📍 **Smart Hazard Reporting** | Report potholes, broken signals, road damage, waterlogging, accidents, and missing signs with photo upload, GPS auto-detection, and severity tracking |
| 4 | 📊 **Accident Risk Prediction** | Predict risk from speed, weather, traffic density, road condition, and time of day, with interactive gauge charts and recommendations |
| 5 | 🗺️ **Smart City Dashboard** | Interactive map with hazard markers, accident heatmaps, density analysis, and real-time safety insights |
| 6 | 🚨 **Emergency SOS** | One-click emergency mode with nearby hospitals, ambulance info, first-aid guides, GPS sharing, and emergency contacts |
| 7 | 🎓 **Safety Learning Hub** | Articles, videos, tutorials, and quizzes with gamified badges and a leaderboard |
| 8 | 🏆 **Driver Safety Score** | Personalized rating based on quiz performance, risk assessments, and driving habits, with monthly progress tracking |
| 9 | 📈 **AI Analytics Engine** | Insights on dangerous roads, peak accident times, risk categories, and user safety trends |
| 10 | 🛠️ **Authority / Admin Panel** | Manage users and reports, verify incidents, view analytics, and export CSV/PDF reports |

---

## 🧰 Tech Stack

### Frontend
| Purpose | Technology |
|---------|------------|
| Framework | React 18 + Vite |
| Styling | Tailwind CSS + PostCSS |
| Animation | Framer Motion |
| Routing | React Router |
| Charts | Chart.js |
| Maps | Leaflet |
| State | Zustand |
| Data fetching | React Query |

### Backend
| Purpose | Technology |
|---------|------------|
| Framework | Python Flask |
| ORM | SQLAlchemy |
| Database | SQLite |
| Auth | JWT |

### AI
| Purpose | Technology |
|---------|------------|
| Chat & NLP | Google Gemini API |
| Vision | Computer Vision pipeline |
| Predictions | Predictive analytics |

---

## 🏗️ Architecture

```
┌──────────────────────┐        REST / JSON         ┌──────────────────────┐
│  React + Vite SPA    │ ─────────────────────────► │    Flask API         │
│  (localhost:3000)    │ ◄───────────────────────── │  (localhost:5000)    │
└──────────────────────┘        JWT in header       └──────────┬───────────┘
                                                               │
                                   ┌───────────────────────────┼──────────────────┐
                                   ▼                           ▼                  ▼
                            ┌─────────────┐            ┌──────────────┐    ┌──────────────┐
                            │  SQLite DB  │            │  Gemini API  │    │ Vision Module│
                            │ (SQLAlchemy)│            │ (or mock AI) │    │              │
                            └─────────────┘            └──────────────┘    └──────────────┘
```

---

## 📁 Project Structure

```
safeguard-ai/
├── backend/
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
├── frontend/
│   ├── dist/                 # Production build output
│   ├── node_modules/         # Installed dependencies
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
│   ├── package-lock.json
│   ├── postcss.config.js     # PostCSS configuration
│   ├── tailwind.config.js    # Tailwind configuration
│   └── vite.config.js        # Vite configuration
│
├── launch.bat                # Windows launcher script
├── run.bat                   # Windows run script
├── stop.bat                  # Windows stop script
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or newer
- [Python](https://www.python.org/) 3.9 or newer
- `pip` (comes with Python)

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/safeguard-ai.git
cd safeguard-ai
```

### 2. Start the backend

```bash
cd backend

# (Recommended) create a virtual environment
python -m venv venv
source venv/bin/activate        # macOS / Linux
venv\Scripts\activate           # Windows

pip install -r requirements.txt
python app.py
```

Backend runs at **http://localhost:5000**

### 3. Start the frontend

Open a **second terminal**:

```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```

Frontend runs at **http://localhost:3000**

### ⚡ Windows Shortcut

On Windows you can skip the manual steps and use the included scripts from the project root:

| Script | What it does |
|--------|--------------|
| `run.bat` | Starts the app |
| `launch.bat` | Launches the app |
| `stop.bat` | Stops the running servers |

Double-click a file, or run it from a terminal, e.g. `run.bat`.

### 4. Log in

Open http://localhost:3000 in your browser and use the default admin account:

| Field | Value |
|-------|-------|
| Email | `admin@safeguard.ai` |
| Password | `Admin@123` |

> ⚠️ **Change these credentials immediately** before deploying to any public environment.

---

## 🔑 Environment Variables

Create a `.env` file inside `backend/` (never commit it):

```env
# AI (optional - the app falls back to mock responses without these)
GEMINI_API_KEY=your_gemini_api_key
OPENAI_API_KEY=your_openai_api_key

# Security (recommended for production)
SECRET_KEY=change-me
JWT_SECRET_KEY=change-me-too
```

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | Optional | Enables real Gemini-powered chat and insights. Get one from [Google AI Studio](https://aistudio.google.com/) |
| `OPENAI_API_KEY` | Optional | Alternative AI provider |
| `SECRET_KEY` | Recommended | Flask secret key |
| `JWT_SECRET_KEY` | Recommended | Key used to sign JWT tokens |

---

## 🔌 API Overview

Each backend route module maps to a feature area:

| Module | Purpose |
|--------|---------|
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

---

## 🌐 Deployment

### Frontend → Vercel

```bash
cd frontend
npm run build
vercel deploy
```

Set your backend URL as an environment variable in Vercel so the frontend can reach the API.

### Backend → Render

```bash
cd backend
gunicorn app:app
```

On Render, use these settings:

| Setting | Value |
|---------|-------|
| Root directory | `backend` |
| Build command | `pip install -r requirements.txt` |
| Start command | `gunicorn app:app` |

Add your environment variables in the Render dashboard.

> 📝 SQLite is great for development, but for production consider PostgreSQL, since many hosts use ephemeral file systems.

---

## 🔒 Security

- JWT authentication with 24-hour token expiry
- Password hashing with bcrypt
- Input validation on all endpoints
- Role-based access control (`user` / `admin`)
- CORS protection
- Rate limiting on auth routes

Found a vulnerability? Please open a private security advisory instead of a public issue.

---

## 🗺️ Roadmap

- [ ] Mobile app (React Native)
- [ ] Real-time alerts via WebSockets
- [ ] Live traffic and weather API integration
- [ ] Trained deep-learning model for sign detection
- [ ] PostgreSQL support
- [ ] Offline-first SOS mode

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m "Add amazing feature"`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for details.

---

<div align="center">

**Built with ❤️ to make every journey safer.**

⭐ If you find this project useful, please consider giving it a star!

</div>
=======
# SafeGuard_AI
>>>>>>> cff7b40ad78ac857927e11c8c08a029e90e0974b
