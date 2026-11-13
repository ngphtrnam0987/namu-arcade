import React, { useState, useMemo } from 'react';
import { GAMES_REGISTRY } from '../games/registry';
import { GameCard } from '../components/ui/GameCard';
import { soundService } from '../services/sound';
import { Search, Gamepad2, Filter } from 'lucide-react';

export const GameLibraryPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredGames = useMemo(() => {
    return GAMES_REGISTRY.filter((game) => {
      const matchesSearch =
        game.name.toLowerCase().includes(search.toLowerCase()) ||
        game.description.toLowerCase().includes(search.toLowerCase()) ||
        game.tagline.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        selectedCategory === 'all' || game.category.toLowerCase() === selectedCategory.toLowerCase();
      return matchesSearch && matchesCategory;
    });
  }, [search, selectedCategory]);

  const categories = ['all', 'Arcade', 'Puzzle'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
          <Gamepad2 className="w-4 h-4" />
          <span>Full Catalog</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">Game Library</h1>
        <p className="text-sm text-slate-400 mt-1 max-w-xl">
          Browse all current V1.0 titles and future arcade modules. Zero install required.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl glass-panel border border-slate-800">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title, genre, or mechanics..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition"
          />
        </div>

        {/* Categories */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <Filter className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                soundService.playClick();
                setSelectedCategory(cat);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${
                selectedCategory.toLowerCase() === cat.toLowerCase()
                  ? 'bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(0,240,255,0.3)]'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Games Grid */}
      {filteredGames.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredGames.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 rounded-2xl glass-panel border border-slate-800 space-y-3">
          <Gamepad2 className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-slate-300">No games matched your criteria</h3>
          <p className="text-sm text-slate-500">Try adjusting your search terms or category filter.</p>
        </div>
      )}
    </div>
  );
};
