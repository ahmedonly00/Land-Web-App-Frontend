import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Maximize, DollarSign, ArrowLeft, Check } from 'lucide-react';
import { plotService } from '../services/plotService';
import { settingsService } from '../services/settingsService';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import WhatsAppButton from '../components/common/WhatsAppButton';
import Loading from '../components/common/Loading';
import { formatPrice, formatSize, getStatusBadgeColor } from '../utils/formatters';
import { getPlotWhatsAppMessage } from '../utils/whatsapp';
import { getImageUrl } from '../utils/imageUtils';
import { toast } from 'react-toastify';

const PlotDetail = () => {
  const { id } = useParams();
  const [plot, setPlot] = useState(null);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    loadPlot();
    loadSettings();
  }, [id]);

  const loadPlot = async () => {
    try {
      const plotData = await plotService.getPlotById(id);
      setPlot(plotData);
    } catch (error) {
      console.error('Failed to load plot', error);
      toast.error('Failed to load plot details');
    } finally {
      setLoading(false);
    }
  };

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

  if (!plot) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Plot Not Found</h2>
            <Link to="/plots" className="btn-primary">
              Back to Plots
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const whatsappMessage = getPlotWhatsAppMessage(plot);
  const whatsappNumber = settings?.whatsappNumber || '+250780314239';

  // Get images array or fallback to default placeholder
  const getImages = () => {
    if (plot.images && plot.images.length > 0) {
      return plot.images;
    } else if (plot.imageUrl) {
      // For backward compatibility with older plot entries
      return [{ imageUrl: plot.imageUrl }];
    }
    return [{ imageUrl: '/placeholder-plot.jpg' }];
  };

  const images = getImages();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-grow bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <Link to="/plots" className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-6">
            <ArrowLeft size={20} />
            Back to Plots
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Image Gallery */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                <div className="relative h-96 bg-gray-200">
                  <img
                    src={getImageUrl(images[selectedImage]?.imageUrl)}
                    alt={plot.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = '/placeholder-plot.jpg';
                    }}
                  />
                  <div className="absolute top-4 right-4">
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusBadgeColor(plot.status)}`}>
                      {plot.status}
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
                        <img
                          src={getImageUrl(image.imageUrl)}
                          alt={`${plot.title} ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = '/placeholder-plot.jpg';
                          }}
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{plot.title}</h1>
                
                <div className="flex items-center text-gray-600 mb-6">
                  <MapPin size={20} className="mr-2" />
                  {plot.location}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Size</div>
                    <div className="text-xl font-semibold flex items-center gap-2">
                      <Maximize size={20} />
                      {formatSize(plot.size, plot.sizeUnit)}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Price</div>
                    <div className="text-xl font-semibold text-primary-600 flex items-center gap-2">
                      <DollarSign size={20} />
                      {formatPrice(plot.price, plot.currency)}
                    </div>
                  </div>
                </div>

                {plot.description && (
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-3">Description</h2>
                    <p className="text-gray-700 whitespace-pre-line">{plot.description}</p>
                  </div>
                )}

                {plot.features && plot.features.length > 0 && (
                  <div>
                    <h2 className="text-xl font-semibold mb-3">Features</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {plot.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-gray-700">
                          <Check size={18} className="text-green-600" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Price Card */}
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-blue-600">
                    {formatPrice(plot.price, plot.currency)}
                  </div>
                  <div className="text-gray-600">Total Price</div>
                </div>

                <div className="flex items-center text-gray-700 mb-6">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span>{plot.location}</span>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <WhatsAppButton
                    phoneNumber={whatsappNumber}
                    message={whatsappMessage}
                    className="w-full"
                  />
                  
                  <a
                    href={`tel:${settings?.phoneNumber || '+250788123456'}`}
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
                      <span className="text-gray-600">Size:</span>
                      <span className="font-medium">{formatSize(plot.size, plot.sizeUnit)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className="font-medium">{plot.status}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium">Land Plot</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PlotDetail;
