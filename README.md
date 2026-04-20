# MedRx - Medical Report Analyzer

MedRx is a full-stack MVP that lets users upload medical reports (JPG/PNG/PDF), extract report text via OCR, detect key health parameters, and generate simple explanations in English or Hinglish.

## Tech Stack

- Frontend: React + Vite + Tailwind CSS
- Backend: Express + Next.js (custom server integration)
- Database: MongoDB (Mongoose)
- Auth: JWT + bcrypt
- OCR/PDF Parsing: Tesseract.js + pdf-parse

## Folder Structure

```text
PROJECT FOR SEM 6/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── utils/
│   └── ...
└── backend/
    ├── next-client/pages/index.js
    ├── src/
    │   ├── config/
    │   ├── controllers/
    │   ├── middleware/
    │   ├── models/
    │   ├── routes/
    │   └── services/
    ├── server.js
    └── .env.example
```

## Step-by-Step Setup

### 1) Backend Setup

```bash
cd backend
cp .env.example .env
```

Update `.env` values:
- `MONGO_URI` (your MongoDB connection string)
- `JWT_SECRET` (any strong random secret)

Run backend:

```bash
npm install
npm run dev
```

Backend runs at `http://localhost:5000`.

### 2) Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`.

## App Flow

1. Splash page auto-redirects after 1.5 seconds.
2. Home page has "Start Now".
3. Portal has split layout:
   - Left: Login/Signup (MongoDB + JWT)
   - Right: Upload report (works with or without login)
4. File is analyzed:
   - OCR text extraction
   - Medical value detection (Hemoglobin, Blood Sugar, Cholesterol)
   - Normal/Low/High comparison
   - Natural language explanation
5. Results page shows extracted text, parameter cards, and explanation with language toggle.

## API Endpoints

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/analyze` (multipart file field: `report`)
- `GET /api/history` (optional logged-in history)
- `GET /api/health`

## Notes for Production

- Replace local storage token strategy with HTTP-only cookies.
- Add request validation (e.g., Zod/Joi).
- Integrate queue/worker for OCR at scale.
- Use object storage (S3/GCS) instead of local temp uploads.
