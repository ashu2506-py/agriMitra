# AGRI MITRA - System Architecture Specification

## 1. Overview
AGRI MITRA is designed as a modular monolith web application paired with a dedicated Python FastAPI service for AI capabilities. This architecture minimizes deployment complexity while ensuring clean domain separation, high throughput, and easy maintainability.

## 2. System Architecture Diagram

```
+-----------------------------------------------------------------------+
|                          Web / Mobile Client                          |
|                  React 18 + TypeScript + Vite + Tailwind               |
+-----------------------------------T-----------------------------------+
                                    |
                     REST / HTTP-only Cookies / Socket.IO
                                    |
                                    v
+-----------------------------------------------------------------------+
|                      Node.js Express API Server                       |
|                          (Modular Monolith)                           |
|                                                                       |
|  +--------------------+  +-------------------+  +-------------------+ |
|  | Auth & Security    |  | Crop Marketplace  |  | Orders & Escrow   | |
|  +--------------------+  +-------------------+  +-------------------+ |
|  | Buyer Matching     |  | FPO Aggregation   |  | Logistics/Tracking| |
|  +--------------------+  +-------------------+  +-------------------+ |
|  | Payment Service    |  | Invoice Generator |  | AI RAG Assistant  | |
|  +--------------------+  +-------------------+  +-------------------+ |
+------------------T------------------T--------------------T------------+
                   |                  |                    |
                   v                  v                    v
       +-------------------+  +---------------+  +--------------------+
       | PostgreSQL Data   |  | Redis Cache   |  | Python AI Engine   |
       | Prisma ORM        |  | Rate Limits   |  | FastAPI / XGBoost  |
       +-------------------+  +---------------+  +--------------------+
```

## 3. Core Modules
- **Auth Module**: Registration, login, JWT issuance, HTTP-only cookie management, and RBAC authorization.
- **Crop Marketplace**: Listing management, quality grading records, multi-parameter search, location radius filtering.
- **Matching Engine**: Weighted buyer-seller compatibility calculations with explainable match metrics.
- **FPO Aggregation**: Multi-farmer inventory aggregation, bulk listing creation, sub-allocation payouts.
- **Logistics & Routing**: OSRM route calculations, OR-Tools multi-stop sequencing, Socket.IO real-time GPS streaming.
- **AI Intelligence**: FastAPI bridge for disease diagnosis, quality scoring, price estimation, and demand forecasting.
- **Invoicing & Payments**: PDFKit invoice creation, Razorpay signature verification & webhook processor.
