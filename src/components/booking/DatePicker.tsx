import React, { useState } from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
  isToday,
  isBefore,
  addDays,
  addMonths,
  subMonths,
  eachDayOfInterval
} from 'date-fns';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

interface DatePickerProps {
  selectedDate: Date | null;
  onChange: (date: Date) => void;
  error?: string;
}

const DatePicker: React.FC<DatePickerProps> = ({ selectedDate, onChange, error }) => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  
  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };
  
  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };
  
  const onDateClick = (day: Date) => {
    onChange(day);
    setIsCalendarOpen(false);
  };
  
  const toggleCalendar = () => {
    setIsCalendarOpen(!isCalendarOpen);
  };
  
  const renderHeader = () => {
    return (
      <div className="flex justify-between items-center mb-4">
        <button
          type="button"
          onClick={prevMonth}
          className="p-1 rounded-full hover:bg-gray-100"
        >
          <ChevronLeft size={20} />
        </button>
        <h2 className="font-semibold text-gray-800">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <button
          type="button"
          onClick={nextMonth}
          className="p-1 rounded-full hover:bg-gray-100"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    );
  };
  
  const renderDays = () => {
    const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    return (
      <div className="grid grid-cols-7 mb-2">
        {days.map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-gray-500"
          >
            {day}
          </div>
        ))}
      </div>
    );
  };
  
  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    
    const dateFormat = 'd';
    const rows = [];
    
    let days = [];
    let day = startDate;
    let formattedDate = '';
    
    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, dateFormat);
        const cloneDay = day;
        const isDisabled = isBefore(day, today) && !isToday(day);
        
        days.push(
          <div
            key={day.toString()}
            className={`
              relative h-10 w-10 flex items-center justify-center
              ${isDisabled ? 'text-gray-300 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-100'}
              ${!isSameMonth(day, monthStart) ? 'text-gray-400' : ''}
              ${isSameDay(day, selectedDate || new Date(-1)) ? 'bg-primary text-white rounded-full hover:bg-primary' : ''}
              ${isToday(day) && !isSameDay(day, selectedDate || new Date(-1)) ? 'border border-primary text-primary rounded-full' : ''}
            `}
            onClick={() => !isDisabled && onDateClick(cloneDay)}
          >
            {formattedDate}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div key={day.toString()} className="grid grid-cols-7 gap-1 mb-1">
          {days}
        </div>
      );
      days = [];
    }
    
    return <div className="mb-2">{rows}</div>;
  };
  
  return (
    <div className="relative">
      <div
        className="form-input flex items-center cursor-pointer"
        onClick={toggleCalendar}
      >
        <CalendarIcon size={18} className="text-gray-500 mr-2" />
        {selectedDate ? (
          <span>{format(selectedDate, 'MMMM d, yyyy')}</span>
        ) : (
          <span className="text-gray-400">Select a date</span>
        )}
      </div>
      
      {error && <p className="form-error">{error}</p>}
      
      {isCalendarOpen && (
        <div className="absolute z-10 mt-1 p-4 bg-white rounded-lg shadow-lg border border-gray-200 min-w-[320px] animate-fade-in">
          {renderHeader()}
          {renderDays()}
          {renderCells()}
        </div>
      )}
    </div>
  );
};

export default DatePicker;