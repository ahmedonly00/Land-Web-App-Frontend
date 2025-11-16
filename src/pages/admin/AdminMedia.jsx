import { Toaster } from 'react-hot-toast';
import MediaGallery from '../../components/media/MediaGallery';

const AdminMedia = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 md:p-8">
      <MediaGallery />
      <Toaster position="top-center" />
    </div>
  );
};

export default AdminMedia;
