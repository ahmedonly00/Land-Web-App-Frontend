import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { MapPin, Maximize, TrendingUp } from 'lucide-react';
import { formatPrice, formatSize } from '../../utils/formatters';
import PlaceholderImage from '../ui/placeholder-image';
import { getImageUrl, checkImageExists } from '../../utils/imageUtils';

const PlotCard = ({ plot }) => {
  const [imageError, setImageError] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  
  useEffect(() => {
    const loadImage = async () => {
      if (plot.featuredImageUrl) {
        const url = getImageUrl(plot.featuredImageUrl);
        const exists = await checkImageExists(url);
        if (exists) {
          setImageUrl(url);
        } else {
          setImageError(true);
        }
      }
    };
    
    loadImage();
  }, [plot.featuredImageUrl]);

  const getStatusVariant = (status) => {
    switch (status?.toUpperCase()) {
      case 'AVAILABLE':
        return 'success';
      case 'SOLD':
        return 'destructive';
      case 'RESERVED':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="group">
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50 h-full flex flex-col">
        <Link to={`/plots/${plot.id}`} className="block flex-1 flex flex-col">
          {/* Image */}
          <div className="relative h-56 overflow-hidden">
            {!imageError && imageUrl ? (
              <img
                src={imageUrl}
                alt={plot.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                onError={() => setImageError(true)}
              />
            ) : (
              <PlaceholderImage text="Plot Image" className="h-full" />
            )}
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />
            
            {/* Status Badge */}
            <div className="absolute top-3 right-3">
              <Badge variant={getStatusVariant(plot.status)} className="shadow-lg">
                {plot.status}
              </Badge>
            </div>

            {/* Price Badge */}
            <div className="absolute bottom-3 left-3">
              <div className="bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg">
                <div className="flex items-center gap-1 text-primary-600 font-bold text-lg">
                  <TrendingUp size={18} />
                  {formatPrice(plot.price, plot.currency)}
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <CardContent className="p-5 flex-1 flex flex-col">
            {/* Title */}
            <h3 className="text-xl font-bold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
              {plot.title}
            </h3>

            {/* Location */}
            <div className="flex items-center text-muted-foreground text-sm mb-4">
              <MapPin size={16} className="mr-2 flex-shrink-0 text-primary" />
              <span className="line-clamp-1">{plot.location}</span>
            </div>

            {/* Size */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1 text-sm font-medium">
                <Maximize size={16} className="text-primary" />
                <span>{formatSize(plot.size, plot.sizeUnit)}</span>
              </div>
            </div>

            {/* Features */}
            {plot.features && plot.features.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-auto">
                {plot.features.slice(0, 3).map((feature, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {feature}
                  </Badge>
                ))}
                {plot.features.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{plot.features.length - 3}
                  </Badge>
                )}
              </div>
            )}
          </CardContent>
        </Link>

        <CardFooter className="px-5 pb-5 pt-0">
          <Link to={`/plots/${plot.id}`} className="w-full" onClick={(e) => e.stopPropagation()}>
            <Button className="w-full">
              View Details
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PlotCard;
