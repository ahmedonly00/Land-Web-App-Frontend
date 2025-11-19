// Use environment variable or fallback to local development URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http') || imagePath.startsWith('blob:')) {
    return imagePath;
  }

  // Remove any leading slashes and the 'api/' prefix if present
  let cleanPath = imagePath.replace(/^[\/\\]+|^api\//, '');
  
  // Remove any duplicate 'uploads/images' or 'images' segments
  cleanPath = cleanPath.replace(/^uploads\/images\/|^images\//, '');
  
  // Construct the final URL
  return `${API_BASE_URL}/uploads/images/${cleanPath}`;
};

export const checkImageExists = async (url) => {
  if (!url) return false;
  
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.error('Error checking image:', error);
    return false;
  }
};
