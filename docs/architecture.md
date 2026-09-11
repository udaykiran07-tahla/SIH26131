# System Architecture • KisanDrishti (SIH Prototype #26131)

## High-Level Three-Layer Architecture

```
                    ┌─────────────────────────┐
                    │      FARMER MOBILE      │
                    │   (Responsive Browser)  │
                    └────────────┬────────────┘
                                 │
             ┌───────────────────┴───────────────────┐
             │                                       │
      Layer 1: Farmer Simple                  Layer 2 & 3:
      - 20 Indian Languages                   - Detailed Biological Mode
      - Camera / Upload UI                    - Technical ML Analytics
      - 1-Click Evaluation Chips              - Admin Management Portal
             │                                       │
             └───────────────────┬───────────────────┘
                                 │ HTTP / JSON & Multipart
                                 ▼
                    ┌─────────────────────────┐
                    │   NEXT.JS 14 FRONTEND   │
                    │ (React + Tailwind CSS)  │
                    └────────────┬────────────┘
                                 │ REST API Client
                                 ▼
                    ┌─────────────────────────┐
                    │    NODE.JS + EXPRESS    │
                    │     REST API SERVER     │
                    └────────────┬────────────┘
                                 │
         ┌───────────────────────┼───────────────────────┐
         │                       │                       │
         ▼                       ▼                       ▼
┌──────────────────┐   ┌──────────────────┐   ┌──────────────────┐
│   IMAGE SERVICE  │   │ PREDICTION ENGINE│   │   MONGODB STORE  │
│ (OpenCV / Sharp) │   │ (Abstract Serv.) │   │   (Mongoose ODM) │
│ - Quality verify │   │ - Mock CNN Serv. │   │ - Crops          │
│ - Dimensions     │   │ - Real ML Client │   │ - Conditions     │
│ - Blur variance  │   │ - Confidence Eval│   │ - Diagnoses      │
│ - 224x224 resize │   └─────────┬────────┘   │ - Dataset Vault  │
└──────────────────┘             │            │ - Model Versions │
                                 ▼            └──────────────────┘
                       ┌──────────────────┐
                       │  KNOWLEDGE BASE  │
                       │     MATCHER      │
                       │ - Symptoms       │
                       │ - Non-chemical   │
                       │ - CIBRC Chemical │
                       │ - ICAR Citations │
                       └──────────────────┘
```

---

## Data Flow Pipeline

1. **Capture & Upload:** The farmer captures a photo using their mobile camera or uploads from device gallery.
2. **Quality Verification:** The image is sent via `multipart/form-data` to Express. `imageService.js` / Sharp validates dimensions, file size (< 10MB), and calculates Laplacian blur variance & brightness.
3. **ML Classification:** `PredictionService` classifies foliar symptoms into crop & condition (e.g. `Tomato Early Blight`, 91% confidence, top-3 alternatives) within 380-520ms.
4. **Knowledge Retrieval:** `recommendationService.js` retrieves verified biological symptoms, cultural/non-chemical prevention, registered chemical advice, and official ICAR/KVK reference citations from MongoDB.
5. **Farmer Presentation:** The Next.js frontend renders natural, clean cards in the farmer's selected Indian language without technical jargon.
6. **Scalability Expansion:** Agricultural officers and administrators can log into the Admin portal to upload new dataset samples, register evaluated model weights, or update crop monographs.
