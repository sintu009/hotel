import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { Calendar, Clock, Check } from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import RoomTypeSelector from '../components/booking/RoomTypeSelector';
import DatePicker from '../components/booking/DatePicker';
import TimeSlotPicker from '../components/booking/TimeSlotPicker';

type FormData = {
  name: string;
  contactNumber: string;
  date: Date | null;
  roomTypeId: string;
  startTime: string;
  endTime: string;
};

const BookingPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { createBooking } = useBooking();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  const initialRoomTypeId = location.state?.roomTypeId || null;

  const { register, handleSubmit, control, watch, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      roomTypeId: initialRoomTypeId,
      date: null,
      startTime: '',
      endTime: ''
    }
  });

  const selectedRoomTypeId = watch('roomTypeId');
  const selectedDate = watch('date');

  const nextStep = () => setCurrentStep(currentStep + 1);
  const prevStep = () => setCurrentStep(currentStep - 1);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      await createBooking({
        name: data.name,
        contactNumber: data.contactNumber,
        date: data.date,
        roomTypeId: data.roomTypeId,
        startTime: data.startTime,
        endTime: data.endTime
      });
      setShowConfirmation(true);
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Error creating booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const goToCalendar = () => {
    navigate('/calendar');
  };

  if (showConfirmation) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center animate-fade-in">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="text-success" size={32} />
          </div>
          <h1 className="text-2xl font-bold mb-4">Booking Confirmed!</h1>
          <p className="mb-8 text-gray-600">
            Your booking has been successfully confirmed. A confirmation email with all details has been sent to your email address.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate('/')}
              className="btn btn-outline"
            >
              Return Home
            </button>
            <button 
              onClick={goToCalendar}
              className="btn btn-primary"
            >
              View Calendar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Book Your Space</h1>
        
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex flex-col items-center">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                    currentStep >= step 
                      ? 'bg-primary text-white' 
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {step}
                </div>
                <span className="text-sm text-gray-600">
                  {step === 1 ? 'Room' : step === 2 ? 'Date & Time' : 'Details'}
                </span>
              </div>
            ))}
          </div>
          <div className="relative h-1 bg-gray-200 mt-4">
            <div 
              className="absolute top-0 left-0 h-full bg-primary transition-all duration-300"
              style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
            ></div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="card">
          {currentStep === 1 && (
            <div className="animate-fade-in">
              <h2 className="text-xl font-semibold mb-4">Select a Room Type</h2>
              <Controller
                name="roomTypeId"
                control={control}
                rules={{ required: 'Please select a room type' }}
                render={({ field }) => (
                  <RoomTypeSelector 
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.roomTypeId?.message}
                  />
                )}
              />
              <div className="flex justify-end mt-6">
                <button 
                  type="button"
                  onClick={nextStep}
                  disabled={!selectedRoomTypeId}
                  className="btn btn-primary"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="animate-fade-in">
              <h2 className="text-xl font-semibold mb-4">Choose Date & Time</h2>
              
              <div className="mb-6">
                <label className="form-label">Select Date</label>
                <Controller
                  name="date"
                  control={control}
                  rules={{ required: 'Please select a date' }}
                  render={({ field }) => (
                    <DatePicker
                      selectedDate={field.value}
                      onChange={field.onChange}
                      error={errors.date?.message}
                    />
                  )}
                />
              </div>
              
              {selectedDate && (
                <div className="mb-6 animate-fade-in">
                  <label className="form-label">Select Time Slot</label>
                  <Controller
                    name="startTime"
                    control={control}
                    rules={{ required: 'Please select a start time' }}
                    render={({ field: startField }) => (
                      <Controller
                        name="endTime"
                        control={control}
                        rules={{ required: 'Please select an end time' }}
                        render={({ field: endField }) => (
                          <TimeSlotPicker
                            date={selectedDate}
                            roomTypeId={selectedRoomTypeId}
                            startTime={startField.value}
                            endTime={endField.value}
                            onStartTimeChange={startField.onChange}
                            onEndTimeChange={endField.onChange}
                            startTimeError={errors.startTime?.message}
                            endTimeError={errors.endTime?.message}
                          />
                        )}
                      />
                    )}
                  />
                </div>
              )}
              
              <div className="flex justify-between mt-6">
                <button 
                  type="button"
                  onClick={prevStep}
                  className="btn btn-outline"
                >
                  Back
                </button>
                <button 
                  type="button"
                  onClick={nextStep}
                  disabled={!selectedDate || !watch('startTime') || !watch('endTime')}
                  className="btn btn-primary"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="animate-fade-in">
              <h2 className="text-xl font-semibold mb-4">Personal Details</h2>
              
              <div className="mb-4">
                <label htmlFor="name" className="form-label">Full Name</label>
                <input
                  id="name"
                  type="text"
                  className="form-input"
                  placeholder="John Doe"
                  {...register('name', { required: 'Name is required' })}
                />
                {errors.name && <p className="form-error">{errors.name.message}</p>}
              </div>
              
              <div className="mb-6">
                <label htmlFor="contactNumber" className="form-label">Contact Number</label>
                <input
                  id="contactNumber"
                  type="tel"
                  className="form-input"
                  placeholder="+1 (555) 123-4567"
                  {...register('contactNumber', { 
                    required: 'Contact number is required',
                    pattern: {
                      value: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
                      message: 'Please enter a valid phone number'
                    }
                  })}
                />
                {errors.contactNumber && <p className="form-error">{errors.contactNumber.message}</p>}
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <h3 className="text-lg font-medium mb-2">Booking Summary</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-gray-600">Date:</div>
                  <div className="font-medium flex items-center gap-1">
                    <Calendar size={14} />
                    {selectedDate?.toLocaleDateString()}
                  </div>
                  <div className="text-gray-600">Time:</div>
                  <div className="font-medium flex items-center gap-1">
                    <Clock size={14} />
                    {watch('startTime')} - {watch('endTime')}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between mt-6">
                <button 
                  type="button"
                  onClick={prevStep}
                  className="btn btn-outline"
                >
                  Back
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary"
                >
                  {isSubmitting ? 'Processing...' : 'Confirm Booking'}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default BookingPage;