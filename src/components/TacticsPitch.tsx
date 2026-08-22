'use client';

import React, { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { Player, Formation, Mentality, Aggression, Position } from '@/types';
import {
  Shield,
  Zap,
  UserCheck,
  Users,
  Target,
  Crown,
  CornerDownRight
} from 'lucide-react';

export const TacticsPitch: React.FC = () => {
  const {
    clubs,
    players,
    managers,
    activeManagerIndex,
    updateTactics,
    swapPlayers,
  } = useGameStore();

  const [subTab, setSubTab] = useState<'squad' | 'tactics' | 'setpieces'>('squad');
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);

  const activeManager = managers[activeManagerIndex - 1] || managers[0];
  const activeClub = activeManager ? clubs[activeManager.clubId] : null;

  if (!activeClub) return <div className="text-white p-4">Wybierz klub</div>;

  const tactics = activeClub.tactics;
  const startingPlayers = tactics.startingIds.map((id) => players[id]).filter(Boolean);
  const benchPlayers = tactics.benchIds.map((id) => players[id]).filter(Boolean);
  const allClubPlayers = Object.values(players).filter((p) => p.clubId === activeClub.id);

  const handlePlayerClick = (playerId: string) => {
    if (!selectedPlayerId) {
      setSelectedPlayerId(playerId);
    } else if (selectedPlayerId === playerId) {
      setSelectedPlayerId(null);
    } else {
      swapPlayers(activeClub.id, selectedPlayerId, playerId);
      setSelectedPlayerId(null);
    }
  };

  const getDetailedPositionLabel = (p: Player, idx: number) => {
    if (p.position === 'BR') return 'BR (Bramkarz)';
    if (p.position === 'OB') {
      if (idx === 1) return 'OL (Lewy obrońca)';
      if (idx === 4) return 'OP (Prawy obrońca)';
      return 'OŚ (Środkowy obrońca)';
    }
    if (p.position === 'PO') {
      if (idx === 5) return 'PL (Lewy pomocnik)';
      if (idx === 8) return 'PP (Prawy pomocnik)';
      return 'PŚ (Środkowy pomocnik)';
    }
    return 'NŚ (Napastnik)';
  };

  const getFormationCoordinates = (formation: Formation): { x: number; y: number; pos: Position }[] => {
    switch (formation) {
      case '4-4-2':
        return [
          { x: 50, y: 88, pos: 'BR' },
          { x: 18, y: 70, pos: 'OB' }, { x: 38, y: 72, pos: 'OB' }, { x: 62, y: 72, pos: 'OB' }, { x: 82, y: 70, pos: 'OB' },
          { x: 18, y: 45, pos: 'PO' }, { x: 38, y: 48, pos: 'PO' }, { x: 62, y: 48, pos: 'PO' }, { x: 82, y: 45, pos: 'PO' },
          { x: 35, y: 20, pos: 'NA' }, { x: 65, y: 20, pos: 'NA' },
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
    <div className="flex flex-col gap-4 leading-tight text-slate-100 font-sans">
      {/* NAGŁÓWEK PODZAKŁADEK */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-3 shadow-md flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setSubTab('squad')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              subTab === 'squad'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Skład ({allClubPlayers.length})</span>
          </button>

          <button
            onClick={() => setSubTab('tactics')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              subTab === 'tactics'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Taktyka & Boisko</span>
          </button>

          <button
            onClick={() => setSubTab('setpieces')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              subTab === 'setpieces'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>Stałe Fragmenty</span>
          </button>
        </div>

        <div className="text-xs text-slate-400 font-semibold flex items-center gap-2">
          <span>Wyjściowa XI: <strong className="text-emerald-400 font-black">{startingPlayers.length} / 11</strong></span>
          <span>•</span>
          <span>Ławka: <strong className="text-amber-400 font-black">{benchPlayers.length}</strong></span>
        </div>
      </div>

      {/* 1. SKŁAD ZESPOŁU */}
      {subTab === 'squad' && (
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 shadow-md flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h2 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-400" />
              Kadra Zespołu ({allClubPlayers.length} zawodników)
            </h2>
            <span className="text-[11px] text-slate-400">Kliknij zawodnika, aby zamienić miejsce</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs leading-tight">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-2 px-2">Rola</th>
                  <th className="py-2 px-2">Poz. Dokładna</th>
                  <th className="py-2 px-3">Zawodnik</th>
                  <th className="py-2 px-2 text-center">Wiek</th>
                  <th className="py-2 px-2 text-center font-black text-emerald-400">OVR</th>
                  <th className="py-2 px-2 text-center">Forma</th>
                  <th className="py-2 px-2 text-center">Kondycja</th>
                  <th className="py-2 px-3 text-right">Pensja / tydz.</th>
                  <th className="py-2 px-2 text-center">Akcja</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {allClubPlayers
                  .sort((a, b) => {
                    const isStartingA = tactics.startingIds.includes(a.id);
                    const isStartingB = tactics.startingIds.includes(b.id);
                    if (isStartingA && !isStartingB) return -1;
                    if (!isStartingA && isStartingB) return 1;
                    return b.overall - a.overall;
                  })
                  .map((player, idx) => {
                    const isStarting = tactics.startingIds.includes(player.id);
                    const isBench = tactics.benchIds.includes(player.id);
                    const isSelected = selectedPlayerId === player.id;
                    const detailedPos = getDetailedPositionLabel(player, idx);

                    return (
                      <tr
                        key={player.id}
                        onClick={() => handlePlayerClick(player.id)}
                        className={`cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-amber-500/20 border-l-4 border-amber-400 text-white font-bold'
                            : isStarting
                            ? 'bg-emerald-950/30 hover:bg-emerald-900/40 text-white'
                            : isBench
                            ? 'bg-slate-950/40 hover:bg-slate-800/40 text-slate-300'
                            : 'hover:bg-slate-800/30 text-slate-400'
                        }`}
                      >
                        <td className="py-2 px-2">
                          {isStarting ? (
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                              XI
                            </span>
                          ) : isBench ? (
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                              Ławka
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.2 rounded text-[10px] text-slate-500 bg-slate-800">
                              Rezerwa
                            </span>
                          )}
                        </td>

                        <td className="py-2 px-2">
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-emerald-300">
                            {detailedPos}
                          </span>
                        </td>

                        <td className="py-2 px-3">
                          <span className="font-bold text-white">
                            {player.firstName} {player.lastName}
                          </span>
                        </td>

                        <td className="py-2 px-2 text-center text-slate-300">{player.age}</td>

                        <td className="py-2 px-2 text-center font-black text-emerald-400">
                          {player.overall}
                        </td>

                        <td className="py-2 px-2 text-center text-slate-300">
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800">
                            🔥 {player.form}/10
                          </span>
                        </td>

                        <td className="py-2 px-2 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <div className="w-14 h-1.5 bg-slate-800 rounded-full overflow-hidden">
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
                            <span className="text-[10px] font-bold text-slate-300">
                              {player.condition}%
                            </span>
                          </div>
                        </td>

                        <td className="py-2 px-3 text-right text-slate-300 font-semibold">
                          {player.salary.toLocaleString('pl-PL')} PLN
                        </td>

                        <td className="py-2 px-2 text-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePlayerClick(player.id);
                            }}
                            className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold rounded transition-all"
                          >
                            {isSelected ? 'Anuluj' : 'Zamień'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. TAKTYKA */}
      {subTab === 'tactics' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-7 flex flex-col gap-3">
            <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400 uppercase">Formacja:</span>
                <div className="flex gap-1">
                  {formationsList.map((f) => (
                    <button
                      key={f}
                      onClick={() => updateTactics(activeClub.id, { formation: f })}
                      className={`px-2.5 py-1 rounded text-xs font-bold transition-all ${
                        tactics.formation === f
                          ? 'bg-emerald-500 text-slate-950 shadow'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative w-full aspect-[4/4.5] bg-emerald-950 rounded-2xl overflow-hidden border border-emerald-600/50 shadow-xl flex items-center justify-center select-none">
              <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/40 via-emerald-800/20 to-emerald-900/40 pointer-events-none" />
              <div className="absolute inset-2 border border-white/30 rounded-lg pointer-events-none" />
              <div className="absolute top-1/2 left-2 right-2 h-0.5 bg-white/30 pointer-events-none" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 border border-white/30 rounded-full pointer-events-none" />

              {startingPlayers.map((player, idx) => {
                const coord = coordinates[idx] || { x: 50, y: 50, pos: player.position };
                const isSelected = selectedPlayerId === player.id;

                return (
                  <div
                    key={player.id}
                    onClick={() => handlePlayerClick(player.id)}
                    style={{ left: `${coord.x}%`, top: `${coord.y}%`, transform: 'translate(-50%, -50%)' }}
                    className={`absolute cursor-pointer transition-all duration-200 ${
                      isSelected ? 'scale-125 z-30' : 'hover:scale-110 hover:z-20'
                    }`}
                  >
                    <div
                      className={`flex flex-col items-center p-1 rounded-xl border backdrop-blur-md shadow transition-all ${
                        isSelected
                          ? 'bg-amber-500/90 border-amber-300 text-slate-950 ring-2 ring-amber-400'
                          : 'bg-slate-900/85 border-slate-700 text-white hover:border-emerald-400'
                      }`}
                    >
                      <div className="flex items-center gap-1">
                        <span className="text-[9px] font-black px-1 rounded bg-slate-800 text-white">
                          {player.position}
                        </span>
                        <span className="text-[10px] font-black text-emerald-400">
                          {player.overall}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold truncate max-w-[75px] text-center mt-0.5">
                        {player.lastName}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 flex flex-col gap-3 shadow-md">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-emerald-400" />
                Polecenia Taktyczne
              </h3>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Nastawienie taktyczne:</label>
                <select
                  value={tactics.mentality}
                  onChange={(e) => updateTactics(activeClub.id, { mentality: e.target.value as Mentality })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  {mentalitiesList.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Agresywność i pressing:</label>
                <select
                  value={tactics.aggression}
                  onChange={(e) => updateTactics(activeClub.id, { aggression: e.target.value as Aggression })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  {aggressionsList.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 flex flex-col gap-2 shadow-md">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                Ławka Rezerwowych ({benchPlayers.length})
              </h3>
              <div className="flex flex-col gap-1.5 max-h-60 overflow-y-auto pr-1">
                {benchPlayers.map((player) => (
                  <div
                    key={player.id}
                    onClick={() => handlePlayerClick(player.id)}
                    className="flex items-center justify-between p-2 rounded-xl border border-slate-800 bg-slate-950/60 text-slate-300 cursor-pointer hover:border-slate-600 text-xs"
                  >
                    <span className="font-bold text-white">{player.firstName} {player.lastName}</span>
                    <span className="text-emerald-400 font-bold">OVR {player.overall}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. STAŁE FRAGMENTY */}
      {subTab === 'setpieces' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 shadow-md flex flex-col gap-3">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
              <Crown className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-black text-white uppercase">Kapitan Zespołu</h3>
            </div>
            <select
              value={tactics.captainId || startingPlayers[0]?.id || ''}
              onChange={(e) => updateTactics(activeClub.id, { captainId: e.target.value })}
              className="bg-slate-950 border border-slate-700 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              {startingPlayers.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.firstName} {p.lastName} (OVR: {p.overall})
                </option>
              ))}
            </select>
          </div>

          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 shadow-md flex flex-col gap-3">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
              <Target className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-black text-white uppercase">Wykonawca Karnych</h3>
            </div>
            <select
              value={tactics.penaltyTakerId || startingPlayers[startingPlayers.length - 1]?.id || ''}
              onChange={(e) => updateTactics(activeClub.id, { penaltyTakerId: e.target.value })}
              className="bg-slate-950 border border-slate-700 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              {startingPlayers.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.firstName} {p.lastName} (Wykańczanie: {p.scoring})
                </option>
              ))}
            </select>
          </div>

          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 shadow-md flex flex-col gap-3">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
              <CornerDownRight className="w-4 h-4 text-blue-400" />
              <h3 className="text-xs font-black text-white uppercase">Wolne i Rożne</h3>
            </div>
            <select
              value={tactics.freeKickTakerId || startingPlayers[1]?.id || ''}
              onChange={(e) => updateTactics(activeClub.id, { freeKickTakerId: e.target.value })}
              className="bg-slate-950 border border-slate-700 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              {startingPlayers.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.firstName} {p.lastName} (Rozgrywanie: {p.playmaking})
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
};
