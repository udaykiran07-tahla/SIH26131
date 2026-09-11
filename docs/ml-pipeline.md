# Machine Learning & OpenCV Pipeline • Technical Monograph

## 1. Role of OpenCV in the Architecture

> [!IMPORTANT]
> **OpenCV is strictly for Image Preprocessing and Computer Vision Validation.**
> It is **NOT** claimed to be the disease detector. The disease and pest prediction is performed by the Deep Learning Classifier (Convolutional Neural Network / Vision Transformer).

---

## 2. Preprocessing Steps

Implemented in Python (`ml/preprocessing/image_preprocessor.py`) and Node.js (`backend/src/services/imageService.js`):

1. **Decoding:** Reading binary buffer into BGR pixel array.
2. **Dimension Verification:** Ensuring minimum resolution of 100x100 pixels.
3. **Sharpness & Blur Detection:**
   $$\text{Blur Score} = \text{Variance}(\nabla^2 I)$$
   Calculates Laplacian operator variance across grayscale intensities. If variance $< 50$, the image is flagged as potentially blurry.
4. **Brightness Analysis:**
   Computes mean luminance channel in HSV color space. Flags under-exposed ($< 30$) or over-exposed ($> 235$) photos.
5. **Geometry Normalization:**
   Resizes crop leaf to $224 \times 224$ pixels using area interpolation.
6. **Color Standardization:**
   Converts BGR to RGB, rescales to $[0.0, 1.0]$, and standardizes across ImageNet channels:
   $$\text{mean} = [0.485, 0.456, 0.406], \quad \text{std} = [0.229, 0.224, 0.225]$$

---

## 3. Deep Learning Classification

The prototype uses the decoupled `PredictionService` interface:
- **`MockPredictionService`:** Generates realistic inferences, 380-520ms latency, and multi-class probability vectors for prototype evaluation.
- **`RealMLPredictionService`:** Sends preprocessed tensors to your trained PyTorch/FastAPI endpoint or ONNX runtime.

### Swapping in Your Model
Change in `.env`:
```env
USE_MOCK_ML=false
ML_SERVICE_URL=http://localhost:8000/predict
```
No changes required in the React UI or Express controllers!
