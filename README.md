# KisanDrishti • Early Detection and Management of Crop Diseases and Pest Infestations

> **Smart India Hackathon (SIH 2026) Prototype**  
> *A practical, farmer-friendly, AI-powered web platform for early foliar crop diagnosis, non-chemical pest management, and verified ICAR recommendations.*

---

## 1. Project Overview

**KisanDrishti** addresses agricultural productivity losses by putting an accessible, multilingual AI diagnosis tool directly into the hands of Indian farmers.

Farmers can photograph an affected crop leaf or pest using their mobile browser, instantly receive an understandable diagnosis, symptoms checklist, cause analysis, non-chemical field hygiene solutions, approved chemical precautions, and direct access to their nearest Krishi Vigyan Kendra (KVK).

### Core Highlights
- **Three-Layer Experience:**
  - **Layer 1 (Farmer Simple Mode):** Zero technical jargon, large touch targets, 20 Indian languages, visual cards.
  - **Layer 2 (Detailed Information Mode):** Biological lifecycle, epidemiology, cultural care, and verified ICAR citations.
  - **Layer 3 (Technical & Admin Mode):** CNN multi-class probability distribution, inference latency, dataset sample management, and model tracking.
- **Safety-First Agricultural Advice:** Absolutely NO hallucinated chemical dosages. Every recommendation links to verified database records accompanied by statutory disclaimers.
- **Pluggable ML Architecture:** Fully decoupled `PredictionService` allows instant swapping between the included demo model and your custom-trained PyTorch/ONNX model.
- **1-Click SIH Evaluation Demo:** Preloaded samples (Tomato Early Blight, Potato Late Blight, Rice Blast, Cotton Bollworm, Corn Armyworm, Healthy Leaf) for quick judging evaluation.

---

## 2. System Architecture

```
                    FARMER MOBILE PHONE
                            │
                            ▼
              NEXT.JS 14 FRONTEND (React + Tailwind)
                            │
                            ▼
               EXPRESS.JS REST API SERVER
                            │
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
    MongoDB          Image Service         Prediction
   (Mongoose)      (OpenCV / Sharp)         Service
                            │                   │
                            ▼                   ▼
                     Quality / Tensor        ML Model
                     (224x224 RGB)        (Mock / Real)
                            │                   │
                            └─────────┬─────────┘
                                      ▼
                           Knowledge Base Matcher
                           (ICAR / KVK Advisory)
                                      │
                                      ▼
                            Farmer Result Cards
```

---

## 3. Project Folder Structure

```
crop-intelligence/
├── frontend/                     # Next.js 14 App Router + React + Tailwind CSS
│   ├── src/
│   │   ├── app/                  # Routes: /, /history, /knowledge, /admin, /admin/dataset, /admin/models
│   │   ├── components/
│   │   │   ├── common/           # Header, Footer, NetworkBanner
│   │   │   ├── farmer/           # HeroFarmer, ImageUploader, SampleImageSelector, ResultCards
│   │   │   └── analysis/         # DetailedInfoModal (Layer 2), TechnicalAnalysisModal (Layer 3)
│   │   ├── context/              # LanguageContext (20 languages), AuthContext
│   │   ├── locales/              # 20 JSON dictionaries (en, hi, te, ta, mr, bn, etc.)
│   │   └── services/             # api.js REST client
│   └── package.json
│
├── backend/                      # Node.js + Express.js REST API
│   ├── src/
│   │   ├── config/               # db.js, env.js
│   │   ├── models/               # Crop, Condition, Prediction, DatasetSample, ModelVersion, Admin
│   │   ├── controllers/          # prediction, crop, condition, dataset, model, dashboard, admin
│   │   ├── routes/               # predictionRoutes, cropRoutes, conditionRoutes, datasetRoutes, etc.
│   │   ├── services/             # imageService (Sharp), predictionService (Mock/Real), recommendationService
│   │   ├── middleware/           # upload (Multer), auth (JWT), errorHandler
│   │   └── seed/                 # seed.js (Pre-loads Indian crops & verified ICAR conditions)
│   ├── uploads/                  # Storage directory for crop photos
│   ├── tests/                    # api_verification.js (Native automated tests)
│   └── package.json
│
├── ml/                           # Computer Vision & Machine Learning
│   ├── preprocessing/            # image_preprocessor.py (OpenCV), imagePreprocessor.js
│   ├── notebooks/                # plant_disease_transfer_learning.py (MobileNetV3 starter)
│   └── README.md                 # ML connection guide
│
├── docs/                         # Technical documentation
│   ├── architecture.md
│   ├── api.md
│   └── ml-pipeline.md
│
├── .env.example
├── .gitignore
├── README.md
└── package.json                  # Root runner
```

