import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Home } from 'lucide-react';
import ContentCalendar from '../components/calendar/ContentCalendar';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <section className="mb-16">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Find Your Perfect <span className="text-primary">Space</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Book your ideal room with our easy-to-use platform. Check availability,
              select your preferred time, and confirm your booking in minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => navigate('/booking')}
                className="btn btn-primary flex items-center justify-center gap-2"
              >
                <Clock size={18} />
                Book Now
              </button>
              <button 
                onClick={() => navigate('/calendar')}
                className="btn btn-outline flex items-center justify-center gap-2"
              >
                <Calendar size={18} />
                View Calendar
              </button>
            </div>
          </div>
          <div className="md:w-1/2">
            <div className="card bg-gradient-to-br from-blue-50 to-white p-8 border border-blue-100">
              <h2 className="text-2xl font-semibold mb-6">Upcoming Events</h2>
              <ContentCalendar isCompact />
            </div>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-8 text-center">Our Spaces</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {roomTypes.map((room) => (
            <div key={room.id} className="card group hover:scale-[1.02] transition-all duration-300">
              <div className="h-48 rounded-lg mb-4 overflow-hidden bg-gray-200">
                <img 
                  src={room.image} 
                  alt={room.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <h3 className="text-xl font-semibold">{room.name}</h3>
              <p className="text-gray-600 mb-3">{room.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-primary">${room.price}/hour</span>
                <button 
                  onClick={() => navigate('/booking', { state: { roomTypeId: room.id } })}
                  className="btn btn-outline text-sm"
                >
                  Select
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="card bg-gradient-to-br from-blue-50 to-white p-8">
          <h2 className="text-2xl font-semibold mb-4">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <Clock className="text-primary" size={24} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Flexible Booking</h3>
              <p className="text-gray-600">Choose your preferred time slot with our custom time selection tool.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <Calendar className="text-primary" size={24} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Event Calendar</h3>
              <p className="text-gray-600">Stay updated with all upcoming events and bookings.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <Home className="text-primary" size={24} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Quality Spaces</h3>
              <p className="text-gray-600">Choose from a variety of room types to suit your needs.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// Sample data for room types
const roomTypes = [
  {
    id: 1,
    name: 'Conference Room',
    description: 'Perfect for meetings and presentations with full AV equipment.',
    price: 75,
    image: 'https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
  {
    id: 2,
    name: 'Private Office',
    description: 'Quiet space for focused work or small team collaborations.',
    price: 45,
    image: 'https://images.pexels.com/photos/3182826/pexels-photo-3182826.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
  {
    id: 3,
    name: 'Event Space',
    description: 'Large open area for events, workshops, and social gatherings.',
    price: 120,
    image: 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  }
];

export default HomePage;