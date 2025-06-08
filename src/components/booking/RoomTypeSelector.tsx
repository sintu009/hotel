import React, { useState, useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';
import axios from 'axios';

interface RoomType {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

interface RoomTypeSelectorProps {
  value: string | null;
  onChange: (value: string) => void;
  error?: string;
}

const RoomTypeSelector: React.FC<RoomTypeSelectorProps> = ({ value, onChange, error }) => {
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoomTypes = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/room-types', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRoomTypes(response.data);
      } catch (error) {
        console.error('Error fetching room types:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoomTypes();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-40 bg-gray-200 rounded-lg mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-20"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {roomTypes.map((room) => (
          <div 
            key={room._id}
            onClick={() => onChange(room._id)}
            className={`
              relative cursor-pointer rounded-lg overflow-hidden transition-all duration-200
              ${value === room._id 
                ? 'ring-2 ring-primary ring-offset-2' 
                : 'border border-gray-200 hover:border-primary'}
            `}
          >
            <div className="h-40 overflow-hidden">
              <img 
                src={room.image} 
                alt={room.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="font-medium mb-1">{room.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{room.description}</p>
              <div className="font-semibold text-primary">${room.price}/hour</div>
            </div>
            {value === room._id && (
              <div className="absolute top-2 right-2 bg-primary text-white p-1 rounded-full">
                <CheckCircle2 size={20} />
              </div>
            )}
          </div>
        ))}
      </div>
      {error && <p className="form-error mt-2">{error}</p>}
    </div>
  );
};

export default RoomTypeSelector;