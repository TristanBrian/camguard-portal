
import React, { useState } from 'react';
import { Button } from 'components/ui/button';
import { ArrowRight, Phone } from 'lucide-react';

interface CTASectionProps {
  title: string;
  description: string;
  primaryButtonText: string;
  secondaryButtonText?: string;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
  whatsappPhoneNumber?: string;
  whatsappMessage?: string;
  bgColor?: string;
}

const CTASection: React.FC<CTASectionProps> = ({
  title,
  description,
  primaryButtonText,
  secondaryButtonText,
  onPrimaryClick,
  onSecondaryClick,
  whatsappPhoneNumber,
  whatsappMessage,
  bgColor = 'bg-kimcom-900'
}) => {
  const [showCallDialog, setShowCallDialog] = useState(false);

  const handleWhatsAppClick = () => {
    if (!whatsappPhoneNumber) return;
    const phone = whatsappPhoneNumber.startsWith('0') ? `254${whatsappPhoneNumber.substring(1)}` : whatsappPhoneNumber;
    const message = encodeURIComponent(whatsappMessage || '');
    const whatsappUrl = `https://wa.me/${phone}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleCallClick = () => {
    setShowCallDialog(true);
  };

  const closeDialog = () => {
    setShowCallDialog(false);
  };

  return (
    <div className={`${bgColor} py-16`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:flex lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {title}
            </h2>
            <p className="mt-3 text-lg text-gray-300">
              {description}
            </p>
          </div>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 lg:mt-0 lg:ml-10">
            <Button 
              size="lg" 
              onClick={onPrimaryClick}
              className="bg-white text-kimcom-900 hover:bg-gray-100"
            >
              {primaryButtonText}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            {secondaryButtonText && (
              <Button 
                size="lg" 
                variant="outline" 
                onClick={whatsappPhoneNumber ? handleWhatsAppClick : handleCallClick}
                className="border-white text-white bg-white/20"
              >
                <Phone className="mr-2 h-5 w-5" />
                {secondaryButtonText}
              </Button>
            )}
          </div>
        </div>
      </div>

      {showCallDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Call Us Now</h3>
            <p className="mb-6 text-gray-700">Phone: <a href="tel:0740213382" className="text-kimcom-700 underline">0740213382</a></p>
            <div className="flex justify-end">
              <Button onClick={closeDialog} className="bg-kimcom-600 hover:bg-kimcom-700 text-white">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CTASection;
