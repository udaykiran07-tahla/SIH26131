"""
Plant Disease Transfer Learning Starter Script
Architecture: MobileNetV3-Large / ResNet50
Dataset: PlantVillage or Custom KVK Crop Dataset

This script outlines how beginner/intermediate students can train a CNN
for crop disease detection and export weights for the web application.
"""

# Step 1: Dependencies
# pip install torch torchvision timm

"""
import torch
import torch.nn as nn
from torchvision import datasets, transforms, models
from torch.utils.data import DataLoader

# 1. Dataset Preprocessing & Augmentations
data_transforms = {
    'train': transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.RandomHorizontalFlip(),
        transforms.RandomRotation(15),
        transforms.ColorJitter(brightness=0.2, contrast=0.2),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
    ]),
    'val': transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
    ]),
}

# 2. Transfer Learning Model Setup
def build_model(num_classes=38):
    # Pre-trained MobileNetV3 is light and ideal for mobile edge deployment
    model = models.mobilenet_v3_large(weights=models.MobileNet_V3_Large_Weights.DEFAULT)
    
    # Freeze earlier feature extraction layers
    for param in model.features.parameters():
        param.requires_grad = False

    # Replace classification head with our crop condition classes
    in_features = model.classifier[0].in_features
    model.classifier = nn.Sequential(
        nn.Linear(in_features, 512),
        nn.Hardswish(),
        nn.Dropout(p=0.3),
        nn.Linear(512, num_classes)
    )
    return model

# 3. Export to ONNX or TorchScript for Web Deployment
def export_model(model, filepath="crop_disease_mobilenet.onnx"):
    model.eval()
    dummy_input = torch.randn(1, 3, 224, 224)
    torch.onnx.export(
        model,
        dummy_input,
        filepath,
        input_names=['image'],
        output_names=['probabilities'],
        dynamic_axes={'image': {0: 'batch_size'}, 'probabilities': {0: 'batch_size'}}
    )
    print(f"Model exported successfully to {filepath}")
"""

print("🌾 Plant Disease Transfer Learning Guide Ready.")
print("See ml/README.md for instructions on deploying trained weights into backend/src/services/predictionService.js")
