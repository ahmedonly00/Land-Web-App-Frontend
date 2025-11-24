// Use environment variable for API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.iwacu250.com';

export const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http') || imagePath.startsWith('blob:')) {
    return imagePath;
  }

  // Log the original path for debugging
  console.log('Original image path:', imagePath);
  
  // Handle different path formats
  let cleanPath = imagePath;
  
  // Remove any leading slashes
  cleanPath = cleanPath.replace(/^[\/\\]+/, '');
  
  // Check if the path already includes 'uploads/images' or 'images'
  if (!cleanPath.includes('uploads/images') && !cleanPath.startsWith('images/')) {
    cleanPath = `uploads/images/${cleanPath}`;
  }
  
  // Construct the final URL
  const imageUrl = `${API_BASE_URL}/${cleanPath}`;
  console.log('Generated image URL:', imageUrl);
  
  return imageUrl;
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
