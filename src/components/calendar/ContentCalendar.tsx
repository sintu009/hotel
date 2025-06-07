import React, { useState } from 'react';
import { addMonths, subMonths, format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';

interface ContentCalendarProps {
  isCompact?: boolean;
}

const ContentCalendar: React.FC<ContentCalendarProps> = ({ isCompact = false }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { bookings, events } = useBooking();
  
  const calendarItems = [...bookings, ...events];
  
  const goToPreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };
  
  const goToNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };
  
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const getEventsForDay = (day: Date) => {
    return calendarItems.filter(item => {
      const itemDate = new Date(item.date);
      return isSameDay(itemDate, day);
    });
  };

  return (
    <div className={`calendar ${isCompact ? 'text-sm' : ''}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">
          {format(currentDate, 'MMMM yyyy')}
        </h3>
        <div className="flex space-x-1">
          <button 
            onClick={goToPreviousMonth}
            className="p-1 rounded hover:bg-gray-100"
            aria-label="Previous month"
          >
            <ChevronLeft size={isCompact ? 16 : 20} />
          </button>
          <button 
            onClick={goToNextMonth}
            className="p-1 rounded hover:bg-gray-100"
            aria-label="Next month"
          >
            <ChevronRight size={isCompact ? 16 : 20} />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(day => (
          <div key={day} className="text-center font-medium text-gray-500 text-xs py-1">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {monthDays.map(day => {
          const dayEvents = getEventsForDay(day);
          const hasEvents = dayEvents.length > 0;
          
          return (
            <div 
              key={day.toString()} 
              className={`
                relative aspect-square flex flex-col justify-center items-center 
                rounded-full cursor-pointer transition-colors hover:bg-gray-100
                ${isToday(day) ? 'bg-blue-50 border border-blue-200' : ''}
                ${!isSameMonth(day, currentDate) ? 'text-gray-300' : ''}
              `}
            >
              <span className={`text-${isCompact ? 'xs' : 'sm'}`}>
                {format(day, 'd')}
              </span>
              
              {hasEvents && (
                <div className="absolute bottom-1 flex justify-center space-x-0.5">
                  {dayEvents.slice(0, 3).map((_, index) => (
                    <div 
                      key={index}
                      className="w-1 h-1 rounded-full bg-primary"
                    ></div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {isCompact && (
        <div className="mt-4">
          <h4 className="font-medium text-sm mb-2">Upcoming Events</h4>
          <div className="space-y-2">
            {calendarItems
              .filter(item => new Date(item.date) >= new Date())
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
              .slice(0, 3)
              .map((item, index) => (
                <div key={index} className="flex items-start p-2 bg-gray-50 rounded-lg">
                  <div className="bg-primary/10 p-1 rounded mr-2">
                    <Clock size={14} className="text-primary" />
                  </div>
                  <div>
                    <div className="font-medium text-xs">{item.title}</div>
                    <div className="text-xs text-gray-500">
                      {format(new Date(item.date), 'MMM d')} • {item.startTime} - {item.endTime}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentCalendar;