import Image from 'next/image';
import Link from 'next/link';

export default function DiventaSocio() {
  return (
    <main className="flex-grow pt-40 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Left Column */}
          <div className="w-full lg:w-1/2">
            <h1 className="text-5xl md:text-6xl font-black mb-16 relative inline-block">
              Diventa socio
              <span
                className="absolute bottom-3 left-0 w-full h-6 bg-sunfai-yellow -z-10 transform -rotate-1"></span>
            </h1>

            <div className="space-y-8">
              <a href="https://drive.google.com/file/d/1hfUPnlpROJvsaMqVHttI_ykHRCRb5_-b/view?usp=drive_link"
                className="block border-2 border-black rounded-full p-6 hover:bg-black hover:text-white transition group">
                <span className="font-bold text-lg block mb-1 underline group-hover:no-underline">Diventa
                  socio
                  SUN-FAI:</span>
                <span className="font-black text-xl uppercase">clicca qui per il modulo PERSONE
                  FISICHE.</span>
              </a>

              <a href="https://drive.google.com/file/d/1Hx6sfmzUmkI2Hxt8OfPAzYJPKAxRXI_u/view?usp=drive_link"
                className="block border-2 border-black rounded-full p-6 hover:bg-black hover:text-white transition group">
                <span className="font-bold text-lg block mb-1 underline group-hover:no-underline">Diventa
                  socio
                  SUN-FAI:</span>
                <span className="font-black text-xl uppercase">clicca qui per il modulo PERSONE
                  GIURIDICHE.</span>
              </a>
            </div>
          </div>

          {/* Right Column: Illustration */}
          <div className="w-full lg:w-1/2">
            <div className="relative h-[400px] w-full">
                <Image 
                    src="/assets/dinventa-socio.jpg" 
                    alt="Diventa Socio Illustration"
                    fill
                    className="object-contain"
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
