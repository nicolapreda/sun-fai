import { getAllNews } from '@/lib/data';
import Image from 'next/image';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function Notizie() {
  const news = await getAllNews();

  return (
    <main className="flex-grow pt-40 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-5xl md:text-6xl font-black mb-16 relative inline-block">
          Notizie
          <span className="absolute bottom-3 left-0 w-full h-6 bg-sunfai-yellow -z-10 transform -rotate-1"></span>
        </h1>

        <div className="space-y-16">
          {news.length === 0 ? (
            <p className="text-center text-gray-600">Nessuna notizia disponibile al momento.</p>
          ) : (
            news.map((item) => (
              <div key={item.id}>
                <article>
                  {item.image && (
                    <Link href={`/notizie/${item.id}`} className="block mb-6 relative h-64 w-full rounded-xl overflow-hidden shadow-md">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover transition duration-300 hover:opacity-90"
                      />
                    </Link>
                  )}
                  <h2 className="text-3xl font-black mb-4 leading-tight">
                    <Link href={`/notizie/${item.id}`} className="hover:text-sunfai-yellow transition">
                      {item.title}
                    </Link>
                  </h2>
                  <p className="text-sm text-gray-500 mb-2">
                    {new Date(item.date).toLocaleDateString('it-IT')}
                  </p>
                  <p className="text-lg text-gray-700 leading-relaxed mb-4">
                    {item.content.substring(0, 300).replace(/\n/g, ' ')}...
                  </p>
                  <Link
                    href={`/notizie/${item.id}`}
                    className="inline-block bg-black text-white px-6 py-2 rounded-full font-bold text-sm hover:bg-sunfai-yellow hover:text-black transition"
                  >
                    Leggi tutto
                  </Link>
                </article>
                <hr className="border-gray-200 mt-16" />
              </div>
            ))
          )}
        </div>

        <div className="text-center mt-20">
          <Link href="/" className="text-sm font-bold underline hover:text-sunfai-yellow transition">
            Torna alla home
          </Link>
        </div>
      </div>
    </main>
  );
}
