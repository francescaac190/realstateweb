import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const QUICK_TAGS = ['Casas', 'Departamentos', 'Terrenos', 'Oficinas'];

const TAG_TYPE_IDS: Record<string, number> = {
  Casas: 1,
  Departamentos: 2,
  Terrenos: 3,
  Oficinas: 4,
};

export default function HeroSearchBar() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (query.trim()) params.set('q', query.trim());
    navigate(`/properties?${params.toString()}`);
  };

  const handleTagClick = (tag: string) => {
    const typeId = TAG_TYPE_IDS[tag];
    navigate(`/properties?typeId=${typeId}`);
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-2xl">
      {/* Search bar */}
      <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-3 shadow-lg">
        <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="text"
          placeholder="Ciudad, tipo de propiedad..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          className="flex-1 text-sm text-gray-700 placeholder-gray-400 bg-transparent outline-none"
        />
        <button
          onClick={handleSearch}
          className="bg-[#f97316] text-white text-sm font-semibold px-4 py-1.5 rounded-lg hover:bg-orange-600 transition-colors"
        >
          Buscar
        </button>
      </div>

      {/* Quick-filter tags */}
      <div className="flex gap-2 flex-wrap">
        {QUICK_TAGS.map((tag) => (
          <button
            key={tag}
            onClick={() => handleTagClick(tag)}
            className="text-xs text-white/80 border border-white/20 bg-white/10 hover:bg-white/20 rounded-full px-3 py-1 transition-colors"
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}
