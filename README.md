# WorkPilot AI 🚀
### "Your Personal Corporate Life Manager."

A premium AI-powered application for corporate employees, freelancers, and professionals to manage their complete work life from one place.

---

## 📦 Monorepo Structure

```
workpilot-ai/
├── mobile/          # Flutter App (Android + iOS)
├── backend/         # Node.js REST API
├── ai-service/      # FastAPI AI Microservice
├── admin/           # React Admin Panel
└── docs/            # Architecture & API Docs
```

---

## 🎯 Features

### Core Modules
| Module | Description |
|--------|-------------|
| 🤖 AI Career Assistant | Career roadmap, skill gap, resume analyzer, interview prep |
| 📊 Goal & KPI Manager | OKR tracking, progress graphs, boss feedback |
| 📅 Meeting Manager | AI notes, action items, voice-to-text, follow-ups |
| ✅ Task Manager | Daily/weekly/monthly planner, smart reminders |
| 🔐 Document Vault | Encrypted storage for all career documents |
| 💰 Salary & Tax Manager | Increment history, ITR reminders, Form16 |
| 💳 Finance Manager | EMI, SIP, loans, insurance, budget |
| 🏖️ Leave Manager | Leave balance, holiday calendar, team view |
| 💊 Health Manager | Water, medicine, checkup reminders |
| 👨‍👩‍👧 Family Organizer | Birthdays, bills, LIC, school fees |
| 📓 AI Daily Journal | Auto work logs from completed tasks |
| ✉️ AI Email Writer | Professional email generator |
| 💬 AI Chat Assistant | Corporate knowledge assistant with memory |
| 🔔 Smart Notifications | Increment, tax, EMI, goals, certifications |
| 📈 Analytics | Productivity, Career, Financial, Learning scores |

---

## 🛠 Tech Stack

### Mobile (Flutter)
- **Framework**: Flutter 3.x
- **State Management**: flutter_bloc + Hydrated BLoC
- **Navigation**: go_router
- **DI**: get_it + injectable
- **Local Storage**: Hive + SharedPreferences
- **Network**: Dio + Retrofit
- **Auth**: Firebase Auth (Email, Google, Microsoft, OTP, Biometric)
- **Database**: Firebase Firestore + Offline Sync
- **Storage**: Firebase Storage (encrypted documents)
- **Charts**: fl_chart
- **Notifications**: FCM + flutter_local_notifications

### Backend (Node.js)
- **Framework**: Express.js
- **Database**: PostgreSQL + Sequelize ORM
- **Auth**: JWT + Firebase Admin SDK
- **Queue**: Bull + Redis
- **Email**: Nodemailer
- **File Storage**: Firebase Storage
- **API Docs**: Swagger/OpenAPI
- **Logging**: Winston

### AI Service (FastAPI)
- **Framework**: FastAPI + Python 3.11
- **LLM**: OpenAI GPT-4 via LangChain
- **Memory**: Redis (conversation history)
- **Voice**: OpenAI Whisper API
- **Task Queue**: Celery

### Admin Panel (React)
- **Framework**: React 18 + TypeScript + Vite
- **Styling**: TailwindCSS + Shadcn/UI
- **State**: Zustand + React Query
- **Charts**: Recharts
- **Auth**: JWT admin tokens

---

## 🚀 Quick Start

### Prerequisites
- Flutter SDK 3.x
- Node.js 20+
- Python 3.11+
- PostgreSQL 15+
- Redis
- Firebase project

### 1. Clone & Setup Environment
```bash
git clone https://github.com/your-org/workpilot-ai.git
cd workpilot-ai

# Copy all env files
cp backend/.env.example backend/.env
cp ai-service/.env.example ai-service/.env
cp admin/.env.example admin/.env
```

### 2. Backend
```bash
cd backend
npm install
npm run migrate   # Run DB migrations
npm run seed      # Optional: seed data
npm run dev
```

### 3. AI Service
```bash
cd ai-service
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8001
```

### 4. Admin Panel
```bash
cd admin
npm install
npm run dev
```

### 5. Flutter App
```bash
cd mobile
flutter pub get
flutter run
```

---

## 📱 Deployment

### Android (Play Store)
```bash
cd mobile
flutter build apk --release
flutter build appbundle --release
```

### iOS (App Store)
```bash
cd mobile
flutter build ios --release
```

### Backend (Docker)
```bash
docker-compose up --build
```

### Admin Panel (Vercel/Netlify)
```bash
cd admin
npm run build
# Deploy dist/ folder
```

---

## 💎 Subscription Plans

| Plan | Price | Features |
|------|-------|---------|
| Free | ₹0 | 3 modules, 5 tasks/day, basic AI |
| Premium Monthly | ₹299/mo | All modules, unlimited tasks, AI |
| Premium Yearly | ₹2499/yr | All + offline, priority support |
| AI Pro | ₹499/mo | All + unlimited AI, career coaching |

---

## 🔒 Security
- AES-256 encryption for documents
- JWT with refresh token rotation
- Biometric + PIN lock
- GDPR + India DPDP Act compliant
- Firebase Security Rules
- Rate limiting on all endpoints

---

## 📄 License
MIT License — © 2026 WorkPilot AI

---

## 🤝 Contributing
See [CONTRIBUTING.md](docs/CONTRIBUTING.md)
