// Use environment variable for API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.iwacu250.com';

export const getImageUrl = (imagePath) => {
  if (!imagePath) {
    console.log('No image path provided');
    return '';
  }
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http') || imagePath.startsWith('blob:')) {
    console.log('Using full URL:', imagePath);
    return imagePath;
  }

  // Log the original path for debugging
  console.log('Original image path:', imagePath);
  
  // Handle absolute paths (starting with /)
  if (imagePath.startsWith('/')) {
    // Remove any leading slashes to prevent double slashes
    const cleanPath = imagePath.replace(/^\/+/, '');
    // Construct the URL
    const imageUrl = `${API_BASE_URL}/uploads/${cleanPath}`;
    console.log('Generated image URL:', imageUrl);
    return imageUrl;
  }
  
  // Handle relative paths
  let cleanPath = imagePath;
  
  // Remove any leading slashes
  cleanPath = cleanPath.replace(/^[\/\\]+/, '');
  
  // Remove any existing 'uploads/' or 'images/' prefixes to avoid duplication
  cleanPath = cleanPath.replace(/^(uploads\/)?(images\/)?/, '');
  
  // Use 'uploads/images/' as the prefix for relative paths
  cleanPath = `uploads/images/${cleanPath}`;
  
  // Construct the final URL
  const imageUrl = `${API_BASE_URL}/${cleanPath}`.replace(/([^:]\/)\/+/g, '$1');
  console.log('Generated image URL (relative path):', imageUrl);
  
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
