import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Calendar, Clock } from 'lucide-react';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white shadow-md py-2' 
          : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <div className="bg-primary p-2 rounded-lg text-white mr-2">
              <Calendar size={24} />
            </div>
            <span className="font-bold text-xl">SpaceBook</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <NavLink to="/" isActive={location.pathname === '/'}>
              Home
            </NavLink>
            <NavLink to="/calendar" isActive={location.pathname === '/calendar'}>
              Calendar
            </NavLink>
            <Link 
              to="/booking" 
              className="btn btn-primary flex items-center gap-2"
            >
              <Clock size={18} />
              <span>Book Now</span>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 focus:outline-none"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white absolute top-full left-0 w-full shadow-md animate-slide-up">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col space-y-4">
              <NavLink to="/" isActive={location.pathname === '/'}>
                Home
              </NavLink>
              <NavLink to="/calendar" isActive={location.pathname === '/calendar'}>
                Calendar
              </NavLink>
              <Link 
                to="/booking" 
                className="btn btn-primary w-full flex items-center justify-center gap-2"
              >
                <Clock size={18} />
                <span>Book Now</span>
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

interface NavLinkProps {
  to: string;
  isActive: boolean;
  children: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ to, isActive, children }) => {
  return (
    <Link 
      to={to} 
      className={`transition-colors duration-200 ${
        isActive 
          ? 'text-primary font-medium' 
          : 'text-gray-700 hover:text-primary'
      }`}
    >
      {children}
    </Link>
  );
};

export default Header;