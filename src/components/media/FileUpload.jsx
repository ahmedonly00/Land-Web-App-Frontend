import { useCallback, useState, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { uploadFile } from '../../services/fileService';
import { toast } from 'react-hot-toast';

const FileUpload = ({ onUploadSuccess, type = 'image' }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      handleFile(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: type === 'video' ? 'video/*' : 'image/*',
    maxFiles: 1,
  });

  const handleFile = (file) => {
    if (!file) return;

    // Validate file size (5MB for images, 50MB for videos)
    const maxSize = type === 'video' ? 50 * 1024 * 1024 : 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error(`File is too large. Max size: ${type === 'video' ? '50MB' : '5MB'}`);
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!preview) return;

    const file = fileInputRef.current.files[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const result = await uploadFile(file, type);
      onUploadSuccess?.(result);
      toast.success(`${type === 'video' ? 'Video' : 'Image'} uploaded successfully!`);
      setPreview(null);
      fileInputRef.current.value = '';
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error(`Failed to upload ${type}. Please try again.`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600'
        }`}
      >
        <input {...getInputProps()} ref={fileInputRef} />
        <div className="space-y-2">
          {isDragActive ? (
            <p className="text-blue-500">Drop the {type} here...</p>
          ) : (
            <>
              <p className="text-gray-600 dark:text-gray-300">
                Drag & drop a {type} here, or click to select
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {type === 'video' ? 'MP4, WebM up to 50MB' : 'JPG, PNG, GIF up to 5MB'}
              </p>
            </>
          )}
        </div>
      </div>

      {preview && (
        <div className="mt-4">
          <h3 className="text-sm font-medium mb-2">Preview</h3>
          <div className="relative">
            {type === 'video' ? (
              <video
                src={preview}
                controls
                className="max-h-64 rounded-lg"
              />
            ) : (
              <img
                src={preview}
                alt="Preview"
                className="max-h-64 rounded-lg object-contain"
              />
            )}
            <div className="mt-3 flex justify-end space-x-2">
              <button
                onClick={() => {
                  setPreview(null);
                  fileInputRef.current.value = '';
                }}
                className="px-3 py-1 text-sm border rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                disabled={isUploading}
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                disabled={isUploading}
              >
                {isUploading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
