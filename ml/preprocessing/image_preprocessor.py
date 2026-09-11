"""
OpenCV Image Preprocessing Pipeline for Crop Disease & Pest Identification
Author: SIH Team Prototype
Dependencies: opencv-python, numpy

WHAT IT DOES:
1. Decodes and verifies image integrity.
2. Checks resolution, brightness distribution, and blurriness using Laplacian variance.
3. Resizes image to standard 224x224 input resolution for CNN architectures (MobileNet, ResNet, EfficientNet).
4. Converts color space from BGR to RGB.
5. Normalizes pixel intensities to [0.0, 1.0] with ImageNet channel standardization.
6. Returns clean tensor and diagnostic quality flags.

WHY IT EXISTS:
Decouples raw image manipulation from neural network inference.
Allows beginner/intermediate students to explain the CV pipeline clearly to SIH judges.
"""

import os
import sys

try:
    import cv2
    import numpy as np
    OPENCV_AVAILABLE = True
except ImportError:
    OPENCV_AVAILABLE = False


class CropImagePreprocessor:
    def __init__(self, target_size=(224, 224), blur_threshold=100.0):
        self.target_size = target_size
        self.blur_threshold = blur_threshold
        # Standard ImageNet mean and std dev for transfer learning models
        self.mean = np.array([0.485, 0.456, 0.406], dtype=np.float32) if OPENCV_AVAILABLE else None
        self.std = np.array([0.229, 0.224, 0.225], dtype=np.float32) if OPENCV_AVAILABLE else None

    def check_blur(self, gray_image):
        """
        Compute Laplacian variance to detect out-of-focus or blurred leaves.
        Lower values (< 100) generally indicate blur.
        """
        laplacian_var = cv2.Laplacian(gray_image, cv2.CV_64F).var()
        return laplacian_var, laplacian_var < self.blur_threshold

    def check_brightness(self, bgr_image):
        """
        Convert to HSV space to inspect luminance channel (V).
        """
        hsv = cv2.cvtColor(bgr_image, cv2.COLOR_BGR2HSV)
        v_channel = hsv[:, :, 2]
        avg_brightness = np.mean(v_channel)
        is_too_dark = avg_brightness < 40
        is_too_bright = avg_brightness > 230
        return avg_brightness, is_too_dark, is_too_bright

    def preprocess(self, image_path):
        """
        Execute full preprocessing pipeline on input file.
        Returns:
            dict: { 'success': bool, 'tensor': np.ndarray, 'metadata': dict }
        """
        if not OPENCV_AVAILABLE:
            return {
                'success': False,
                'error': 'OpenCV (opencv-python) is not installed in the current Python environment.'
            }

        if not os.path.exists(image_path):
            return {'success': False, 'error': f'Image file not found: {image_path}'}

        # 1. Read image
        bgr = cv2.imread(image_path)
        if bgr is None:
            return {'success': False, 'error': 'Corrupted or unreadable image format.'}

        h, w, c = bgr.shape

        # 2. Quality diagnostics
        gray = cv2.cvtColor(bgr, cv2.COLOR_BGR2GRAY)
        blur_score, is_blurry = self.check_blur(gray)
        brightness_score, is_dark, is_bright = self.check_brightness(bgr)

        # 3. Resize to CNN input dimensions (224x224)
        resized = cv2.resize(bgr, self.target_size, interpolation=cv2.INTER_AREA)

        # 4. Color space BGR -> RGB
        rgb = cv2.cvtColor(resized, cv2.COLOR_BGR2RGB)

        # 5. Normalize pixel values [0, 255] -> [0.0, 1.0]
        normalized = rgb.astype(np.float32) / 255.0

        # 6. Apply ImageNet channel standardization: (x - mean) / std
        standardized = (normalized - self.mean) / self.std

        # 7. Convert HWC -> CHW format for PyTorch, or add batch dimension
        # Shape: (1, 3, 224, 224)
        tensor = np.transpose(standardized, (2, 0, 1))
        batch_tensor = np.expand_dims(tensor, axis=0)

        return {
            'success': True,
            'tensor_shape': batch_tensor.shape,
            'metadata': {
                'original_dimensions': {'width': w, 'height': h},
                'target_dimensions': {'width': self.target_size[0], 'height': self.target_size[1]},
                'blur_score': round(float(blur_score), 2),
                'is_blurry': bool(is_blurry),
                'brightness_score': round(float(brightness_score), 2),
                'is_too_dark': bool(is_dark),
                'is_too_bright': bool(is_bright),
                'color_space': 'RGB',
                'standardization': 'ImageNet (mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])'
            },
            'batch_tensor': batch_tensor
        }


if __name__ == '__main__':
    print("🌾 OpenCV Preprocessing Pipeline Initialized.")
    if len(sys.argv) > 1:
        img_file = sys.argv[1]
        preprocessor = CropImagePreprocessor()
        result = preprocessor.preprocess(img_file)
        print("Preprocessing Output:", result['metadata'] if result['success'] else result['error'])
    else:
        print("Usage: python image_preprocessor.py <path_to_leaf_image>")
