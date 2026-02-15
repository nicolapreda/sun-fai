import Link from 'next/link';
import Image from 'next/image';
import HomeVideo from '@/components/HomeVideo';
import MapWrapper from '@/components/MapWrapper';
import { getLatestNews, getUpcomingEvents } from '@/lib/data';
import { getInstantPowers } from '@/lib/services/ardake';

export const revalidate = 300; 

export default async function Home() {
  const news = await getLatestNews(3);
  const events = await getUpcomingEvents(3);
  const stats = await getInstantPowers();

  const reviews = [
    {
      title: "Sun-Fai eletta migliore Cer in Italia 2024",
      text: "La cooperativa Sun-Fai di Dalmine è stata eletta “CER dell’anno 2024” dall’Italian Forum of Energy Communities (IFEC). Questo riconoscimento premia il progetto per la sua innovazione sociale, economica e tecnologica.",
      sub: "Energia In Città"
    },
    {
      title: "Coi risparmi in bolletta, più aiuti a chi ne ha bisogno",
      text: "La cooperativa Sun-Fai ha avviato un nuovo progetto solidale: finanzierà l'installazione di un impianto fotovoltaico sul Centro di primo ascolto interparrocchiale di Dalmine.",
      sub: "Articolo di Pietro Giudici - L'Eco di Bergamo"
    },
    {
      title: "La cooperativa di giovani che scommette sulle Cer",
      text: "Nata dalla curiosità e dall'impegno di un gruppo di giovani, Sun-Fai è oggi una realtà consolidata capace di offrire formazione e consulenza su povertà energetica e sostenibilità.",
      sub: "Articolo di Pietro Giudici - L'Eco di Bergamo"
    }
  ];

  return (
    <main className="min-h-screen">
      {/* HERO SECTION */}
      <section className="relative h-screen w-full overflow-hidden flex items-center text-white">
        <HomeVideo />
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 text-left">
          <h1 className="text-6xl md:text-8xl font-black mb-8 animate-scale-in leading-tight">
            Tutta un'altra energia.<br />
            La tua.
        La nostra.
          </h1>
        </div>
      </section>

      {/* WELCOME SECTION */}
      <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6">
              <div className="flex flex-col lg:flex-row items-center gap-12">
                  {/* Left Column: Illustration */}
                  <div className="w-full lg:w-1/2 flex justify-center lg:justify-start">
                      <div className="relative w-full max-w-md aspect-square">
                          <Image 
                            src="/assets/benvenuti.jpg" 
                            alt="Benvenuti in Sun-Fai"
                            fill
                            className="object-contain"
                          />
                      </div>
                  </div>

                  {/* Right Column: Text & Badge */}
                  <div className="w-full lg:w-1/2 relative">

                      <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight text-black">
                          Benvenuti sul<br />
                          <span className="yellow-brush-bg text-black transform rotate-1 inline-block mt-2">
                              sito di Sun-Fai
                          </span>
                      </h2>
                      
                      <p className="text-xl md:text-2xl font-bold text-black leading-relaxed">
                          Sun-fai è una cooperativa nata per essere una
                          comunità energetica rinnovabile sociale e solidale
                          ma è diventata molto di più!
                      </p>
                  </div>
              </div>
          </div>
      </section>

      {/* LA NOSTRA REALTÀ SECTION */}
      <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6">
              <h2 className="text-4xl md:text-5xl font-black mb-16 relative inline-block">
                  La nostra realtà
                  <span className="absolute bottom-2 left-0 w-full h-4 bg-sunfai-yellow -z-10 transform -rotate-1"></span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Card 1: CHI SIAMO */}
                  <Link href="/chi-siamo" className="block group">
                      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 transition duration-300 group-hover:shadow-2xl">
                          <div className="relative h-64 overflow-hidden">
                              <Image 
                                src="/assets/chi-siamo-2.jpeg" 
                                alt="Chi Siamo"
                                fill
                                className="object-cover transition duration-500 group-hover:scale-110"
                              />
                          </div>
                          <div className="p-8 text-center">
                              <h3 className="text-3xl font-black inline-block relative">
                                  CHI
                                  <span className="block text-sunfai-black mt-1">SIAMO</span>
                                  <span className="absolute bottom-1 left-0 w-full h-3 bg-sunfai-yellow -z-10 transform -rotate-2"></span>
                              </h3>
                          </div>
                      </div>
                  </Link>

                  {/* Card 2: COSA FACCIAMO */}
                  <Link href="/cosa-facciamo" className="block group">
                      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 transition duration-300 group-hover:shadow-2xl">
                          <div className="relative h-64 overflow-hidden">
                              <Image 
                                src="/assets/cosa-facciamo.png" 
                                alt="Cosa Facciamo"
                                fill
                                className="object-cover transition duration-500 group-hover:scale-110"
                              />
                          </div>
                          <div className="p-8 text-center">
                              <h3 className="text-3xl font-black inline-block relative">
                                  COSA
                                  <span className="block text-sunfai-black mt-1">FACCIAMO</span>
                                  <span className="absolute bottom-1 left-0 w-full h-3 bg-sunfai-yellow -z-10 transform rotate-1"></span>
                              </h3>
                          </div>
                      </div>
                  </Link>

                  {/* Card 3: COSA SONO LE CER(S) */}
                  <Link href="/le-cer" className="block group">
                      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 transition duration-300 group-hover:shadow-2xl">
                          <div className="relative h-64 overflow-hidden">
                              <Image 
                                src="/assets/cosa-sono-le-cer.jpeg" 
                                alt="Cosa Sono Le CER"
                                fill
                                className="object-cover transition duration-500 group-hover:scale-110"
                              />
                          </div>
                          <div className="p-8 text-center">
                              <h3 className="text-3xl font-black inline-block relative">
                                  COSA SONO
                                  <span className="block text-sunfai-black mt-1">LE CER(S)</span>
                                  <span className="absolute bottom-1 left-0 w-full h-3 bg-sunfai-yellow -z-10 transform -rotate-1"></span>
                              </h3>
                          </div>
                      </div>
                  </Link>
              </div>
          </div>
      </section>

      {/* ARDAKÉ SECTION */}
      <section className="py-20 bg-white text-black relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 relative z-10">
              <div className="flex flex-col lg:flex-row items-center gap-16">
                  {/* Left Column: Content */}
                  <div className="w-full lg:w-1/2 text-left">
                      <div className="inline-block bg-sunfai-yellow text-black px-4 py-1 rounded-full font-bold uppercase text-xs mb-6 tracking-wider shadow-sm">
                          Piattaforma
                      </div>
                      <h2 className="text-5xl md:text-7xl font-black mb-6 leading-tight text-black">
                          Ardaké
                      </h2>
                      <p className="text-xl md:text-2xl text-gray-800 mb-10 leading-relaxed">
                          La tua energia, sempre sotto controllo.<br/>
                          <span className="text-black font-bold bg-sunfai-yellow/20 px-2 rounded-lg">Monitora consumi</span>, produzione e risparmio in tempo reale.
                      </p>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 gap-8 mb-10">
                          <div className="bg-gray-50 p-6 rounded-2xl shadow-sm border border-gray-100">
                              <div className="text-4xl lg:text-5xl font-black text-black mb-2">
                                  {stats.powerSum > 0 ? stats.powerSum.toFixed(0) : '350'} <span className="text-sunfai-yellow text-2xl lg:text-3xl">kWh</span>
                              </div>
                              <div className="text-xs lg:text-sm font-bold uppercase tracking-wider text-gray-500">Energia erogata (24h)</div>
                          </div>
                          <div className="bg-gray-50 p-6 rounded-2xl shadow-sm border border-gray-100">
                              <div className="text-4xl lg:text-5xl font-black text-black mb-2">100+</div>
                              <div className="text-xs lg:text-sm font-bold uppercase tracking-wider text-gray-500">Soci attivi</div>
                          </div>
                      </div>

                      <a href="https://sun-fai.org/gestione_cer/file_server/monitoring_energy.html" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-4 bg-black text-white rounded-full px-8 py-4 font-bold text-lg hover:bg-sunfai-yellow hover:text-black transition duration-300 shadow-xl group">
                          Accedi alla piattaforma
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5 group-hover:translate-x-1 transition-transform">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                          </svg>
                      </a>
                  </div>

                  {/* Right Column: Creative Mockup */}
                  <div className="w-full lg:w-1/2 relative flex justify-center">
                      <div className="relative w-full max-w-lg aspect-square flex items-center justify-center">
                          {/* Glow effect behind */}
                          <div className="absolute w-2/3 h-2/3 bg-sunfai-yellow blur-[60px] opacity-25 rounded-full animate-pulse mx-auto"></div>

                          {/* Mockup Image */}
                          <div className="relative w-full h-full"> 
                              <Image 
                                src="/assets/ardake-mockup.png" 
                                alt="Ardaké Platform Mockup"
                                fill
                                className="object-contain animate-float hover:scale-105 transition duration-500 drop-shadow-2xl z-10"
                              />
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      {/* CONFIGURAZIONI SECTION */}
      <section id="configurazioni" className="py-20 bg-black text-white">
          <div className="max-w-7xl mx-auto px-6">
              <h2 className="text-4xl md:text-5xl font-black mb-16">
                  Le nostre<br/>
                  configurazioni
              </h2>

              <div className="flex flex-col lg:flex-row gap-12 items-center mb-12">
                  <div className="w-full lg:w-1/2">
                      <div className="rounded-xl overflow-hidden border-4 border-gray-800 h-[400px] bg-white text-black relative">
                          <MapWrapper />
                      </div>
                      
                      {/* Map Legend */}
                      <div className="flex flex-wrap justify-center gap-4 mt-6 text-sm font-bold bg-white text-black p-4 rounded-xl">
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

                  {/* Stats */}
                  <div className="w-full lg:w-1/2">
                      <div className="grid grid-cols-2 gap-x-8 gap-y-16 text-center">
                          <div>
                              <div className="text-6xl font-black mb-2">2</div>
                              <div className="text-sm font-bold uppercase tracking-wider">CER aperte e gestite<br/>da Sun-Fai</div>
                          </div>
                          <div>
                              <div className="text-6xl font-black mb-2">249 kWh</div>
                              <div className="text-sm font-bold uppercase tracking-wider">Potenza totale dei<br/>nostri impianti</div>
                          </div>
                          <div>
                              <a href="https://sun-fai.org/gestione_cer/file_server/monitoring_energy.html" target="_blank" rel="noopener noreferrer" className="group block">
                                  <div className="text-6xl font-black mb-2 text-sunfai-yellow group-hover:text-white transition duration-300">
                                      {stats.powerSum > 0 ? stats.powerSum.toFixed(0) : '--'} <span className="text-white text-2xl lg:text-3xl">kWh</span>
                                  </div>
                                  <div className="text-sm font-bold uppercase tracking-wider group-hover:text-sunfai-yellow transition duration-300">
                                      Energia erogata<br/>nelle ultime 24h</div>
                              </a>
                          </div>
                          <div>
                              <div className="text-6xl font-black mb-2">100</div>
                              <div className="text-sm font-bold uppercase tracking-wider">Numero di soci di Sun-fai</div>
                          </div>
                      </div>
                  </div>
              </div>

               <div className="text-center">
                  <a href="https://sun-fai.org/gestione_cer/file_server/monitoring_energy.html" target="_blank" rel="noopener noreferrer" className="inline-block border-2 border-white rounded-full px-8 py-3 font-bold hover:bg-white hover:text-black transition duration-300">
                      Accedi alla nostra piattaforma di monitoraggio Ardaké!
                  </a>
              </div>
          </div>
      </section>

      {/* DICONO DI NOI */}
      <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6">
              <h2 className="text-4xl md:text-5xl font-black mb-16 relative inline-block">
                  Dicono di noi
                  <span className="absolute bottom-2 left-0 w-full h-4 bg-sunfai-yellow -z-10 transform -rotate-1"></span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {reviews.map((review, idx) => (
                  <div key={idx} className="w-full border-2 border-black rounded-3xl p-8 flex flex-col bg-white shadow-lg hover:shadow-xl transition relative group">
                      <div className="absolute top-0 right-0 w-16 h-16 bg-sunfai-yellow opacity-20 rounded-bl-full rounded-tr-3xl -z-10 group-hover:opacity-100 transition duration-300"></div>
                      <h3 className="text-xl font-black mb-4">{review.title}</h3>
                      <p className="text-sm text-gray-700 mb-8 flex-grow leading-relaxed">
                        {review.text}
                      </p>
                      <div className="mt-auto">
                        <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{review.sub}</div>
                      </div>
                  </div>
                ))}
              </div>
          </div>
      </section>

      {/* NOTIZIE SECTION */}
      <section id="notizie" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6">
              <h2 className="text-4xl md:text-5xl font-black mb-16 relative inline-block">
                  Notizie
                  <span className="absolute bottom-2 left-0 w-full h-4 bg-sunfai-yellow -z-10 transform -rotate-1"></span>
              </h2>

              <div className="flex flex-col lg:flex-row gap-12">
                {news.length > 0 ? (
                  <>
                     <Link href={`/notizie/${news[0].id}`} className="w-full lg:w-1/2 group cursor-pointer block">
                        <div className="relative rounded-2xl overflow-hidden shadow-xl mb-6 aspect-[4/3]">
                           <Image 
                              src={news[0].image || '/assets/placeholder.jpg'} 
                              alt={news[0].title}
                              fill
                              className="object-cover transform transition duration-500 group-hover:scale-105"
                              unoptimized={!!news[0].image}
                           />
                           <div className="absolute bottom-0 left-0 p-6 bg-gradient-to-t from-black to-transparent w-full">
                              <span className="text-white text-sm font-bold mb-2 block">
                                {new Date(news[0].date).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })}
                              </span>
                              <h3 className="text-3xl font-black text-white leading-tight">{news[0].title}</h3>
                           </div>
                        </div>
                        <span className="bg-sunfai-yellow text-black px-6 py-2 rounded-full font-bold text-sm inline-block hover:bg-yellow-500 transition">
                            Leggi l'articolo
                        </span>
                     </Link>

                     <div className="w-full lg:w-1/2 flex flex-col justify-center space-y-12">
                        {news.slice(1).map(item => (
                          <div key={item.id}>
                              <h3 className="text-2xl font-black mb-2 leading-tight">{item.title}</h3>
                              <Link href={`/notizie/${item.id}`} className="text-black font-medium underline hover:text-sunfai-yellow transition">
                                  Clicca per leggere l'articolo
                              </Link>
                          </div>
                        ))}
                     </div>
                  </>
                ) : (
                  <p className="text-center w-full">Nessuna notizia disponibile al momento.</p>
                )}
              </div>

              <div className="text-center mt-12">
                  <Link href="/notizie" className="inline-block border-2 border-black rounded-full px-8 py-3 font-bold hover:bg-black hover:text-white transition duration-300">
                      Vedi tutte le notizie
                  </Link>
              </div>
          </div>
      </section>

      {/* PROSSIMI EVENTI SECTION */}
      <section id="eventi" className="py-20 bg-black text-white">
          <div className="max-w-7xl mx-auto px-6">
              <h2 className="text-4xl md:text-5xl font-black mb-16">I Prossimi Eventi</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {events.length > 0 ? events.map(event => (
                   <div key={event.id} className="flex items-start gap-4 group cursor-pointer">
                      <div className="bg-white text-black rounded-full w-16 h-16 flex flex-col items-center justify-center flex-shrink-0 border-4 border-transparent group-hover:border-sunfai-yellow transition">
                          <span className="text-xs font-bold text-red-500 uppercase">{new Date(event.date).toLocaleDateString('it-IT', { month: 'short' }).replace('.', '').toUpperCase()}</span>
                          <span className="text-2xl font-black leading-none">{new Date(event.date).getDate()}</span>
                      </div>
                      <div>
                          <h3 className="font-bold text-lg mb-1 group-hover:text-sunfai-yellow transition">{event.title}</h3>
                          <p className="text-gray-400 text-sm">
                             {event.time ? 'Ore ' + event.time + ' - ' : ''}{event.location}
                          </p>
                      </div>
                   </div>
                )) : (
                   <div className="col-span-3 text-center">
                       <p className="text-gray-400">Nessun evento in programma al momento.</p>
                   </div>
                )}
              </div>
          </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contatti" className="py-20 bg-white">
         <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row gap-8">
               {/* Left: Info Card */}
               <div className="w-full md:w-1/2 border-2 border-black rounded-3xl p-12 bg-white flex flex-col justify-between">
                   <div>
                       <h2 className="text-5xl font-black mb-6">Contattaci</h2>
                       <p className="text-lg font-bold mb-8 leading-relaxed">
                          Contattaci per ricevere <span className="yellow-brush-bg text-black inline-block transform -rotate-1">informazioni</span>,<br/>
                          proporre una collaborazione o unirti alla<br/>
                          comunità Sun-Fai.
                       </p>
                   </div>
                   
                   <div className="flex gap-4 mt-auto">
                      <a href="https://www.instagram.com/sun_fai_cooperativa/" target="_blank" className="text-black hover:text-sunfai-yellow transition duration-300">
                          <svg className="w-10 h-10 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 2A3.75 3.75 0 0 0 4 7.75v8.5A3.75 3.75 0 0 0 7.75 20h8.5A3.75 3.75 0 0 0 20 16.25v-8.5A3.75 3.75 0 0 0 16.25 4h-8.5ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm5.375-3.5a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25Z" />
                          </svg>
                      </a>
                      <a href="https://www.linkedin.com/in/sun-fai/" target="_blank" className="text-black hover:text-sunfai-yellow transition duration-300">
                          <svg className="w-10 h-10 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                          </svg>
                      </a>
                   </div>
               </div>
               
               <div className="w-full md:w-1/2 relative min-h-[400px]">
                   <Image 
                     src="/assets/contattaci.jpg" 
                     alt="Contattaci"
                     fill
                     className="object-cover rounded-3xl"
                   />
               </div>
            </div>
         </div>
      </section>
    </main>
  );
}
