import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Star, 
  Phone, 
  Clock, 
  Verified,
  TrendingUp,
  Calendar,
  Plus
} from 'lucide-react';
import { VisitedShop } from '@/types/shop';

interface VisitedShopsSectionProps {
  visitedShops: VisitedShop[];
  title?: string;
  showRequestButton?: boolean;
  onRequestNewShop?: () => void;
}

const VisitedShopsSection: React.FC<VisitedShopsSectionProps> = ({ 
  visitedShops, 
  title = "Print Shops Previously Visited",
  showRequestButton = false,
  onRequestNewShop 
}) => {
  const formatLastVisited = (date: Date) => {
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  };

  const getCurrentStatus = (operatingHours: VisitedShop['operatingHours']) => {
    const now = new Date();
    const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase() as keyof typeof operatingHours;
    const currentTime = now.getHours() * 100 + now.getMinutes();
    
    const todayHours = operatingHours[currentDay];
    if (!todayHours.isOpen) return { isOpen: false, text: 'Closed Today' };
    
    const openTime = parseInt(todayHours.open.replace(':', ''));
    const closeTime = parseInt(todayHours.close.replace(':', ''));
    
    if (currentTime >= openTime && currentTime <= closeTime) {
      return { isOpen: true, text: `Open until ${todayHours.close}` };
    } else {
      return { isOpen: false, text: `Opens at ${todayHours.open}` };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-neutral-900">{title}</h2>
          <p className="text-neutral-600 mt-1">Select from shops you've visited before to place new orders</p>
        </div>
        {showRequestButton && onRequestNewShop && (
          <Button
            variant="outline"
            onClick={onRequestNewShop}
            className="border-golden-300 text-golden-700 hover:bg-golden-50 font-medium"
          >
            <Plus className="w-4 h-4 mr-2" />
            Request New Shop
          </Button>
        )}
      </div>

      {visitedShops.length === 0 ? (
        <Card className="border-0 shadow-glass bg-white/70 backdrop-blur-lg">
          <CardContent className="p-16 text-center">
            <div className="w-20 h-20 bg-gradient-golden-soft rounded-full mx-auto mb-6 flex items-center justify-center">
              <MapPin className="w-10 h-10 text-golden-600" />
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-3">No visited shops yet</h3>
            <p className="text-neutral-600 max-w-md mx-auto">
              Once you visit print shops and place orders, they will appear here for easy reordering.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visitedShops.map((shop) => {
            const status = getCurrentStatus(shop.operatingHours);
            return (
              <Card key={shop.id} className="border-0 shadow-glass bg-white/70 backdrop-blur-lg hover:shadow-premium transition-all duration-300 group cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-neutral-900 text-lg group-hover:text-golden-700 transition-colors">
                          {shop.name}
                        </h3>
                        {shop.verified && (
                          <Verified className="w-4 h-4 text-blue-500" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <Star className="w-4 h-4 text-golden-500 fill-current" />
                        <span className="font-semibold text-neutral-900">{shop.rating}</span>
                        <span className="text-sm text-neutral-500">({shop.totalReviews} reviews)</span>
                      </div>
                    </div>
                    <Badge className={`text-xs font-medium ${
                      status.isOpen 
                        ? 'bg-green-100 text-green-800 border-green-200' 
                        : 'bg-red-100 text-red-800 border-red-200'
                    }`}>
                      {status.text}
                    </Badge>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-neutral-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-neutral-600 font-medium">{shop.address}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-neutral-500" />
                      <span className="text-sm text-neutral-600 font-medium">
                        Last visited: {formatLastVisited(shop.lastVisited)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-neutral-500" />
                      <span className="text-sm text-neutral-600 font-medium">
                        {shop.visitCount} visits • Avg: {shop.averageCompletionTime}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div>
                      <h4 className="text-sm font-semibold text-neutral-900 mb-2">Services:</h4>
                      <div className="flex flex-wrap gap-1">
                        {shop.services.slice(0, 3).map((service) => (
                          <Badge key={service} variant="outline" className="text-xs border-neutral-300 text-neutral-700">
                            {service}
                          </Badge>
                        ))}
                        {shop.services.length > 3 && (
                          <Badge variant="outline" className="text-xs border-neutral-300 text-neutral-700">
                            +{shop.services.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-neutral-900 mb-2">Pricing:</h4>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-neutral-500">B&W:</span>
                          <span className="font-semibold text-neutral-900 ml-1">₹{shop.pricing.blackWhite}</span>
                        </div>
                        <div>
                          <span className="text-neutral-500">Color:</span>
                          <span className="font-semibold text-neutral-900 ml-1">₹{shop.pricing.color}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1 bg-gradient-golden hover:shadow-golden text-white font-semibold"
                      onClick={() => {
                        // Navigate to order creation with pre-selected shop
                        window.location.href = `/customer/order/new?shop=${shop.id}`;
                      }}
                    >
                      Order Now
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(`tel:${shop.phone}`)}
                      className="border-neutral-300 hover:bg-neutral-50"
                    >
                      <Phone className="w-4 h-4" />
                    </Button>
                  </div>

                  {shop.orderHistory && shop.orderHistory.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-neutral-200">
                      <p className="text-xs text-neutral-500 font-medium">
                        Recent orders: {shop.orderHistory.length} completed
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default VisitedShopsSection;
