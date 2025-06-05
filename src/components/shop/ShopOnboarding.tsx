
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Upload, MapPin, Phone, Mail, Clock, IndianRupee } from 'lucide-react';

interface ShopOnboardingData {
  // Business Information
  businessName: string;
  businessType: string;
  registrationNumber: string;
  gstNumber: string;
  
  // Contact Information
  ownerName: string;
  email: string;
  phone: string;
  
  // Location Details
  address: string;
  city: string;
  state: string;
  pincode: string;
  landmark: string;
  
  // Public Profile
  shopDescription: string;
  services: string[];
  operatingHours: {
    open: string;
    close: string;
    days: string[];
  };
  
  // Capabilities
  printTypes: string[];
  paperSizes: string[];
  bindingOptions: string[];
  colorPrinting: boolean;
  scanningServices: boolean;
  
  // Pricing
  blackWhitePerPage: number;
  colorPerPage: number;
  minimumOrder: number;
  
  // Documents
  documents: File[];
}

const ShopOnboarding: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<ShopOnboardingData>({
    businessName: '',
    businessType: '',
    registrationNumber: '',
    gstNumber: '',
    ownerName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    landmark: '',
    shopDescription: '',
    services: [],
    operatingHours: {
      open: '09:00',
      close: '18:00',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    },
    printTypes: [],
    paperSizes: [],
    bindingOptions: [],
    colorPrinting: false,
    scanningServices: false,
    blackWhitePerPage: 1,
    colorPerPage: 5,
    minimumOrder: 10,
    documents: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const updateFormData = (updates: Partial<ShopOnboardingData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleDocumentUpload = (files: FileList | null) => {
    if (files) {
      const newFiles = Array.from(files);
      updateFormData({ documents: [...formData.documents, ...newFiles] });
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      setTimeout(() => {
        toast({
          title: "Application Submitted!",
          description: "We'll review your application and get back to you within 2-3 business days."
        });
        setIsSubmitting(false);
      }, 2000);
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Please try again later.",
        variant: "destructive"
      });
      setIsSubmitting(false);
    }
  };

  const totalSteps = 4;

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Progress Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-light text-neutral-900 mb-4">
            Join PrintEasy Network
          </h1>
          <div className="flex items-center justify-center space-x-2 mb-6">
            {[1, 2, 3, 4].map((stepNum) => (
              <React.Fragment key={stepNum}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  stepNum <= step 
                    ? 'bg-yellow-500 text-white' 
                    : 'bg-neutral-200 text-neutral-500'
                }`}>
                  {stepNum}
                </div>
                {stepNum < 4 && (
                  <div className={`w-12 h-1 ${
                    stepNum < step ? 'bg-yellow-500' : 'bg-neutral-200'
                  }`}></div>
                )}
              </React.Fragment>
            ))}
          </div>
          <p className="text-neutral-600 font-light">
            Step {step} of {totalSteps}
          </p>
        </div>

        <Card className="border border-neutral-200 shadow-soft bg-white">
          <CardContent className="p-8">
            {step === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <CardTitle className="text-2xl font-light text-neutral-900 mb-2">
                    Business Information
                  </CardTitle>
                  <CardDescription className="text-neutral-600">
                    Tell us about your printing business
                  </CardDescription>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Business Name *
                    </label>
                    <Input
                      value={formData.businessName}
                      onChange={(e) => updateFormData({ businessName: e.target.value })}
                      placeholder="Your Print Shop Name"
                      className="border-neutral-200 focus:border-yellow-500 focus:ring-yellow-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Business Type *
                    </label>
                    <Input
                      value={formData.businessType}
                      onChange={(e) => updateFormData({ businessType: e.target.value })}
                      placeholder="e.g., Print Shop, Xerox Center"
                      className="border-neutral-200 focus:border-yellow-500 focus:ring-yellow-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Registration Number
                    </label>
                    <Input
                      value={formData.registrationNumber}
                      onChange={(e) => updateFormData({ registrationNumber: e.target.value })}
                      placeholder="Business registration number"
                      className="border-neutral-200 focus:border-yellow-500 focus:ring-yellow-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      GST Number
                    </label>
                    <Input
                      value={formData.gstNumber}
                      onChange={(e) => updateFormData({ gstNumber: e.target.value })}
                      placeholder="GST registration number"
                      className="border-neutral-200 focus:border-yellow-500 focus:ring-yellow-500"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Owner Name *
                    </label>
                    <Input
                      value={formData.ownerName}
                      onChange={(e) => updateFormData({ ownerName: e.target.value })}
                      placeholder="Full name"
                      className="border-neutral-200 focus:border-yellow-500 focus:ring-yellow-500"
                    />
                  </div>
                  
                  <div className="relative">
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Email *
                    </label>
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 mt-2 w-4 h-4 text-neutral-400" />
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateFormData({ email: e.target.value })}
                      placeholder="business@email.com"
                      className="pl-10 border-neutral-200 focus:border-yellow-500 focus:ring-yellow-500"
                    />
                  </div>
                  
                  <div className="relative">
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Phone *
                    </label>
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 mt-2 w-4 h-4 text-neutral-400" />
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => updateFormData({ phone: e.target.value })}
                      placeholder="10-digit number"
                      className="pl-10 border-neutral-200 focus:border-yellow-500 focus:ring-yellow-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <CardTitle className="text-2xl font-light text-neutral-900 mb-2">
                    Location & Services
                  </CardTitle>
                  <CardDescription className="text-neutral-600">
                    Help customers find and understand your services
                  </CardDescription>
                </div>

                <div className="space-y-4">
                  <div className="relative">
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Complete Address *
                    </label>
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-neutral-400" />
                    <Textarea
                      value={formData.address}
                      onChange={(e) => updateFormData({ address: e.target.value })}
                      placeholder="Shop number, building name, street address"
                      className="pl-10 border-neutral-200 focus:border-yellow-500 focus:ring-yellow-500"
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid md:grid-cols-4 gap-4">
                    <Input
                      value={formData.city}
                      onChange={(e) => updateFormData({ city: e.target.value })}
                      placeholder="City"
                      className="border-neutral-200 focus:border-yellow-500 focus:ring-yellow-500"
                    />
                    <Input
                      value={formData.state}
                      onChange={(e) => updateFormData({ state: e.target.value })}
                      placeholder="State"
                      className="border-neutral-200 focus:border-yellow-500 focus:ring-yellow-500"
                    />
                    <Input
                      value={formData.pincode}
                      onChange={(e) => updateFormData({ pincode: e.target.value })}
                      placeholder="Pincode"
                      className="border-neutral-200 focus:border-yellow-500 focus:ring-yellow-500"
                    />
                    <Input
                      value={formData.landmark}
                      onChange={(e) => updateFormData({ landmark: e.target.value })}
                      placeholder="Landmark"
                      className="border-neutral-200 focus:border-yellow-500 focus:ring-yellow-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Shop Description *
                  </label>
                  <Textarea
                    value={formData.shopDescription}
                    onChange={(e) => updateFormData({ shopDescription: e.target.value })}
                    placeholder="Describe your shop, services, and what makes you special..."
                    className="border-neutral-200 focus:border-yellow-500 focus:ring-yellow-500"
                    rows={4}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-3">
                      Operating Hours
                    </label>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Clock className="w-4 h-4 text-neutral-400" />
                        <Input
                          type="time"
                          value={formData.operatingHours.open}
                          onChange={(e) => updateFormData({
                            operatingHours: { ...formData.operatingHours, open: e.target.value }
                          })}
                          className="flex-1 border-neutral-200 focus:border-yellow-500"
                        />
                        <span className="text-neutral-500">to</span>
                        <Input
                          type="time"
                          value={formData.operatingHours.close}
                          onChange={(e) => updateFormData({
                            operatingHours: { ...formData.operatingHours, close: e.target.value }
                          })}
                          className="flex-1 border-neutral-200 focus:border-yellow-500"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-3">
                      Pricing (₹ per page)
                    </label>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <IndianRupee className="w-4 h-4 text-neutral-400" />
                        <Input
                          type="number"
                          value={formData.blackWhitePerPage}
                          onChange={(e) => updateFormData({ blackWhitePerPage: Number(e.target.value) })}
                          placeholder="B&W price"
                          className="flex-1 border-neutral-200 focus:border-yellow-500"
                        />
                        <Input
                          type="number"
                          value={formData.colorPerPage}
                          onChange={(e) => updateFormData({ colorPerPage: Number(e.target.value) })}
                          placeholder="Color price"
                          className="flex-1 border-neutral-200 focus:border-yellow-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <CardTitle className="text-2xl font-light text-neutral-900 mb-2">
                    Upload Documents
                  </CardTitle>
                  <CardDescription className="text-neutral-600">
                    Required documents for verification
                  </CardDescription>
                </div>

                <div className="border-2 border-dashed border-neutral-300 rounded-xl p-8 text-center hover:border-yellow-500 transition-colors">
                  <Upload className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-neutral-900 mb-2">
                    Upload Documents
                  </h3>
                  <p className="text-neutral-600 mb-4">
                    Business license, GST certificate, ID proof, address proof
                  </p>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleDocumentUpload(e.target.files)}
                    className="hidden"
                    id="document-upload"
                  />
                  <label htmlFor="document-upload">
                    <Button type="button" variant="outline" className="cursor-pointer">
                      Choose Files
                    </Button>
                  </label>
                </div>

                {formData.documents.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-neutral-900">Uploaded Documents:</h4>
                    {formData.documents.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                        <span className="text-sm text-neutral-700">{file.name}</span>
                        <span className="text-xs text-neutral-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {step === 4 && (
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-yellow-100 rounded-full mx-auto flex items-center justify-center mb-6">
                  <Upload className="w-10 h-10 text-yellow-600" />
                </div>
                <CardTitle className="text-2xl font-light text-neutral-900">
                  Review & Submit
                </CardTitle>
                <CardDescription className="text-neutral-600 max-w-md mx-auto">
                  Please review all information before submitting your application. 
                  We'll review and get back to you within 2-3 business days.
                </CardDescription>
                
                <div className="bg-neutral-50 rounded-xl p-6 text-left max-w-md mx-auto">
                  <h4 className="font-medium text-neutral-900 mb-3">Application Summary:</h4>
                  <div className="space-y-2 text-sm text-neutral-600">
                    <p><strong>Business:</strong> {formData.businessName}</p>
                    <p><strong>Owner:</strong> {formData.ownerName}</p>
                    <p><strong>Location:</strong> {formData.city}, {formData.state}</p>
                    <p><strong>Documents:</strong> {formData.documents.length} files uploaded</p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between pt-8 border-t border-neutral-200">
              <Button
                variant="outline"
                onClick={() => setStep(Math.max(1, step - 1))}
                disabled={step === 1}
                className="border-neutral-300 hover:bg-neutral-50"
              >
                Previous
              </Button>
              
              {step < totalSteps ? (
                <Button
                  onClick={() => setStep(step + 1)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white"
                >
                  Next Step
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ShopOnboarding;
