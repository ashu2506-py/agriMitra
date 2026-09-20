# AGRI MITRA - Database Schema Specification

The database is built using PostgreSQL with Prisma ORM.

## Relational Entity Relationship Diagram

- **User**: Core authentication identity (Email, Password Hash, Role).
  - **FarmerProfile**: Farm size, crops grown, district, state, location.
  - **BuyerProfile**: Company name, buyer type (Retailer, Wholesaler, Restaurant, Processor).
  - **FPO**: Organization name, registration number, total farmers.
  - **DriverProfile**: Vehicle type, license number, current status.
- **Crop**: Normalized crop catalog (Wheat, Rice, Tomato, Potato, Onion, etc.).
- **CropListing**: Quantity, min price, expected price, grade, status, harvest date, location.
- **CropImage**: Media URLs, thumbnail, dimensions.
- **CropHealthAnalysis**: AI disease diagnosis records.
- **QualityAssessment**: AI quality grading breakdown scores.
- **BuyerRequirement**: Target crop, max price, quantity, radius.
- **BuyerMatch**: Computed compatibility score & explanations.
- **Negotiation**: Offer & counter-offer history log.
- **Order & OrderItem**: Order state, locked inventory quantity, total price.
- **FPOAggregation**: Aggregated member quantities & sub-allocations.
- **Shipment & ShipmentLocation**: Delivery state, driver assignment, GPS breadcrumbs.
- **Payment & Invoice**: Razorpay transaction tokens, status, PDF invoice records.
- **Rating**: Order feedback, 1-5 star score, review comment.
- **AuditLog**: Immutably logged sensitive operations.
