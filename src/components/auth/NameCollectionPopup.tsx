
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';

interface NameCollectionPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const NameCollectionPopup: React.FC<NameCollectionPopupProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { updateProfile } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsLoading(true);
    try {
      await updateProfile(name.trim());
      onClose();
    } catch (error) {
      console.error('Failed to update name:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Complete Your Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              required
            />
          </div>
          <Button type="submit" disabled={isLoading || !name.trim()} className="w-full">
            {isLoading ? 'Saving...' : 'Save Name'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NameCollectionPopup;
