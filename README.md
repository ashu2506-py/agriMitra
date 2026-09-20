# AGRI MITRA 🌾 Market Platform

> AI-Powered Direct Farm-to-Market Digital Marketplace connecting farmers, FPOs, buyers, and logistics drivers with transparent pricing, crop intelligence, and route optimization.

---

## 🚀 System Architecture

AGRI MITRA is structured as a production-grade monorepo:

```
agri-mitra/
├── frontend/      # React 18, TypeScript, Vite, Tailwind CSS, Zustand, Recharts, Leaflet
├── backend/       # Node.js, Express.js (Modular Monolith), TypeScript, Prisma, Socket.IO
├── ai-service/    # Python 3.11+, FastAPI, OpenCV, scikit-learn, XGBoost, OR-Tools baseline
├── docs/          # Architecture, API specifications, Database schema, AI documentation
└── docker-compose.yml
```

---

## 💡 Key Features

- 👨‍🌾 **Farmer Portal**: Crop listing management, AI health & quality assessment, buyer discovery, direct negotiation, and shipment tracking.
- 🏬 **Buyer Marketplace**: Hyperlocal crop search, custom buyer requirements, transparent pricing breakdown, order placement, PDF invoicing.
- 🏢 **FPO Module**: Multi-farmer aggregation, bulk crop listings, transparent order payout allocation.
- 🚚 **Logistics Driver Portal**: Route optimization, Socket.IO real-time GPS tracking, status updates.
- 🧠 **AI Intelligence Engine**:
  - Crop Disease Detection (`/ai/crop/disease-detection`)
  - Quality Grading (`/ai/crop/quality`)
  - XGBoost Price Prediction (`/ai/market/price-prediction`)
  - Demand Forecasting (`/ai/market/demand-forecast`)
  - Contextual Farmer AI Assistant (`/api/assistant/chat`)
- 🛡️ **Security & Auditing**: Role-based access control (RBAC), HTTP-only JWT cookies, server-side input validation with Zod & Pydantic, immutable audit logs.

---

## 🛠️ Quick Start

### Prerequisites
- Node.js v18+ & npm
- Python 3.11+
- (Optional) Docker & Docker Compose for PostgreSQL / Redis

### Environment Setup
Copy `.env.example` to `.env` in the root directory and update credentials if needed:
```bash
cp .env.example .env
```

### Local Development

#### 1. Backend Service
```bash
cd backend
npm install
npx prisma generate
npx prisma db push # or npx prisma migrate dev
npm run seed       # Populates realistic demo dataset
npm run dev
```
Backend server will run on `http://localhost:5000`.

#### 2. AI Intelligence Service
```bash
cd ai-service
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
AI API docs available at `http://localhost:8000/docs`.

#### 3. Frontend Web Client
```bash
cd frontend
npm install
npm run dev
```
Frontend client will run on `http://localhost:5173`.

---

## 🧪 Testing

```bash
# Backend unit & integration tests
cd backend && npm test

# AI service API tests
cd ai-service && pytest

# Frontend build & type check
cd frontend && npm run build
```

---

## 📚 Documentation

For in-depth specifications, refer to the `docs/` folder:
- [Architecture Overview](docs/architecture.md)
- [API Specifications](docs/api.md)
- [Database Schema Design](docs/database.md)
- [AI Model Architecture](docs/ai.md)
- [Deployment Guide](docs/deployment.md)
