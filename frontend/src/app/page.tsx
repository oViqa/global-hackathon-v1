'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useAuthStore } from '@/store/authStore';
import { LoginDialog } from '@/components/auth/LoginDialog';
import { CreateEventDialog } from '@/components/events/CreateEventDialog';
import { Button } from '@/components/ui/button';
import { Plus, User, Menu } from 'lucide-react';

const MapView = dynamic(() => import('@/components/map/MapView'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p className="text-lg font-medium text-gray-600">Loading pudding map...</p>
      </div>
    </div>
  )
});

export default function Home() {
  const { user, isLoading } = useAuthStore();
  const [showLogin, setShowLogin] = useState(false);
  const [showCreateEvent, setShowCreateEvent] = useState(false);

  const handleCreateEvent = () => {
    if (!user) {
      setShowLogin(true);
    } else {
      setShowCreateEvent(true);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-lg font-medium text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
      <main className="relative w-full h-screen overflow-hidden">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-[1000] bg-white/95 backdrop-blur-sm shadow-md">
          <div className="container mx-auto px-4 py-3 flex items-center justify-end gap-2">
            {user ? (
              <>
                <Button 
                  onClick={handleCreateEvent}
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Create Event</span>
                </Button>
                <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">{user.name}</span>
                </Button>
              </>
            ) : (
              <>
                <Button 
                  onClick={handleCreateEvent}
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Create Event</span>
                </Button>
                <Button onClick={() => setShowLogin(true)} size="sm">
                  Login
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Map */}
        <div className="w-full h-full pt-16">
          <MapView />
        </div>

        {/* Dialogs */}
        <LoginDialog open={showLogin} onOpenChange={setShowLogin} />
        <CreateEventDialog open={showCreateEvent} onOpenChange={setShowCreateEvent} />
      </main>
  );
}
