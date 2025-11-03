import { Target, Eye, Award, Users } from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">About iwacu 250</h1>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              Your trusted partner in finding the perfect land plot in Rwanda
            </p>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Our Story</h2>
              <div className="prose prose-lg max-w-none text-gray-700">
                <p className="mb-4">
                  iwacu 250 was founded with a simple mission: to make land ownership accessible and transparent 
                  for everyone in Rwanda. We understand that finding the right plot of land is one of the most 
                  important decisions you'll make, whether for building your dream home, starting a business, 
                  or investing in your future.
                </p>
                <p className="mb-4">
                  With years of experience in the Rwandan real estate market, we have built a reputation for 
                  integrity, professionalism, and customer satisfaction. Our team works tirelessly to source, 
                  verify, and present only the best land plots across Rwanda.
                </p>
                <p>
                  We pride ourselves on our transparent processes, verified title deeds, and commitment to 
                  helping our clients make informed decisions. Every plot in our portfolio has been carefully 
                  vetted to ensure it meets our high standards.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                  <Target className="text-primary-600" size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                <p className="text-gray-700">
                  To provide accessible, transparent, and reliable land acquisition services that empower 
                  individuals and businesses to achieve their property ownership goals in Rwanda.
                </p>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                  <Eye className="text-primary-600" size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                <p className="text-gray-700">
                  To be Rwanda's most trusted and innovative land plot marketplace, setting the standard 
                  for excellence in real estate services and customer satisfaction.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Our Core Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="text-primary-600" size={32} />
                </div>
                <h3 className="text-xl font-semibold mb-3">Integrity</h3>
                <p className="text-gray-600">
                  We operate with honesty and transparency in all our dealings, ensuring verified titles 
                  and accurate information.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="text-primary-600" size={32} />
                </div>
                <h3 className="text-xl font-semibold mb-3">Customer First</h3>
                <p className="text-gray-600">
                  Your satisfaction is our priority. We provide personalized service and support throughout 
                  your land acquisition journey.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="text-primary-600" size={32} />
                </div>
                <h3 className="text-xl font-semibold mb-3">Excellence</h3>
                <p className="text-gray-600">
                  We strive for excellence in every aspect of our service, from plot selection to 
                  customer support.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Why Choose iwacu 250?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold">
                    ✓
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Verified Properties</h4>
                  <p className="text-gray-600 text-sm">
                    All our plots come with verified title deeds and complete legal documentation.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold">
                    ✓
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Prime Locations</h4>
                  <p className="text-gray-600 text-sm">
                    Strategic locations across Rwanda with great potential for appreciation.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold">
                    ✓
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Expert Guidance</h4>
                  <p className="text-gray-600 text-sm">
                    Professional advice and support throughout the entire acquisition process.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold">
                    ✓
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Transparent Pricing</h4>
                  <p className="text-gray-600 text-sm">
                    No hidden fees. Clear, upfront pricing on all our properties.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold">
                    ✓
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Fast Response</h4>
                  <p className="text-gray-600 text-sm">
                    Quick response times via WhatsApp, email, or phone for all inquiries.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold">
                    ✓
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">After-Sales Support</h4>
                  <p className="text-gray-600 text-sm">
                    Continued support even after your purchase is complete.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-primary-600 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Find Your Perfect Plot?</h2>
            <p className="text-xl mb-8 text-primary-100 max-w-2xl mx-auto">
              Browse our available plots or contact us for personalized assistance
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/plots" className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
                Browse Plots
              </Link>
              <Link to="/contact" className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition">
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default About;
