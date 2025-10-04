'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { MapPin, Users, Clock, Calendar, Plus, Filter, List, Map as MapIcon, User, Settings } from 'lucide-react';
import CreateEventModal from '../events/CreateEventModal';
import JoinEventModal from '../events/JoinEventModal';
import EventChat from '../chat/EventChat';

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
  location: { lat: number; lng: number };
  city: string;
  startTime: string;
  attendeeLimit: number;
  attendeeCount: number;
  organizer: {
    name: string;
    avatar?: string;
  };
  puddingPhotos: string[];
}

export default function MapView() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [radius, setRadius] = useState(50); // km
  const [timeFilter, setTimeFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isCreateEventModalOpen, setIsCreateEventModalOpen] = useState(false);
  const [isJoinEventModalOpen, setIsJoinEventModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedEventForJoin, setSelectedEventForJoin] = useState<Event | null>(null);
  const [selectedEventForChat, setSelectedEventForChat] = useState<Event | null>(null);

  // Germany center coordinates
  const defaultCenter: [number, number] = [51.1657, 10.4515];
  const defaultZoom = 6;

  useEffect(() => {
    // Mock data for now - will be replaced with API call
    const mockEvents: Event[] = [
      {
        id: '1',
        title: 'Schoko-Pudding Sonntag',
        description: 'Let\'s meet at Alexanderplatz and share our favorite chocolate puddings! Bring your own spoon and fork!',
        location: { lat: 52.520008, lng: 13.404954 },
        city: 'Berlin',
        startTime: '2025-10-06T15:00:00Z',
        attendeeLimit: 15,
        attendeeCount: 8,
        organizer: {
          name: 'Max Müller',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
        },
        puddingPhotos: [
          'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=100&h=100&fit=crop',
          'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=100&h=100&fit=crop',
          'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=100&h=100&fit=crop',
        ]
      },
      {
        id: '2',
        title: 'Vanille Vibes',
        description: 'Vanilla pudding lovers unite! We\'ll taste different vanilla varieties and share recipes.',
        location: { lat: 48.1351, lng: 11.5820 },
        city: 'Munich',
        startTime: '2025-10-07T14:00:00Z',
        attendeeLimit: 12,
        attendeeCount: 5,
        organizer: {
          name: 'Lisa Schmidt',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
        },
        puddingPhotos: [
          'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=100&h=100&fit=crop',
          'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=100&h=100&fit=crop',
        ]
      },
      {
        id: '3',
        title: 'Caramel Connect',
        description: 'Sweet caramel pudding meetup in the heart of Frankfurt. Bring your favorite caramel treats!',
        location: { lat: 50.1109, lng: 8.6821 },
        city: 'Frankfurt',
        startTime: '2025-10-08T16:00:00Z',
        attendeeLimit: 20,
        attendeeCount: 12,
        organizer: {
          name: 'Tom Weber',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
        },
        puddingPhotos: [
          'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=100&h=100&fit=crop',
          'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=100&h=100&fit=crop',
          'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=100&h=100&fit=crop',
          'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=100&h=100&fit=crop',
        ]
      },
    ];

    // Simulate API call
    setTimeout(() => {
      setEvents(mockEvents);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleJoinEvent = () => {
    setIsAuthModalOpen(true);
  };

  const handleCreateEvent = (eventData: any) => {
    console.log('Creating event:', eventData);
    // TODO: Implement actual event creation
    alert('Event created successfully! (Demo mode)');
  };

  const handleJoinEventSubmit = (joinData: any) => {
    console.log('Joining event:', joinData);
    // TODO: Implement actual join request
    alert('Join request submitted! Waiting for organizer approval.');
  };

  const handleChatOpen = () => {
    setSelectedEventForChat(selectedEvent);
    setIsChatOpen(true);
  };

  const formatTimeUntilEvent = (startTime: string) => {
    const now = new Date();
    const eventTime = new Date(startTime);
    const diff = eventTime.getTime() - now.getTime();
    
    if (diff < 0) return 'Event ended';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `In ${days}d ${hours}h`;
    if (hours > 0) return `In ${hours}h ${minutes}m`;
    return `In ${minutes}m`;
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-500 mx-auto mb-6"></div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Loading Pudding Events</h2>
          <p className="text-gray-600">Finding the sweetest meetups across Germany...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 p-4">
        <div className="glass rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">🍮</span>
            </div>
            <div>
              <h1 className="font-bold text-xl text-gray-900">Pudding mit Gabel</h1>
              <p className="text-sm text-gray-600">Find your pudding people</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Radius Filter */}
            <select 
              value={radius} 
              onChange={(e) => setRadius(Number(e.target.value))}
              className="glass rounded-xl px-3 py-2 text-sm border-0 focus:ring-2 focus:ring-primary-500"
            >
              <option value={10}>10km</option>
              <option value={20}>20km</option>
              <option value={50}>50km</option>
              <option value={100}>100km</option>
              <option value={999}>All Germany</option>
            </select>

            {/* Time Filter */}
            <select 
              value={timeFilter} 
              onChange={(e) => setTimeFilter(e.target.value as any)}
              className="glass rounded-xl px-3 py-2 text-sm border-0 focus:ring-2 focus:ring-primary-500"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="all">All Time</option>
            </select>

            {/* View Toggle */}
            <button
              onClick={() => setViewMode(viewMode === 'map' ? 'list' : 'map')}
              className="glass rounded-xl p-2 hover:bg-white/60 transition-colors"
            >
              {viewMode === 'map' ? <List className="w-5 h-5" /> : <MapIcon className="w-5 h-5" />}
            </button>

            {/* User Menu */}
            <div className="relative">
              <button className="glass rounded-xl p-2 hover:bg-white/60 transition-colors">
                <User className="w-5 h-5" />
              </button>
            </div>

            {/* Admin Toggle */}
            <button
              onClick={() => setIsAdminMode(!isAdminMode)}
              className={`rounded-xl p-2 transition-colors ${
                isAdminMode ? 'bg-primary-500 text-white' : 'glass hover:bg-white/60'
              }`}
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Map View */}
      {viewMode === 'map' && (
        <div className="h-full w-full">
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
                <Popup className="custom-popup">
                  <div className="p-4 min-w-[280px]">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-bold text-lg text-gray-900 leading-tight">
                        {event.title}
                      </h3>
                      <button
                        onClick={() => setSelectedEvent(null)}
                        className="text-gray-400 hover:text-gray-600 ml-2"
                      >
                        ×
                      </button>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-primary-500" />
                        <span>{event.city}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-primary-500" />
                        <span>{new Date(event.startTime).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-primary-500" />
                        <span>{new Date(event.startTime).toLocaleTimeString()}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-primary-500" />
                        <span>{event.attendeeCount}/{event.attendeeLimit} joined</span>
                      </div>
                    </div>

                    {/* Pudding Photos Preview */}
                    {event.puddingPhotos.length > 0 && (
                      <div className="flex space-x-1 mb-4">
                        {event.puddingPhotos.slice(0, 3).map((photo, index) => (
                          <img
                            key={index}
                            src={photo}
                            alt={`Pudding ${index + 1}`}
                            className="w-8 h-8 rounded-lg object-cover"
                          />
                        ))}
                        {event.puddingPhotos.length > 3 && (
                          <div className="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center text-xs text-gray-600">
                            +{event.puddingPhotos.length - 3}
                          </div>
                        )}
                      </div>
                    )}

                    <button 
                      onClick={handleJoinEvent}
                      className="apple-button-primary w-full text-sm"
                    >
                      Join Event 🍮
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="h-full pt-24 pb-20 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 space-y-4">
            {events.map((event) => (
              <div key={event.id} className="apple-card p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-xl text-gray-900 mb-2">{event.title}</h3>
                    <p className="text-gray-600 mb-3">{event.description}</p>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{event.city}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(event.startTime).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{formatTimeUntilEvent(event.startTime)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{event.attendeeCount}/{event.attendeeLimit}</span>
                      </div>
                    </div>

                    {/* Organizer */}
                    <div className="flex items-center space-x-2 mb-4">
                      <img 
                        src={event.organizer.avatar} 
                        alt={event.organizer.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className="text-sm text-gray-600">Organized by {event.organizer.name}</span>
                    </div>
                  </div>
                  
                  <div className="ml-6 flex flex-col items-end space-y-3">
                    {/* Pudding Photos */}
                    {event.puddingPhotos.length > 0 && (
                      <div className="flex space-x-1">
                        {event.puddingPhotos.slice(0, 4).map((photo, index) => (
                          <img
                            key={index}
                            src={photo}
                            alt={`Pudding ${index + 1}`}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                        ))}
                        {event.puddingPhotos.length > 4 && (
                          <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center text-xs text-gray-600">
                            +{event.puddingPhotos.length - 4}
                          </div>
                        )}
                      </div>
                    )}
                    
                    <button 
                      onClick={() => {
                        setSelectedEventForJoin(event);
                        setIsJoinEventModalOpen(true);
                      }}
                      className="apple-button-primary text-sm"
                    >
                      Join Event 🍮
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <button 
        onClick={() => setIsCreateEventModalOpen(true)}
        className="fixed bottom-6 right-6 apple-button-primary p-4 shadow-2xl z-10"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-30 p-4">
          <div className="apple-card max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedEvent.title}
                </h2>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
              
              {selectedEvent.description && (
                <p className="text-gray-600 mb-6">{selectedEvent.description}</p>
              )}
              
              <div className="space-y-3 text-sm text-gray-600 mb-6">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-primary-500" />
                  <span>{selectedEvent.city}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-primary-500" />
                  <span>{new Date(selectedEvent.startTime).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-primary-500" />
                  <span>{new Date(selectedEvent.startTime).toLocaleTimeString()}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-primary-500" />
                  <span>{selectedEvent.attendeeCount}/{selectedEvent.attendeeLimit} joined</span>
                </div>
              </div>

              {/* Organizer */}
              <div className="flex items-center space-x-3 mb-6 p-3 bg-gray-50 rounded-xl">
                <img 
                  src={selectedEvent.organizer.avatar} 
                  alt={selectedEvent.organizer.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-gray-900">Organized by</p>
                  <p className="text-gray-600">{selectedEvent.organizer.name}</p>
                </div>
              </div>

              {/* Pudding Photos */}
              {selectedEvent.puddingPhotos.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Pudding Gallery</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {selectedEvent.puddingPhotos.map((photo, index) => (
                      <img
                        key={index}
                        src={photo}
                        alt={`Pudding ${index + 1}`}
                        className="w-full h-20 rounded-lg object-cover"
                      />
                    ))}
                  </div>
                </div>
              )}
              
              <div className="space-y-3">
                <button 
                  onClick={() => {
                    setSelectedEventForJoin(selectedEvent);
                    setIsJoinEventModalOpen(true);
                  }}
                  className="apple-button-primary w-full"
                >
                  Join Event 🍮
                </button>
                <button 
                  onClick={handleChatOpen}
                  className="apple-button-secondary w-full"
                >
                  Open Chat
                </button>
                <button className="apple-button-secondary w-full">
                  Share Event
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40 p-4">
          <div className="apple-card max-w-md w-full">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Sign in to join</h2>
              
              <div className="space-y-3">
                <button className="apple-button-secondary w-full flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.024-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
                  </svg>
                  <span>Continue with Apple</span>
                </button>
                
                <button className="apple-button-secondary w-full flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span>Continue with Google</span>
                </button>
              </div>
              
              <div className="mt-6 text-center">
                <button 
                  onClick={() => setIsAuthModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Admin Dashboard */}
      {isAdminMode && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="apple-card max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Admin Dashboard</h2>
                <button
                  onClick={() => setIsAdminMode(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="apple-card p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Total Events</h3>
                  <p className="text-3xl font-bold text-primary-500">{events.length}</p>
                </div>
                
                <div className="apple-card p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Total Attendees</h3>
                  <p className="text-3xl font-bold text-secondary-500">
                    {events.reduce((sum, event) => sum + event.attendeeCount, 0)}
                  </p>
                </div>
                
                <div className="apple-card p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Pending Approvals</h3>
                  <p className="text-3xl font-bold text-accent-500">0</p>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="font-semibold text-gray-900 mb-4">Manage Events</h3>
                <div className="space-y-3">
                  {events.map((event) => (
                    <div key={event.id} className="apple-card p-4 flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900">{event.title}</h4>
                        <p className="text-sm text-gray-600">{event.city} • {event.attendeeCount}/{event.attendeeLimit} attendees</p>
                      </div>
                      <div className="flex space-x-2">
                        <button className="apple-button-secondary text-sm">Edit</button>
                        <button className="bg-red-500 text-white px-3 py-1 rounded-full text-sm hover:bg-red-600">Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Event Modal */}
      <CreateEventModal
        isOpen={isCreateEventModalOpen}
        onClose={() => setIsCreateEventModalOpen(false)}
        onSubmit={handleCreateEvent}
      />

      {/* Join Event Modal */}
      <JoinEventModal
        isOpen={isJoinEventModalOpen}
        onClose={() => setIsJoinEventModalOpen(false)}
        event={selectedEventForJoin}
        onSubmit={handleJoinEventSubmit}
      />

      {/* Event Chat */}
      <EventChat
        eventId={selectedEventForChat?.id || ''}
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        event={selectedEventForChat}
      />
    </div>
  );
}