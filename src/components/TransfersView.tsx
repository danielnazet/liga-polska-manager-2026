'use client';

import React, { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { Position } from '@/types';
import { ArrowRightLeft, Search, UserPlus, UserMinus, ShieldAlert, Check } from 'lucide-react';

export const TransfersView: React.FC = () => {
  const {
    clubs,
    players,
    freeAgents,
    managers,
    activeManagerIndex,
    signFreeAgent,
    releasePlayer,
  } = useGameStore();

  const activeManager = managers[activeManagerIndex - 1] || managers[0];
  const activeClub = activeManager ? clubs[activeManager.clubId] : null;

  const [positionFilter, setPositionFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!activeClub) return null;

  const freeAgentPlayers = freeAgents
    .map((id) => players[id])
    .filter(Boolean)
    .filter((p) => {
      if (positionFilter !== 'ALL' && p.position !== positionFilter) return false;
      if (searchQuery) {
        const full = `${p.firstName} ${p.lastName}`.toLowerCase();
        if (!full.includes(searchQuery.toLowerCase())) return false;
      }
      return true;
    })
    .sort((a, b) => b.overall - a.overall);

  const mySquadPlayers = [
    ...activeClub.tactics.startingIds,
    ...activeClub.tactics.benchIds,
  ]
    .map((id) => players[id])
    .filter(Boolean);

  const handleSign = (playerId: string) => {
    const ok = signFreeAgent(activeClub.id, playerId);
    if (ok) {
      setSuccessMessage('Podpisano kontrakt z zawodnikiem!');
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
    <div className="flex flex-col gap-6">
      {/* Powiadomienie */}
      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-600/20 border border-emerald-500/50 text-emerald-300 text-sm font-bold flex items-center gap-2">
          <Check className="w-5 h-5 text-emerald-400" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Górny panel budżetowy */}
      <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5 text-emerald-400" />
            Rynek Transferowy & Wolni Agenci
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Wzmocnij zespół, podpisując kontrakty z wolnymi zawodnikami bez kwoty odstępnego.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-slate-950 px-4 py-2 rounded-2xl border border-slate-800 text-xs">
          <div>
            <span className="text-slate-400 block">Budżet Płacowy:</span>
            <span className="font-bold text-white">
              {activeClub.finances.wageBudget.toLocaleString('pl-PL')} PLN / tydz.
            </span>
          </div>
          <div className="border-l border-slate-800 pl-4">
            <span className="text-slate-400 block">Stan Konta:</span>
            <span className="font-bold text-emerald-400">
              {activeClub.finances.balance.toLocaleString('pl-PL')} PLN
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Lista Wolnych Agentów */}
        <div className="lg:col-span-8 bg-slate-900/90 rounded-3xl border border-slate-800 p-6 shadow-xl flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase">Filtruj:</span>
              {['ALL', 'BR', 'OB', 'PO', 'NA'].map((pos) => (
                <button
                  key={pos}
                  onClick={() => setPositionFilter(pos)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                    positionFilter === pos
                      ? 'bg-emerald-600 text-white shadow'
                      : 'bg-slate-950 text-slate-400 hover:text-white'
                  }`}
                >
                  {pos === 'ALL' ? 'Wszyscy' : pos}
                </button>
              ))}
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Szukaj zawodnika..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-2.5 px-3">Zawodnik</th>
                  <th className="py-2.5 px-2 text-center">Poz</th>
                  <th className="py-2.5 px-2 text-center">Wiek</th>
                  <th className="py-2.5 px-2 text-center">OVR</th>
                  <th className="py-2.5 px-3 text-right">Oczekiwana Pensja</th>
                  <th className="py-2.5 px-3 text-right">Akcja</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {freeAgentPlayers.map((player) => (
                  <tr key={player.id} className="hover:bg-slate-800/30 transition-all">
                    <td className="py-3 px-3">
                      <span className="font-bold text-white">
                        {player.firstName} {player.lastName}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-center">
                      <span
                        className={`text-[10px] font-black px-1.5 py-0.5 rounded ${
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
                    <td className="py-3 px-2 text-center text-slate-300">{player.age}</td>
                    <td className="py-3 px-2 text-center font-black text-emerald-400">{player.overall}</td>
                    <td className="py-3 px-3 text-right text-slate-300 font-semibold">
                      {player.salary.toLocaleString('pl-PL')} PLN / tydz.
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => handleSign(player.id)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-1 ml-auto shadow-md shadow-emerald-950/50"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Podpisz</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Kadra Własna (Możliwość zwolnienia) */}
        <div className="lg:col-span-4 bg-slate-900/90 rounded-3xl border border-slate-800 p-6 shadow-xl flex flex-col gap-4">
          <h3 className="text-sm font-black text-white uppercase tracking-wider border-b border-slate-800 pb-3">
            Twoja Kadra ({mySquadPlayers.length} graczy)
          </h3>

          <div className="flex flex-col gap-2 max-h-[550px] overflow-y-auto pr-1">
            {mySquadPlayers.map((player) => (
              <div
                key={player.id}
                className="p-3 bg-slate-950/60 border border-slate-800 rounded-2xl flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <span
                      className={`text-[9px] font-black px-1 rounded ${
                        player.position === 'BR'
                          ? 'bg-amber-600'
                          : player.position === 'OB'
                          ? 'bg-blue-600'
                          : player.position === 'PO'
                          ? 'bg-emerald-600'
                          : 'bg-red-600'
                      }`}
                    >
                      {player.position}
                    </span>
                    <span>
                      {player.firstName} {player.lastName}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    OVR: <strong className="text-emerald-400">{player.overall}</strong> • Pensja:{' '}
                    {player.salary.toLocaleString('pl-PL')} PLN
                  </div>
                </div>

                <button
                  onClick={() => handleRelease(player.id)}
                  title="Rozwiąż kontrakt"
                  className="p-1.5 bg-red-950 hover:bg-red-900 border border-red-800 text-red-300 rounded-xl transition-all"
                >
                  <UserMinus className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
