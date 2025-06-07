import React, { useState } from 'react';
import { addMonths, subMonths, format } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Search } from 'lucide-react';
import MonthCalendar from '../components/calendar/MonthCalendar';
import EventList from '../components/calendar/EventList';
import { useBooking } from '../context/BookingContext';

const CalendarPage: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const { bookings, events } = useBooking();
  
  const goToPreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };
  
  const goToNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };
  
  const goToToday = () => {
    setCurrentDate(new Date());
  };
  
  // Combine bookings and events for the calendar display
  const calendarItems = [...bookings, ...events].filter(item => {
    return !searchTerm || 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (item.roomType && item.roomType.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <h1 className="text-3xl font-bold mb-4 md:mb-0">Events Calendar</h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input pl-10 pr-4 py-2 w-full md:w-64"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button 
              onClick={goToPreviousMonth}
              className="p-2 rounded-full hover:bg-gray-100"
              aria-label="Previous month"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={goToNextMonth}
              className="p-2 rounded-full hover:bg-gray-100"
              aria-label="Next month"
            >
              <ChevronRight size={20} />
            </button>
            <h2 className="text-xl font-semibold">
              {format(currentDate, 'MMMM yyyy')}
            </h2>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={goToToday}
              className="flex items-center space-x-1 px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <CalendarIcon size={16} />
              <span>Today</span>
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-7 md:grid-rows-[auto_1fr]">
          <div className="md:col-span-5 p-4">
            <MonthCalendar 
              currentDate={currentDate}
              events={calendarItems}
            />
          </div>
          
          <div className="md:col-span-2 border-l border-gray-200 bg-gray-50 p-4 max-h-[600px] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">
              Upcoming Events
            </h3>
            <EventList 
              events={calendarItems}
              currentDate={currentDate}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;