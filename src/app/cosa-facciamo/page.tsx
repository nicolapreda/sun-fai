import Image from 'next/image';
import Link from 'next/link';

export default function CosaFacciamo() {
  return (
    <main className="flex-grow pt-40 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-5xl md:text-6xl font-black mb-16 relative inline-block">
          Cosa facciamo
          <span className="absolute bottom-3 left-0 w-full h-6 bg-sunfai-yellow -z-10 transform -rotate-1"></span>
        </h1>

        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Costruiamo comunità energetiche rinnovabili. Insieme.</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            Sun-Fai progetta, costituisce e gestisce Comunità Energetiche Rinnovabili. Leggi il nostro <a
              href="#" className="underline font-bold">Statuto</a> e il nostro <a href="#"
              className="underline font-bold">Regolamento</a>.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            All'interno di Sun-Fai, una CER diventa:
          </p>
          <ul className="list-disc list-inside text-lg text-gray-700 leading-relaxed space-y-2 mb-6 ml-4">
            <li>un'occasione di nuove relazioni e condivisione;</li>
            <li>un laboratorio di democrazia partecipativa;</li>
            <li>un modo concreto per praticare reciprocità e solidarietà;</li>
            <li>un percorso per sentirsi connessi e necessari, gli uni agli altri;</li>
            <li>un'opportunità per generare bene comune, sociale ed energetico;</li>
            <li>un impegno verso chi vive fragilità o situazioni di povertà.</li>
          </ul>
          <p className="text-lg text-gray-700 leading-relaxed mb-12">
            Scegliere una CER in Sun-Fai significa contribuire a un modello più giusto, umano e sostenibile.
          </p>

          <h2 className="text-2xl font-bold mb-6">Cosa facciamo oltre alle CER</h2>
          <ul className="list-disc list-inside text-lg text-gray-700 leading-relaxed space-y-2 mb-12 ml-4">
            <li>Partecipazione a bandi, sia per Sun-Fai sia per altre realtà interessate.</li>
            <li>Progettazione ed erogazione di percorsi formativi su temi energetici, sociali e cooperativi.
            </li>
            <li>Supporto a enti, associazioni, amministrazioni e privati nel diventare promotori di nuove
              CER.
            </li>
            <li>Crowdfunding e community funding, per sostenere progetti condivisi.</li>
            <li>Bilanci di sostenibilità e strumenti per la rendicontazione sociale.</li>
          </ul>

          <p className="text-lg font-bold mb-6">
            In generale, ci interessano tutti i progetti che uniscano l'impatto positivo sulle persone, il
            beneficio per il territorio, la tutela dell'ambiente e sostenibilità economica.
          </p>
          <p className="text-lg font-bold mb-6">
            Crediamo nelle persone.<br />
            Siamo aperti a collaborazioni e a nuovi progetti.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed mb-12">
            Se hai un'idea, un territorio da valorizzare o un percorso da far nascere, <Link href="/#contatti"
              className="underline font-bold">contattaci</Link>.
          </p>
        </div>

        {/* Image Grid */}
        <div className="flex justify-center mb-16">
          <div className="rounded-3xl overflow-hidden shadow-xl h-64 md:h-96 w-full md:w-2/3 relative">
            <Image 
                src="/assets/chi-siamo-2.webp" 
                alt="Sun-Fai Team Stand"
                fill
                className="object-cover transform hover:scale-105 transition duration-500"
            />
          </div>
        </div>

        <div className="text-center">
          <Link href="/" className="text-sm font-bold underline hover:text-sunfai-yellow transition">Torna
            alla
            home</Link>
        </div>
      </div>
    </main>
  );
}
