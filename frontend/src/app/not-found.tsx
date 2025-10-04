import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, Search, MapPin } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
        <div className="flex justify-center mb-4">
          <div className="text-6xl">🍮</div>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          404
        </h1>
        
        <h2 className="text-xl font-semibold text-gray-700 mb-2">
          Pudding Not Found
        </h2>
        
        <p className="text-gray-600 mb-6">
          Looks like this pudding meetup has already been eaten! The page you&apos;re looking for doesn&apos;t exist.
        </p>

        <div className="space-y-3">
          <Button asChild className="w-full">
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Back to Map
            </Link>
          </Button>
          
          <Button asChild variant="outline" className="w-full">
            <Link href="/">
              <Search className="w-4 h-4 mr-2" />
              Find Events
            </Link>
          </Button>
        </div>

        <div className="mt-6 text-sm text-gray-500">
          <p>Looking for something specific?</p>
          <p>Try searching for pudding meetups near you!</p>
        </div>
      </div>
    </div>
  );
}
