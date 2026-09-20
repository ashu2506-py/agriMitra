# AGRI MITRA - API Specification

## Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "INSUFFICIENT_QUANTITY",
    "message": "Requested quantity exceeds available stock.",
    "details": null
  }
}
```

---

## Endpoint Summary

### Auth (`/api/auth`)
- `POST /api/auth/register` - Create user account (Farmer, Buyer, FPO, Driver)
- `POST /api/auth/login` - Authenticate user & set HTTP-only cookie
- `POST /api/auth/logout` - Clear cookies & invalidate session
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Fetch current user & profile details

### Listings (`/api/listings`)
- `GET /api/listings` - List crop listings with search, filter, pagination
- `POST /api/listings` - Create new crop listing
- `GET /api/listings/:id` - Fetch single listing details
- `PATCH /api/listings/:id` - Update crop listing status or parameters
- `DELETE /api/listings/:id` - Cancel listing

### Buyer Requirements & Matching (`/api/buyer-requirements`, `/api/matching`)
- `POST /api/buyer-requirements` - Post buyer requirement
- `GET /api/buyer-requirements` - List requirement posts
- `GET /api/matching/buyers/:requirementId` - Execute buyer-seller matching engine

### Orders & Payments (`/api/orders`, `/api/payments`, `/api/invoices`)
- `POST /api/orders` - Place order with transactional inventory lock
- `GET /api/orders` - List orders for authenticated user
- `GET /api/orders/:id` - Order details
- `PATCH /api/orders/:id/status` - Update order lifecycle status
- `POST /api/payments/create-order` - Generate Razorpay test payment order
- `POST /api/payments/verify` - Server-side payment signature verification
- `GET /api/invoices/:id/pdf` - Download digital PDF invoice

### Logistics (`/api/logistics`, `/api/shipments`)
- `GET /api/shipments` - View assigned or owned shipments
- `PATCH /api/shipments/:id/status` - Driver status updates
- `POST /api/logistics/optimize-route` - OSRM/OR-Tools route optimizer

### AI Service (`/ai/*` via Python FastAPI)
- `GET /health` - AI Service Health
- `POST /ai/crop/disease-detection` - Image analysis for diseases
- `POST /ai/crop/quality` - Automated quality grading
- `POST /ai/market/price-prediction` - Price estimation model
- `POST /ai/market/demand-forecast` - 7-day demand trend model
- `POST /api/assistant/chat` - Contextual RAG AI assistant endpoint
