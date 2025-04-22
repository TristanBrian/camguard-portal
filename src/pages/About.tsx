
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CTASection from '@/components/CTASection';
import { Award, CheckCircle, Shield, Users, Target, Star, Clock } from 'lucide-react';

const About = () => {
  // Our values
  const values = [
    {
      icon: CheckCircle,
      title: "Quality",
      description: "We never compromise on the quality of our products and services.",
    },
    {
      icon: Shield,
      title: "Integrity",
      description: "We operate with transparency and honesty in all our dealings.",
    },
    {
      icon: Users,
      title: "Customer Focus",
      description: "Our clients' needs and satisfaction are at the center of everything we do.",
    },
    {
      icon: Target,
      title: "Innovation",
      description: "We continuously seek innovative solutions to enhance security.",
    },
  ];

  // Milestones
  const milestones = [
    {
      year: "2019",
      title: "Company Founding",
      description: "KimCom Solutions was established in Nairobi.",
    },
    {
      year: "2021",
      title: "Product Range Expansion",
      description: "Began offering networking products and services.",
    },
    {
      year: "2024",
      title: "Online Store Launch",
      description: "Launched e-commerce platform for security products.",
    },
  ];

  // Dummy gallery images (these can later be made dynamic for admin functionality)
  const galleryImages = [
    {
      src: "/lovable-uploads/ed271c59-d2fa-4603-a4f3-a98005dc8b9c.jpg",
      alt: "Onsite installation 1"
    },
    {
      src: "/lovable-uploads/e7af41dc-f76c-4a63-ba51-f4883d3ce4aa.png",
      alt: "Onsite installation 2"
    },
    {
      src: "/lovable-uploads/adb0b881-8c8f-4542-b73c-cdcb43015dc7.png",
      alt: "Onsite installation 3"
    },
    {
      src: "/lovable-uploads/eec54a61-fec4-4ab4-86ae-af63f1331531.png",
      alt: "Onsite installation 4"
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
                  alt="KimCom Solutions Office"
                  className="rounded-xl shadow-xl"
                  src="/lovable-uploads/1852c9c3-af54-471d-91b1-ff1e106529de.jpg"
                />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
                <p className="text-gray-700 mb-4">
                  Founded in 2019, KimCom Solutions began as a small CCTV installation company with a big vision: to make high-quality security systems accessible to everyone in Kenya.
                </p>
                <p className="text-gray-700 mb-4">
                  Our founder, Paul Kim, identified a gap in the market for reliable, professionally installed security systems at fair prices. Starting with a team of just three technicians, we quickly gained a reputation for our attention to detail and exceptional customer service.
                </p>
                <p className="text-gray-700 mb-4">
                  Over the years, we've expanded our services to include networking solutions, access control systems, and a wide range of security products. Today, we're proud to serve clients across Kenya from our offices in Nairobi.
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

        {/* Gallery Section (Admin can upload and manage pictures here for branding) */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Gallery</h2>
              <p className="text-xl text-gray-600">
                Explore some of our recent on-site installations and completed projects.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {galleryImages.map((img, i) => (
                <div key={i} className="rounded-lg overflow-hidden shadow group relative">
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-kimcom-800/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <span className="text-white font-semibold">{img.alt}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-8">
              <span className="text-gray-500 text-sm">More photos coming soon...</span>
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
                <h3 className="text-4xl font-bold text-kimcom-700 mb-3">6</h3>
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
                    <div
                      key={index}
                      className={`flex flex-col md:flex-row items-start ${index % 2 === 0 ? '' : 'md:flex-row-reverse'}`}
                    >
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
