// src/lib/firebase/storage.ts
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { app } from './init';

const storage = getStorage(app);

/**
 * Uploads an image file to Firebase Storage.
 * @param file The image file to upload.
 * @param path The path in storage to upload the file to (e.g., 'products/').
 * @returns A promise that resolves with the public download URL of the uploaded image.
 */
export async function uploadImage(file: File, path: string = 'images/'): Promise<string> {
  if (!file) {
    throw new Error('No file provided for upload.');
  }

  // Create a unique file name to prevent overwriting
  const fileName = `${path}${Date.now()}-${file.name}`;
  const storageRef = ref(storage, fileName);

  try {
    // Upload the file to the specified path
    const snapshot = await uploadBytes(storageRef, file);
    
    // Get the public URL of the file
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  } catch (error) {
    console.error("Error uploading image to Firebase Storage:", error);
    // Depending on the app's needs, you might want to throw a more specific error
    // or handle it in a way that the user can understand.
    throw new Error('Image upload failed.');
  }
}
