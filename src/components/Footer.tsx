import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="py-12 bg-black text-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <Image 
                src="/assets/logo.png" 
                alt="Sun-Fai Logo" 
                width={150} 
                height={48} 
                className="h-12 mb-4 brightness-0 invert w-auto" 
            />
            <p className="text-sm text-gray-400 mb-6">Energia condivisa per un futuro sostenibile</p>
            <div className="flex gap-4 items-center">
              <a href="https://www.instagram.com/sun_fai_cooperativa/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-sunfai-yellow transition duration-300 cursor-pointer">
                <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 2A3.75 3.75 0 0 0 4 7.75v8.5A3.75 3.75 0 0 0 7.75 20h8.5A3.75 3.75 0 0 0 20 16.25v-8.5A3.75 3.75 0 0 0 16.25 4h-8.5ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm5.375-3.5a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25Z" />
                </svg>
              </a>
              <a href="https://www.linkedin.com/in/sun-fai/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-sunfai-yellow transition duration-300 cursor-pointer">
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-4">Link Rapidi</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/" className="hover:text-sunfai-yellow transition">Home</Link></li>
              <li><Link href="/chi-siamo" className="hover:text-sunfai-yellow transition">Chi Siamo</Link></li>
              <li><Link href="/notizie" className="hover:text-sunfai-yellow transition">Notizie</Link></li>
              <li><Link href="/#eventi" className="hover:text-sunfai-yellow transition">Eventi</Link></li>
              <li><Link href="/admin/dashboard" className="hover:text-sunfai-yellow transition">Sezione admin</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Servizi</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/#configurazioni" className="hover:text-sunfai-yellow transition">Configurazioni</Link></li>
              <li><Link href="/#contatti" className="hover:text-sunfai-yellow transition">Contatti</Link></li>
              <li><Link href="#" className="hover:text-sunfai-yellow transition">FAQ</Link></li>
              <li><Link href="#" className="hover:text-sunfai-yellow transition">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
          <p>©2026 Sun-Fai Cooperativa. Tutti i diritti riservati.</p>
          <p className="mt-2">
            Developed with love❤️ by <a href="https://predanicola.it" target="_blank" rel="noopener noreferrer" className="hover:text-sunfai-yellow transition underline">Nicola Preda</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
