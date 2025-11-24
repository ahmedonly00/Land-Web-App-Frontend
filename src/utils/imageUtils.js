// Use environment variable for API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.iwacu250.com';

export const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http') || imagePath.startsWith('blob:')) {
    return imagePath;
  }

  // Handle relative paths that start with 'images/'
  if (imagePath.startsWith('images/')) {
    return `${API_BASE_URL}/${imagePath}`;
  }

  // For backward compatibility with other path formats
  let cleanPath = imagePath;
  
  // Remove any leading slashes
  cleanPath = cleanPath.replace(/^[\/\\]+/, '');
  
  // Remove any duplicate 'uploads/images' or 'images' segments
  cleanPath = cleanPath.replace(/^(uploads\/)?(images\/)?/, '');
  
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
