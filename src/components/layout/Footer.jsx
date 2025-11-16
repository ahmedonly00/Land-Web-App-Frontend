import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';
import { useState, useEffect } from 'react';
import { settingsService } from '../../services/settingsService';

const Footer = () => {
  const [settings, setSettings] = useState({});

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await settingsService.getPublicSettings();
      setSettings(response.data);
    } catch (error) {
      console.error('Failed to load settings', error);
    }
  };

  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold mb-4">Iwacu 250</h3>
            <p className="text-gray-400 text-sm mb-2">Multipurpose 250</p>
            <p className="text-gray-400 text-sm">
              Your trusted partner for premium land plots in Rwanda.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/plots" className="text-gray-400 hover:text-white transition text-sm">
                  Browse Land | House
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-gray-400 text-sm">
                <Phone size={16} />
                {settings.company_phone || '+250780314239'}
              </li>
              <li className="flex items-center gap-2 text-gray-400 text-sm">
                <Mail size={16} />
                {settings.company_email || 'karimkanakuze2050@gmail.com'}
              </li>
              <li className="flex items-center gap-2 text-gray-400 text-sm">
                <MapPin size={16} />
                {settings.company_address || 'Kigali, Rwanda'}
              </li>
            </ul>
          </div>

          {/* Business Hours */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Business Hours</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>Monday - Friday: 8AM - 6PM</li>
              <li>Saturday: 9AM - 4PM</li>
              <li>Sunday: Closed</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Iwacu 250. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
