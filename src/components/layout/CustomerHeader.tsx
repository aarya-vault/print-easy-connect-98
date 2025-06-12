
import React from 'react';
import UniversalHeader from './UniversalHeader';

interface CustomerHeaderProps {
  title?: string;
  showBackButton?: boolean;
  backTo?: string;
}

const CustomerHeader: React.FC<CustomerHeaderProps> = ({
  title = "Dashboard",
  showBackButton = false,
  backTo
}) => {
  return (
    <UniversalHeader 
      title={title}
      showBackButton={showBackButton}
      backTo={backTo}
      showHomeButton={true}
    />
  );
};

export default CustomerHeader;
