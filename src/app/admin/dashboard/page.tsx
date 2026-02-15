'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface NewsItem {
    id: number;
    title: string;
    content: string;
    image: string | null;
    date: string;
}

interface EventItem {
    id: number;
    title: string;
    description: string;
    date: string;
    time?: string;
    location: string;
    image: string | null;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'news' | 'events'>('news');
  const [news, setNews] = useState<NewsItem[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form States
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);
  
  // News Form Data
  const [newsTitle, setNewsTitle] = useState('');
  const [newsContent, setNewsContent] = useState('');
  const [newsDate, setNewsDate] = useState('');
  const [newsImage, setNewsImage] = useState<File | null>(null);

  // ... (Events Form Data)

  const resetForm = () => {
    setIsEditing(false);
    setCurrentId(null);
    setNewsTitle('');
    setNewsContent('');
    setNewsDate('');
    setNewsImage(null);
    setEventTitle('');
    // ... (rest of resetForm)
  };

  // ... (openEditModal logic - no change needed for image file input, maybe show preview URL logic later if needed)

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      
      const formData = new FormData();
      if (activeTab === 'news') {
          formData.append('title', newsTitle);
          formData.append('content', newsContent);
          formData.append('date', newsDate);
          if (newsImage) {
              formData.append('image', newsImage);
          }
      } else {
        // ... (Events logic)
      }
      
      // ... (rest of handleSubmit)
  };

  // ... (inside JSX form for news)
                      {activeTab === 'news' ? (
                          <>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Titolo</label>
                                <input type="text" value={newsTitle} onChange={e => setNewsTitle(e.target.value)} required className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-sunfai-yellow focus:ring-1 focus:ring-sunfai-yellow outline-none transition"/>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Data</label>
                                <input type="date" value={newsDate} onChange={e => setNewsDate(e.target.value)} required className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-sunfai-yellow focus:ring-1 focus:ring-sunfai-yellow outline-none transition"/>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Immagine</label>
                                <input 
                                    type="file" 
                                    accept="image/*"
                                    onChange={e => setNewsImage(e.target.files ? e.target.files[0] : null)} 
                                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-sunfai-yellow focus:ring-1 focus:ring-sunfai-yellow outline-none transition"
                                />
                                {isEditing && !newsImage && (
                                    <p className="text-xs text-gray-500 mt-1">Carica una nuova immagine per sostituire quella attuale (opzionale).</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Contenuto</label>
                                <textarea rows={6} value={newsContent} onChange={e => setNewsContent(e.target.value)} required className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-sunfai-yellow focus:ring-1 focus:ring-sunfai-yellow outline-none transition resize-none"></textarea>
                            </div>
                          </>
                      ) : (
                        // ...
                          <>
                             <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Titolo</label>
                                <input type="text" value={eventTitle} onChange={e => setEventTitle(e.target.value)} required className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-sunfai-yellow focus:ring-1 focus:ring-sunfai-yellow outline-none transition"/>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Data</label>
                                    <input type="date" value={eventDate} onChange={e => setEventDate(e.target.value)} required className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-sunfai-yellow focus:ring-1 focus:ring-sunfai-yellow outline-none transition"/>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Ora</label>
                                    <input type="time" value={eventTime} onChange={e => setEventTime(e.target.value)} className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-sunfai-yellow focus:ring-1 focus:ring-sunfai-yellow outline-none transition"/>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Luogo</label>
                                <input type="text" value={eventLocation} onChange={e => setEventLocation(e.target.value)} required className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-sunfai-yellow focus:ring-1 focus:ring-sunfai-yellow outline-none transition"/>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Descrizione</label>
                                <textarea rows={4} value={eventDescription} onChange={e => setEventDescription(e.target.value)} required className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-sunfai-yellow focus:ring-1 focus:ring-sunfai-yellow outline-none transition resize-none"></textarea>
                            </div>
                          </>
                      )}

                      <div className="flex justify-end gap-4 pt-4">
                          <button type="button" onClick={resetForm} className="px-6 py-3 font-bold text-gray-500 hover:text-black transition">Annulla</button>
                          <button type="submit" className="bg-black text-white px-8 py-3 rounded-full font-bold hover:bg-sunfai-yellow hover:text-black transition shadow-lg">
                              {isEditing ? 'Salva Modifiche' : 'Crea'}
                          </button>
                      </div>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
}
