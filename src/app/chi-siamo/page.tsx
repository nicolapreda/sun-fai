import Link from 'next/link';
import Image from 'next/image';

const boardMembers = [
    { name: "Francesco Crivena", role: "Presidente", img: "/assets/chi-siamo/Francesco Crivena.png" },
    { name: "Andrea Zonca", role: "Vicepresidente", img: "/assets/chi-siamo/Andrea Zonca.png" },
    { name: "Stefano Crivena", role: "Consigliere", img: "/assets/chi-siamo/Stefano crivena.png" },
    { name: "Alceste Perico", role: "Consigliere", img: "/assets/chi-siamo/Alceste Perico.png" }
];

const collaborators = [
    { name: 'Andrea Belotti', img: 'Andrea Belotti.png' },
    { name: 'Beatrice Parimbelli', img: 'Beatrice Parimbelli.png' },
    { name: 'Benedetta Petro', img: 'Benedetta Petro.png' }, // Adjusted name if valid
    { name: 'Chiara Crivena', img: 'Chiara Crivena.png' },
    { name: 'Giorgio Venezia', img: 'Giorgio Venezia.png' },
    { name: 'Lorenzo Ciresa', img: 'Lorenzo Ciresa.png' },
    { name: 'Nicholas Previtali', img: 'Nicholas Previtali.png' },
    { name: 'Nicola Preda', img: 'Nicola Preda.png' },
    { name: 'Simone Mazzoleni', img: 'Simone Mazzoleni.png' }
];

export const metadata = {
  title: 'Chi Siamo | Sun-Fai Cooperativa',
  description: 'Scopri la storia di Sun-Fai, la cooperativa energetica nata nella Bergamasca.',
};

export default function ChiSiamo() {
  return (
    <main className="bg-white">
      {/* INTRO SECTION */}
      <section className="pt-40 pb-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-5xl md:text-6xl font-black mb-12 relative inline-block">
            Chi siamo
            <span className="absolute bottom-3 left-0 w-full h-6 bg-sunfai-yellow -z-10 transform -rotate-1"></span>
          </h1>

          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="w-full lg:w-1/2">
              <p className="text-xl md:text-2xl leading-relaxed mb-8">
                Sun-Fai è una <span className="font-black">cooperativa </span> che nasce nella <span className="font-black">Bergamasca</span> e si estende oggi in tutta <span className="font-black">Italia</span>. Crediamo in un nuovo modello di <span className="font-black">energia condivisa</span>, dove le <span className="font-black">Comunità Energetiche Rinnovabili (CER)</span> diventano lo strumento per creare <span className="font-black">valore sociale</span>, generare <span className="font-black">risparmio reale</span> favorire un <span className="font-black">futuro</span> più pulito e <span className="font-black">responsabile</span>. Con Sun-Fai, ogni scelta energetica diventa un passo verso il <span className="font-black">bene comune</span>.
              </p>

              <div className="flex flex-col gap-4">
                <a href="#" className="block w-full border-2 border-black rounded-full py-4 px-8 font-bold text-center text-lg uppercase hover:bg-black hover:text-white transition">Leggi lo Statuto</a>
                <a href="#" className="block w-full border-2 border-black rounded-full py-4 px-8 font-bold text-center text-lg uppercase hover:bg-black hover:text-white transition">Leggi il Regolamento interno</a>
              </div>
            </div>
            <div className="w-full lg:w-1/2">
              <div className="rounded-3xl overflow-hidden shadow-2xl">
                <Image src="/assets/chi-siamo-2.jpeg" alt="Sun-Fai Team" width={800} height={600} className="w-full h-auto" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PERCHÉ PARTECIPARE SECTION */}
      <section className="py-20 bg-black text-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-black mb-16 relative inline-block text-white">
            Perchè partecipare?
            <span className="absolute bottom-2 left-0 w-full h-4 bg-sunfai-yellow -z-10 transform -rotate-1 opacity-80"></span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="flex flex-col items-center group">
              <div className="mb-6 transform transition duration-500 group-hover:scale-110">
                <Image src="/assets/riduci-costi-energetici.png" alt="Riduci i costi energetici" width={200} height={200} className="h-32 object-contain w-auto" />
              </div>
              <h3 className="text-3xl md:text-4xl font-black mb-4 leading-tight">Riduci i costi<br/>energetici</h3>
            </div>
            <div className="flex flex-col items-center group">
              <div className="mb-6 transform transition duration-500 group-hover:scale-110">
                <Image src="/assets/riduci-le-emissioni.png" alt="Riduci le emissioni" width={200} height={200} className="h-32 object-contain w-auto" />
              </div>
              <h3 className="text-3xl md:text-4xl font-black mb-4 leading-tight">Riduci le<br/>emissioni</h3>
            </div>
            <div className="flex flex-col items-center group">
              <div className="mb-6 transform transition duration-500 group-hover:scale-110">
                <Image src="/assets/sostieni-il-tuo-territorio.png" alt="Sostieni il tuo territorio" width={200} height={200} className="h-32 object-contain w-auto" />
              </div>
              <h3 className="text-3xl md:text-4xl font-black mb-4 leading-tight">Sostieni il tuo<br/>territorio</h3>
            </div>
          </div>
        </div>
      </section>

      {/* CONSIGLIO DI AMMINISTRAZIONE SECTION */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-black mb-16 relative inline-block">
            Il Consiglio Di<br/>Amministrazione
            <span className="absolute bottom-2 left-0 w-full h-4 bg-sunfai-yellow -z-10 transform -rotate-1"></span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mx-auto">
             {boardMembers.map((member, idx) => (
                <div key={idx} className="group relative w-full aspect-square bg-gray-200 rounded-2xl overflow-hidden cursor-pointer shadow-lg">
                   <Image 
                     src={member.img} 
                     alt={member.name} 
                     fill 
                     className="object-cover transition duration-500 group-hover:scale-110 block"
                   />
                   <div className="absolute inset-0 bg-[#1a1a1a] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                      <span className="text-sunfai-yellow font-bold uppercase tracking-wider mb-2 text-sm">{member.role}</span>
                      <h3 className="text-white text-3xl font-black leading-tight mb-6" dangerouslySetInnerHTML={{ __html: member.name.replace(' ', '<br/>') }}></h3>
                      <div className="w-10 h-10 rounded-full border border-white flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition duration-300">
                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                         </svg>
                      </div>
                   </div>
                </div>
             ))}
          </div>
        </div>
      </section>

      {/* I COLLABORATORI SECTION */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
           <h2 className="text-4xl md:text-5xl font-black mb-16 relative inline-block">
             I collaboratori
             <span className="absolute bottom-2 left-0 w-full h-4 bg-sunfai-yellow -z-10 transform -rotate-1"></span>
           </h2>

           <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {collaborators.map((collab, idx) => (
                 <div key={idx} className="group relative w-full aspect-square bg-gray-200 rounded-xl overflow-hidden cursor-pointer shadow-md">
                     <Image 
                        src={`/assets/chi-siamo/${collab.img}`} 
                        alt={collab.name} 
                        fill
                        className="object-cover transition duration-500 group-hover:scale-110 block"
                     />
                     <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                        <h4 className="text-white text-3xl font-black leading-tight mb-2">
                            {collab.name.split(' ')[0]}<br/>{collab.name.split(' ').slice(1).join(' ')}
                        </h4>
                     </div>
                 </div>
              ))}
           </div>
        </div>
      </section>
    </main>
  );
}
