import React from 'react';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Video, Wifi } from 'lucide-react';
const Hero = () => {
  const handleWhatsAppClick = () => {
    // Format phone number for WhatsApp link
    const phoneNumber = "254740133382"; // Phone number in international format
    const message = encodeURIComponent("Subject: Enquiry\n\nHello, I would like to request a quote for your services.");
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

    // Open WhatsApp in a new tab
    window.open(whatsappUrl, '_blank');
  };
  return <div className="relative bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="max-w-xl animate-fade-up">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-kimcom-100 text-kimcom-800 mb-6">
              <ShieldCheck className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Trusted Security Solution Provider</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-6">
              Secure Your Space with <span className="gradient-text">Advanced CCTV Solutions</span>
            </h1>
            <p className="text-lg leading-relaxed text-gray-600 mb-8">
              KimCom Solutions provides professional CCTV installation, maintenance, networking equipment, and security solutions for homes and businesses.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-kimcom-600 hover:bg-kimcom-700" onClick={handleWhatsAppClick}>
                Request a Quote
              </Button>
              <Button size="lg" variant="outline">
                Explore Products
              </Button>
            </div>
            
            <div className="mt-10 grid grid-cols-2 md:grid-cols-3 gap-6">
              <div className="flex items-center">
                <Video className="h-5 w-5 text-kimcom-600 mr-2" />
                <span className="text-sm font-medium">CCTV Installation</span>
              </div>
              <div className="flex items-center">
                <Wifi className="h-5 w-5 text-kimcom-600 mr-2" />
                <span className="text-sm font-medium">Network Setup</span>
              </div>
              <div className="flex items-center">
                <ShieldCheck className="h-5 w-5 text-kimcom-600 mr-2" />
                <span className="text-sm font-medium">24/7 Monitoring</span>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="bg-white p-3 rounded-xl shadow-xl overflow-hidden">
              <img src="/lovable-uploads/7e3926fc-037b-40b1-9918-f51c15515c59.png" alt="KimCom Security Products Showcase" className="w-full h-auto rounded-lg object-cover" />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-kimcom-600 text-white p-4 rounded-lg shadow-lg">
              <p className="text-xl font-bold">6+</p>
              <p className="text-sm">Years of Excellence</p>
            </div>
            <div className="absolute -top-6 -right-6 bg-white p-4 rounded-lg shadow-lg">
              <p className="text-xl font-bold text-kimcom-600">500+</p>
              <p className="text-sm text-gray-600">Projects Completed</p>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default Hero;