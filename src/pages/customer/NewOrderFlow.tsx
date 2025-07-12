
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  MapPin, 
  Star, 
  Phone,
  Clock,
  Upload,
  UserPlus,
  ArrowRight,
  Building,
  Zap,
  Award,
  CheckCircle
} from 'lucide-react';

interface Shop {
  id: string;
  name: string;
  address: string;
  phone: string;
  rating: number;
  totalReviews: number;
  distance: string;
  estimatedTime: string;
  specialties: string[];
  services: string[];
  isOpen: boolean;
  uploadSlug: string;
}

const NewOrderFlow: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrderType, setSelectedOrderType] = useState<'upload' | 'walkin' | null>(null);

  const [nearbyShops] = useState<Shop[]>([
    {
      id: 'shop1',
      name: 'Quick Print Solutions',
      address: 'Shop 12, MG Road, Bangalore',
      phone: '9876543210',
      rating: 4.8,
      totalReviews: 245,
      distance: '0.5 km',
      estimatedTime: '15-20 mins',
      specialties: ['24/7 Service', 'Same Day Delivery'],
      services: ['Color Printing', 'Black & White', 'Binding', 'Scanning'],
      isOpen: true,
      uploadSlug: 'quick-print-solutions'
    },
    {
      id: 'shop2',
      name: 'Campus Copy Center',
      address: 'Near College Gate, Whitefield',
      phone: '8765432109',
      rating: 4.5,
      totalReviews: 189,
      distance: '1.2 km',
      estimatedTime: '10-15 mins',
      specialties: ['Student Discounts', 'Bulk Orders'],
      services: ['Photocopying', 'Scanning', 'Lamination'],
      isOpen: true,
      uploadSlug: 'campus-copy-center'
    },
    {
      id: 'shop3',
      name: 'Digital Express Printing',
      address: 'Forum Mall, Level 1, Koramangala',
      phone: '7654321098',
      rating: 4.9,
      totalReviews: 312,
      distance: '2.1 km',
      estimatedTime: '20-25 mins',
      specialties: ['Premium Quality', 'Fast Service'],
      services: ['Color Printing', 'Photo Printing', 'Large Format'],
      isOpen: true,
      uploadSlug: 'digital-express-printing'
    },
    {
      id: 'shop4',
      name: 'Print Hub Express',
      address: 'HSR Layout, Sector 7',
      phone: '5555566666',
      rating: 4.6,
      totalReviews: 156,
      distance: '3.0 km',
      estimatedTime: '25-30 mins',
      specialties: ['Eco-Friendly', 'Competitive Pricing'],
      services: ['Black & White', 'Binding', 'Lamination'],
      isOpen: false,
      uploadSlug: 'print-hub-express'
    }
  ]);

  const filteredShops = nearbyShops.filter(shop =>
    shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shop.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shop.services.some(service => service.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleShopSelect = (shop: Shop, orderType: 'upload' | 'walkin') => {
    if (orderType === 'upload') {
      navigate(`/customer/shop/${shop.uploadSlug}/upload`);
    } else {
      navigate(`/customer/shop/${shop.id}/walkin`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-golden-50 via-white to-golden-100">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-neutral-900 mb-4">
            Create New <span className="text-golden-600">Print Order</span>
          </h1>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Choose your preferred print shop and order type to get started
          </p>
        </div>

        {/* Order Type Selection */}
        <div className="max-w-4xl mx-auto mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Choose Your Order Type</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card 
              className={`border-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                selectedOrderType === 'upload' ? 'border-blue-500 bg-blue-50' : 'border-neutral-200 hover:border-blue-300'
              }`}
              onClick={() => setSelectedOrderType('upload')}
            >
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Upload className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-bold text-neutral-900 mb-2">Upload Files</h3>
                  <p className="text-neutral-600 mb-4">
                    Upload your documents and get them printed with custom options
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <Badge variant="outline" className="text-xs">PDF, DOC, DOCX</Badge>
                    <Badge variant="outline" className="text-xs">JPG, PNG</Badge>
                    <Badge variant="outline" className="text-xs">Custom Options</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card 
              className={`border-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                selectedOrderType === 'walkin' ? 'border-purple-500 bg-purple-50' : 'border-neutral-200 hover:border-purple-300'
              }`}
              onClick={() => setSelectedOrderType('walkin')}
            >
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <UserPlus className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-bold text-neutral-900 mb-2">Walk-in Order</h3>
                  <p className="text-neutral-600 mb-4">
                    Create an order to visit the shop with your documents
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <Badge variant="outline" className="text-xs">Physical Documents</Badge>
                    <Badge variant="outline" className="text-xs">In-Person Service</Badge>
                    <Badge variant="outline" className="text-xs">Immediate Help</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Shop Search */}
        {selectedOrderType && (
          <div className="max-w-4xl mx-auto mb-6">
            <Card className="border-2 border-neutral-200 shadow-md bg-white">
              <CardContent className="p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <Input
                    placeholder="Search shops by name, location, or services..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-12 border-2 border-neutral-200 focus:border-golden-400 rounded-xl bg-white shadow-sm"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Shop Selection */}
        {selectedOrderType && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl font-semibold text-neutral-900 mb-6">
              Select a Print Shop ({filteredShops.length} available)
            </h2>
            
            <div className="space-y-4">
              {filteredShops.map((shop) => (
                <Card 
                  key={shop.id} 
                  className={`border-2 shadow-lg hover:shadow-xl transition-all duration-300 ${
                    shop.isOpen ? 'border-green-200 hover:border-green-300' : 'border-gray-200 opacity-70'
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 bg-gradient-to-r from-golden-500 to-golden-600 rounded-xl flex items-center justify-center">
                            <Building className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-neutral-900">{shop.name}</h3>
                            <div className="flex items-center gap-4 mt-1">
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-golden-500 fill-current" />
                                <span className="font-semibold text-neutral-900">{shop.rating}</span>
                                <span className="text-sm text-neutral-500">({shop.totalReviews} reviews)</span>
                              </div>
                              <Badge className={`text-xs ${shop.isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {shop.isOpen ? 'Open' : 'Closed'}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-neutral-600">
                            <MapPin className="w-4 h-4" />
                            <span className="text-sm">{shop.address}</span>
                            <span className="text-sm text-golden-600 font-medium">• {shop.distance}</span>
                          </div>
                          <div className="flex items-center gap-2 text-neutral-600">
                            <Phone className="w-4 h-4" />
                            <span className="text-sm">{shop.phone}</span>
                          </div>
                          <div className="flex items-center gap-2 text-neutral-600">
                            <Clock className="w-4 h-4" />
                            <span className="text-sm">Est. completion: {shop.estimatedTime}</span>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <h4 className="text-sm font-semibold text-neutral-900 mb-2">Specialties:</h4>
                            <div className="flex flex-wrap gap-2">
                              {shop.specialties.map((specialty, index) => (
                                <Badge key={index} className="text-xs bg-golden-100 text-golden-800 border-golden-300">
                                  {index === 0 ? <Zap className="w-3 h-3 mr-1" /> : <Award className="w-3 h-3 mr-1" />}
                                  {specialty}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-semibold text-neutral-900 mb-2">Services:</h4>
                            <div className="flex flex-wrap gap-2">
                              {shop.services.map((service, index) => (
                                <Badge key={index} variant="outline" className="text-xs border-neutral-300 text-neutral-700">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  {service}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="ml-6">
                        <Button
                          onClick={() => handleShopSelect(shop, selectedOrderType)}
                          disabled={!shop.isOpen}
                          className={`h-12 px-6 font-semibold ${
                            selectedOrderType === 'upload'
                              ? 'bg-blue-500 hover:bg-blue-600 text-white'
                              : 'bg-purple-500 hover:bg-purple-600 text-white'
                          }`}
                        >
                          {selectedOrderType === 'upload' ? 'Upload Files' : 'Create Walk-in Order'}
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div className="text-center mt-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/customer/dashboard')}
            className="text-neutral-600 hover:text-neutral-900"
          >
            ← Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NewOrderFlow;
