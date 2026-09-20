# AGRI MITRA - Project Guidelines & Rules

## Monorepo Architecture & Stack
- **Frontend**: React, TypeScript, Vite, Tailwind CSS, Zustand, TanStack Query, Axios, Recharts, Leaflet, Socket.IO client, React Hook Form, Zod, Lucide React.
- **Backend**: Node.js, Express.js (Modular Monolith), TypeScript, Prisma ORM, PostgreSQL, Redis, Socket.IO, JWT cookies, Zod validation, Pino logging, PDFKit, Multer.
- **AI Service**: Python 3.11+, FastAPI, Pydantic, NumPy, Pandas, OpenCV, scikit-learn, XGBoost, OR-Tools baseline.

## Key Rules & Directives
1. **Clean Modular Monolith**: Do not over-engineer microservices. Keep backend as a modular monolith and AI as a dedicated FastAPI service.
2. **Strict Interfaces & Fallbacks**: Provide production providers and clean development/mock fallbacks for all external APIs (Razorpay, Cloudinary/S3, Weather, LLM, Disease Detection, Price Prediction). Never return fake predictions presented as genuine AI results without proper labeling.
3. **Database Integrity & Transactions**: Use Prisma transactions for all inventory deduction, order confirmation, and FPO quantity allocation to prevent double-selling.
4. **Security & RBAC**: Enforce server-side role-based access control (FARMER, BUYER, FPO, DRIVER, ADMIN). Store passwords securely using bcrypt. Use HTTP-only cookies for JWT tokens. Never expose secrets in source code.
5. **No Synthetic Production Data**: Seed data must be explicitly labeled as DEMO DATA.
6. **Code Quality**: TypeScript strict mode enabled. Validate inputs using Zod (Node) and Pydantic (FastAPI). Centralize error handling and structured logging.
