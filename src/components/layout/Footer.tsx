import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <Link to="/" className="flex items-center mb-4">
              <div className="bg-primary p-2 rounded-lg text-white mr-2">
                <Calendar size={24} />
              </div>
              <span className="font-bold text-xl">SpaceBook</span>
            </Link>
            <p className="text-gray-400 mb-4">
              Find and book your perfect space for meetings, events, and more.
            </p>
            <div className="flex space-x-4">
              <SocialIcon icon="facebook" />
              <SocialIcon icon="twitter" />
              <SocialIcon icon="instagram" />
              <SocialIcon icon="linkedin" />
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/booking" className="text-gray-400 hover:text-white transition-colors">
                  Book Now
                </Link>
              </li>
              <li>
                <Link to="/calendar" className="text-gray-400 hover:text-white transition-colors">
                  Calendar
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Room Types</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/booking" className="text-gray-400 hover:text-white transition-colors">
                  Conference Rooms
                </Link>
              </li>
              <li>
                <Link to="/booking" className="text-gray-400 hover:text-white transition-colors">
                  Private Offices
                </Link>
              </li>
              <li>
                <Link to="/booking" className="text-gray-400 hover:text-white transition-colors">
                  Event Spaces
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="text-gray-400 mr-2 mt-1 flex-shrink-0" size={18} />
                <span className="text-gray-400">
                  123 Booking Street, Suite 101<br />
                  San Francisco, CA 94107
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="text-gray-400 mr-2 flex-shrink-0" size={18} />
                <a href="tel:+14155552671" className="text-gray-400 hover:text-white transition-colors">
                  (415) 555-2671
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="text-gray-400 mr-2 flex-shrink-0" size={18} />
                <a href="mailto:info@spacebook.com" className="text-gray-400 hover:text-white transition-colors">
                  info@spacebook.com
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} SpaceBook. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link to="/privacy" className="text-gray-500 text-sm hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-gray-500 text-sm hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

interface SocialIconProps {
  icon: string;
}

const SocialIcon: React.FC<SocialIconProps> = ({ icon }) => {
  return (
    <a 
      href={`https://${icon}.com`} 
      target="_blank" 
      rel="noopener noreferrer"
      className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary transition-colors"
      aria-label={`Follow us on ${icon}`}
    >
      <span className="sr-only">Follow us on {icon}</span>
      <div className="w-4 h-4 bg-white mask-icon-${icon}"></div>
    </a>
  );
};

export default Footer;