import React from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
  isToday,
  eachDayOfInterval,
  addDays
} from 'date-fns';
import { useBooking, CalendarItem } from '../../context/BookingContext';

interface MonthCalendarProps {
  currentDate: Date;
  events: CalendarItem[];
}

const MonthCalendar: React.FC<MonthCalendarProps> = ({ currentDate, events }) => {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(endOfMonth(monthEnd));
  
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  const getEventsForDay = (day: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return isSameDay(eventDate, day);
    });
  };
  
  // Get all the days in the calendar view (6 weeks)
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  
  // Group the days into weeks
  const weeks = [];
  let week = [];
  
  for (let i = 0; i < calendarDays.length; i++) {
    week.push(calendarDays[i]);
    
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }

  return (
    <div className="month-calendar">
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(day => (
          <div key={day} className="text-center font-medium text-gray-500 text-xs py-2">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {weeks.flatMap((week, weekIndex) => 
          week.map((day, dayIndex) => (
            <div 
              key={`${weekIndex}-${dayIndex}`}
              className={`
                min-h-[100px] p-1 border border-gray-100 
                ${!isSameMonth(day, currentDate) ? 'bg-gray-50' : 'bg-white'}
              `}
            >
              <div className={`
                flex justify-center items-center w-6 h-6 mb-1 rounded-full
                ${isToday(day) ? 'bg-primary text-white' : ''}
                ${!isSameMonth(day, currentDate) ? 'text-gray-400' : ''}
                text-sm font-medium
              `}>
                {format(day, 'd')}
              </div>
              
              <div className="space-y-1 overflow-y-auto max-h-[80px]">
                {getEventsForDay(day).map((event, index) => (
                  <div 
                    key={index}
                    className={`
                      text-xs p-1 rounded
                      ${event.type === 'booking' ? 'bg-blue-100 text-blue-800' : 'bg-accent text-amber-800'}
                    `}
                  >
                    <div className="font-medium truncate">{event.title}</div>
                    <div className="text-[10px]">{event.startTime} - {event.endTime}</div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MonthCalendar;