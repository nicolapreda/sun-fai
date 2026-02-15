'use client';

import { useState, useEffect } from 'react';
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
  const [showModal, setShowModal] = useState(false);
  
  // News Form Data
  const [newsTitle, setNewsTitle] = useState('');
  const [newsContent, setNewsContent] = useState('');
  const [newsDate, setNewsDate] = useState('');
  const [newsImage, setNewsImage] = useState<File | null>(null);

  // Events Form Data
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [eventLocation, setEventLocation] = useState('');

  useEffect(() => {
    checkAuth();
    fetchData();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/check-auth');
      const data = await res.json();
      if (!data.authenticated) {
        router.push('/admin');
      }
    } catch (error) {
      router.push('/admin');
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch News
      const resNews = await fetch('/api/news');
      if (resNews.ok) setNews(await resNews.json());

      // Fetch Events
      const resEvents = await fetch('/api/events');
      if (resEvents.ok) setEvents(await resEvents.json());
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    router.push('/admin');
  };

  const resetForm = () => {
    setIsEditing(false);
    setCurrentId(null);
    setNewsTitle('');
    setNewsContent('');
    setNewsDate('');
    setNewsImage(null);
    setEventTitle('');
    setEventDescription('');
    setEventDate('');
    setEventTime('');
    setEventLocation('');
    setShowModal(false);
  };

  const openEditModal = (item: any, type: 'news' | 'events') => {
    setActiveTab(type);
    setIsEditing(true);
    setCurrentId(item.id);
    
    if (type === 'news') {
        setNewsTitle(item.title);
        setNewsContent(item.content);
        setNewsDate(item.date ? new Date(item.date).toISOString().split('T')[0] : '');
        setNewsImage(null); // Reset file input on edit open
    } else {
        setEventTitle(item.title);
        setEventDescription(item.description);
        setEventDate(item.date ? new Date(item.date).toISOString().split('T')[0] : '');
        setEventTime(item.time || '');
        setEventLocation(item.location);
    }
    setShowModal(true);
  };

  const handleDelete = async (id: number, type: 'news' | 'events') => {
      if (!confirm('Sei sicuro di voler eliminare questo elemento?')) return;

      try {
          const res = await fetch(`/api/${type}/${id}`, { method: 'DELETE' });
          if (res.ok) {
              fetchData();
          } else {
              alert('Errore durante l\'eliminazione');
          }
      } catch (error) {
          console.error(error);
          alert('Errore di connessione');
      }
  };

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
          formData.append('title', eventTitle);
          formData.append('description', eventDescription);
          formData.append('date', eventDate);
          formData.append('time', eventTime);
          formData.append('location', eventLocation);
      }

      const url = isEditing 
          ? `/api/${activeTab}/${currentId}` 
          : `/api/${activeTab}`;
      
      const method = isEditing ? 'PUT' : 'POST';

      try {
          const res = await fetch(url, {
              method,
              body: formData,
          });

          if (res.ok) {
              fetchData();
              resetForm();
          } else {
              const err = await res.json();
              alert('Errore: ' + (err.error || 'Operazione fallita'));
          }
      } catch (error) {
          console.error(error);
          alert('Errore di connessione');
      }
  };


  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Caricamento...</div>;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Navbar */}
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-4">
             <div className="relative w-24 h-12">
                 <Image src="/assets/logo.png" alt="Logo" fill className="object-contain" />
             </div>
             <span className="text-gray-400">|</span>
             <span className="font-bold text-gray-700">Dashboard Admin</span>
        </div>
        <button 
            onClick={handleLogout}
            className="text-sm font-bold text-red-500 hover:text-red-700 hover:bg-red-50 px-4 py-2 rounded-full transition"
        >
            Esci
        </button>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-black">Gestione Contenuti</h1>
            <button 
                onClick={() => { resetForm(); setShowModal(true); }}
                className="bg-black text-white px-6 py-3 rounded-full font-bold shadow-lg hover:bg-sunfai-yellow hover:text-black transition transform hover:scale-105"
            >
                + Aggiungi Nuovo
            </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
            <button 
                onClick={() => setActiveTab('news')}
                className={`pb-4 px-4 font-bold text-lg transition border-b-4 ${activeTab === 'news' ? 'border-sunfai-yellow text-black' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
            >
                Notizie ({news.length})
            </button>
            <button 
                onClick={() => setActiveTab('events')}
                className={`pb-4 px-4 font-bold text-lg transition border-b-4 ${activeTab === 'events' ? 'border-sunfai-yellow text-black' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
            >
                Eventi ({events.length})
            </button>
        </div>

        {/* Content List */}
        <div className="grid grid-cols-1 gap-6">
            {activeTab === 'news' ? (
                news.map(item => (
                    <div key={item.id} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition border border-gray-100 flex justify-between items-center group">
                        <div className="flex items-center gap-4">
                            {item.image && (
                                <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                                    <Image src={item.image} alt={item.title} fill className="object-cover" />
                                </div>
                            )}
                            <div>
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">
                                    {new Date(item.date).toLocaleDateString()}
                                </span>
                                <h3 className="text-xl font-black mb-2">{item.title}</h3>
                                <p className="text-gray-500 text-sm line-clamp-2 max-w-2xl">{item.content}</p>
                            </div>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                            <button onClick={() => openEditModal(item, 'news')} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-bold text-sm">
                                Modifica
                            </button>
                            <button onClick={() => handleDelete(item.id, 'news')} className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg font-bold text-sm">
                                Elimina
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                events.map(item => (
                    <div key={item.id} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition border border-gray-100 flex justify-between items-center group">
                         <div className="flex items-center gap-6">
                            <div className="bg-gray-50 text-black rounded-xl w-16 h-16 flex flex-col items-center justify-center flex-shrink-0 border border-gray-200">
                                <span className="text-xs font-bold text-red-500 uppercase">{new Date(item.date).toLocaleDateString('it-IT', { month: 'short' }).replace('.', '').toUpperCase()}</span>
                                <span className="text-2xl font-black leading-none">{new Date(item.date).getDate()}</span>
                            </div>
                            <div>
                                <h3 className="text-xl font-black mb-1">{item.title}</h3>
                                <div className="text-sm text-gray-500 flex items-center gap-4">
                                    <span>📍 {item.location}</span>
                                    {item.time && <span>⏰ {item.time}</span>}
                                </div>
                            </div>
                         </div>
                         <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                            <button onClick={() => openEditModal(item, 'events')} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-bold text-sm">
                                Modifica
                            </button>
                            <button onClick={() => handleDelete(item.id, 'events')} className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg font-bold text-sm">
                                Elimina
                            </button>
                        </div>
                    </div>
                ))
            )}

            {(activeTab === 'news' && news.length === 0) || (activeTab === 'events' && events.length === 0) ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300 text-gray-400">
                    Nessun contenuto trovato.
                </div>
            ) : null}
        </div>
      </div>

      {/* Modal Form */}
      {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                  <div className="p-8 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                      <h2 className="text-2xl font-black">
                          {isEditing ? 'Modifica' : 'Aggiungi'} {activeTab === 'news' ? 'Notizia' : 'Evento'}
                      </h2>
                      <button onClick={resetForm} className="text-gray-400 hover:text-black transition">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                      </button>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="p-8 space-y-6">
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
