
import React from 'react';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface ServiceCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  iconColor?: string;
  buttonText?: string;
  onClick?: () => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  title,
  description,
  icon: Icon,
  iconColor = 'text-kimcom-600',
  buttonText = 'Learn More',
  onClick
}) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover-animate overflow-hidden">
      <div className="p-6">
        <div className={`w-12 h-12 flex items-center justify-center rounded-full bg-kimcom-100 mb-4`}>
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{description}</p>
        <Button 
          variant="outline" 
          className="w-full justify-center border-kimcom-200 text-kimcom-700 hover:bg-kimcom-50 hover:text-kimcom-800"
          onClick={onClick}
        >
          {buttonText}
        </Button>
      </div>
    </div>
  );
};

export default ServiceCard;
