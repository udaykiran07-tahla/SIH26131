import { Capacitor } from '@capacitor/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

/**
 * Checks if the current app is running in a Capacitor native container (Android/iOS)
 */
export function isNativeApp() {
  return typeof window !== 'undefined' && Boolean(Capacitor?.isNativePlatform && Capacitor.isNativePlatform());
}

/**
 * Capture a photo using the native Android device camera.
 * Automatically converts the captured image into a standard browser File object.
 * Returns null if cancelled, failed, or running in desktop browser.
 */
export async function capturePhotoWithNativeCamera() {
  if (!isNativeApp()) return null;

  try {
    const photo = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      promptLabelHeader: 'Kisan Drishti Camera',
      promptLabelPhoto: 'From Gallery',
      promptLabelPicture: 'Take Leaf Picture',
    });

    if (!photo || !photo.webPath) return null;

    const response = await fetch(photo.webPath);
    const blob = await response.blob();
    const format = photo.format || 'jpg';
    const mimeType = format === 'jpg' ? 'image/jpeg' : `image/${format}`;
    const filename = `crop_leaf_${Date.now()}.${format}`;

    return new File([blob], filename, { type: mimeType });
  } catch (error) {
    if (error?.message && !error.message.toLowerCase().includes('cancel')) {
      console.warn('Native camera capture error:', error.message);
    }
    return null;
  }
}

/**
 * Select a photo from native Android gallery.
 * Automatically converts the selected image into a standard browser File object.
 * Returns null if cancelled, failed, or running in desktop browser.
 */
export async function pickPhotoFromNativeGallery() {
  if (!isNativeApp()) return null;

  try {
    const photo = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: CameraSource.Photos,
      promptLabelHeader: 'Select Crop Photo',
    });

    if (!photo || !photo.webPath) return null;

    const response = await fetch(photo.webPath);
    const blob = await response.blob();
    const format = photo.format || 'jpg';
    const mimeType = format === 'jpg' ? 'image/jpeg' : `image/${format}`;
    const filename = `crop_gallery_${Date.now()}.${format}`;

    return new File([blob], filename, { type: mimeType });
  } catch (error) {
    if (error?.message && !error.message.toLowerCase().includes('cancel')) {
      console.warn('Native gallery picker error:', error.message);
    }
    return null;
  }
}
