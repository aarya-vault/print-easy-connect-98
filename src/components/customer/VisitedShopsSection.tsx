
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Star, 
  Clock, 
  Phone, 
  Calendar,
  TrendingUp,
  Plus
} from 'lucide-react';
import { VisitedShop } from '@/types/shop';

interface VisitedShopsSectionProps {
  visitedShops: VisitedShop[];
  onRequestNewShop: () => void;
}

const VisitedShopsSection: React.FC<VisitedShopsSectionProps> = ({ 
  visitedShops, 
  onRequestNewShop 
}) => {
  const navigate = useNavigate();

  const formatLastVisit = (date: Date) => {
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  };

  const handleCreateOrder = (shopId: string) => {
    navigate(`/customer/order/new?shopId=${shopId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-neutral-900 mb-2">
            Your Print Shops
          </h2>
          <p className="text-neutral-600">
            Place orders from shops you've visited before
          </p>
        </div>
        <Button
          onClick={onRequestNewShop}
          variant="outline"
          className="border-golden-300 text-golden-700 hover:bg-golden-50"
        >
          <Plus className="w-4 h-4 mr-2" />
          Request New Shop
        </Button>
      </div>

      {visitedShops.length === 0 ? (
        <Card className="border-0 shadow-glass bg-white/60 backdrop-blur-lg">
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 bg-gradient-golden-soft rounded-full mx-auto mb-6 flex items-center justify-center">
              <MapPin className="w-10 h-10 text-golden-600" />
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-3">
              No Visited Shops Yet
            </h3>
            <p className="text-neutral-600 mb-6 max-w-md mx-auto">
              Visit a print shop in person first, then you can place orders through PrintEasy
            </p>
            <Button
              onClick={onRequestNewShop}
              className="bg-gradient-golden text-white font-medium"
            >
              <Plus className="w-4 h-4 mr-2" />
              Find Nearby Shops
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visitedShops.map((shop) => (
            <Card key={shop.id} className="border-0 shadow-glass bg-white/60 backdrop-blur-lg hover:shadow-premium transition-all duration-300 group hover:scale-[1.02]">
              <CardContent className="p-6">
                {/* Shop Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-neutral-900 text-lg mb-1 group-hover:text-golden-700 transition-colors">
                      {shop.name}
                    </h3>
                    <div className="flex items-center text-sm text-neutral-600 mb-2">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span className="truncate">{shop.address}</span>
                    </div>
                  </div>
                  {shop.verified && (
                    <Badge className="bg-golden-100 text-golden-800 border-golden-200">
                      Verified
                    </Badge>
                  )}
                </div>

                {/* Shop Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center text-sm">
                    <Star className="w-4 h-4 text-golden-500 mr-1 fill-current" />
                    <span className="font-medium">{shop.rating}</span>
                    <span className="text-neutral-500 ml-1">({shop.totalReviews})</span>
                  </div>
                  <div className="flex items-center text-sm text-neutral-600">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{shop.averageCompletionTime}</span>
                  </div>
                </div>

                {/* Visit History */}
                <div className="border-t border-neutral-200 pt-4 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-neutral-600">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>Last visit: {formatLastVisit(shop.lastVisited)}</span>
                    </div>
                    <div className="flex items-center text-golden-700 font-medium">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      <span>{shop.visitCount} visits</span>
                    </div>
                  </div>
                </div>

                {/* Services */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {shop.services.slice(0, 3).map((service, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {service}
                      </Badge>
                    ))}
                    {shop.services.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{shop.services.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <Button
                    onClick={() => handleCreateOrder(shop.id)}
                    className="w-full bg-gradient-golden text-white font-medium hover:shadow-golden"
                  >
                    Create Order
                  </Button>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(`tel:${shop.phone}`)}
                      className="flex-1 border-neutral-300 hover:bg-neutral-50"
                    >
                      <Phone className="w-4 h-4 mr-1" />
                      Call
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-neutral-300 hover:bg-neutral-50"
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default VisitedShopsSection;
