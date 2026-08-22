'use client';

import React from 'react';
import { useGameStore } from '@/store/gameStore';
import { Newspaper, Calendar, ArrowRight, Trophy } from 'lucide-react';

export const NewsView: React.FC = () => {
  const { news } = useGameStore();

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-6">
      {/* Nagłówek prasy */}
      <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Newspaper className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black tracking-wide text-white uppercase">
              Przegląd Futbolowy 2026
            </h2>
            <p className="text-xs text-slate-400">
              Oficjalny serwis informacyjny polskich lig piłkarskich
            </p>
          </div>
        </div>

        <div className="text-xs text-slate-400 bg-slate-950 px-4 py-2 rounded-2xl border border-slate-800 flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5 text-emerald-400" />
          <span>Wydanie Sezonowe • Rok 2026</span>
        </div>
      </div>

      {/* Lista artykułów prasowych */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {news.map((item, idx) => (
          <div
            key={item.id}
            className={`p-6 rounded-3xl border transition-all flex flex-col justify-between shadow-xl ${
              idx === 0
                ? 'md:col-span-2 bg-gradient-to-br from-slate-900 to-emerald-950/40 border-emerald-500/40'
                : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div>
              <div className="flex items-center justify-between text-xs mb-3">
                <span
                  className={`font-black uppercase tracking-wider px-2.5 py-1 rounded-lg ${
                    item.category === 'league'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : item.category === 'transfer'
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}
                >
                  {item.category === 'league'
                    ? 'Wydarzenie Kolejki'
                    : item.category === 'transfer'
                    ? 'Rynek Transferowy'
                    : 'Klubowe'}
                </span>
                <span className="text-slate-500 font-medium">Kolejka {item.round}</span>
              </div>

              <h3 className={`font-black text-white leading-snug mb-3 ${idx === 0 ? 'text-lg sm:text-xl' : 'text-base'}`}>
                {item.title}
              </h3>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {item.content}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span>Przegląd Futbolowy / Redakcja</span>
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
