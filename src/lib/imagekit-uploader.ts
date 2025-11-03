// src/lib/imagekit-uploader.ts
import ImageKit from 'imagekit-javascript';

let ikInstance: ImageKit | null = null;

const getImageKitInstance = () => {
    if (!ikInstance) {
        ikInstance = new ImageKit({
            urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
            publicKey: process.env.IMAGEKIT_PUBLIC_KEY!, 
            authenticationEndpoint: `${window.location.origin}/api/imagekit/auth`,
        });
    }
    return ikInstance;
};

export const uploadToImageKit = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const ik = getImageKitInstance();
    ik.upload({
      file: file,
      fileName: file.name,
      tags: ["user_upload"],
    }, (err, result) => {
      if (err) {
        console.error("ImageKit upload error:", err);
        return reject(err);
      }
      if (result) {
        return resolve(result.url);
      }
    });
  });
};
