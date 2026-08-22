'use client';

import React, { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { Trophy, Calendar, Check, Minus, X as CloseIcon, Shield, ChevronRight, Layers } from 'lucide-react';

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

  const [selectedLeagueId, setSelectedLeagueId] = useState<string>(defaultLeagueId);
  const [selectedRound, setSelectedRound] = useState<number>(currentRound);

  const currentLeague = leagues[selectedLeagueId] || leagues.ekstraklasa;
  const leagueStandings = standings[selectedLeagueId] || [];
  const leagueFixtures = fixtures.filter(
    (f) => f.leagueId === selectedLeagueId && f.round === selectedRound
  );

  // Filtrowanie lig według poziomów (Tier)
  const tierNames: Record<number, string> = {
    1: 'I: Ekstraklasa',
    2: 'II: 1. Liga',
    3: 'III: 2. Liga',
    4: 'IV: 3. Liga',
    5: 'V: IV Liga',
    6: 'VI: V Liga',
    7: 'VII: Okręgowa',
    8: 'VIII: Klasa B',
    9: 'IX: Klasa C',
  };

  const leaguesByTier = Object.values(leagues).reduce<Record<number, typeof currentLeague[]>>((acc, lg) => {
    acc[lg.tier] = acc[lg.tier] || [];
    acc[lg.tier].push(lg);
    return acc;
  }, {});

  return (
    <div className="flex flex-col gap-6">
      {/* Przełącznik Poziomów i Grup Ligowych */}
      <div className="bg-slate-900/90 p-4 rounded-3xl border border-slate-800 shadow-xl flex flex-col gap-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
          <Layers className="w-4 h-4" />
          <span>Wybierz poziom i grupę rozgrywkową:</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {Object.entries(leaguesByTier)
            .sort(([t1], [t2]) => Number(t1) - Number(t2))
            .map(([tierStr, tierLeagues]) => {
              const tier = Number(tierStr);
              const isSelectedTier = tierLeagues.some((l) => l.id === selectedLeagueId);

              return (
                <div key={tier} className="flex flex-col gap-1">
                  <div className="text-[10px] font-black text-slate-500 uppercase px-1">
                    {tierNames[tier] || `Poziom ${tier}`}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {tierLeagues.map((lg) => (
                      <button
                        key={lg.id}
                        onClick={() => {
                          setSelectedLeagueId(lg.id);
                          setSelectedRound(currentRound);
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all truncate max-w-[200px] ${
                          selectedLeagueId === lg.id
                            ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/60 border border-emerald-400'
                            : 'bg-slate-950/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                        }`}
                        title={lg.name}
                      >
                        {lg.name}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Tabela Ligowa */}
        <div className="lg:col-span-8 bg-slate-900/90 rounded-3xl border border-slate-800 p-6 shadow-xl flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <h2 className="text-base font-black text-white uppercase tracking-wider">
                {currentLeague.name} (Poziom {currentLeague.tier})
              </h2>
            </div>
            <span className="text-xs text-slate-400">Kolejka {currentRound}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-2.5 px-2">#</th>
                  <th className="py-2.5 px-3">Klub</th>
                  <th className="py-2.5 px-2 text-center">M</th>
                  <th className="py-2.5 px-2 text-center">Z</th>
                  <th className="py-2.5 px-2 text-center">R</th>
                  <th className="py-2.5 px-2 text-center">P</th>
                  <th className="py-2.5 px-2 text-center">Bramki</th>
                  <th className="py-2.5 px-2 text-center">+/-</th>
                  <th className="py-2.5 px-3 text-center font-black text-emerald-400">Pkt</th>
                  <th className="py-2.5 px-3 text-center">Forma</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {leagueStandings.map((st, idx) => {
                  const club = clubs[st.clubId];
                  if (!club) return null;
                  const isUserClub = club.isControlledByPlayer;

                  // Oznaczenia stref (Awanse, Baraże, Spadki)
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
                      <td className={`py-3 px-2 font-bold ${rankBadge}`}>
                        {idx + 1}
                      </td>
                      <td className="py-3 px-3 flex items-center gap-2.5">
                        <div
                          className="w-5 h-5 rounded flex items-center justify-center font-black text-[9px] shrink-0 shadow-sm"
                          style={{ backgroundColor: club.primaryColor, color: club.secondaryColor }}
                        >
                          {club.shortName}
                        </div>
                        <span className={`truncate ${isUserClub ? 'text-emerald-300 font-black' : 'text-white'}`}>
                          {club.name} {isUserClub && '⭐'}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-center text-slate-300">{st.played}</td>
                      <td className="py-3 px-2 text-center text-slate-300">{st.won}</td>
                      <td className="py-3 px-2 text-center text-slate-400">{st.drawn}</td>
                      <td className="py-3 px-2 text-center text-slate-400">{st.lost}</td>
                      <td className="py-3 px-2 text-center text-slate-300">
                        {st.goalsFor}:{st.goalsAgainst}
                      </td>
                      <td className="py-3 px-2 text-center text-slate-400">
                        {st.goalDifference > 0 ? `+${st.goalDifference}` : st.goalDifference}
                      </td>
                      <td className="py-3 px-3 text-center font-black text-sm text-emerald-400">
                        {st.points}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          {st.form.slice(-5).map((res, i) => (
                            <span
                              key={i}
                              className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black text-slate-950 ${
                                res === 'W'
                                  ? 'bg-emerald-400'
                                  : res === 'D'
                                  ? 'bg-amber-400'
                                  : 'bg-red-500 text-white'
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

          {/* LEGENDA AWANSÓW I SPADKÓW */}
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-400">
            {currentLeague.tier === 1 ? (
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-amber-400 inline-block" />
                <span>Mistrz Polski / Liga Mistrzów</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-emerald-500 inline-block" />
                <span>Awans bezpośredni ({currentLeague.promotionSpots} miejsca)</span>
              </div>
            )}

            {currentLeague.playoffSpots > 0 && (
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-blue-500 inline-block" />
                <span>Baraże o awans ({currentLeague.playoffSpots} miejsca)</span>
              </div>
            )}

            {currentLeague.relegationSpots > 0 && (
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-red-500 inline-block" />
                <span>Strefa spadkowa ({currentLeague.relegationSpots} miejsc)</span>
              </div>
            )}
          </div>
        </div>

        {/* Terminarz i Wyniki Kolejki */}
        <div className="lg:col-span-4 bg-slate-900/90 rounded-3xl border border-slate-800 p-6 shadow-xl flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-400" />
              <h2 className="text-sm font-black text-white uppercase tracking-wider">
                Kolejka {selectedRound}
              </h2>
            </div>

            <div className="flex items-center gap-1">
              <button
                disabled={selectedRound <= 1}
                onClick={() => setSelectedRound((r) => Math.max(1, r - 1))}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 rounded-lg text-xs text-white transition-all"
              >
                ◀
              </button>
              <button
                disabled={selectedRound >= 34}
                onClick={() => setSelectedRound((r) => r + 1)}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 rounded-lg text-xs text-white transition-all"
              >
                ▶
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2.5 max-h-[500px] overflow-y-auto pr-1">
            {leagueFixtures.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-xs">
                Brak meczów w tej kolejce.
              </div>
            ) : (
              leagueFixtures.map((fix) => {
                const home = clubs[fix.homeClubId];
                const away = clubs[fix.awayClubId];
                if (!home || !away) return null;

                return (
                  <div
                    key={fix.id}
                    className="p-3 bg-slate-950/60 border border-slate-800 rounded-2xl flex items-center justify-between text-xs"
                  >
                    <span className="font-bold text-white truncate max-w-[100px] text-right">
                      {home.name}
                    </span>

                    <div className="px-3 py-1 bg-slate-900 rounded-xl border border-slate-700 font-black text-emerald-400 text-xs">
                      {fix.played ? `${fix.scoreHome} : ${fix.scoreAway}` : 'vs'}
                    </div>

                    <span className="font-bold text-white truncate max-w-[100px] text-left">
                      {away.name}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
