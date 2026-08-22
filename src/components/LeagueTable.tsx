'use client';

import React, { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import {
  Trophy,
  Calendar,
  Layers,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export const LeagueTable: React.FC = () => {
  const {
    leagues,
    clubs,
    standings,
    fixtures,
    currentRound,
    managers,
    activeManagerIndex,
  } = useGameStore();

  const activeManager = managers[activeManagerIndex - 1] || managers[0];
  const defaultLeagueId = activeManager ? clubs[activeManager.clubId]?.leagueId || 'ekstraklasa' : 'ekstraklasa';

  const [subTab, setSubTab] = useState<'table' | 'fixtures' | 'all_leagues'>('table');
  const [selectedLeagueId, setSelectedLeagueId] = useState<string>(defaultLeagueId);
  const [selectedRound, setSelectedRound] = useState<number>(currentRound);
  const [expandedLeagues, setExpandedLeagues] = useState<Record<string, boolean>>({ [defaultLeagueId]: true });

  const currentLeague = leagues[selectedLeagueId] || leagues.ekstraklasa;
  const leagueStandings = standings[selectedLeagueId] || [];
  const leagueFixtures = fixtures.filter(
    (f) => f.leagueId === selectedLeagueId && f.round === selectedRound
  );

  const toggleAccordion = (leagueId: string) => {
    setExpandedLeagues((prev) => ({
      ...prev,
      [leagueId]: !prev[leagueId],
    }));
  };

  return (
    <div className="flex flex-col gap-4 text-slate-100 font-sans leading-snug">
      {/* NAGŁÓWEK PODZAKŁADEK */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-3 shadow-md flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setSubTab('table')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              subTab === 'table'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Tabela Ligowa</span>
          </button>

          <button
            onClick={() => setSubTab('fixtures')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              subTab === 'fixtures'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
            <span>Wyniki & Terminarz</span>
          </button>

          <button
            onClick={() => setSubTab('all_leagues')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              subTab === 'all_leagues'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            <span>Podgląd Wszystkich Lig</span>
          </button>
        </div>

        <select
          value={selectedLeagueId}
          onChange={(e) => {
            setSelectedLeagueId(e.target.value);
            setSelectedRound(currentRound);
          }}
          className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs font-bold text-white focus:outline-none focus:border-emerald-500"
        >
          {Object.values(leagues).map((lg) => (
            <option key={lg.id} value={lg.id}>
              {lg.name} (Poziom {lg.tier})
            </option>
          ))}
        </select>
      </div>

      {/* TABELA LIGOWA */}
      {subTab === 'table' && (
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 shadow-md flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <h2 className="text-xs font-black text-white uppercase tracking-wider">
                {currentLeague.name} (Poziom {currentLeague.tier})
              </h2>
            </div>
            <span className="text-xs text-slate-400">Kolejka {currentRound}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs leading-tight">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-2 px-2">#</th>
                  <th className="py-2 px-3">Klub</th>
                  <th className="py-2 px-2 text-center">M</th>
                  <th className="py-2 px-2 text-center">Z</th>
                  <th className="py-2 px-2 text-center">R</th>
                  <th className="py-2 px-2 text-center">P</th>
                  <th className="py-2 px-2 text-center">Bramki</th>
                  <th className="py-2 px-2 text-center">+/-</th>
                  <th className="py-2 px-3 text-center font-black text-emerald-400">Pkt</th>
                  <th className="py-2 px-3 text-center">Forma</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {leagueStandings.map((st, idx) => {
                  const club = clubs[st.clubId];
                  if (!club) return null;
                  const isUserClub = club.isControlledByPlayer;

                  let rankBadge = 'text-slate-400';
                  let rowBorder = '';

                  if (idx === 0) {
                    rankBadge = 'text-amber-400 font-black';
                    rowBorder = 'border-l-4 border-amber-400 bg-amber-950/20';
                  } else if (idx < currentLeague.promotionSpots) {
                    rankBadge = 'text-emerald-400 font-bold';
                    rowBorder = 'border-l-4 border-emerald-500 bg-emerald-950/20';
                  } else if (idx < currentLeague.promotionSpots + (currentLeague.playoffSpots || 0)) {
                    rankBadge = 'text-blue-400 font-bold';
                    rowBorder = 'border-l-4 border-blue-500 bg-blue-950/20';
                  } else if (idx >= leagueStandings.length - currentLeague.relegationSpots) {
                    rankBadge = 'text-red-400 font-bold';
                    rowBorder = 'border-l-4 border-red-500 bg-red-950/20';
                  }

                  const rowBg = isUserClub
                    ? 'bg-emerald-950/50 font-bold border-l-4 border-emerald-400'
                    : rowBorder || 'hover:bg-slate-800/30';

                  return (
                    <tr key={st.clubId} className={`transition-all ${rowBg}`}>
                      <td className={`py-2 px-2 font-bold ${rankBadge}`}>{idx + 1}</td>
                      <td className="py-2 px-3 flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded flex items-center justify-center font-black text-[8px] shrink-0"
                          style={{ backgroundColor: club.primaryColor, color: club.secondaryColor }}
                        >
                          {club.shortName}
                        </div>
                        <span className={`truncate ${isUserClub ? 'text-emerald-300 font-black' : 'text-white'}`}>
                          {club.name} {isUserClub && '⭐'}
                        </span>
                      </td>
                      <td className="py-2 px-2 text-center text-slate-300">{st.played}</td>
                      <td className="py-2 px-2 text-center text-slate-300">{st.won}</td>
                      <td className="py-2 px-2 text-center text-slate-400">{st.drawn}</td>
                      <td className="py-2 px-2 text-center text-slate-400">{st.lost}</td>
                      <td className="py-2 px-2 text-center text-slate-300">{st.goalsFor}:{st.goalsAgainst}</td>
                      <td className="py-2 px-2 text-center text-slate-400">
                        {st.goalDifference > 0 ? `+${st.goalDifference}` : st.goalDifference}
                      </td>
                      <td className="py-2 px-3 text-center font-black text-xs text-emerald-400">{st.points}</td>
                      <td className="py-2 px-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          {st.form.slice(-5).map((res, i) => (
                            <span
                              key={i}
                              className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-black text-slate-950 ${
                                res === 'W' ? 'bg-emerald-400' : res === 'D' ? 'bg-amber-400' : 'bg-red-500 text-white'
                              }`}
                            >
                              {res}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* WYNIKI I TERMINARZ */}
      {subTab === 'fixtures' && (
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 shadow-md flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-400" />
              <h2 className="text-xs font-black text-white uppercase tracking-wider">
                {currentLeague.name} (Kolejka {selectedRound})
              </h2>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                disabled={selectedRound <= 1}
                onClick={() => setSelectedRound((r) => Math.max(1, r - 1))}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 rounded-lg text-xs text-white transition-all font-bold"
              >
                ◀
              </button>
              <span className="text-xs text-slate-400 font-bold px-1">Runda {selectedRound}</span>
              <button
                disabled={selectedRound >= 34}
                onClick={() => setSelectedRound((r) => r + 1)}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 rounded-lg text-xs text-white transition-all font-bold"
              >
                ▶
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {leagueFixtures.map((fix) => {
              const home = clubs[fix.homeClubId];
              const away = clubs[fix.awayClubId];
              if (!home || !away) return null;

              return (
                <div
                  key={fix.id}
                  className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2 w-5/12">
                    <div
                      className="w-4 h-4 rounded flex items-center justify-center font-black text-[8px] shrink-0"
                      style={{ backgroundColor: home.primaryColor, color: home.secondaryColor }}
                    >
                      {home.shortName}
                    </div>
                    <span className="font-bold text-white truncate">{home.name}</span>
                  </div>

                  <div className="px-2.5 py-1 bg-slate-900 rounded-lg border border-slate-700 font-black text-emerald-400 text-xs text-center shrink-0">
                    {fix.played ? `${fix.scoreHome} : ${fix.scoreAway}` : 'VS'}
                  </div>

                  <div className="flex items-center justify-end gap-2 w-5/12 text-right">
                    <span className="font-bold text-white truncate">{away.name}</span>
                    <div
                      className="w-4 h-4 rounded flex items-center justify-center font-black text-[8px] shrink-0"
                      style={{ backgroundColor: away.primaryColor, color: away.secondaryColor }}
                    >
                      {away.shortName}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* PODGLĄD WSZYSTKICH LIG */}
      {subTab === 'all_leagues' && (
        <div className="flex flex-col gap-3">
          {Object.values(leagues).map((lg) => {
            const isExpanded = !!expandedLeagues[lg.id];
            const lgStandings = standings[lg.id] || [];

            return (
              <div key={lg.id} className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-md overflow-hidden">
                <button
                  onClick={() => toggleAccordion(lg.id)}
                  className="w-full p-3 flex items-center justify-between bg-slate-950/60 hover:bg-slate-800/50 transition-all text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center text-xs font-black text-emerald-400">
                      {lg.tier}
                    </div>
                    <div>
                      <h3 className="text-xs font-black text-white">{lg.name}</h3>
                      <div className="text-[10px] text-slate-400">
                        {lg.clubIds.length} drużyn • Awans: {lg.promotionSpots}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                    <span>{isExpanded ? 'Zwiń' : 'Rozwiń'}</span>
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="p-3 border-t border-slate-800/80 overflow-x-auto">
                    <table className="w-full text-left text-xs leading-tight">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                          <th className="py-1.5 px-2">#</th>
                          <th className="py-1.5 px-3">Klub</th>
                          <th className="py-1.5 px-2 text-center">M</th>
                          <th className="py-1.5 px-2 text-center">Z-R-P</th>
                          <th className="py-1.5 px-2 text-center">Bramki</th>
                          <th className="py-1.5 px-3 text-center font-black text-emerald-400">Pkt</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {lgStandings.map((st, idx) => {
                          const club = clubs[st.clubId];
                          if (!club) return null;

                          return (
                            <tr key={st.clubId} className="hover:bg-slate-800/30">
                              <td className="py-1.5 px-2 font-bold text-slate-400">{idx + 1}</td>
                              <td className="py-1.5 px-3 flex items-center gap-2">
                                <div
                                  className="w-3.5 h-3.5 rounded text-[8px] font-black flex items-center justify-center shrink-0"
                                  style={{ backgroundColor: club.primaryColor, color: club.secondaryColor }}
                                >
                                  {club.shortName}
                                </div>
                                <span className="font-bold text-white truncate">{club.name}</span>
                              </td>
                              <td className="py-1.5 px-2 text-center text-slate-300">{st.played}</td>
                              <td className="py-1.5 px-2 text-center text-slate-400">{st.won}-{st.drawn}-{st.lost}</td>
                              <td className="py-1.5 px-2 text-center text-slate-300">{st.goalsFor}:{st.goalsAgainst}</td>
                              <td className="py-1.5 px-3 text-center font-black text-emerald-400">{st.points}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
