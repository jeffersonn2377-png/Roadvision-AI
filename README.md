# ROADVISION AI — Intelligent Road Damage & Infrastructure Maintenance Platform

> **"From Road Images to Intelligent Maintenance Decisions."**

ROADVISION AI is a software-based AI road damage detection, multi-factor priority ranking, cost estimation, and predictive maintenance platform built for smart cities and municipal infrastructure authorities.

---

## 🌟 Key Features

- **100% Software Prototype**: Runs completely locally on any normal Windows laptop in VS Code with a browser. No hardware, ESP32, or IoT sensors required.
- **AI Road Scanner**: Processes road images and videos (JPG, PNG, WEBP, MP4) with simulated or trained computer vision models.
- **Modular AI Service Architecture**: Features `DemoDetector` for prototype testing and a clean `YOLODetector` placeholder for future model weights.
- **Main Innovation — Multi-Factor Repair Priority**:
  - Damage Severity: **35%**
  - Damage Size/Area Risk: **30%**
  - Traffic Volume: **20%**
  - Road Importance: **15%**
- **Dynamic AI Decision Recommendations**: Automatically generates natural language explanations for priority #1 road dispatches.
- **Interactive Damage Map**: Leaflet + OpenStreetMap integration with color-coded severity markers (🟢 Minor, 🟡 Moderate, 🟠 High, 🔴 Critical) and popup dispatch triggers.
- **Predictive Maintenance**: Historical decay regression modeling projecting 30-day road health scores.
- **Cost Estimation Engine**: Automatic min/max INR (₹) repair cost calculations.
- **Persistent Maintenance Dispatch**: Complete work-order ticket workflow with SQLite database persistence.
- **Automated Judge Demo**: 6-step interactive visual workflow modal executing real REST API calls.

---

## 🛠️ Technology Stack

### Backend
- **Python 3.10+**
- **FastAPI**
- **SQLAlchemy ORM**
- **SQLite Database**
- **Pydantic v2**
- **Uvicorn Server**

### Frontend
- **React 18**
- **Vite**
- **Tailwind CSS** (Command Center Dark Theme)
- **React Router DOM**
- **Leaflet & React-Leaflet**
- **Recharts**
- **Lucide React Icons**
- **Axios**

---

## 📁 Project Structure

```text
ROADVISION-AI/
├── backend/
│   ├── main.py                     # FastAPI routes, CORS & startup initialization
│   ├── database.py                 # SQLite SQLAlchemy engine setup
│   ├── models.py                   # SQLAlchemy ORM schemas
│   ├── schemas.py                  # Pydantic request/response models
│   ├── ai_service.py               # DemoDetector & YOLODetector placeholder
│   ├── services/
│   │   ├── severity_service.py     # Severity score algorithm (0-100)
│   │   ├── priority_service.py     # Main innovation weighted priority algorithm
│   │   ├── cost_service.py         # Repair cost range estimation (₹)
│   │   ├── health_service.py       # Road network health calculator
│   │   ├── prediction_service.py   # Historical decay trend linear regression
│   │   └── seed_service.py         # Auto database seeder (20+ records, 10 roads)
│   ├── uploads/                    # Uploaded road media & sample files
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/             # Navbar, Sidebar, Canvas Visualizer, Judge Demo
│   │   ├── pages/                  # 12 React views (Landing, Dashboard, Scanner, etc.)
│   │   ├── services/               # Axios API client
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
├── README.md
├── .gitignore
└── .env.example
```

---

## 🔑 Demo Credentials

- **Email**: `admin@roadvision.ai`
- **Password**: `admin123`

---

## 🚀 Easy Setup & Running Instructions (Windows PowerShell)

### Step 1: Start Backend (FastAPI + SQLite)

Open VS Code Terminal #1:

```powershell
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

- **Backend API**: `http://localhost:8000`
- **Interactive Swagger Docs**: `http://localhost:8000/docs`

---

### Step 2: Start Frontend (React + Vite)

Open VS Code Terminal #2:

```powershell
cd frontend
npm install
npm run dev
```

Open the Vite local server URL shown in terminal (typically `http://localhost:5173`).

---

## ⚙️ Future YOLO Integration

To switch from `DemoDetector` to a real trained YOLO model:
1. Place your trained PyTorch weights file (e.g. `best.pt`) in `backend/models/`.
2. Update `backend/ai_service.py` under the `YOLODetector` class to load `ultralytics` (`from ultralytics import YOLO`).
3. Set default detector in `ai_service.py` to return `YOLODetector("path/to/best.pt")`.

---

## 📤 How to Push to GitHub

Run these Git commands in your project root terminal:

```powershell
git init
git add .
git commit -m "Initial ROADVISION AI full-stack release"
git branch -M main
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin main
```
