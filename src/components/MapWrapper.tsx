"use client";

import dynamic from 'next/dynamic';

const Map = dynamic(() => import('./Map'), { 
    ssr: false,
    loading: () => <div className="h-[400px] w-full bg-gray-100 animate-pulse rounded-xl flex items-center justify-center">Caricamento mappa...</div>
});

export default function MapWrapper() {
  return <Map />;
}
