import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, Landmark, ChevronRight, MapPin, Trees, Building2, Factory, Building, ArrowRight } from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';

// Image URLs for each category
const smallPlotsImages = [
  'https://images.unsplash.com/photo-1600585154526-990dced4b1ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
];

const largeAcresImages = [
  'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
];

const otherLandsImages = [
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1499793983690-29f59eb7fbde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
];

const PropertyCategories = () => {
  const [activeTab, setActiveTab] = useState('land');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Rotate images every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(prevIndex => (prevIndex + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const landCategories = [
    {
      title: 'Small Plots',
      icon: MapPin,
      features: [
        'Near Tarmac road',
        'Near lakes',
        'Sites of plots'
      ],
      images: smallPlotsImages,
      color: 'from-blue-500 to-blue-600',
      animation: 'fade-in-up',
      delay: '0.1s'
    },
    {
      title: 'Large Acres of Land',
      icon: Trees,
      features: [
        'On Tarmac roads',
        'On the lakes',
        'Farming zones'
      ],
      images: largeAcresImages,
      color: 'from-green-500 to-green-600',
      info: [
        '1 hectare = 2.471 acres',
        '1 hectare = 10,000m²',
        '1 acre = 4,050m²'
      ],
      animation: 'fade-in-up',
      delay: '0.2s'
    },
    {
      title: 'Other Big Lands',
      icon: Building2,
      features: [
        'Plots for Commercial use',
        'Plots for Hotels',
        'Plots for Industries',
        'Plots for Hospitals and Schools'
      ],
      images: otherLandsImages,
      color: 'from-orange-500 to-orange-600',
      animation: 'fade-in-up',
      delay: '0.3s'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      {/* Add custom animation keyframes */}
      <style jsx="true">{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        
        /* Smooth transition for image carousel */
        .image-fade-enter {
          opacity: 0;
        }
        .image-fade-enter-active {
          opacity: 1;
          transition: opacity 1000ms ease-in-out;
        }
        .image-fade-exit {
          opacity: 1;
        }
        .image-fade-exit-active {
          opacity: 0;
          transition: opacity 1000ms ease-in-out;
        }
      `}</style>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white py-16 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Explore Our Properties
            </h1>
            <p className="text-xl text-primary-100">
              Find the perfect land or house for your needs
            </p>
          </div>
        </div>
      </section>

      {/* Land Information Section */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-center gap-4 mt-16">
            <Link to="/plots" className="w-full md:w-auto">
              <Button size="lg" className="px-8 py-6 text-lg w-full">
                <MapPin className="mr-2" size={20} />
                View All Land Listings
                <ArrowRight className="ml-2" size={20} />
              </Button>
            </Link>
            <Link to="/houses" className="w-full md:w-auto">
              <Button size="lg" variant="outline" className="px-8 py-6 text-lg w-full border-primary-600 text-primary-600 hover:bg-primary-50">
                <Home className="mr-2" size={20} />
                View All Houses
                <ArrowRight className="ml-2" size={20} />
              </Button>
            </Link>
          </div>
          <div className="text-center mb-12">
            <Badge className="mb-4 text-base px-4 py-2">
              <Landmark className="mr-2" size={18} />
              Land Categories
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Available Land Types</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover various land options tailored to your investment needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 px-4 w-full max-w-7xl mx-auto">
            {landCategories.map((category, index) => {
              const Icon = category.icon;
              return (
                <div key={index} className="flex flex-col h-full">
                <Card 
                  className="group hover:shadow-2xl transition-all duration-500 border border-gray-200 hover:border-primary/50 animate-fade-in-up overflow-hidden flex flex-col h-full"
                  style={{ 
                    animationDelay: category.delay,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)'
                  }}
                >
                  {/* Image Carousel - Professional */}
                  <div className="relative aspect-video overflow-hidden bg-gray-100">
                    {category.images.map((img, imgIndex) => (
                      <div 
                        key={imgIndex}
                        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${imgIndex === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
                        style={{
                          backgroundImage: `url(${img})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          transition: 'opacity 1s ease-in-out',
                          transform: 'scale(1.1)'
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      </div>
                    ))}
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white bg-gradient-to-t from-black/70 to-transparent">
                      <div className="flex items-center space-x-3">
                        <div className={`w-9 h-9 ${category.color.split(' ')[0]} ${category.color.split(' ')[1]} rounded-lg flex items-center justify-center flex-shrink-0`}>
                          <Icon className="text-white" size={18} />
                        </div>
                        <h3 className="text-lg font-semibold text-white">{category.title}</h3>
                      </div>
                    </div>
                  </div>
                  
                  <CardContent className="flex-1 flex flex-col p-5 space-y-3">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">Key Features</h4>
                      <div className={`h-0.5 flex-1 bg-gradient-to-r from-transparent ${category.color.split(' ')[1]} ml-3`}></div>
                    </div>
                    <div className="space-y-2">
                    <ul className="space-y-2.5">
                      {category.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start">
                          <div className={`flex-shrink-0 w-5 h-5 rounded-full ${category.color.split(' ')[1]} bg-opacity-10 flex items-center justify-center mt-0.5 mr-2`}>
                            <ChevronRight size={12} className={category.color.split(' ')[1]} />
                          </div>
                          <span className="text-sm text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    {category.info && (
                      <div className="mt-6 pt-4 border-t border-gray-100">
                        <div className="flex items-center space-x-2 mb-3">
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Conversion Info</span>
                          <div className={`h-px flex-1 bg-gradient-to-r ${category.color.split(' ')[1]} bg-opacity-30`}></div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {category.info.map((info, idx) => (
                            <div key={idx} className={`px-3 py-1.5 text-xs font-medium rounded-full ${category.color.split(' ')[1]} bg-opacity-10 text-${category.color.split('-')[1]}-700`}>
                              {info}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    </div>
                  </CardContent>
                </Card>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Property Type Selection Cards */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Ready to Find Your Property?</h2>
            <p className="text-lg text-muted-foreground">
              Select your preferred property type to start exploring
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Land Card */}
            <Link to="/plots?type=land" className="group relative overflow-hidden rounded-2xl transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
              <div className="relative h-80 bg-gradient-to-br from-green-600 to-green-800 overflow-hidden">
                {/* Animated background elements */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS10cmVlLXBhbG0iPjxwYXRoIGQ9Ik0xNSAxMGMxLjEtLjkgMy0xLjQgNS0xYTIyIDIyIDAgMCAxIDQgMCIvPjxwYXRoIGQ9Ik0xMyAxOWMxLjEuNyA0LjIgMSA2IDBjMS4xLS44IDIuNi0yIDQtM2EzIDMgMCAwIDAgMC0zYy0yLjItMS4zLTQuMS0yLTYtMi0xLjkgMC00LjIuNy02IDJhMyAzIDAgMCAwIDAgM2MtMS40IDEtMi45IDIuMi00IDN6Ii8+PHBhdGggZD0iTTEyIDE5Yy0xLjEuNy00LjIgMS02IDAtMS4xLS44LTIuNi0yLTMtM2EyIDIgMCAwIDEgMC0zYzIuMi0xLjMgNC4xLTIgNi0yIDEuOSAwIDQuMi43IDYgMmEyIDIgMCAwIDEgMCAzYy0xLjQgMS0yLjkgMi4yLTQgM3oiLz48L3N2Zz4=')] opacity-30"></div>
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                  <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20 mb-6 transform group-hover:scale-110 transition-transform duration-500">
                    <Landmark className="text-white mx-auto" size={80} />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-4">Browse Land</h3>
                  <p className="text-white/90 mb-6">
                    Explore our wide selection of land plots for all purposes
                  </p>
                  <div className="inline-flex items-center justify-center px-6 py-3 bg-white text-green-700 rounded-full font-semibold group-hover:bg-green-50 transition-colors">
                    View Land Plots
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                  </div>
                </div>
                {/* Animated overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            </Link>

            {/* House Card */}
            <Link to="/houses" className="group relative overflow-hidden rounded-2xl transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
              <div className="relative h-80 bg-gradient-to-br from-amber-600 to-amber-800 overflow-hidden">
                {/* Animated background elements */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS1ob21lIj48cGF0aCBkPSJtMyA5IDktNyA5IDd2MTFhMiAyIDAgMCAxLTIgMkg1YTIgMiAwIDAgMS0yLTJ6Ii8+PHBvbHlsaW5lIHBvaW50cz0iOSAyMiA5IDEyIDE1IDEyIDE1IDIyIi8+PC9zdmc+')] opacity-30"></div>
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                  <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20 mb-6 transform group-hover:scale-110 transition-transform duration-500">
                    <Home className="text-white mx-auto" size={80} />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-4">Browse Houses</h3>
                  <p className="text-white/90 mb-6">
                    Discover beautiful houses ready for you to move in or invest
                  </p>
                  <div className="inline-flex items-center justify-center px-6 py-3 bg-white text-amber-700 rounded-full font-semibold group-hover:bg-amber-50 transition-colors">
                    View Houses
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                  </div>
                </div>
                {/* Animated overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 text-white py-16 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Need Help Choosing?</h2>
          <p className="text-xl mb-8 text-primary-100 max-w-2xl mx-auto">
            Our team is ready to assist you in finding the perfect property
          </p>
          <Button asChild size="lg" className="bg-white text-primary-600 hover:bg-gray-100 shadow-xl">
            <Link to="/contact">
              Contact Us Today
            </Link>
          </Button>
        </div>
      </section>

      <Footer />

      <style jsx="true">{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default PropertyCategories;
