'use client';

import React, { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { Trophy, Calendar, Check, Minus, X as CloseIcon } from 'lucide-react';

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

  return (
    <div className="flex flex-col gap-6">
      {/* Switcher Lig */}
      <div className="flex flex-wrap gap-2 bg-slate-900/90 p-2.5 rounded-2xl border border-slate-800 shadow-lg">
        {Object.values(leagues).map((lg) => (
          <button
            key={lg.id}
            onClick={() => {
              setSelectedLeagueId(lg.id);
              setSelectedRound(currentRound);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedLeagueId === lg.id
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/60'
                : 'bg-slate-950/60 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {lg.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Tabela Ligowa */}
        <div className="lg:col-span-8 bg-slate-900/90 rounded-3xl border border-slate-800 p-6 shadow-xl flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <h2 className="text-base font-black text-white uppercase tracking-wider">
                Tabela: {currentLeague.name}
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

                  // Oznaczenia stref (Awanse, Puchary, Spadki)
                  let rankColor = 'text-slate-400';
                  let rowBg = isUserClub ? 'bg-emerald-950/40 border-l-4 border-emerald-500' : 'hover:bg-slate-800/30';

                  if (idx === 0) rankColor = 'text-amber-400 font-black';
                  else if (idx < currentLeague.promotionSpots) rankColor = 'text-emerald-400 font-bold';
                  else if (idx >= leagueStandings.length - currentLeague.relegationSpots) rankColor = 'text-red-400 font-bold';

                  return (
                    <tr key={st.clubId} className={`transition-all ${rowBg}`}>
                      <td className={`py-3 px-2 font-bold ${rankColor}`}>
                        {idx + 1}
                      </td>
                      <td className="py-3 px-3 flex items-center gap-2.5">
                        <div
                          className="w-5 h-5 rounded flex items-center justify-center text-[10px] font-black shadow"
                          style={{ backgroundColor: club.primaryColor, color: club.secondaryColor }}
                        >
                          {club.shortName}
                        </div>
                        <span className={`font-bold ${isUserClub ? 'text-emerald-300' : 'text-white'}`}>
                          {club.name} {isUserClub && '⭐'}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-center text-slate-300">{st.played}</td>
                      <td className="py-3 px-2 text-center text-slate-300">{st.won}</td>
                      <td className="py-3 px-2 text-center text-slate-300">{st.drawn}</td>
                      <td className="py-3 px-2 text-center text-slate-300">{st.lost}</td>
                      <td className="py-3 px-2 text-center text-slate-400">
                        {st.goalsFor}:{st.goalsAgainst}
                      </td>
                      <td className={`py-3 px-2 text-center font-semibold ${st.goalDifference > 0 ? 'text-emerald-400' : st.goalDifference < 0 ? 'text-red-400' : 'text-slate-400'}`}>
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
                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 rounded text-xs text-white"
              >
                ◀
              </button>
              <button
                disabled={selectedRound >= 34}
                onClick={() => setSelectedRound((r) => r + 1)}
                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 rounded text-xs text-white"
              >
                ▶
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2.5 max-h-[500px] overflow-y-auto pr-1">
            {leagueFixtures.map((fix) => {
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
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
