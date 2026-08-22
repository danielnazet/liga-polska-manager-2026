'use client';

import React, { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { Player, Formation, Mentality, Aggression, Position } from '@/types';
import { Shield, Zap, Flame, UserCheck, RefreshCw, Activity, HeartPulse } from 'lucide-react';

export const TacticsPitch: React.FC = () => {
  const {
    clubs,
    players,
    managers,
    activeManagerIndex,
    updateTactics,
    swapPlayers,
  } = useGameStore();

  const activeManager = managers[activeManagerIndex - 1] || managers[0];
  const activeClub = activeManager ? clubs[activeManager.clubId] : null;

  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);

  if (!activeClub) return <div className="text-white p-6">Wybierz klub</div>;

  const tactics = activeClub.tactics;
  const startingPlayers = tactics.startingIds.map((id) => players[id]).filter(Boolean);
  const benchPlayers = tactics.benchIds.map((id) => players[id]).filter(Boolean);

  const handlePlayerClick = (playerId: string) => {
    if (!selectedPlayerId) {
      setSelectedPlayerId(playerId);
    } else if (selectedPlayerId === playerId) {
      setSelectedPlayerId(null);
    } else {
      // Zamiana zawodników
      swapPlayers(activeClub.id, selectedPlayerId, playerId);
      setSelectedPlayerId(null);
    }
  };

  // Pozycje na boisku dla różnych formacji (w procentach X, Y)
  const getFormationCoordinates = (formation: Formation): { x: number; y: number; pos: Position }[] => {
    switch (formation) {
      case '4-4-2':
        return [
          { x: 50, y: 88, pos: 'BR' }, // GK
          { x: 18, y: 70, pos: 'OB' }, { x: 38, y: 72, pos: 'OB' }, { x: 62, y: 72, pos: 'OB' }, { x: 82, y: 70, pos: 'OB' }, // DEF
          { x: 18, y: 45, pos: 'PO' }, { x: 38, y: 48, pos: 'PO' }, { x: 62, y: 48, pos: 'PO' }, { x: 82, y: 45, pos: 'PO' }, // MID
          { x: 35, y: 20, pos: 'NA' }, { x: 65, y: 20, pos: 'NA' }, // FWD
        ];
      case '4-3-3':
        return [
          { x: 50, y: 88, pos: 'BR' },
          { x: 18, y: 70, pos: 'OB' }, { x: 38, y: 72, pos: 'OB' }, { x: 62, y: 72, pos: 'OB' }, { x: 82, y: 70, pos: 'OB' },
          { x: 30, y: 48, pos: 'PO' }, { x: 50, y: 45, pos: 'PO' }, { x: 70, y: 48, pos: 'PO' },
          { x: 20, y: 22, pos: 'NA' }, { x: 50, y: 18, pos: 'NA' }, { x: 80, y: 22, pos: 'NA' },
        ];
      case '3-5-2':
        return [
          { x: 50, y: 88, pos: 'BR' },
          { x: 25, y: 72, pos: 'OB' }, { x: 50, y: 74, pos: 'OB' }, { x: 75, y: 72, pos: 'OB' },
          { x: 15, y: 45, pos: 'PO' }, { x: 35, y: 48, pos: 'PO' }, { x: 50, y: 42, pos: 'PO' }, { x: 65, y: 48, pos: 'PO' }, { x: 85, y: 45, pos: 'PO' },
          { x: 35, y: 20, pos: 'NA' }, { x: 65, y: 20, pos: 'NA' },
        ];
      case '4-2-3-1':
        return [
          { x: 50, y: 88, pos: 'BR' },
          { x: 18, y: 70, pos: 'OB' }, { x: 38, y: 72, pos: 'OB' }, { x: 62, y: 72, pos: 'OB' }, { x: 82, y: 70, pos: 'OB' },
          { x: 35, y: 55, pos: 'PO' }, { x: 65, y: 55, pos: 'PO' },
          { x: 20, y: 35, pos: 'PO' }, { x: 50, y: 32, pos: 'PO' }, { x: 80, y: 35, pos: 'PO' },
          { x: 50, y: 18, pos: 'NA' },
        ];
      case '5-3-2':
        return [
          { x: 50, y: 88, pos: 'BR' },
          { x: 15, y: 68, pos: 'OB' }, { x: 32, y: 72, pos: 'OB' }, { x: 50, y: 74, pos: 'OB' }, { x: 68, y: 72, pos: 'OB' }, { x: 85, y: 68, pos: 'OB' },
          { x: 30, y: 46, pos: 'PO' }, { x: 50, y: 42, pos: 'PO' }, { x: 70, y: 46, pos: 'PO' },
          { x: 35, y: 20, pos: 'NA' }, { x: 65, y: 20, pos: 'NA' },
        ];
      default:
        return [
          { x: 50, y: 88, pos: 'BR' },
          { x: 18, y: 70, pos: 'OB' }, { x: 38, y: 72, pos: 'OB' }, { x: 62, y: 72, pos: 'OB' }, { x: 82, y: 70, pos: 'OB' },
          { x: 18, y: 45, pos: 'PO' }, { x: 38, y: 48, pos: 'PO' }, { x: 62, y: 48, pos: 'PO' }, { x: 82, y: 45, pos: 'PO' },
          { x: 35, y: 20, pos: 'NA' }, { x: 65, y: 20, pos: 'NA' },
        ];
    }
  };

  const coordinates = getFormationCoordinates(tactics.formation);

  const formationsList: Formation[] = ['4-4-2', '4-3-3', '3-5-2', '4-2-3-1', '5-3-2'];
  const mentalitiesList: { id: Mentality; label: string }[] = [
    { id: 'very_defensive', label: 'Bunkier / Obrona Częstochowy' },
    { id: 'defensive', label: 'Defensywne' },
    { id: 'balanced', label: 'Zrównoważone' },
    { id: 'attacking', label: 'Ofensywne' },
    { id: 'all_out_attack', label: 'Wszystko na jedną kartę' },
  ];
  const aggressionsList: { id: Aggression; label: string }[] = [
    { id: 'gentle', label: 'Czysta gra' },
    { id: 'normal', label: 'Umiarkowana' },
    { id: 'aggressive', label: 'Agresywna' },
    { id: 'ruthless', label: 'Kości trzeszczą' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Lewa kolumna: Interaktywne Boisko */}
      <div className="lg:col-span-7 flex flex-col gap-4">
        {/* Pasek ustawień taktycznych */}
        <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Formacja:</span>
            <div className="flex gap-1">
              {formationsList.map((f) => (
                <button
                  key={f}
                  onClick={() => updateTactics(activeClub.id, { formation: f })}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    tactics.formation === f
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            {selectedPlayerId ? (
              <span className="text-amber-400 font-semibold animate-pulse flex items-center gap-1">
                <RefreshCw className="w-3.5 h-3.5" /> Wybierz drugiego gracza do zamiany
              </span>
            ) : (
              <span>Kliknij gracza, aby go zamienić</span>
            )}
          </div>
        </div>

        {/* Murawa boiska 2D */}
        <div className="relative w-full aspect-[4/5] sm:aspect-[4/4.8] bg-emerald-950 rounded-2xl overflow-hidden border-2 border-emerald-600/50 shadow-2xl shadow-emerald-950/60 flex items-center justify-center select-none">
          {/* Tło i linie boiska */}
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/40 via-emerald-800/20 to-emerald-900/40 pointer-events-none" />
          {/* Pasy murawy */}
          <div className="absolute inset-0 opacity-15 bg-[repeating-linear-gradient(0deg,#000,#000_30px,transparent_30px,transparent_60px)] pointer-events-none" />

          {/* Linie boiska */}
          <div className="absolute inset-4 border-2 border-white/30 rounded-xl pointer-events-none" />
          <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-white/30 pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 border-2 border-white/30 rounded-full pointer-events-none" />
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-48 h-20 border-b-2 border-x-2 border-white/30 pointer-events-none" />
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-48 h-20 border-t-2 border-x-2 border-white/30 pointer-events-none" />

          {/* Karty zawodników na murawie */}
          {startingPlayers.map((player, idx) => {
            const coord = coordinates[idx] || { x: 50, y: 50, pos: player.position };
            const isSelected = selectedPlayerId === player.id;

            return (
              <div
                key={player.id}
                onClick={() => handlePlayerClick(player.id)}
                style={{
                  left: `${coord.x}%`,
                  top: `${coord.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                className={`absolute cursor-pointer transition-all duration-200 group z-10 ${
                  isSelected ? 'scale-125 z-30' : 'hover:scale-110 hover:z-20'
                }`}
              >
                <div
                  className={`flex flex-col items-center p-1.5 rounded-xl border backdrop-blur-md shadow-lg transition-all ${
                    isSelected
                      ? 'bg-amber-500/90 border-amber-300 text-slate-950 ring-4 ring-amber-400/50'
                      : 'bg-slate-900/85 border-slate-700 text-white hover:border-emerald-400'
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <span
                      className={`text-[10px] font-black px-1 rounded ${
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
                    <span className="text-xs font-black tracking-tighter text-emerald-400">
                      {player.overall}
                    </span>
                  </div>

                  <span className="text-[11px] font-bold truncate max-w-[80px] text-center mt-0.5">
                    {player.lastName}
                  </span>

                  {/* Kondycja pasek */}
                  <div className="w-12 h-1 bg-slate-700 rounded-full mt-1 overflow-hidden">
                    <div
                      className={`h-full ${
                        player.condition > 75
                          ? 'bg-emerald-400'
                          : player.condition > 50
                          ? 'bg-amber-400'
                          : 'bg-red-500'
                      }`}
                      style={{ width: `${player.condition}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Prawa kolumna: Ławka rezerwowych & Polecenia taktyczne */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        {/* Nastawienie i Agresja */}
        <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 flex flex-col gap-4 shadow-xl">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Zap className="w-4 h-4 text-emerald-400" />
            Polecenia Menedżera
          </h3>

          <div>
            <label className="text-xs text-slate-400 block mb-1.5 font-medium">Nastawienie taktyczne:</label>
            <select
              value={tactics.mentality}
              onChange={(e) => updateTactics(activeClub.id, { mentality: e.target.value as Mentality })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
            >
              {mentalitiesList.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1.5 font-medium">Agresywność i pressing:</label>
            <select
              value={tactics.aggression}
              onChange={(e) => updateTactics(activeClub.id, { aggression: e.target.value as Aggression })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
            >
              {aggressionsList.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Ławka rezerwowych */}
        <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 flex flex-col gap-3 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-amber-400" />
              Ławka Rezerwowych ({benchPlayers.length})
            </h3>
            <span className="text-xs text-slate-400">Kliknij, aby podmienić</span>
          </div>

          <div className="flex flex-col gap-2 max-h-[360px] overflow-y-auto pr-1">
            {benchPlayers.map((player) => {
              const isSelected = selectedPlayerId === player.id;
              return (
                <div
                  key={player.id}
                  onClick={() => handlePlayerClick(player.id)}
                  className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-amber-500/20 border-amber-400 text-white shadow-md'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-600 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`text-xs font-black px-1.5 py-0.5 rounded ${
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
                    <div>
                      <div className="text-xs font-bold text-white">
                        {player.firstName} {player.lastName}
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-2">
                        <span>Wiek: {player.age}</span>
                        <span>•</span>
                        <span className="text-emerald-400">OVR: {player.overall}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-[10px] text-slate-400 flex items-center gap-1">
                        <HeartPulse className="w-3 h-3 text-red-400" />
                        <span>{player.condition}%</span>
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Activity className="w-3 h-3 text-amber-400" />
                        <span>Forma: {player.form}/10</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
