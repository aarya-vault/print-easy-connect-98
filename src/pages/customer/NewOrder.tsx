
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import FileUpload from '@/components/ui/file-upload';
import { useAuth } from '@/contexts/AuthContext';
import apiService from '@/services/api';
import { Upload, FileText, ArrowLeft } from 'lucide-react';

interface Shop {
  id: string;
  name: string;
  address: string;
  phone: string;
  rating: number;
}

const NewOrder: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [shops, setShops] = useState<Shop[]>([]);
  const [selectedShop, setSelectedShop] = useState<string>('');
  const [orderType, setOrderType] = useState<'uploaded-files' | 'walk-in'>('uploaded-files');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadShops = async () => {
      try {
        const response = await apiService.getShops();
        setShops(response.shops || []);
      } catch (error) {
        console.error('Failed to load shops:', error);
        toast.error('Failed to load shops');
      }
    };
    loadShops();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedShop) {
      toast.error('Please select a shop');
      return;
    }

    if (orderType === 'uploaded-files' && files.length === 0) {
      toast.error('Please upload at least one file');
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('shopId', selectedShop);
      formData.append('orderType', orderType);
      formData.append('description', description);
      formData.append('customerName', user?.name || '');
      formData.append('customerPhone', user?.phone || '');

      files.forEach(file => {
        formData.append('files', file);
      });

      const response = await apiService.createOrder(formData);
      toast.success('Order created successfully!');
      navigate('/customer/dashboard', { replace: true });
    } catch (error: any) {
      console.error('Order creation failed:', error);
      toast.error(error.message || 'Failed to create order');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (selectedFiles: File[]) => {
    setFiles(selectedFiles);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-golden-50 via-white to-golden-100 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/customer/dashboard')}
            className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </div>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Create New Order</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="shop">Select Shop *</Label>
                <Select value={selectedShop} onValueChange={setSelectedShop}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a print shop" />
                  </SelectTrigger>
                  <SelectContent>
                    {shops.map((shop) => (
                      <SelectItem key={shop.id} value={shop.id}>
                        <div>
                          <p className="font-medium">{shop.name}</p>
                          <p className="text-sm text-neutral-500">{shop.address}</p>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Order Type *</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <Button
                    type="button"
                    variant={orderType === 'uploaded-files' ? 'default' : 'outline'}
                    onClick={() => setOrderType('uploaded-files')}
                    className="h-20 flex-col gap-2"
                  >
                    <Upload className="w-6 h-6" />
                    Upload Files
                  </Button>
                  <Button
                    type="button"
                    variant={orderType === 'walk-in' ? 'default' : 'outline'}
                    onClick={() => setOrderType('walk-in')}
                    className="h-20 flex-col gap-2"
                  >
                    <FileText className="w-6 h-6" />
                    Walk-in Order
                  </Button>
                </div>
              </div>

              {orderType === 'uploaded-files' && (
                <div>
                  <Label>Upload Files *</Label>
                  <FileUpload
                    onFilesSelected={handleFileChange}
                    maxFiles={5}
                    maxSize={10 * 1024 * 1024}
                    acceptedTypes={['application/pdf', 'image/*', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']}
                    className="mt-2"
                  />
                  {files.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm text-neutral-600">
                        {files.length} file(s) selected
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your printing requirements..."
                  className="mt-2"
                  rows={4}
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading || !selectedShop || (orderType === 'uploaded-files' && files.length === 0)}
                className="w-full h-12 bg-gradient-to-r from-golden-500 to-golden-600 hover:from-golden-600 hover:to-golden-700"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating Order...
                  </div>
                ) : (
                  'Create Order'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NewOrder;
