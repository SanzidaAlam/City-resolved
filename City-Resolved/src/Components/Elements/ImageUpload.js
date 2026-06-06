import axios from "axios";


const api_key = import.meta.env.VITE_IMGBB_API_KEY;


const api_url = `https://api.imgbb.com/1/upload?key=${api_key}`;

export const imageUpload = async (imageFile, onProgress) => {
  const formData = new FormData();
  formData.append('image', imageFile);

  try {
    const response = await axios.post(api_url, formData, {
      headers: { 'content-type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);

        if (onProgress) {
          onProgress(percentCompleted);
        }
      }
    });

    return response.data.data.display_url;
  } catch (error) {
    console.error("ImgBB Upload Error:", error);
    throw error;
  }
};