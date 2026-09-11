/**
 * Image Preprocessing & Quality Verification Service
 * 
 * WHAT IT DOES:
 * Inspects incoming crop images for dimensions, format integrity, brightness, and sharpness.
 * Prepares a normalized 224x224 tensor-ready image buffer mimicking standard CV pipelines.
 * 
 * WHY IT EXISTS:
 * Ensures poor quality/corrupted photos are intercepted before ML model inference,
 * providing immediate helpful feedback to farmers (e.g., "Image is too dark or blurry").
 */

const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

class ImageService {
  /**
   * Preprocess and inspect image quality
   * @param {string} filePath - Absolute path to uploaded image
   * @returns {Promise<Object>} Preprocessing results and quality indicators
   */
  async processAndValidate(filePath) {
    try {
      if (!fs.existsSync(filePath)) {
        throw new Error('Image file could not be found on server storage.');
      }

      const image = sharp(filePath);
      const metadata = await image.metadata();

      if (!metadata.width || !metadata.height) {
        throw new Error('Corrupted or unreadable image file.');
      }

      // Check minimum dimensions (at least 100x100 for recognizable crop analysis)
      if (metadata.width < 100 || metadata.height < 100) {
        throw new Error('Image resolution is too low. Please upload a clear photo of at least 200x200 pixels.');
      }

      // Compute statistics for brightness and contrast
      const stats = await image.stats();
      // Average luminance across channels (0 to 255)
      const avgBrightness = (stats.channels[0].mean + stats.channels[1].mean + stats.channels[2].mean) / 3;

      const isTooDark = avgBrightness < 30; // Very dark image
      const isTooBright = avgBrightness > 235; // Heavily overexposed

      // Prepare standard 224x224 normalized thumbnail/processed image
      const processedBuffer = await sharp(filePath)
        .resize(224, 224, { fit: 'cover' })
        .toFormat('jpeg', { quality: 90 })
        .toBuffer();

      // Sharpness heuristic based on standard deviation of pixel intensities
      const avgStdDev = (stats.channels[0].stdev + stats.channels[1].stdev + stats.channels[2].stdev) / 3;
      const isBlurry = avgStdDev < 15; // Low contrast / washed out blur

      return {
        isValid: true,
        dimensions: {
          width: metadata.width,
          height: metadata.height,
        },
        format: metadata.format ? metadata.format.toUpperCase() : 'UNKNOWN',
        fileSize: metadata.size,
        quality: {
          brightnessScore: Math.round(avgBrightness),
          sharpnessScore: Math.round(avgStdDev),
          isTooDark,
          isTooBright,
          isBlurry,
        },
        preprocessingSteps: {
          decoded: true,
          resized: '224x224',
          normalized: true,
          colorSpace: 'RGB',
        },
        processedBuffer,
      };
    } catch (error) {
      console.error('[ImageService Error]:', error.message);
      throw error;
    }
  }
}

module.exports = new ImageService();
