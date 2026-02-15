import { getNewsById } from '@/lib/data';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function Notizia({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const newsItem = await getNewsById(parseInt(id));

  if (!newsItem) {
    notFound();
  }

  const paragraphs = newsItem.content.split('\n').filter((p) => p.trim() !== '');

  return (
    <main className="flex-grow pt-40 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        {/* Breadcrumbs / Back Link */}
        <div className="mb-8">
          <Link
            href="/notizie"
            className="text-gray-500 hover:text-sunfai-yellow transition flex items-center gap-2 font-bold"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Torna alle notizie
          </Link>
        </div>

        {/* Article Header */}
        <header className="mb-12 text-center">
          <span className="inline-block bg-sunfai-yellow text-black text-sm font-bold px-4 py-1 rounded-full mb-6">
            {new Date(newsItem.date).toLocaleDateString('it-IT', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-8 leading-tight">{newsItem.title}</h1>
        </header>

        {/* Featured Image */}
        {newsItem.image && (
          <div className="rounded-3xl overflow-hidden shadow-2xl mb-12 relative h-[400px] md:h-[600px] w-full">
            <Image 
                src={newsItem.image} 
                alt={newsItem.title} 
                fill
                className="object-cover"
            />
          </div>
        )}

        {/* Article Content */}
        <article className="prose prose-lg md:prose-xl max-w-none text-gray-800 leading-relaxed">
          {paragraphs.map((p, index) => (
            <p key={index} className="mb-6">
              {p}
            </p>
          ))}
        </article>
      </div>
    </main>
  );
}
