# MediConnect — AI-Assisted Telemedicine System

A full-stack telemedicine web app built for a BTech major project.

## Features
1. **AI symptom intake** — patient describes symptoms in free text; a rule-based
   NLP mapper (`backend/utils/symptomMapper.js`) predicts the right medical
   specialization and urgency level. (Easily swappable for a real LLM API call —
   see notes in that file.)
2. **Location-based doctor matching** — uses the browser's Geolocation API +
   Haversine distance calculation to find matching doctors within a radius,
   sorted by distance.
3. **Video or in-person choice** — patient picks consultation mode per booking.
4. **Maps integration** — Leaflet + OpenStreetMap (free, no API key needed)
   shows the doctor's clinic location and patient location on a map.
5. **Video consultation** — free public Jitsi Meet (`meet.jit.si`) embedded via
   iframe, room name unique per appointment — real working video calls, no
   backend signaling server required.
6. **Prescription → Cart → Delivery** — after a consultation, the doctor
   enters prescribed medicines. The patient can add them to a cart, checkout,
   and track a mock order-status pipeline (Placed → Packed → Out for Delivery
   → Delivered).
7. **Three roles**: Patient, Doctor, Admin (pharmacy/order management).

## Tech Stack
- **Frontend:** React 18 + Vite, React Router, Axios, React-Leaflet
- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT auth, bcrypt
- **Video:** Jitsi Meet (free public server)
- **Maps:** Leaflet + OpenStreetMap tiles

## Project Structure
```
telemed-app/
├── backend/
│   ├── models/          # User, Appointment, Prescription, Order
│   ├── routes/          # auth, doctors, ai, appointments, prescriptions, orders
│   ├── middleware/       # JWT auth middleware
│   ├── utils/            # symptomMapper.js (AI logic), geo.js (distance calc)
│   └── server.js
└── frontend/
    └── src/
        ├── pages/        # one component per screen
        ├── components/   # Navbar, MapView
        ├── context/      # AuthContext
        └── api/          # axios instance
```

## Setup

### Prerequisites
- Node.js 18+
- MongoDB running locally (`mongod`) OR a free MongoDB Atlas cluster

### 1. Backend
```bash
cd backend
npm install
cp .env.example .env
# edit .env: set MONGO_URI (local or Atlas) and a JWT_SECRET
npm run dev        # or: npm start
```
Backend runs on `http://localhost:5000`.

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on `http://localhost:5173` and proxies `/api` calls to the backend.

## How to demo it end-to-end
1. Register a **doctor** account (allow location access when prompted — this
   sets the clinic's map pin). Pick a specialization, e.g. "Cardiologist".
2. Register a **patient** account.
3. As the patient: go to **New Consultation**, type symptoms like
   *"I've been having chest pain and palpitations"*, allow location access,
   submit. The AI should predict "Cardiologist" and show your doctor.
4. Choose **Video** or **In-Person**, pick a time slot, confirm booking.
5. Open the appointment — video mode launches a live Jitsi call; in-person
   mode shows the clinic on the map.
6. Log in as the **doctor**, open the same appointment, click
   "Write Prescription", add medicines, save.
7. Back as the **patient**: go to **Prescriptions** → "Add All to Cart" →
   **Cart** → **Checkout** → place order.
8. Go to **Orders** to see the status tracker. To advance the order status,
   register a third account with role `admin` directly in MongoDB (or add a
   temporary registration option) and use the **Admin** page to move it
   through Placed → Packed → Out for Delivery → Delivered.

## Notes for your project report / viva
- The AI module is intentionally rule-based and explainable (keyword →
  specialization scoring) rather than a black-box model — this is a
  legitimate and common approach for symptom-triage systems, and it's easy
  to explain in a viva. `backend/utils/symptomMapper.js` documents how you'd
  swap in a real LLM API call or a trained ClinicalBERT/MedSpaCy model if
  you want to extend it.
- Distance filtering uses the Haversine formula — no paid API required.
- Video calls use Jitsi's free public server so there's no billing setup or
  WebRTC signaling server to build/host — but the architecture (unique room
  per appointment, iframe embed) is realistic and mirrors how you'd swap in
  Twilio/Agora with a paid key later.
- Order delivery is simulated (status field updated manually by
  admin/pharmacy) — real courier API integration would be a natural
  "future work" extension to mention.

## Possible extensions to mention as future work
- Real LLM-based symptom analysis (OpenAI/Anthropic API call)
- SMS/email notifications for appointment reminders
- Payment gateway integration (Razorpay/Stripe) for consultation fees & orders
- Doctor availability calendar instead of fixed time slots
- Real-time chat during consultations
