import React from 'react';
import { format, isSameMonth, isSameDay, isToday, isAfter, isBefore, parseISO } from 'date-fns';
import { Calendar, Clock, User, MapPin } from 'lucide-react';
import { CalendarItem } from '../../context/BookingContext';

interface EventListProps {
  events: CalendarItem[];
  currentDate: Date;
}

const EventList: React.FC<EventListProps> = ({ events, currentDate }) => {
  // Sort events by date, then by start time
  const sortedEvents = [...events].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    
    if (dateA.getTime() !== dateB.getTime()) {
      return dateA.getTime() - dateB.getTime();
    }
    
    // If dates are the same, sort by start time
    const startTimeA = a.startTime.split(':').map(Number);
    const startTimeB = b.startTime.split(':').map(Number);
    
    if (startTimeA[0] !== startTimeB[0]) {
      return startTimeA[0] - startTimeB[0];
    }
    
    return startTimeA[1] - startTimeB[1];
  });
  
  // Group events by date
  const groupedEvents: Record<string, CalendarItem[]> = {};
  
  sortedEvents.forEach(event => {
    const dateKey = format(new Date(event.date), 'yyyy-MM-dd');
    
    if (!groupedEvents[dateKey]) {
      groupedEvents[dateKey] = [];
    }
    
    groupedEvents[dateKey].push(event);
  });
  
  // Get dates in the current month
  const dateKeys = Object.keys(groupedEvents).filter(dateKey => {
    const date = parseISO(dateKey);
    return isAfter(date, new Date()) || isToday(date);
  });
  
  if (dateKeys.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Calendar className="mx-auto mb-2 text-gray-400\" size={32} />
        <p>No upcoming events</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {dateKeys.map(dateKey => {
        const date = parseISO(dateKey);
        const isCurrentDay = isToday(date);
        const eventsForDay = groupedEvents[dateKey];
        
        return (
          <div key={dateKey} className="space-y-2">
            <div className={`
              flex items-center space-x-2 py-1 border-b
              ${isCurrentDay ? 'border-primary text-primary' : 'border-gray-200 text-gray-700'}
            `}>
              <Calendar size={16} />
              <span className="font-medium">
                {isCurrentDay ? 'Today' : format(date, 'EEEE, MMMM d')}
              </span>
            </div>
            
            <div className="space-y-2">
              {eventsForDay.map((event, index) => (
                <div 
                  key={index}
                  className={`
                    p-3 rounded-lg border-l-4
                    ${event.type === 'booking' 
                      ? 'bg-blue-50 border-blue-500' 
                      : 'bg-amber-50 border-amber-500'}
                  `}
                >
                  <div className="font-medium mb-1">{event.title}</div>
                  <div className="grid grid-cols-[16px_1fr] gap-x-2 gap-y-1 text-sm text-gray-600">
                    <Clock size={14} className="mt-0.5" />
                    <span>{event.startTime} - {event.endTime}</span>
                    
                    {event.roomType && (
                      <>
                        <MapPin size={14} className="mt-0.5" />
                        <span>{event.roomType}</span>
                      </>
                    )}
                    
                    {event.contact && (
                      <>
                        <User size={14} className="mt-0.5" />
                        <span>{event.contact}</span>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default EventList;