# Machine Learning & Computer Vision Architecture

This directory houses the Computer Vision preprocessing scripts, training notebooks, and model export workflows for the SIH Crop Disease & Pest Detection prototype.

---

## 1. Pipeline Overview

```
Input Image (JPG/PNG/WEBP)
           │
           ▼
[OpenCV / Sharp Preprocessing]
  - Decode & verify format
  - Check resolution, blur (Laplacian variance), and brightness
  - Resize to (224, 224)
  - Color space BGR ➔ RGB
  - ImageNet normalization: (x - mean) / std
           │
           ▼
[Prediction Service Abstraction]
  ├── MockPredictionService    <-- Default for SIH Prototype evaluation
  └── RealMLPredictionService  <-- Plugs into trained PyTorch / ONNX / FastAPI microservice
           │
           ▼
Predicted Crop & Condition + Confidence Score
           │
           ▼
[Knowledge Base Matcher]
  - Symptoms, Causes, Non-chemical controls, Registered chemicals, ICAR references
```

---

## 2. Preprocessing Architecture

- **Node.js (Server Production):** Handled via `backend/src/services/imageService.js` powered by `sharp` for fast C++ image resizing, format checks, and luminance analysis.
- **Python / OpenCV (Data Science & ML Pipeline):** Implemented in `ml/preprocessing/image_preprocessor.py`. Demonstrates explicit OpenCV operations (`cv2.imread`, `cv2.resize`, `cv2.Laplacian`, `cv2.cvtColor`) to judges and mentors.

---

## 3. How to Connect Your Trained ML Model

When you finish training your CNN model:

1. **Option A: ONNX Web Inference in Node.js**
   - Install `onnxruntime-node`:
     ```bash
     cd backend && npm install onnxruntime-node
     ```
   - Place your exported `crop_disease_model.onnx` into `ml/models/`.
   - Update `RealMLPredictionService` in `backend/src/services/predictionService.js` to run inference using ONNX session.

2. **Option B: Python FastAPI Microservice**
   - Run a lightweight FastAPI endpoint (e.g. at `http://localhost:8000/predict`) that loads PyTorch `.pt` or TensorFlow `.h5` weights.
   - In `.env`, set:
     ```env
     USE_MOCK_ML=false
     ML_SERVICE_URL=http://localhost:8000/predict
     ```
   - That's it! The Express backend and Next.js frontend will immediately begin consuming live ML predictions without changing any UI or API code.
