'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ServiceDetailsPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to services browse page since this route expects an ID
    router.push('/services/browse');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Redirecting...</h2>
        <p className="text-gray-600">Taking you to services page.</p>
      </div>
    </div>
  );
}
