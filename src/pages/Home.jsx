import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Shield, TrendingUp, Sparkles } from 'lucide-react';
import { plotService } from '../services/plotService';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import PlotCard from '../components/plot/PlotCard';
import Loading from '../components/common/Loading';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { toast } from 'react-toastify';

const Home = () => {
  const [featuredPlots, setFeaturedPlots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeaturedPlots();
  }, []);

  const loadFeaturedPlots = async () => {
    try {
      const response = await plotService.getFeaturedPlots(6);
      // Handle the response based on the new API structure
      // The response could be the data directly or in a data property
      const plots = response.data || response;
      setFeaturedPlots(Array.isArray(plots) ? plots : []);
    } catch (error) {
      console.error('Failed to load featured plots', error);
      toast.error('Failed to load featured plots');
      // Set empty array to prevent undefined errors
      setFeaturedPlots([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white py-24 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Sparkles size={16} className="text-yellow-300" />
              <span className="text-sm font-medium">Premium Land Plots in Rwanda</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Find Your Perfect
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
                Land , Plot and House
              </span>
            </h1>
            
            <p className="text-xl mb-10 text-primary-100 max-w-2xl mx-auto leading-relaxed">
              Discover premium residential, commercial, and agricultural land plots across Rwanda. 
              Your dream property awaits with Iwacu 250.
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-primary-600 hover:bg-gray-100 shadow-xl">
                <Link to="/plots">
                  Browse Plots
                  <ArrowRight size={20} className="ml-2" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-primary-600">
                <Link to="/contact">
                  Contact Us
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-primary-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000" />
      </section>

      {/* Featured Plots */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Plots</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our handpicked selection of premium land plots available for immediate purchase
            </p>
          </div>

          {loading ? (
            <Loading />
          ) : featuredPlots.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {featuredPlots.map((plot) => (
                  <PlotCard key={plot.id} plot={plot} />
                ))}
              </div>
              <div className="text-center">
                <Button asChild size="lg">
                  <Link to="/plots">
                    View All Plots
                    <ArrowRight size={20} className="ml-2" />
                  </Link>
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No plots available at the moment</p>
              <Link to="/contact" className="btn-primary">
                Contact Us for Updates
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Iwacu 250?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We provide exceptional service and premium land plots to help you make the best investment
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card className="text-center border-2 hover:border-primary/50 hover:shadow-xl transition-all duration-300 group">
              <CardContent className="pt-8 pb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <MapPin className="text-white" size={36} />
                </div>
                <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">Prime Locations</h3>
                <p className="text-muted-foreground leading-relaxed">
                  All our plots are strategically located in developing areas with great potential for appreciation
                </p>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="text-center border-2 hover:border-primary/50 hover:shadow-xl transition-all duration-300 group">
              <CardContent className="pt-8 pb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Shield className="text-white" size={36} />
                </div>
                <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">Verified Titles</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Every plot comes with verified title deeds and complete legal documentation for your peace of mind
                </p>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="text-center border-2 hover:border-primary/50 hover:shadow-xl transition-all duration-300 group">
              <CardContent className="pt-8 pb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <TrendingUp className="text-white" size={36} />
                </div>
                <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">Great Investment</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Invest in Rwanda's growing real estate market with plots that offer excellent returns
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 text-white py-20 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Find Your Perfect Plot?</h2>
          <p className="text-xl mb-10 text-primary-100 max-w-2xl mx-auto leading-relaxed">
            Browse our available plots or contact us for personalized assistance in finding the ideal land for your needs
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-primary-600 hover:bg-gray-100 shadow-xl">
              <Link to="/plots">
                Browse All Plots
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-primary-600">
              <Link to="/contact">
                Get in Touch
              </Link>
            </Button>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-10 left-20 w-64 h-64 bg-primary-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
        <div className="absolute bottom-10 right-20 w-64 h-64 bg-primary-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
      </section>

      <Footer />
    </div>
  );
};

export default Home;
