'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import api from '@/lib/api';
import { formatDate, formatTime, getTimeUntil } from '@/lib/utils';
import { Button } from '@/components/ui/button';

// Fix Leaflet default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom pudding marker icon
const puddingIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
      <circle cx="12" cy="12" r="10" fill="#8b5cf6"/>
      <text x="12" y="16" font-size="14" text-anchor="middle" fill="white">🍮</text>
    </svg>
  `),
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

interface Event {
  id: string;
  title: string;
  description?: string;
  location: { lat: number; lng: number };
  city: string;
  state: string;
  startTime: string;
  endTime: string;
  attendeeLimit: number;
  attendeeCount: number;
  status: string;
  organizer: {
    id: string;
    name: string;
  };
  puddingPreviews: string[];
}

export default function MapView() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const response = await api.get('/events', {
        params: {
          status: 'UPCOMING',
          limit: 50
        }
      });
      setEvents(response.data.events);
    } catch (error) {
      console.error('Failed to load events:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-lg font-medium text-gray-600">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <MapContainer
      center={[51.1657, 10.4515]} // Center of Germany
      zoom={6}
      style={{ width: '100%', height: '100%' }}
      className="z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {events.map((event) => (
        <Marker
          key={event.id}
          position={[event.location.lat, event.location.lng]}
          icon={puddingIcon}
        >
          <Popup>
            <div className="p-2 min-w-[250px]">
              <h3 className="font-bold text-lg mb-2">{event.title}</h3>
              <div className="space-y-1 text-sm">
                <p className="text-gray-600">
                  📅 {formatDate(event.startTime)} • {formatTime(event.startTime)}
                </p>
                <p className="text-gray-600">
                  📍 {event.city}, {event.state}
                </p>
                <p className="text-gray-600">
                  👥 {event.attendeeCount}/{event.attendeeLimit} joined
                </p>
                <p className="text-primary-600 font-semibold">
                  ⏰ Starts in {getTimeUntil(event.startTime)}
                </p>
                <p className="text-gray-700 mt-2">
                  Organized by {event.organizer.name}
                </p>
                {event.description && (
                  <p className="text-gray-600 mt-2 text-xs">
                    {event.description.substring(0, 100)}
                    {event.description.length > 100 && '...'}
                  </p>
                )}
              </div>
              <Button className="w-full mt-3" size="sm">
                View Details
              </Button>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
