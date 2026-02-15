"use client";

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useState } from 'react';

// Locations data
const markers = [
    { lat: 45.6484, lng: 9.6056, title: "Dalmine", status: "attiva", color: "green" },
    { lat: 45.8051, lng: 9.4962, title: "Carenno", status: "attiva", color: "green" },
    { lat: 45.8715, lng: 9.7346, title: "Serina", status: "in-arrivo", color: "yellow" },
    { lat: 45.6492, lng: 9.6543, title: "Stezzano", status: "in-arrivo", color: "yellow" },
    { lat: 45.6171, lng: 9.5934, title: "Osio Sotto", status: "in-valutazione", color: "orange" },
    { lat: 45.6983, lng: 9.6010, title: "Sun-Fai", status: "attiva", color: "green" },
    // Add other locations as needed based on the screenshot/legacy data
];

const createCustomIcon = (color: string) => {
    const hexColor = color === 'green' ? '#22c55e' : (color === 'yellow' ? '#FFD600' : '#f97316');
    
    // Create a circular marker with a white border and the specific color fill
    const svgIcon = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
        <circle cx="12" cy="12" r="10" fill="${hexColor}" stroke="white" stroke-width="3" />
      </svg>
    `;

    return new L.DivIcon({
        className: 'custom-map-marker',
        html: svgIcon,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        popupAnchor: [0, -12]
    });
};

export default function Map() {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    return (
        <div className="relative h-[400px] w-full rounded-xl overflow-hidden">
            <MapContainer 
                center={[45.72675, 9.5509]} 
                zoom={10} 
                scrollWheelZoom={false} 
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {markers.map((marker, idx) => (
                    <Marker 
                        key={idx} 
                        position={[marker.lat, marker.lng]}
                        icon={createCustomIcon(marker.color)}
                    >
                        <Popup>
                            <strong>{marker.title}</strong><br />
                            {marker.status === 'attiva' ? 'Attiva' : (marker.status === 'in-arrivo' ? 'In Arrivo' : 'In Valutazione')}
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
            
            {/* Floating Legend */}
             <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-lg z-[1000] flex gap-4 text-xs font-bold whitespace-nowrap">
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-green-500 border border-black"></span> Attiva
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-sunfai-yellow border border-black"></span> In arrivo
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-orange-500 border border-black"></span> In valutazione
                </div>
            </div>
        </div>
    );
}
