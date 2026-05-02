import ElectionNews from '@/components/ElectionNews';
import { Newspaper } from 'lucide-react';

export const metadata = {
  title: 'Election News | ElectionIQ',
  description: 'Stay updated with the latest Indian election news, voter registration drives, and election commission announcements.',
};

export default function NewsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      <main className="container mx-auto px-4 py-12 max-w-5xl">
        <header className="mb-10">
          <div className="inline-flex items-center gap-3 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-bold mb-4">
            <Newspaper className="w-4 h-4" /> Live Updates
          </div>
          <h1 className="text-4xl font-extrabold text-gray-800 mb-3">Latest Election News</h1>
          <p className="text-gray-500 text-lg">Stay informed with the latest updates from the Election Commission of India and related news.</p>
        </header>
        <ElectionNews />
      </main>
    </div>
  );
}
