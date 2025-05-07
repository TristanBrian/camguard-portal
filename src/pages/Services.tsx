import React from 'react';
import ServiceCard from '@/components/ServiceCard';
import CTASection from '@/components/CTASection';
import { Button } from '@/components/ui/button';
import { 
  Camera, 
  Video, 
  Settings, 
  Wifi, 
  ShieldCheck, 
  Server, 
  Network, 
  Hammer,
  Wrench,
  ArrowRight,
  Clock,
  Users,
  Building2,
  Home
} from 'lucide-react';

const Services = () => {
  // Service category data
  const serviceCategories = [
    {
      id: "cat1",
      title: "Residential Services",
      description: "Comprehensive security solutions for your home",
      icon: Home,
    },
    {
      id: "cat2",
      title: "Commercial Services",
      description: "Enterprise-grade security for businesses of all sizes",
      icon: Building2,
    },
    {
      id: "cat3",
      title: "Maintenance & Support",
      description: "Ongoing support to keep your systems running optimally",
      icon: Wrench,
    },
    {
      id: "cat4",
      title: "Networking Solutions",
      description: "Complete networking setup and optimization services",
      icon: Network,
    },
  ];

  // Detailed services data
  const detailedServices = [
    {
      id: "s1",
      title: "CCTV Installation",
      description: "Professional installation of security camera systems for homes and businesses.",
      icon: Camera,
      category: "installation",
      features: [
        "Site assessment and planning",
        "Camera placement optimization",
        "Wiring and connectivity setup",
        "Software configuration",
        "Mobile access setup"
      ],
      price: "Starting at KSh 8,500"
    },
    {
      id: "s2",
      title: "System Maintenance",
      description: "Regular maintenance and repairs to keep your security systems running optimally.",
      icon: Settings,
      category: "maintenance",
      features: [
        "Quarterly system inspection",
        "Camera cleaning and adjustment",
        "Software updates",
        "Troubleshooting",
        "Parts replacement"
      ],
      price: "KSh 3,500 per visit"
    },
    {
      id: "s3",
      title: "Network Setup",
      description: "Complete networking solutions including WiFi optimization and router configuration.",
      icon: Wifi,
      category: "networking",
      features: [
        "Network design and planning",
        "Router and switch installation",
        "WiFi coverage optimization",
        "Network security setup",
        "Remote access configuration"
      ],
      price: "Starting at KSh 12,000"
    },
    {
      id: "s4",
      title: "Security Audits",
      description: "Comprehensive security assessments to identify and address vulnerabilities.",
      icon: ShieldCheck,
      category: "consultation",
      features: [
        "Physical security assessment",
        "Network vulnerability testing",
        "Camera placement review",
        "Access control evaluation",
        "Detailed recommendation report"
      ],
      price: "KSh 15,000 per audit"
    },
    {
      id: "s5",
      title: "Video Surveillance",
      description: "24/7 remote video monitoring services for homes and businesses.",
      icon: Video,
      category: "monitoring",
      features: [
        "Real-time video monitoring",
        "Instant alert notifications",
        "Suspicious activity detection",
        "Monthly incident reports",
        "Video evidence preservation"
      ],
      price: "KSh 5,000 per month"
    },
    {
      id: "s6",
      title: "Server Deployment",
      description: "Setup and configuration of dedicated servers for large surveillance systems.",
      icon: Server,
      category: "installation",
      features: [
        "Server hardware installation",
        "RAID configuration",
        "Operating system setup",
        "Backup system implementation",
        "Remote management setup"
      ],
      price: "Starting at KSh 45,000"
    },
    {
      id: "s7",
      title: "Emergency Repairs",
      description: "Quick response service for urgent security system issues.",
      icon: Hammer,
      category: "maintenance",
      features: [
        "24/7 emergency support",
        "Priority response time",
        "On-site troubleshooting",
        "Temporary system provision",
        "Same-day parts replacement"
      ],
      price: "KSh 7,500 per visit"
    },
    {
      id: "s8",
      title: "Maintenance Contracts",
      description: "Annual service plans to ensure optimal system performance.",
      icon: Clock,
      category: "maintenance",
      features: [
        "Scheduled maintenance visits",
        "Priority emergency support",
        "Free software updates",
        "Discounted parts replacement",
        "Annual system audit"
      ],
      price: "KSh 25,000 per year"
    },
  ];

  // Process steps
  const processSteps = [
    {
      number: 1,
      title: "Consultation",
      description: "We discuss your security needs and requirements."
    },
    {
      number: 2,
      title: "Site Survey",
      description: "Our technicians evaluate your property for optimal system design."
    },
    {
      number: 3,
      title: "Proposal",
      description: "We provide a detailed quote with recommended solutions."
    },
    {
      number: 4,
      title: "Installation",
      description: "Our professionals install and configure your system."
    },
    {
      number: 5,
      title: "Training",
      description: "We train you on how to use and maintain your new system."
    },
  ];

  const handleServiceClick = (id: string) => {
    // Format phone number for WhatsApp link
    const phoneNumber = "0740213382";
    const formattedPhone = phoneNumber.startsWith('0') ? `254${phoneNumber.substring(1)}` : phoneNumber;
    const message = encodeURIComponent(`I'm interested in your ${id} service. Please provide more information.`);
    const whatsappUrl = `https://wa.me/${formattedPhone}?text=${message}`;
    
    // Open WhatsApp in a new tab
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        {/* Hero section */}
        <section className="bg-gradient-to-r from-kimcom-800 to-kimcom-600 py-16 text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold mb-4">Our Security Services</h1>
            <p className="text-xl max-w-3xl">
              KimCom Solutions offers comprehensive security services for residential and commercial properties. From installation to maintenance, we provide end-to-end solutions tailored to your needs.
            </p>
          </div>
        </section>

        {/* Service Categories */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">Services We Offer</h2>
              <p className="text-xl text-gray-600">
                Explore our range of security services designed to protect what matters most to you.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {serviceCategories.map((category) => (
                <ServiceCard
                  key={category.id}
                  title={category.title}
                  description={category.description}
                  icon={category.icon}
                  buttonText="Contact via WhatsApp"
                  onClick={() => handleServiceClick(category.title)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* How it works / Process */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">Our Service Process</h2>
              <p className="text-xl text-gray-600">
                Simple, transparent, and efficient - here's how we work with you from start to finish.
              </p>
            </div>

            <div className="relative">
              {/* Timeline line */}
              <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-1 bg-kimcom-100 h-full"></div>
              
              {/* Process steps */}
              <div className="space-y-12 relative">
                {processSteps.map((step, index) => (
                  <div key={index} className={`flex flex-col md:flex-row items-center ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                    <div className="md:w-1/2 flex justify-center md:justify-end md:pr-12 mb-6 md:mb-0">
                      <div className="bg-white shadow-lg rounded-lg p-6 max-w-md">
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">{step.title}</h3>
                        <p className="text-gray-600">{step.description}</p>
                      </div>
                    </div>
                    <div className="flex-shrink-0 bg-kimcom-600 text-white w-12 h-12 rounded-full flex items-center justify-center z-10 my-4 md:my-0">
                      {step.number}
                    </div>
                    <div className="md:w-1/2 md:pl-12"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Detailed Services */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">Our Detailed Services</h2>
              <p className="text-xl text-gray-600">
                Explore our comprehensive range of security services
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {detailedServices.map((service) => (
                <div key={service.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-kimcom-100 mb-4">
                      <service.icon className="h-6 w-6 text-kimcom-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{service.title}</h3>
                    <p className="text-gray-600 mb-4">{service.description}</p>
                    <div className="mb-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-kimcom-100 text-kimcom-800">
                        {service.category}
                      </span>
                    </div>
                    <div className="space-y-2 mb-6">
                      {service.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start">
                          <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-kimcom-500" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <p className="ml-2 text-gray-700">{feature}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mb-4 font-semibold text-kimcom-700">{service.price}</div>
                    <Button 
                      variant="outline" 
                      className="w-full justify-center border-kimcom-200 text-kimcom-700 hover:bg-kimcom-50 hover:text-kimcom-800"
                      onClick={() => handleServiceClick(service.title)}
                    >
                      Request Service
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Client types */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">Who We Serve</h2>
              <p className="text-xl text-gray-600">
                Our security solutions are tailored for various types of clients
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                <div className="mx-auto w-16 h-16 bg-kimcom-100 rounded-full flex items-center justify-center mb-4">
                  <Home className="h-8 w-8 text-kimcom-600" />
                </div>
                <h3 className="text-xl font-bold mb-3">Homeowners</h3>
                <p className="text-gray-600 mb-6">
                  Protect your family and property with our residential security solutions designed for homes of all sizes.
                </p>
                <Button 
                  variant="outline" 
                  className="border-kimcom-200 text-kimcom-700 hover:bg-kimcom-50"
                >
                  Residential Solutions
                </Button>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                <div className="mx-auto w-16 h-16 bg-kimcom-100 rounded-full flex items-center justify-center mb-4">
                  <Building2 className="h-8 w-8 text-kimcom-600" />
                </div>
                <h3 className="text-xl font-bold mb-3">Businesses</h3>
                <p className="text-gray-600 mb-6">
                  Secure your business assets and create a safe environment for employees and customers with our commercial solutions.
                </p>
                <Button 
                  variant="outline" 
                  className="border-kimcom-200 text-kimcom-700 hover:bg-kimcom-50"
                >
                  Business Solutions
                </Button>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                <div className="mx-auto w-16 h-16 bg-kimcom-100 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-kimcom-600" />
                </div>
                <h3 className="text-xl font-bold mb-3">Institutions</h3>
                <p className="text-gray-600 mb-6">
                  Specialized security solutions for schools, hospitals, government facilities, and other institutions.
                </p>
                <Button 
                  variant="outline" 
                  className="border-kimcom-200 text-kimcom-700 hover:bg-kimcom-50"
                >
                  Institutional Solutions
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <CTASection
          title="Ready to enhance your security?"
          description="Contact us today for a free consultation and quote on your security system needs."
          primaryButtonText="Request a Quote"
          secondaryButtonText="Call Us Now"
          bgColor="bg-kimcom-800"
        />
      </main>
    </div>
  );
};

export default Services;
