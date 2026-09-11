# REST API Reference • KisanDrishti (Port 5000)

Base URL: `http://localhost:5000/api`

---

## 1. Health Endpoint
- **`GET /api/health`**
  - Response: `{ "status": "online", "message": "...", "timestamp": "...", "environment": "development" }`

---

## 2. Predictions & Diagnosis
- **`POST /api/predictions`**
  - Content-Type: `multipart/form-data`
  - Field: `image` (binary file: JPG, PNG, WEBP)
  - Returns:
    ```json
    {
      "success": true,
      "data": {
        "id": "67cf65b9...",
        "imageUrl": "/uploads/crop-1741595123.jpg",
        "prediction": {
          "crop": "Tomato",
          "condition": "Tomato Early Blight",
          "conditionType": "disease",
          "confidence": 0.91,
          "confidenceLevel": "HIGH",
          "isLowConfidence": false,
          "alternatives": [
            { "condition": "Tomato Late Blight", "confidence": 0.05 },
            { "condition": "Tomato Healthy", "confidence": 0.03 }
          ]
        },
        "recommendation": {
          "name": "Tomato Early Blight",
          "scientificName": "Alternaria solani",
          "description": "...",
          "symptoms": [...],
          "causes": [...],
          "prevention": [...],
          "management": {
            "nonChemical": [...],
            "chemical": {
              "guidance": "...",
              "activeIngredients": [...],
              "disclaimer": "STATUTORY NOTICE: ..."
            }
          },
          "references": [...]
        },
        "technical": {
          "inferenceTimeMs": 410,
          "modelVersion": "Demo-CNN-MobileNetV3-v1.0",
          "isDemo": true
        }
      }
    }
    ```
- **`GET /api/predictions`**
  - Paginated diagnosis history: `?page=1&limit=20`
- **`GET /api/predictions/:id`**
  - Retrieve single prediction record by ID
- **`POST /api/predictions/:id/feedback`**
  - Body: `{ "helpful": true, "comment": "Clear advice" }`

---

## 3. Crops Catalog
- **`GET /api/crops`**: List all crops
- **`GET /api/crops/:id`**: Single crop details
- **`POST /api/crops`**: Create crop (Admin Bearer token required)
- **`PUT /api/crops/:id`**: Update crop (Admin)
- **`DELETE /api/crops/:id`**: Delete crop (Admin)

---

## 4. Conditions Knowledge Base
- **`GET /api/conditions`**: Filter conditions (`?crop=Tomato&type=disease&search=blight`)
- **`GET /api/conditions/:id`**: Single condition monograph
- **`POST /api/conditions`**: Create condition (Admin)
- **`PUT /api/conditions/:id`**: Update condition (Admin)
- **`DELETE /api/conditions/:id`**: Delete condition (Admin)

---

## 5. Dataset Management
- **`GET /api/datasets`**: List dataset samples with filters (`?crop=Rice&category=diseased`)
- **`POST /api/datasets`**: Upload single dataset sample (Admin, Multipart with `image`, `crop`, `condition`, `label`, `category`, `source`)
- **`POST /api/datasets/bulk-csv`**: Bulk CSV import (`{ "rows": [...] }`)
- **`DELETE /api/datasets/:id`**: Remove dataset sample (Admin)

---

## 6. Model Versions
- **`GET /api/models`**: List registered model architectures and benchmark evaluations
- **`POST /api/models`**: Register newly evaluated model version (Admin)

---

## 7. Analytics & Admin Authentication
- **`GET /api/dashboard/stats`**: Live MongoDB aggregation (Total predictions, diseases, pests, crops, conditions, dataset count, charts)
- **`POST /api/admin/login`**: Authenticate admin credentials (`{ "username": "admin", "password": "admin123" }`) ➔ returns JWT token
