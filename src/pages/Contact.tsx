
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  MessageSquare,
  Facebook,
  Twitter,
  Instagram,
  Linkedin 
} from 'lucide-react';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage
} from '@/components/ui/form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  subject: z.string().min(5, { message: "Subject must be at least 5 characters." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

type FormValues = z.infer<typeof formSchema>;

const Contact = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log(data);
    toast.success("Your message has been sent! We'll get back to you soon.");
    form.reset();
  };

  // Office locations
  const offices = [
    {
      city: "Nairobi",
      address: "KimCom Tower, 456 Ngong Road, Nairobi",
      phone: "+254 740213382",
      email: "nairobi@kimcom.co.ke",
      hours: "Mon-Fri: 8am - 6pm, Sat: 9am - 1pm"
    },
    {
      city: "Mombasa",
      address: "Coastal Business Centre, Nyali Road, Mombasa",
      phone: "+254 740213382",
      email: "mombasa@kimcom.co.ke",
      hours: "Mon-Fri: 8am - 6pm, Sat: 9am - 1pm"
    },
  ];

  // FAQs
  const faqs = [
    {
      question: "How quickly can you install a security system?",
      answer: "For standard residential installations, we typically complete the work within 1-2 business days after the initial consultation. Commercial installations may take 2-5 days depending on the complexity and size of the project."
    },
    {
      question: "Do you offer maintenance contracts?",
      answer: "Yes, we offer various maintenance packages to ensure your security system remains in optimal condition. Our standard package includes quarterly inspections, while our premium package provides monthly checks and priority support."
    },
    {
      question: "Can I monitor my security cameras remotely?",
      answer: "Absolutely! All our camera systems come with remote viewing capabilities through a mobile app or web interface. We'll set up the remote access during installation and show you how to use it."
    },
    {
      question: "What areas do you serve?",
      answer: "We currently serve Nairobi, Mombasa, and surrounding areas within a 100km radius of our offices. For locations outside these areas, please contact us for special arrangements."
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        {/* Hero section */}
        <section className="bg-gradient-to-r from-kimcom-800 to-kimcom-600 py-16 text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
            <p className="text-xl max-w-3xl">
              Have questions or need a quote? Our team is here to help. Reach out to us using any of the methods below.
            </p>
          </div>
        </section>

        {/* Contact Information */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              {/* Contact Form */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="you@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input placeholder="+254 700 123 456" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Subject</FormLabel>
                            <FormControl>
                              <Input placeholder="CCTV Installation Query" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Please provide details about your inquiry..." 
                              rows={5}
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-full bg-kimcom-600 hover:bg-kimcom-700">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Send Message
                    </Button>
                  </form>
                </Form>
              </div>

              {/* Office Information */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Offices</h2>
                <div className="space-y-8">
                  {offices.map((office, index) => (
                    <div key={index} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">{office.city} Office</h3>
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <MapPin className="h-5 w-5 text-kimcom-600 mt-1 flex-shrink-0" />
                          <span className="ml-3 text-gray-700">{office.address}</span>
                        </div>
                        <div className="flex items-start">
                          <Phone className="h-5 w-5 text-kimcom-600 mt-1 flex-shrink-0" />
                          <span className="ml-3 text-gray-700">{office.phone}</span>
                        </div>
                        <div className="flex items-start">
                          <Mail className="h-5 w-5 text-kimcom-600 mt-1 flex-shrink-0" />
                          <span className="ml-3 text-gray-700">{office.email}</span>
                        </div>
                        <div className="flex items-start">
                          <Clock className="h-5 w-5 text-kimcom-600 mt-1 flex-shrink-0" />
                          <span className="ml-3 text-gray-700">{office.hours}</span>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Social Media */}
                  <div className="mt-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Connect With Us</h3>
                    <div className="flex space-x-4">
                      <a href="#" className="bg-gray-100 hover:bg-kimcom-100 text-kimcom-600 p-3 rounded-full transition-colors">
                        <Facebook className="h-6 w-6" />
                      </a>
                      <a href="#" className="bg-gray-100 hover:bg-kimcom-100 text-kimcom-600 p-3 rounded-full transition-colors">
                        <Twitter className="h-6 w-6" />
                      </a>
                      <a href="#" className="bg-gray-100 hover:bg-kimcom-100 text-kimcom-600 p-3 rounded-full transition-colors">
                        <Instagram className="h-6 w-6" />
                      </a>
                      <a href="#" className="bg-gray-100 hover:bg-kimcom-100 text-kimcom-600 p-3 rounded-full transition-colors">
                        <Linkedin className="h-6 w-6" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Find Our Location</h2>
              <p className="text-xl text-gray-600">
                Visit us at our main office in Nairobi
              </p>
            </div>

            <div className="rounded-xl overflow-hidden shadow-md h-[400px] bg-gray-200">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15955.277215858578!2d36.78261!3d-1.300905!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f10d25fdf2f5f%3A0xe7eef9cdf1077844!2sNgong%20Rd%2C%20Nairobi!5e0!3m2!1sen!2ske!4v1712469938952!5m2!1sen!2ske"
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Nairobi Kenya Map"
                aria-label="Map showing KimCom Tower location on Ngong Road, Nairobi, Kenya"
              ></iframe>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
              <p className="text-xl text-gray-600">
                Find quick answers to common questions about our services
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="divide-y divide-gray-200">
                {faqs.map((faq, index) => (
                  <div key={index} className="py-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h3>
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
