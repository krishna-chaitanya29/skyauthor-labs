"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative max-w-lg mx-auto w-full">
      <input
        type="text"
        placeholder="Search SkyAuthor Labs..."
        className="w-full px-5 py-3 pl-12 rounded-full border border-gray-200 focus:border-blue-500 outline-none shadow-sm transition-all"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
    </form>
  );
}