---

## 4. Technologies Used

- **Frontend:** Next.js 14 (App Router), React 18, Tailwind CSS, Lucide React Icons.
- **Backend:** Node.js, Express.js, Mongoose ODM, Multer, Sharp (C++ image resizing & quality analysis), JWT, Bcrypt.js.
- **Database:** MongoDB (Running locally on port 27017).
- **Computer Vision & ML:** Python OpenCV pipeline (`cv2`), Sharp, MobileNetV3 transfer learning architecture.

---

## 5. Installation & Setup

### Prerequisites
- **Node.js:** v18 or higher (tested on v24.13)
- **MongoDB:** MongoDB Community Server running on `127.0.0.1:27017`
- **Python (Optional for OpenCV script):** 3.10+

### Step-by-Step Setup

1. **Clone or Navigate to the Workspace:**
   ```bash
   cd SIH26131
   ```

2. **Install Backend Dependencies:**
   ```bash
   cd backend
   npm install
   ```

3. **Seed Database with Indian Crops & ICAR Conditions:**
   ```bash
   npm run seed
   ```
   *This initializes MongoDB with Tomato, Potato, Rice, Cotton, Corn, Wheat, default admin (`admin`/`admin123`), model versions, and dataset samples.*

4. **Install Frontend Dependencies:**
   ```bash
   cd ../frontend
   npm install
   ```

---

## 6. Running the Application

### Running Both Servers Simultaneously (From Root):
```bash
npm run dev:backend
# In another terminal:
npm run dev:frontend
```

