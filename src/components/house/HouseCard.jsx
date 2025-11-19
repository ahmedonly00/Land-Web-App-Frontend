import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '../ui/card';
import { Badge } from '../ui/badge';
import { MapPin, Home, Bed, Bath, Ruler, Heart } from 'lucide-react';
import { formatPrice } from '../../utils/formatters';
import PlaceholderImage from '../ui/placeholder-image';
import { getImageUrl, checkImageExists } from '../../utils/imageUtils';
import { Button } from '../ui/button';

const HouseCard = ({ house }) => {
  const [imageError, setImageError] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  
  useEffect(() => {
    const loadImage = async () => {
      if (house.featuredImageUrl) {
        const url = getImageUrl(house.featuredImageUrl);
        const exists = await checkImageExists(url);
        if (exists) {
          setImageUrl(url);
        } else {
          setImageError(true);
        }
      }
    };
    
    loadImage();
  }, [house.featuredImageUrl]);

  const getStatusVariant = (status) => {
    switch (status?.toUpperCase()) {
      case 'AVAILABLE':
        return 'success';
      case 'SOLD':
        return 'destructive';
      case 'RENTED':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  return (
    <Link to={`/houses/${house.id}`} className="block group">
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50 h-full flex flex-col">
        {/* Image */}
        <div className="relative h-56 overflow-hidden">
          {!imageError && imageUrl ? (
            <img
              src={imageUrl}
              alt={house.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              onError={() => setImageError(true)}
            />
          ) : (
            <PlaceholderImage text="House Image" className="h-full" />
          )}
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />
          
          {/* Status Badge */}
          <div className="absolute top-3 right-3">
            <Badge variant={getStatusVariant(house.status)} className="shadow-lg">
              {house.status}
            </Badge>
          </div>

          {/* Price Badge */}
          <div className="absolute bottom-3 left-3">
            <div className="bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg">
              <div className="flex items-center gap-1 text-primary-600 font-bold text-lg">
                <Home size={18} />
                {formatPrice(house.price, house.currency)}
                {house.type === 'RENT' && <span className="text-sm font-normal">/mo</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <CardContent className="p-5 flex-grow">
          {/* Title */}
          <h3 className="text-xl font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {house.title}
          </h3>

          {/* Location */}
          <div className="flex items-center text-muted-foreground text-sm mb-4">
            <MapPin size={16} className="mr-2 flex-shrink-0 text-primary" />
            <span className="line-clamp-1">{house.location}</span>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 text-sm text-center mb-4">
            <div className="flex flex-col items-center">
              <Bed size={18} className="text-primary mb-1" />
              <span>{house.bedrooms} {house.bedrooms === 1 ? 'Bed' : 'Beds'}</span>
            </div>
            <div className="flex flex-col items-center">
              <Bath size={18} className="text-primary mb-1" />
              <span>{house.bathrooms} {house.bathrooms === 1 ? 'Bath' : 'Baths'}</span>
            </div>
            <div className="flex flex-col items-center">
              <Ruler size={18} className="text-primary mb-1" />
              <span>{house.size} m²</span>
            </div>
          </div>

          {/* Tags */}
          {house.tags && house.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {house.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {house.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{house.tags.length - 3}
                </Badge>
              )}
            </div>
          )}
        </CardContent>

        <CardFooter className="px-5 pb-5 pt-0">
          <Link to={`/houses/${house.id}`} className="w-full">
            <Button className="w-full">
              View Details
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default HouseCard;
