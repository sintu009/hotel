import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface TimeSlotPickerProps {
  date: Date;
  roomTypeId: number;
  startTime: string;
  endTime: string;
  onStartTimeChange: (time: string) => void;
  onEndTimeChange: (time: string) => void;
  startTimeError?: string;
  endTimeError?: string;
}

const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({
  date,
  roomTypeId,
  startTime,
  endTime,
  onStartTimeChange,
  onEndTimeChange,
  startTimeError,
  endTimeError
}) => {
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);
  const [availableEndTimes, setAvailableEndTimes] = useState<string[]>([]);
  
  // Generate time slots from 8:00 AM to 8:00 PM
  useEffect(() => {
    const slots = [];
    for (let hour = 8; hour <= 20; hour++) {
      const hourFormatted = hour.toString().padStart(2, '0');
      slots.push(`${hourFormatted}:00`);
      slots.push(`${hourFormatted}:30`);
    }
    setAvailableTimeSlots(slots);
  }, []);
  
  // Update available end times based on selected start time
  useEffect(() => {
    if (!startTime) {
      setAvailableEndTimes([]);
      return;
    }
    
    const startIndex = availableTimeSlots.indexOf(startTime);
    if (startIndex === -1 || startIndex === availableTimeSlots.length - 1) {
      setAvailableEndTimes([]);
      return;
    }
    
    // Only show end times that are after the start time
    setAvailableEndTimes(availableTimeSlots.slice(startIndex + 1));
    
    // Reset end time if it's no longer valid
    if (endTime && availableTimeSlots.indexOf(endTime) <= startIndex) {
      onEndTimeChange('');
    }
  }, [startTime, availableTimeSlots, endTime, onEndTimeChange]);
  
  // Format time for display (24h to 12h)
  const formatTime = (time: string) => {
    if (!time) return '';
    
    const [hourStr, minute] = time.split(':');
    const hour = parseInt(hourStr, 10);
    
    return `${hour % 12 === 0 ? 12 : hour % 12}:${minute} ${hour >= 12 ? 'PM' : 'AM'}`;
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="form-label mb-2">Start Time</label>
        <div className="relative">
          <select
            value={startTime}
            onChange={(e) => onStartTimeChange(e.target.value)}
            className="form-input pl-10"
          >
            <option value="">Select start time</option>
            {availableTimeSlots.map((time) => (
              <option key={`start-${time}`} value={time}>
                {formatTime(time)}
              </option>
            ))}
          </select>
          <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
        </div>
        {startTimeError && <p className="form-error">{startTimeError}</p>}
      </div>
      
      <div>
        <label className="form-label mb-2">End Time</label>
        <div className="relative">
          <select
            value={endTime}
            onChange={(e) => onEndTimeChange(e.target.value)}
            className="form-input pl-10"
            disabled={!startTime}
          >
            <option value="">Select end time</option>
            {availableEndTimes.map((time) => (
              <option key={`end-${time}`} value={time}>
                {formatTime(time)}
              </option>
            ))}
          </select>
          <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
        </div>
        {endTimeError && <p className="form-error">{endTimeError}</p>}
      </div>
      
      {startTime && endTime && (
        <div className="col-span-1 md:col-span-2 p-3 bg-blue-50 rounded-lg border border-blue-100 text-sm">
          <p className="font-medium text-blue-800 mb-1">Booking Duration</p>
          <p className="text-blue-700">
            {calculateDuration(startTime, endTime)} ({formatTime(startTime)} - {formatTime(endTime)})
          </p>
        </div>
      )}
    </div>
  );
};

// Helper function to calculate duration between two times
const calculateDuration = (startTime: string, endTime: string) => {
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);
  
  const startMinutes = startHour * 60 + startMinute;
  const endMinutes = endHour * 60 + endMinute;
  const durationMinutes = endMinutes - startMinutes;
  
  const hours = Math.floor(durationMinutes / 60);
  const minutes = durationMinutes % 60;
  
  if (hours === 0) {
    return `${minutes} minutes`;
  } else if (minutes === 0) {
    return `${hours} hour${hours > 1 ? 's' : ''}`;
  } else {
    return `${hours} hour${hours > 1 ? 's' : ''} and ${minutes} minutes`;
  }
};

export default TimeSlotPicker;