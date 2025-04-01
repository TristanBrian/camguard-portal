
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CTASection from '@/components/CTASection';
import { 
  Award, 
  CheckCircle, 
  Shield, 
  Users,
  Target,
  Star,
  Clock
} from 'lucide-react';

const About = () => {
  // Our team members
  const teamMembers = [
    {
      name: "John Kimani",
      role: "Founder & CEO",
      bio: "John has over 15 years of experience in the security industry and founded KimCom Solutions to provide reliable security solutions to businesses and homeowners.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d"
    },
    {
      name: "Sarah Wanjiku",
      role: "Technical Director",
      bio: "With a background in electrical engineering, Sarah leads our technical team and ensures the highest standards in all installations.",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330"
    },
    {
      name: "David Mwangi",
      role: "Operations Manager",
      bio: "David oversees our day-to-day operations and ensures that our service delivery is timely and of the highest quality.",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e"
    },
    {
      name: "Grace Kamau",
      role: "Customer Relations",
      bio: "Grace is dedicated to ensuring our clients receive exceptional support and maintains our reputation for excellent customer service.",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956"
    },
  ];

  // Our values
  const values = [
    {
      icon: CheckCircle,
      title: "Quality",
      description: "We never compromise on the quality of our products and services."
    },
    {
      icon: Shield,
      title: "Integrity",
      description: "We operate with transparency and honesty in all our dealings."
    },
    {
      icon: Users,
      title: "Customer Focus",
      description: "Our clients' needs and satisfaction are at the center of everything we do."
    },
    {
      icon: Target,
      title: "Innovation",
      description: "We continuously seek innovative solutions to enhance security."
    },
  ];

  // Milestones
  const milestones = [
    {
      year: "2010",
      title: "Company Founding",
      description: "KimCom Solutions was established in Nairobi."
    },
    {
      year: "2013",
      title: "Expansion",
      description: "Opened second office in Mombasa to serve the coastal region."
    },
    {
      year: "2016",
      title: "ISO Certification",
      description: "Achieved ISO 9001 certification for quality management."
    },
    {
      year: "2019",
      title: "Product Range Expansion",
      description: "Began offering networking products and services."
    },
    {
      year: "2022",
      title: "Online Store Launch",
      description: "Launched e-commerce platform for security products."
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        {/* Hero section */}
        <section className="bg-gradient-to-r from-kimcom-800 to-kimcom-600 py-16 text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold mb-4">About KimCom Solutions</h1>
            <p className="text-xl max-w-3xl">
              We're a leading provider of security solutions in Kenya, committed to keeping homes and businesses safe with cutting-edge technology and exceptional service.
            </p>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <img 
                  src="https://images.unsplash.com/photo-1577962917302-cd874c4e31d2" 
                  alt="KimCom Solutions Office" 
                  className="rounded-xl shadow-xl"
                />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
                <p className="text-gray-700 mb-4">
                  Founded in 2010, KimCom Solutions began as a small CCTV installation company with a big vision: to make high-quality security systems accessible to everyone in Kenya.
                </p>
                <p className="text-gray-700 mb-4">
                  Our founder, John Kimani, identified a gap in the market for reliable, professionally installed security systems at fair prices. Starting with a team of just three technicians, we quickly gained a reputation for our attention to detail and exceptional customer service.
                </p>
                <p className="text-gray-700 mb-4">
                  Over the years, we've expanded our services to include networking solutions, access control systems, and a wide range of security products. Today, we're proud to serve clients across Kenya from our offices in Nairobi and Mombasa.
                </p>
                <p className="text-gray-700">
                  Despite our growth, we remain committed to our original mission: providing peace of mind through superior security solutions that are tailored to each client's specific needs.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
              <p className="text-xl text-gray-600">
                These core principles guide everything we do at KimCom Solutions
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <div key={index} className="bg-white p-8 rounded-xl shadow-sm text-center">
                  <div className="mx-auto w-16 h-16 bg-kimcom-100 rounded-full flex items-center justify-center mb-4">
                    <value.icon className="h-8 w-8 text-kimcom-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Team */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
              <p className="text-xl text-gray-600">
                The dedicated professionals behind KimCom Solutions
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <div key={index} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                    <p className="text-kimcom-600 font-medium mb-3">{member.role}</p>
                    <p className="text-gray-600">{member.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Achievements */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Achievements</h2>
              <p className="text-xl text-gray-600">
                Milestones in our journey to becoming Kenya's leading security solutions provider
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white p-8 rounded-xl shadow-sm text-center">
                <div className="mx-auto w-16 h-16 bg-kimcom-100 rounded-full flex items-center justify-center mb-4">
                  <Award className="h-8 w-8 text-kimcom-600" />
                </div>
                <h3 className="text-4xl font-bold text-kimcom-700 mb-3">500+</h3>
                <p className="text-lg font-medium text-gray-800">Satisfied Clients</p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-sm text-center">
                <div className="mx-auto w-16 h-16 bg-kimcom-100 rounded-full flex items-center justify-center mb-4">
                  <Star className="h-8 w-8 text-kimcom-600" />
                </div>
                <h3 className="text-4xl font-bold text-kimcom-700 mb-3">1,200+</h3>
                <p className="text-lg font-medium text-gray-800">Projects Completed</p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-sm text-center">
                <div className="mx-auto w-16 h-16 bg-kimcom-100 rounded-full flex items-center justify-center mb-4">
                  <Clock className="h-8 w-8 text-kimcom-600" />
                </div>
                <h3 className="text-4xl font-bold text-kimcom-700 mb-3">12</h3>
                <p className="text-lg font-medium text-gray-800">Years in Business</p>
              </div>
            </div>

            {/* Timeline */}
            <div className="max-w-4xl mx-auto">
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 h-full w-1 bg-kimcom-100"></div>
                
                {/* Milestones */}
                <div className="space-y-12 relative">
                  {milestones.map((milestone, index) => (
                    <div key={index} className={`flex flex-col md:flex-row items-start ${index % 2 === 0 ? '' : 'md:flex-row-reverse'}`}>
                      <div className="md:w-1/2 pl-12 md:pl-0 md:pr-12 mb-6 md:mb-0 relative">
                        <div className="absolute left-0 md:left-auto md:right-0 top-1 w-8 h-8 bg-kimcom-600 rounded-full flex items-center justify-center text-white font-bold z-10 md:translate-x-1/2">
                          {index + 1}
                        </div>
                        <div className="bg-white shadow-lg rounded-lg p-6 md:mr-6">
                          <div className="text-sm font-bold text-kimcom-600 mb-1">{milestone.year}</div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{milestone.title}</h3>
                          <p className="text-gray-600">{milestone.description}</p>
                        </div>
                      </div>
                      <div className="md:w-1/2"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <CTASection
          title="Want to join our team?"
          description="We're always looking for talented individuals who share our passion for security and technology."
          primaryButtonText="View Careers"
          secondaryButtonText="Contact Us"
          bgColor="bg-kimcom-800"
        />
      </main>

      <Footer />
    </div>
  );
};

export default About;
