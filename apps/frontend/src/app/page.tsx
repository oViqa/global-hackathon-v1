import { Suspense } from 'react';
import MapView from '@/components/map/MapView';
import Header from '@/components/layout/Header';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="relative">
        <Suspense fallback={<LoadingSpinner />}>
          <MapView />
        </Suspense>
      </main>
    </div>
  );
}
