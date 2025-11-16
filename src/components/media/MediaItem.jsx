import { useState } from 'react';
import { FaTrash, FaPlay, FaImage } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const MediaItem = ({ url, onDelete, type = 'image' }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await onDelete(url);
      toast.success('File deleted successfully');
    } catch (error) {
      console.error('Error deleting file:', error);
      toast.error('Failed to delete file');
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="relative group rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 aspect-square">
      {type === 'video' ? (
        <div className="relative w-full h-full">
          <video
            className="w-full h-full object-cover"
            src={url}
            preload="metadata"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity">
            <FaPlay className="text-white text-4xl" />
          </div>
        </div>
      ) : (
        <img
          src={url}
          alt="Media"
          className="w-full h-full object-cover"
          loading="lazy"
        />
      )}

      <button
        onClick={() => setShowDeleteModal(true)}
        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
        aria-label="Delete media"
      >
        <FaTrash size={14} />
      </button>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Delete Media</h3>
            <p className="mb-6">Are you sure you want to delete this {type}?</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50"
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaItem;
