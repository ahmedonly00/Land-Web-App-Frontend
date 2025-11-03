import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { settingsService } from '../../services/settingsService';
import WhatsAppButton from '../common/WhatsAppButton';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
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
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex flex-col">
            <div className="text-2xl font-bold text-primary-600">
              iwacu 250
            </div>
            <div className="text-xs text-gray-600">Multipurpose 250</div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-primary-600 transition font-medium">
              Home
            </Link>
            <Link to="/plots" className="text-gray-700 hover:text-primary-600 transition font-medium">
              Plots
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-primary-600 transition font-medium">
              About
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-primary-600 transition font-medium">
              Contact
            </Link>
            {settings.whatsapp_number && (
              <WhatsAppButton phoneNumber={settings.whatsapp_number} />
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <nav className="md:hidden pb-4 space-y-2">
            <Link 
              to="/" 
              className="block py-2 text-gray-700 hover:text-primary-600"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/plots" 
              className="block py-2 text-gray-700 hover:text-primary-600"
              onClick={() => setIsOpen(false)}
            >
              Plots
            </Link>
            <Link 
              to="/about" 
              className="block py-2 text-gray-700 hover:text-primary-600"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className="block py-2 text-gray-700 hover:text-primary-600"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>
            {settings.whatsapp_number && (
              <div className="pt-2">
                <WhatsAppButton phoneNumber={settings.whatsapp_number} />
              </div>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
