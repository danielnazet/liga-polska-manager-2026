'use client';

import React, { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { Player, Position } from '@/types';
import {
  ArrowRightLeft,
  Search,
  UserPlus,
  UserMinus,
  Check,
  Filter
} from 'lucide-react';

export const TransfersView: React.FC = () => {
  const {
    clubs,
    players,
    freeAgents,
    leagues,
    managers,
    activeManagerIndex,
    signFreeAgent,
    releasePlayer,
  } = useGameStore();

  const activeManager = managers[activeManagerIndex - 1] || managers[0];
  const activeClub = activeManager ? clubs[activeManager.clubId] : null;

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [positionFilter, setPositionFilter] = useState<string>('ALL');
  const [leagueFilter, setLeagueFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'FREE' | 'SQUAD'>('ALL');
  const [minOvr, setMinOvr] = useState<number>(40);
  const [maxAge, setMaxAge] = useState<number>(40);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!activeClub) return null;

  const allPlayersList = Object.values(players);

  const filteredPlayers = allPlayersList
    .filter((p) => {
      if (positionFilter !== 'ALL' && p.position !== positionFilter) return false;
      if (searchQuery) {
        const full = `${p.firstName} ${p.lastName}`.toLowerCase();
        if (!full.includes(searchQuery.toLowerCase())) return false;
      }
      if (statusFilter === 'FREE' && p.clubId !== '') return false;
      if (statusFilter === 'SQUAD' && p.clubId !== activeClub.id) return false;

      if (leagueFilter !== 'ALL') {
        const playerClub = clubs[p.clubId];
        if (!playerClub || playerClub.leagueId !== leagueFilter) return false;
      }

      if (p.overall < minOvr) return false;
      if (p.age > maxAge) return false;

      return true;
    })
    .sort((a, b) => b.overall - a.overall);

  const handleSign = (playerId: string) => {
    const ok = signFreeAgent(activeClub.id, playerId);
    if (ok) {
      setSuccessMessage('Podpisano kontrakt z wolnym zawodnikiem!');
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  const handleRelease = (playerId: string) => {
    if (confirm('Czy na pewno chcesz rozwiązać kontrakt z tym zawodnikiem?')) {
      releasePlayer(activeClub.id, playerId);
      setSuccessMessage('Rozwiązano kontrakt z zawodnikiem.');
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  return (
    <div className="flex flex-col gap-4 text-slate-100 font-sans leading-snug">
      {successMessage && (
        <div className="p-3 rounded-xl bg-emerald-600/20 border border-emerald-500/50 text-emerald-300 text-xs font-bold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* PASEK NAGŁÓWKA */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 shadow-md flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-black text-white flex items-center gap-2">
            <ArrowRightLeft className="w-4 h-4 text-emerald-400" />
            Wyszukiwarka i Baza Piłkarzy ({filteredPlayers.length} / {allPlayersList.length})
          </h2>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Przeglądaj zawodników ze wszystkich lig polskich oraz wolnych agentów bez klubu.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px]">Budżet Płacowy:</span>
            <span className="font-bold text-white">
              {activeClub.finances.wageBudget.toLocaleString('pl-PL')} PLN / tydz.
            </span>
          </div>
          <div className="border-l border-slate-800 pl-3">
            <span className="text-slate-400 block text-[10px]">Stan Konta:</span>
            <span className="font-bold text-emerald-400">
              {activeClub.finances.balance.toLocaleString('pl-PL')} PLN
            </span>
          </div>
        </div>
      </div>

      {/* PANEL FILTRÓW */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-3.5 shadow-md flex flex-col gap-3">
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-400 border-b border-slate-800 pb-1.5">
          <Filter className="w-3.5 h-3.5" />
          <span>Filtry wyszukiwania piłkarzy:</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
          <div className="lg:col-span-2">
            <label className="text-[10px] text-slate-400 block mb-1 font-semibold">Szukaj nazwiska:</label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Np. Lewandowski, Kowalski..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-8 pr-2.5 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] text-slate-400 block mb-1 font-semibold">Pozycja:</label>
            <select
              value={positionFilter}
              onChange={(e) => setPositionFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="ALL">Wszystkie pozycje</option>
              <option value="BR">Bramkarz (BR)</option>
              <option value="OB">Obrońca (OB)</option>
              <option value="PO">Pomocnik (PO)</option>
              <option value="NA">Napastnik (NA)</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] text-slate-400 block mb-1 font-semibold">Status zawodnika:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="ALL">Wszyscy w bazie</option>
              <option value="FREE">Wolni Agenci (Bez klubu)</option>
              <option value="SQUAD">Twoja Kadra</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] text-slate-400 block mb-1 font-semibold">Liga zawodnika:</label>
            <select
              value={leagueFilter}
              onChange={(e) => setLeagueFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1 text-xs text-white focus:outline-none focus:border-emerald-500 truncate"
            >
              <option value="ALL">Wszystkie Ligi</option>
              {Object.values(leagues).map((lg) => (
                <option key={lg.id} value={lg.id}>
                  {lg.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] text-slate-400 block mb-1 font-semibold">Min. Umiejętności: {minOvr}</label>
            <input
              type="range"
              min={35}
              max={85}
              value={minOvr}
              onChange={(e) => setMinOvr(Number(e.target.value))}
              className="w-full accent-emerald-500 bg-slate-950 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* TABELA WYNIKÓW */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 shadow-md overflow-x-auto">
        <table className="w-full text-left text-xs leading-tight">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
              <th className="py-2 px-3">Zawodnik</th>
              <th className="py-2 px-2 text-center">Poz</th>
              <th className="py-2 px-3">Klub</th>
              <th className="py-2 px-2 text-center">Wiek</th>
              <th className="py-2 px-2 text-center font-black text-emerald-400">OVR</th>
              <th className="py-2 px-2 text-center">Kondycja</th>
              <th className="py-2 px-3 text-right">Wartość / Pensja</th>
              <th className="py-2 px-3 text-right">Akcja</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-medium">
            {filteredPlayers.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-8 text-slate-500">
                  Brak zawodników spełniających podane kryteria filtrów.
                </td>
              </tr>
            ) : (
              filteredPlayers.slice(0, 100).map((player) => {
                const club = clubs[player.clubId];
                const isMyPlayer = player.clubId === activeClub.id;
                const isFreeAgent = !player.clubId;

                return (
                  <tr key={player.id} className="hover:bg-slate-800/30 transition-all">
                    <td className="py-2 px-3">
                      <span className="font-bold text-white">
                        {player.firstName} {player.lastName}
                      </span>
                    </td>

                    <td className="py-2 px-2 text-center">
                      <span
                        className={`text-[9px] font-black px-1.5 py-0.5 rounded ${
                          player.position === 'BR'
                            ? 'bg-amber-600 text-white'
                            : player.position === 'OB'
                            ? 'bg-blue-600 text-white'
                            : player.position === 'PO'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-red-600 text-white'
                        }`}
                      >
                        {player.position}
                      </span>
                    </td>

                    <td className="py-2 px-3">
                      {club ? (
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3.5 h-3.5 rounded text-[8px] font-black flex items-center justify-center shrink-0"
                            style={{ backgroundColor: club.primaryColor, color: club.secondaryColor }}
                          >
                            {club.shortName}
                          </div>
                          <span className="text-slate-300 font-semibold">{club.name}</span>
                        </div>
                      ) : (
                        <span className="text-emerald-400 font-bold bg-emerald-950/40 px-1.5 py-0.2 rounded border border-emerald-800/40 text-[10px]">
                          Wolny Agent
                        </span>
                      )}
                    </td>

                    <td className="py-2 px-2 text-center text-slate-300">{player.age}</td>

                    <td className="py-2 px-2 text-center font-black text-emerald-400 text-xs">
                      {player.overall}
                    </td>

                    <td className="py-2 px-2 text-center text-slate-400">
                      {player.condition}%
                    </td>

                    <td className="py-2 px-3 text-right">
                      <div className="font-bold text-white text-xs">
                        {player.marketValue ? `${player.marketValue.toLocaleString('pl-PL')} PLN` : 'Bez odstępnego'}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {player.salary.toLocaleString('pl-PL')} PLN / tydz.
                      </div>
                    </td>

                    <td className="py-2 px-3 text-right">
                      {isFreeAgent ? (
                        <button
                          onClick={() => handleSign(player.id)}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-[11px] flex items-center gap-1 ml-auto shadow"
                        >
                          <UserPlus className="w-3 h-3" />
                          <span>Podpisz</span>
                        </button>
                      ) : isMyPlayer ? (
                        <button
                          onClick={() => handleRelease(player.id)}
                          className="px-2.5 py-1 bg-red-950 hover:bg-red-900 border border-red-800 text-red-300 font-bold rounded-lg text-[11px] flex items-center gap-1 ml-auto"
                        >
                          <UserMinus className="w-3 h-3" />
                          <span>Zwolnij</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => alert(`Złożono ofertę transferową dla klubu ${club?.name} za gracza ${player.lastName}!`)}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-lg text-[11px] flex items-center gap-1 ml-auto border border-slate-700"
                        >
                          <span>Kup (Oferta)</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