- **Frontend Application:** [http://localhost:3000](http://localhost:3000)
- **Backend API:** [http://localhost:5000/api](http://localhost:5000/api)
- **API Health Check:** [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 7. 20 Indian Languages Localization

Language selector on the header instantly switches between:
1. English (`en`)
2. Hindi (`hi` - हिन्दी)
3. Telugu (`te` - తెలుగు)
4. Tamil (`ta` - தமிழ்)
5. Marathi (`mr` - मराठी)
6. Bengali (`bn` - বাংলা)
7. Gujarati (`gu` - ગુજરાતી)
8. Kannada (`kn` - ಕನ್ನಡ)
9. Malayalam (`ml` - മലയാളം)
10. Punjabi (`pa` - ਪੰਜਾਬੀ)
11. Assamese (`as` - অসমীয়া)
12. Odia (`or` - ଓଡ଼ିଆ)
13. Urdu (`ur` - اردو)
14. Sanskrit (`sa` - संस्कृतम्)
15. Nepali (`ne` - नेपाली)
16. Konkani (`kok` - कोंकणी)
17. Manipuri (`mni` - মৈতৈলোন্)
18. Maithili (`mai` - मैथिली)
19. Kashmiri (`ks` - کٲشُر)
20. Sindhi (`sd` - سنڌي)

Translations are centralized in `/frontend/src/locales/*.json` using structured dot-notation keys.

---

## 8. Mock ML Mode vs. Connecting Real Model

By default, the prototype runs in **Demo Mode**:
- `isDemo: true` is tagged on all responses.
- Simulates realistic CNN inference time (380–520ms) and multi-class softmax probability distributions.
- Never falsely claims unmeasured accuracy.

### To Connect Your Real ML Model:
1. Export your trained PyTorch/TensorFlow CNN model weights (see `ml/notebooks/plant_disease_transfer_learning.py`).
2. Run your inference service (e.g. FastAPI on `http://localhost:8000/predict`).
3. In `backend/.env`, set:
   ```env
   USE_MOCK_ML=false
   ML_SERVICE_URL=http://localhost:8000/predict
   ```
4. Restart backend. Zero changes required in frontend or database code!

---

## 8. Android Native Application (Capacitor & APK)

**Kisan Drishti** is packaged as a real, native Android application with Capacitor (`com.kisandrishti.app`).

### Key Native Android Features
- **Native Device Camera & Gallery:** Direct `@capacitor/camera` integration with seamless HTML fallback.
- **Hardware Back Button:** Integrated via `@capacitor/app` for intuitive Android navigation.
- **Sticky Bottom Navigation:** Mobile-optimized 4-tab bar (Home, Diagnose, Crop Guide, History) with safe-area insets.
- **Status Bar & Splash Screen:** Deep agricultural emerald green theme (`#042f24`).
- **Portrait Orientation Locked:** Locked in `AndroidManifest.xml` for single-hand farmer ergonomics.
- **Dynamic Backend Switcher:** One-click presets for **Android Emulator (`10.0.2.2:5000`)**, **Localhost**, or your laptop's **Wi-Fi LAN IP** with real-time ping testing.

### How to Open in Android Studio
1. In the `frontend/` directory, run:
   ```bash
   npx cap open android
   ```
2. Android Studio opens the native project in `frontend/android/`.
3. Connect an Android phone via USB (with USB debugging enabled) or start an Android Emulator.
4. Click the green **Run (▶)** button.

### How to Build the Debug APK via CLI
On any machine with JDK and Android SDK installed:
```bash
cd frontend/android
./gradlew assembleDebug
```
The resulting APK is generated at:
`frontend/android/app/build/outputs/apk/debug/app-debug.apk`

### Connecting the Android App to the Backend
- **When using Android Emulator:**
  - The app defaults automatically to `http://10.0.2.2:5000/api` which maps directly to your laptop's Express backend.
- **When using a Physical Android Phone:**
  1. Connect your phone and laptop to the same Wi-Fi network (or mobile hotspot).
  2. Find your laptop's local IP address (`ipconfig` on Windows, e.g. `192.168.1.50`).
  3. In the Kisan Drishti app, tap **Backend Host** in the footer or menu drawer.
  4. Enter `http://192.168.1.50:5000/api` and tap **Save & Test Connection**.

---

## 9. Admin & Dataset Management

- **Admin Login URL:** [http://localhost:3000/admin](http://localhost:3000/admin)
- **Default Credentials:**
  - Username: `admin`
  - Password: `admin123`
- **Features for Judges:**
  - **Dynamic MongoDB Stats:** Live counts of diagnoses, pathogens, pests, crops, and conditions.
  - **Dataset Management:** Add new crop leaf photos with labels and category (`healthy`/`diseased`/`pest`) to demonstrate scalability.
  - **Bulk CSV Upload:** Import entire batches of sample metadata with a single click.
  - **Model Version Tracker:** Register and track evaluated accuracy, precision, recall, and F1 scores.

---

## 10. Automated Testing

Run the automated backend test suite:
```bash
cd backend
npm test
```
Verifies:
- API health online
- Seeded crop retrieval
- ICAR condition monographs
- Dynamic aggregation metrics
- Admin JWT authentication
- Client error validations

---

## 11. Troubleshooting

- **MongoDB connection refused:** Ensure MongoDB service is running on your machine:
  `Get-Service -Name *mongo*` (PowerShell) or `mongod`.
- **Port 5000 or 3000 already in use:** Modify `PORT` in `backend/src/config/env.js` or start Next.js on an alternate port with `npm run dev -- -p 3001`.
- **Missing uploads directory:** The backend auto-generates `backend/uploads/` on startup.
