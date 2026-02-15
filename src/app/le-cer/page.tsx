import Image from 'next/image';
import Link from 'next/link';

export default function LeCer() {
  return (
    <main className="flex-grow pt-40 pb-20">
      <div className="max-w-7xl mx-auto px-6">

        {/* SECTION 1: Le CER(S) in Sun-Fai */}
        <div className="flex flex-col lg:flex-row gap-16 items-start mb-32">
          <div className="w-full lg:w-1/2">
            <div className="rounded-3xl overflow-hidden shadow-2xl relative h-[400px]">
              <Image 
                src="/assets/chi-siamo-2.webp" 
                alt="Sun-Fai Stand" 
                fill
                className="object-cover"
            />
            </div>
          </div>
          <div className="w-full lg:w-1/2">
            <h1 className="text-4xl md:text-5xl font-black mb-8 relative inline-block">
              Le CER(S) in Sun-Fai
              <span
                className="absolute bottom-2 left-0 w-full h-4 bg-sunfai-yellow -z-10 transform -rotate-1"></span>
            </h1>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Sun-fai è una <span className="yellow-brush-bg">cooperativa</span>, una grande <span
                className="yellow-brush-bg">comunità energetica rinnovabile</span> che ospita al suo interno
              più
              configurazioni da tutta Italia.<br />
              Ogni configurazione è autonoma e fa riferimento alla propria cabina primaria. I soci della
              cooperativa scambiano virtualmente energia elettrica solo con i soci afferenti alla medesima
              cabina primaria.<br />
              Il regolamento interno è unico e condiviso, ma ogni configurazione ha autonomia per quel che
              le
              compete.<br />
              Dotiamo ogni configurazione di una piattaforma unica in Italia e sviluppata interamente da
              noi
              che permette ai soci della cooperativa di sapere in tempo reale quanta energia c'è a
              disposizione da scambiare virtualmente in ogni quarto orario. Ardaké.
            </p>
          </div>
        </div>

        {/* SECTION 2: Cosa sono le CER(S)? */}
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          <div className="w-full lg:w-1/2">
            <h2 className="text-4xl md:text-5xl font-black mb-8 relative inline-block">
              Cosa sono le CER(S)?
              <span
                className="absolute bottom-2 left-0 w-full h-4 bg-sunfai-yellow -z-10 transform -rotate-1"></span>
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              La <span className="yellow-brush-bg">definizione arriva direttamente</span> dal portale <span
                className="yellow-brush-bg">del GSE</span>:<br />
              Una CER è un insieme di cittadini, piccole e medie imprese, enti territoriali e autorità
              locali,
              incluse le amministrazioni comunali, le cooperative, gli enti di ricerca, gli enti
              religiosi,
              quelli del terzo settore e di protezione ambientale, che condividono l'energia elettrica
              rinnovabile prodotta da impianti nella disponibilità di uno o più soggetti associatisi alla
              comunità.<br />
              In una CER l'energia elettrica rinnovabile può essere condivisa tra i diversi soggetti
              produttori e consumatori, localizzati all'interno di un medesimo perimetro geografico,
              grazie
              all'impiego della rete nazionale di distribuzione di energia elettrica, che rende possibile
              la
              condivisione virtuale di tale energia.<br />
              In breve, è un meccanismo che prevede l'incentivazione di tutta l'energia che alcuni
              componenti
              della comunità riescono a produrre in eccesso e nel contempo altri componenti della comunità
              consumano nella medesima fascia oraria.<br />
              Gli incentivi che la comunità di energia rinnovabile riesce a raccogliere sono riconosciuti
              dal
              GSE alla cooperativa Sun-fai, la quale si preoccupa della redistribuzione secondo quanto
              stabilito dal regolamento interno, deciso dai soci della cooperativa.<br />
              Chi fa parte di una comunità di energia rinnovabile viene classificato secondo uno dei due
              ruoli
              previsti: autoconsumatore di energia rinnovabile (prosumer) o cliente finale (consumer).
            </p>
          </div>

          <div className="w-full lg:w-1/2">
            <div className="rounded-3xl overflow-hidden shadow-2xl relative h-[400px]">
              <Image 
                src="/assets/cosa-sono-le-cer.jpeg" 
                alt="Sun-Fai Card" 
                fill
                className="object-cover"
            />
            </div>
          </div>

        </div>

        <div className="text-center mt-20">
          <Link href="/" className="text-sm font-bold underline hover:text-sunfai-yellow transition">Torna
            alla
            home</Link>
        </div>
      </div>
    </main>
  );
}
