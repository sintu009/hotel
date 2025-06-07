import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

export interface CalendarItem {
  id: number;
  title: string;
  date: string; // ISO date string
  startTime: string; // 24-hour format
  endTime: string; // 24-hour format
  type: 'booking' | 'event';
  roomType?: string;
  contact?: string;
}

interface BookingFormData {
  name: string;
  contactNumber: string;
  date: Date | null;
  roomTypeId: number;
  startTime: string;
  endTime: string;
}

interface BookingContextType {
  bookings: CalendarItem[];
  events: CalendarItem[];
  createBooking: (data: BookingFormData) => Promise<void>;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};

interface BookingProviderProps {
  children: ReactNode;
}

// Create axios instance with auth header
const api = axios.create({
  baseURL: 'http://localhost:5000/api'
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const BookingProvider: React.FC<BookingProviderProps> = ({ children }) => {
  const [bookings, setBookings] = useState<CalendarItem[]>([]);
  const [events, setEvents] = useState<CalendarItem[]>([]);
  
  // Load data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookingsRes, eventsRes] = await Promise.all([
          api.get('/bookings'),
          api.get('/events')
        ]);
        setBookings(bookingsRes.data);
        setEvents(eventsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        // If unauthorized, redirect to login
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
      }
    };

    fetchData();
  }, []);
  
  const createBooking = async (data: BookingFormData): Promise<void> => {
    if (!data.date) return;
    
    try {
      const response = await api.post('/bookings', {
        name: data.name,
        contactNumber: data.contactNumber,
        date: data.date.toISOString(),
        roomTypeId: data.roomTypeId,
        startTime: data.startTime,
        endTime: data.endTime
      });
      
      setBookings(prev => [...prev, response.data]);
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  };
  
  return (
    <BookingContext.Provider value={{ bookings, events, createBooking }}>
      {children}
    </BookingContext.Provider>
  );
};