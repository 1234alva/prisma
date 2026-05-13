import imageCompression from 'browser-image-compression';

export const compressImage = async (file) => {
  const options = {
    maxSizeMB: 0.5,        
    maxWidthOrHeight: 1280, 
    useWebWorker: true
  }
  try {
    return await imageCompression(file, options);
  } catch (error) {
    console.error("Error comprimiendo imagen", error);
    return file;
  }
}