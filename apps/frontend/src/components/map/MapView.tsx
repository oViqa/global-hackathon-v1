'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), {
  ssr: false,
});

const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), {
  ssr: false,
});

const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), {
  ssr: false,
});

const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), {
  ssr: false,
});

interface Event {
  id: string;
  title: string;
  description?: string;
  location: {
    lat: number;
    lng: number;
  };
  city: string;
  startTime: string;
  attendeeLimit: number;
  attendeeCount: number;
}

export default function MapView() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  // Germany center coordinates
  const defaultCenter: [number, number] = [51.1657, 10.4515];
  const defaultZoom = 6;

  useEffect(() => {
    // Mock data for now - will be replaced with API call
    const mockEvents: Event[] = [
      {
        id: '1',
        title: 'Schoko-Pudding Sonntag',
        description: 'Let\'s meet at Alexanderplatz!',
        location: { lat: 52.520008, lng: 13.404954 },
        city: 'Berlin',
        startTime: '2025-10-06T15:00:00Z',
        attendeeLimit: 15,
        attendeeCount: 8,
      },
      {
        id: '2',
        title: 'Vanille Vibes',
        description: 'Vanilla pudding lovers unite!',
        location: { lat: 48.1351, lng: 11.5820 },
        city: 'Munich',
        startTime: '2025-10-07T14:00:00Z',
        attendeeLimit: 12,
        attendeeCount: 5,
      },
      {
        id: '3',
        title: 'Caramel Connect',
        description: 'Sweet caramel pudding meetup',
        location: { lat: 50.1109, lng: 8.6821 },
        city: 'Frankfurt',
        startTime: '2025-10-08T16:00:00Z',
        attendeeLimit: 20,
        attendeeCount: 12,
      },
    ];

    // Simulate API call
    setTimeout(() => {
      setEvents(mockEvents);
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading pudding events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen">
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        className="h-full w-full z-0"
        style={{ height: '100vh', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {events.map((event) => (
          <Marker
            key={event.id}
            position={[event.location.lat, event.location.lng]}
            eventHandlers={{
              click: () => setSelectedEvent(event),
            }}
          >
            <Popup>
              <div className="p-2 min-w-[200px]">
                <h3 className="font-semibold text-lg text-gray-900 mb-1">
                  {event.title}
                </h3>
                {event.description && (
                  <p className="text-gray-600 text-sm mb-2">
                    {event.description}
                  </p>
                )}
                <div className="space-y-1 text-xs text-gray-500">
                  <p>📍 {event.city}</p>
                  <p>📅 {new Date(event.startTime).toLocaleDateString()}</p>
                  <p>👥 {event.attendeeCount}/{event.attendeeLimit}</p>
                </div>
                <button className="btn-primary w-full mt-3 text-sm">
                  View Details
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Floating Action Button */}
      <button className="fixed bottom-6 right-6 bg-primary-500 hover:bg-primary-600 text-white p-4 rounded-full shadow-lg transition-all duration-200 hover:scale-105 z-10">
        <Plus className="w-6 h-6" />
      </button>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  {selectedEvent.title}
                </h2>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              {selectedEvent.description && (
                <p className="text-gray-600 mb-4">
                  {selectedEvent.description}
                </p>
              )}
              
              <div className="space-y-2 text-sm text-gray-500 mb-6">
                <p>📍 {selectedEvent.city}</p>
                <p>📅 {new Date(selectedEvent.startTime).toLocaleDateString()}</p>
                <p>🕐 {new Date(selectedEvent.startTime).toLocaleTimeString()}</p>
                <p>👥 {selectedEvent.attendeeCount}/{selectedEvent.attendeeLimit} joined</p>
              </div>
              
              <div className="space-y-3">
                <button className="btn-primary w-full">
                  Join Event 🍮
                </button>
                <button className="btn-secondary w-full">
                  Share Event
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
