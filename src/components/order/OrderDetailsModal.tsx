
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  X, 
  Download, 
  Eye, 
  FileText, 
  Image, 
  Clock, 
  CheckCircle, 
  Phone, 
  MessageCircle,
  MapPin,
  Star,
  Calendar,
  DollarSign
} from 'lucide-react';

interface FileItem {
  id: string;
  name: string;
  type: string;
  size: number;
  url?: string;
  preview?: string;
}

interface OrderDetails {
  id: string;
  type: 'digital' | 'physical';
  description: string;
  status: 'pending' | 'processing' | 'ready' | 'completed';
  shopName: string;
  shopPhone: string;
  shopAddress: string;
  shopRating: number;
  createdAt: Date;
  estimatedCompletion?: Date;
  completedAt?: Date;
  totalAmount?: number;
  files?: FileItem[];
  timeline: {
    status: string;
    timestamp: Date;
    description: string;
  }[];
  pricing: {
    subtotal: number;
    tax: number;
    total: number;
    breakdown: {
      item: string;
      quantity: number;
      rate: number;
      amount: number;
    }[];
  };
}

interface OrderDetailsModalProps {
  order: OrderDetails;
  isOpen: boolean;
  onClose: () => void;
  onOpenChat: () => void;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ 
  order, 
  isOpen, 
  onClose, 
  onOpenChat 
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'files' | 'timeline' | 'billing'>('overview');

  if (!isOpen) return null;

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <Image className="w-5 h-5" />;
    return <FileText className="w-5 h-5" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-golden-100 text-golden-800 border-golden-200';
      case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ready': return 'bg-green-100 text-green-800 border-green-200';
      case 'completed': return 'bg-neutral-100 text-neutral-800 border-neutral-200';
      default: return 'bg-neutral-100 text-neutral-800 border-neutral-200';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden border-0 shadow-premium bg-white">
        {/* Header */}
        <CardHeader className="border-b border-neutral-200 bg-gradient-golden-soft">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-semibold text-neutral-900">
                Order #{order.id}
              </CardTitle>
              <div className="flex items-center space-x-3 mt-2">
                <Badge className={`border ${getStatusColor(order.status)}`}>
                  <span className="capitalize">{order.status}</span>
                </Badge>
                <span className="text-sm text-neutral-600">
                  {order.createdAt.toLocaleDateString()}
                </span>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="border-neutral-300 hover:bg-neutral-50"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        {/* Tabs */}
        <div className="border-b border-neutral-200 bg-white">
          <div className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'files', label: `Files ${order.files ? `(${order.files.length})` : ''}` },
              { id: 'timeline', label: 'Timeline' },
              { id: 'billing', label: 'Billing' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-golden-500 text-golden-700'
                    : 'border-transparent text-neutral-600 hover:text-neutral-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <CardContent className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Order Info */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-neutral-900 mb-3">Order Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Type:</span>
                      <span className="font-medium capitalize">{order.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Status:</span>
                      <Badge className={`${getStatusColor(order.status)} text-xs`}>
                        {order.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Created:</span>
                      <span className="font-medium">
                        {order.createdAt.toLocaleString()}
                      </span>
                    </div>
                    {order.estimatedCompletion && (
                      <div className="flex justify-between">
                        <span className="text-neutral-600">Estimated:</span>
                        <span className="font-medium">
                          {order.estimatedCompletion.toLocaleString()}
                        </span>
                      </div>
                    )}
                    {order.totalAmount && (
                      <div className="flex justify-between">
                        <span className="text-neutral-600">Total:</span>
                        <span className="font-semibold text-lg">₹{order.totalAmount}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-neutral-900 mb-3">Shop Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-neutral-400" />
                      <div>
                        <p className="font-medium">{order.shopName}</p>
                        <p className="text-sm text-neutral-600">{order.shopAddress}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-golden-500 fill-current" />
                      <span className="font-medium">{order.shopRating}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-neutral-400" />
                      <span className="font-medium">{order.shopPhone}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-semibold text-neutral-900 mb-3">Description</h3>
                <p className="text-neutral-700 bg-neutral-50 p-4 rounded-lg">
                  {order.description}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'files' && (
            <div className="space-y-4">
              {order.files && order.files.length > 0 ? (
                <div className="grid gap-4">
                  {order.files.map((file) => (
                    <div key={file.id} className="flex items-center space-x-4 p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors">
                      <div className="flex items-center space-x-3 flex-1">
                        {getFileIcon(file.type)}
                        <div>
                          <p className="font-medium text-neutral-900">{file.name}</p>
                          <p className="text-sm text-neutral-600">
                            {formatFileSize(file.size)} • {file.type}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        {file.preview && (
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4 mr-1" />
                            Preview
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                  <p className="text-neutral-600">No files uploaded for this order</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="space-y-4">
              {order.timeline.map((event, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full ${
                      index === 0 ? 'bg-golden-500' : 'bg-neutral-300'
                    }`}></div>
                    {index < order.timeline.length - 1 && (
                      <div className="w-px h-8 bg-neutral-200 mt-2"></div>
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-neutral-900">{event.status}</h4>
                      <span className="text-sm text-neutral-500">
                        {event.timestamp.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-600">{event.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'billing' && order.pricing && (
            <div className="space-y-6">
              {/* Breakdown */}
              <div>
                <h3 className="font-semibold text-neutral-900 mb-4">Cost Breakdown</h3>
                <div className="space-y-3">
                  {order.pricing.breakdown.map((item, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b border-neutral-100">
                      <div>
                        <span className="font-medium">{item.item}</span>
                        <span className="text-sm text-neutral-600 ml-2">
                          ({item.quantity} × ₹{item.rate})
                        </span>
                      </div>
                      <span className="font-medium">₹{item.amount}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="bg-neutral-50 p-4 rounded-lg">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>₹{order.pricing.subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span>₹{order.pricing.tax}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg pt-2 border-t border-neutral-200">
                    <span>Total:</span>
                    <span>₹{order.pricing.total}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>

        {/* Footer */}
        <div className="border-t border-neutral-200 p-6 bg-neutral-50">
          <div className="flex justify-between items-center">
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => window.open(`tel:${order.shopPhone}`)}
                className="border-neutral-300 hover:bg-neutral-50"
              >
                <Phone className="w-4 h-4 mr-2" />
                Call Shop
              </Button>
              <Button
                onClick={onOpenChat}
                variant="outline"
                className="border-golden-300 text-golden-700 hover:bg-golden-50"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Chat
              </Button>
            </div>
            <Button onClick={onClose} className="bg-neutral-900 text-white hover:bg-neutral-800">
              Close
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default OrderDetailsModal;
