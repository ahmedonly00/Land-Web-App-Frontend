import { useState, useEffect } from 'react';
import { fetchAllFiles, deleteFile as deleteFileApi } from '../../services/fileService';
import FileUpload from './FileUpload';
import MediaItem from './MediaItem';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { toast } from 'react-hot-toast';

const MediaGallery = () => {
  const [activeTab, setActiveTab] = useState('images');
  const [media, setMedia] = useState({ images: [], videos: [] });
  const [isLoading, setIsLoading] = useState(true);

  const loadMedia = async () => {
    try {
      setIsLoading(true);
      const data = await fetchAllFiles();
      setMedia(data);
    } catch (error) {
      console.error('Error loading media:', error);
      toast.error('Failed to load media');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMedia();
  }, []);

  const handleUploadSuccess = (newFile) => {
    setMedia(prev => ({
      ...prev,
      [activeTab]: [newFile.fullUrl, ...prev[activeTab]]
    }));
  };

  const handleDelete = async (fileUrl) => {
    try {
      await deleteFileApi(fileUrl);
      setMedia(prev => ({
        ...prev,
        [activeTab]: prev[activeTab].filter(url => url !== fileUrl)
      }));
      return true;
    } catch (error) {
      console.error('Error deleting file:', error);
      toast.error('Failed to delete file');
      return false;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Media Library</h1>
      
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="videos">Videos</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium mb-4">
              Upload New {activeTab === 'images' ? 'Image' : 'Video'}
            </h2>
            <FileUpload 
              type={activeTab.slice(0, -1)} // 'images' -> 'image', 'videos' -> 'video'
              onUploadSuccess={handleUploadSuccess}
            />
          </div>

          <div>
            <h2 className="text-lg font-medium mb-4">
              {activeTab === 'images' ? 'All Images' : 'All Videos'}
            </h2>
            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {[...Array(8)].map((_, i) => (
                  <div 
                    key={i} 
                    className="aspect-square bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg"
                  />
                ))}
              </div>
            ) : media[activeTab]?.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {media[activeTab].map((url) => (
                  <MediaItem
                    key={url}
                    url={url}
                    onDelete={handleDelete}
                    type={activeTab.slice(0, -1)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <p className="text-gray-500">No {activeTab} found</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MediaGallery;
