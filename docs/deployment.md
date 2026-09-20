# AGRI MITRA - Deployment & Production Guide

## Production Environment Setup

### 1. PostgreSQL & Redis
- **PostgreSQL**: Neon, Supabase, AWS RDS, or managed PostgreSQL.
- **Redis**: Upstash Redis or AWS ElastiCache.

### 2. Backend Deployment (Render / Railway / AWS App Runner)
- Build command: `npm run build`
- Start command: `npm run start`
- Set environment variables: `DATABASE_URL`, `REDIS_URL`, `JWT_SECRET`, `AI_SERVICE_URL`.

### 3. AI Service Deployment (Render / Railway / Cloud GPU)
- Build command: `pip install -r requirements.txt`
- Start command: `uvicorn app.main:app --host 0.0.0.0 --port 8000`

### 4. Frontend Web Client (Vercel / Netlify / Cloudflare Pages)
- Build command: `npm run build`
- Output directory: `dist`
- Configure reverse proxy / environment variable `VITE_API_BASE_URL`.
