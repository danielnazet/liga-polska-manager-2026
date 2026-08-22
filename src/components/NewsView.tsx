'use client';

import React, { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { Newspaper, Calendar, ArrowRight, Globe, Trophy, ArrowRightLeft, Shield } from 'lucide-react';

export const NewsView: React.FC = () => {
  const { news, gameDate } = useGameStore();

  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  // Przykładowe światowe newsy (doklejane do listy newsów ligowych)
  const worldNewsList = [
    {
      id: 'world_1',
      date: gameDate,
      round: 1,
      title: 'Liga Mistrzów UEFA: Wyniki losowania fazy ligowej!',
      content: 'Europejska Unia Piłkarska ogłosiła oficjalny podział koszyków w nowym formacie Ligi Mistrzów. Najlepsze kluby ze Świata staną do walki o puchar w maju 2027.',
      category: 'world' as const,
    },
    {
      id: 'world_2',
      date: gameDate,
      round: 1,
      title: 'Real Madryt i Manchester City przygotowują rekordowy transfer lata!',
      content: 'Według światowych doniesień giganci Premier League i La Liga szykują wymianę zawodników o łącznej wartości ponad 180 milionów euro.',
      category: 'world' as const,
    },
    {
      id: 'world_3',
      date: gameDate,
      round: 1,
      title: 'Złota Piłka 2026: Polscy kibice śledzą notowania napastników!',
      content: 'Plebiscyt France Football zbliża się wielkimi krokami. Analitycy sportowi oceniają szanse polskich i światowych gwiazd na końcowe zwycięstwo.',
      category: 'world' as const,
    },
  ];

  const allNewsCombined = [...worldNewsList, ...news];

  const filteredNews = allNewsCombined.filter((item) => {
    if (categoryFilter === 'ALL') return true;
    if (categoryFilter === 'world' && item.category === 'world') return true;
    if (categoryFilter === 'league' && item.category === 'league') return true;
    if (categoryFilter === 'transfer' && item.category === 'transfer') return true;
    return false;
  });

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-6">
      {/* Nagłówek prasy */}
      <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black tracking-wide text-white uppercase flex items-center gap-2">
              <span>Światowy Przegląd Futbolowy 2026</span>
            </h2>
            <p className="text-xs text-slate-400">
              Wiadomości ze Świata, Ligi Mistrzów, Ekstraklasy oraz polskiej piramidy ligowej
            </p>
          </div>
        </div>

        <div className="text-xs text-slate-400 bg-slate-950 px-4 py-2 rounded-2xl border border-slate-800 flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5 text-emerald-400" />
          <span>Wydanie Światowe • Rok 2026</span>
        </div>
      </div>

      {/* Filtry kategorii newsów */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-3 flex flex-wrap gap-2">
        <button
          onClick={() => setCategoryFilter('ALL')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            categoryFilter === 'ALL'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-slate-950 text-slate-400 hover:text-white'
          }`}
        >
          Wszystkie Wiadomości
        </button>

        <button
          onClick={() => setCategoryFilter('world')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            categoryFilter === 'world'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-slate-950 text-slate-400 hover:text-white'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Ze Świata & LM</span>
        </button>

        <button
          onClick={() => setCategoryFilter('league')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            categoryFilter === 'league'
              ? 'bg-amber-600 text-white shadow-md'
              : 'bg-slate-950 text-slate-400 hover:text-white'
          }`}
        >
          <Trophy className="w-3.5 h-3.5" />
          <span>Ligi Polskie</span>
        </button>

        <button
          onClick={() => setCategoryFilter('transfer')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            categoryFilter === 'transfer'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-slate-950 text-slate-400 hover:text-white'
          }`}
        >
          <ArrowRightLeft className="w-3.5 h-3.5" />
          <span>Rynek Transferowy</span>
        </button>
      </div>

      {/* Lista artykułów prasowych */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredNews.map((item, idx) => (
          <div
            key={item.id}
            className={`p-6 rounded-3xl border transition-all flex flex-col justify-between shadow-xl ${
              idx === 0 && categoryFilter === 'ALL'
                ? 'md:col-span-2 bg-gradient-to-br from-slate-900 to-emerald-950/40 border-emerald-500/40'
                : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div>
              <div className="flex items-center justify-between text-xs mb-3">
                <span
                  className={`font-black uppercase tracking-wider px-2.5 py-1 rounded-lg ${
                    item.category === 'world'
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      : item.category === 'league'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : item.category === 'transfer'
                      ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}
                >
                  {item.category === 'world'
                    ? 'Ze Świata'
                    : item.category === 'league'
                    ? 'Wydarzenie Kolejki'
                    : item.category === 'transfer'
                    ? 'Rynek Transferowy'
                    : 'Klubowe'}
                </span>
                <span className="text-slate-500 font-medium">Kolejka {item.round}</span>
              </div>

              <h3 className={`font-black text-white leading-snug mb-3 ${idx === 0 && categoryFilter === 'ALL' ? 'text-lg sm:text-xl' : 'text-base'}`}>
                {item.title}
              </h3>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {item.content}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span>Światowa Agencja Prasowa / Redakcja</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                Czytaj dalej <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
