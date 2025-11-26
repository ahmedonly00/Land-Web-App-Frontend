import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Building2, Maximize, DollarSign, ArrowLeft, Check, Bed, Bath, Calendar, Home } from 'lucide-react';
import { getImageUrl } from '../utils/imageUtils';
import PlaceholderImage from '../components/ui/placeholder-image';
import houseService from '../services/houseService';
import { settingsService } from '../services/settingsService';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import WhatsAppButton from '../components/common/WhatsAppButton';
import Loading from '../components/common/Loading';
import { formatPrice, formatSize, getStatusBadgeColor } from '../utils/formatters';
import { getHouseWhatsAppMessage } from '../utils/whatsapp';
import { toast } from 'react-toastify';

const HouseDetail = () => {
  const { id } = useParams();
  const [house, setHouse] = useState(null);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    loadHouse();
    loadSettings();
  }, [id]);

  const loadHouse = async () => {
    try {
      const houseData = await houseService.getHouseById(id);
      
      // Process images to ensure they have the correct URL format
      const processImages = (images) => {
        if (!images || !Array.isArray(images)) return [];
        return images.map(img => {
          // Handle both string paths and image objects
          const imagePath = typeof img === 'string' ? img : (img?.imageUrl || '');
          return {
            ...(typeof img === 'object' ? img : {}),
            imageUrl: getImageUrl(imagePath)
          };
        });
      };
      
      // Get the first image URL regardless of format
      const getFirstImageUrl = (images) => {
        if (!images || !images.length) return '';
        const firstImg = images[0];
        return typeof firstImg === 'string' ? firstImg : firstImg?.imageUrl || '';
      };
      
      // Format the house data to ensure consistent image URL handling
      const formattedHouse = {
        ...houseData,
        // Process images array if it exists
        images: houseData.images ? processImages(houseData.images) : [],
        // Ensure we have a featuredImageUrl for backward compatibility
        featuredImageUrl: getImageUrl(
          houseData.featuredImageUrl || 
          getFirstImageUrl(houseData.images) ||
          houseData.imageUrl ||
          ''
        )
      };
      
      console.log('Formatted house data:', formattedHouse);
      setHouse(formattedHouse);
    } catch (error) {
      console.error('Failed to load house', error);
      toast.error('Failed to load house details');
    } finally {
      setLoading(false);
    }
  };
      
      // // Get the first image URL regardless of format
      // const getFirstImageUrl = (images) => {
      //   if (!images || !images.length) return '';
      //   const firstImg = images[0];
      //   return typeof firstImg === 'string' ? firstImg : firstImg?.imageUrl || '';
      // };
      
      // // Format the house data to ensure consistent image URL handling
      // const formattedHouse = {
      //   ...houseData,
      //   // Process images array if it exists
      //   images: houseData.images ? processImages(houseData.images) : [],
      //   // Ensure we have a featuredImageUrl for backward compatibility
      //   featuredImageUrl: getImageUrl(
      //     houseData.featuredImageUrl || 
      //     getFirstImageUrl(houseData.images) ||
      //     houseData.imageUrl ||
      //     ''
      //   )
      // };
      
  //     console.log('Formatted house data:', formattedHouse);
  //     setHouse(formattedHouse);
  //   } catch (error) {
  //     console.error('Failed to load house', error);
  //     toast.error('Failed to load house details');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const loadSettings = async () => {
    try {
      const settingsData = await settingsService.getPublicSettings();
      setSettings(settingsData);
    } catch (error) {
      console.error('Failed to load settings', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <Loading />
        <Footer />
      </div>
    );
  }

  if (!house) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">House Not Found</h2>
            <Link to="/houses" className="btn-primary">
              Back to Houses
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const whatsappMessage = getHouseWhatsAppMessage(house, settings);
  const whatsappNumber = settings?.whatsappNumber || '+250780314239';

  // Get images array or fallback to default placeholder
  const getImages = () => {
    // Check for images array first
    if (house.images && house.images.length > 0) {
      return house.images.map(img => ({
        ...img,
        imageUrl: getImageUrl(img.imageUrl)
      }));
    } 
    
    // Return empty array to trigger the PlaceholderImage component
    return [];
  };

  const images = getImages();
  console.log('House images:', images);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Back Button */}
          <Link 
            to="/houses" 
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Houses
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Images */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                <div className="relative h-96 bg-gray-200">
                  {images[selectedImage]?.imageUrl ? (
                  <img
                    src={getImageUrl(images[selectedImage].imageUrl)}
                    alt={house.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentNode.querySelector('.placeholder-container')?.classList.remove('hidden');
                    }}
                  />
                ) : (
                  <div className="w-full h-full">
                    <PlaceholderImage text="House Image" className="w-full h-full" />
                  </div>
                )}
                <div className="placeholder-container hidden w-full h-full">
                  <PlaceholderImage text="Image not available" className="w-full h-full" />
                </div>
                <div className="absolute top-4 right-4">
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusBadgeColor(house.status)}`}>
                    {house.status}
                  </span>
                </div>
                </div>
                {images.length > 1 && (
                  <div className="p-4 flex gap-2 overflow-x-auto">
                    {images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                          selectedImage === index ? 'border-primary-600' : 'border-gray-200'
                        }`}
                      >
                        {image.imageUrl ? (
                            <img
                              src={getImageUrl(image.imageUrl)}
                              alt={`${house.title} ${index + 1}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextElementSibling?.classList.remove('hidden');
                              }}
                            />
                          ) : (
                            <div className="w-full h-full">
                              <PlaceholderImage text="Image" className="w-full h-full" />
                            </div>
                          )}
                          <div className="hidden absolute inset-0">
                            <PlaceholderImage text="Image not available" className="w-full h-full" />
                          </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* House Info */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex justify-between items-start mb-4">
                  <h1 className="text-3xl font-bold text-gray-900">{house.title}</h1>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(house.status)}`}>
                    {house.status}
                  </span>
                </div>

                <div className="flex items-center text-gray-600 mb-4">
                  <Building2 className="w-5 h-5 mr-2" />
                  <span>{house.type}</span>
                </div>

                <p className="text-gray-700 mb-6">{house.description}</p>

                {/* Features */}
                {house.features && house.features.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">Features</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {house.features.map((feature, index) => (
                        <div key={index} className="flex items-center text-gray-700">
                          <Check className="w-4 h-4 mr-2 text-green-500" />
                          {feature.name || feature}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Property Details */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center text-gray-700">
                    <Bed className="w-5 h-5 mr-2 text-blue-500" />
                    <span>{house.bedrooms} Bedrooms</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Bath className="w-5 h-5 mr-2 text-blue-500" />
                    <span>{house.bathrooms} Bathrooms</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Maximize className="w-5 h-5 mr-2 text-blue-500" />
                    <span>{formatSize(house.size, house.sizeUnit)}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Calendar className="w-5 h-5 mr-2 text-blue-500" />
                    <span>Built {house.yearBuilt}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Price Card */}
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-blue-600">
                    {formatPrice(house.price, house.currency)}
                  </div>
                  <div className="text-gray-600">Total Price</div>
                </div>

                <div className="flex items-center text-gray-700 mb-6">
                  <Building2 className="w-5 h-5 mr-2" />
                  <span>{house.location}</span>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <WhatsAppButton
                    phoneNumber={whatsappNumber}
                    message={whatsappMessage}
                    className="w-full"
                  />
                  
                  <a
                    href={`tel:${settings?.phoneNumber || '+250780314239'}`}
                    className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors text-center font-medium block"
                  >
                    Call Agent
                  </a>
                </div>

                {/* Additional Info */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-semibold mb-3">Property Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Property Type:</span>
                      <span className="font-medium">{house.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className="font-medium">{house.status}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Year Built:</span>
                      <span className="font-medium">{house.yearBuilt}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HouseDetail;
