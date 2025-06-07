import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface RoomTypeSelectorProps {
  value: number | null;
  onChange: (value: number) => void;
  error?: string;
}

const RoomTypeSelector: React.FC<RoomTypeSelectorProps> = ({ value, onChange, error }) => {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {roomTypes.map((room) => (
          <div 
            key={room.id}
            onClick={() => onChange(room.id)}
            className={`
              relative cursor-pointer rounded-lg overflow-hidden transition-all duration-200
              ${value === room.id 
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
            {value === room.id && (
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

// Sample data for room types (same as in HomePage)
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

export default RoomTypeSelector;