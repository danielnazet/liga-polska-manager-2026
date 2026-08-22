'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useGameStore } from '@/store/gameStore';
import {
  Play,
  Pause,
  CheckCircle,
  Radio,
  Clock,
  Shield,
  Zap,
  Activity,
  ArrowRightLeft,
  X,
  HeartPulse,
  Flame,
  Plus,
  Trash2,
  Trophy,
  Users
} from 'lucide-react';
import { Mentality, Player } from '@/types';
import confetti from 'canvas-confetti';

interface SubPair {
  outId: string;
  inId: string;
}

export const LiveMatchScreen: React.FC = () => {
  const {
    activeMatchState,
    clubs,
    players,
    managers,
    activeManagerIndex,
    tickMatchMinute,
    setMatchSpeed,
    toggleMatchPause,
    makeInGameSubstitution,
    makeInGameTacticsChange,
    finishMatchDay,
  } = useGameStore();

  const [hasStartedPlaying, setHasStartedPlaying] = useState(false);
  const [subModalOpen, setSubModalOpen] = useState(false);
  
  // Kolejka wielu zmian na raz (do 5)
  const [pendingSubs, setPendingSubs] = useState<SubPair[]>([]);
  const [selectedSubOut, setSelectedSubOut] = useState<string | null>(null);
  const [selectedSubIn, setSelectedSubIn] = useState<string | null>(null);
  const commentaryEndRef = useRef<HTMLDivElement>(null);

  const activeManager = managers[activeManagerIndex - 1] || managers[0];
  const activeClubId = activeManager?.clubId;

  // Automatyczny timer minutowy meczu
  useEffect(() => {
    if (!activeMatchState || activeMatchState.isPaused || activeMatchState.isFinished || !hasStartedPlaying) return;

    const intervals: Record<number, number> = { 1: 900, 2: 450, 5: 120, 10: 40 };
    const intervalMs = intervals[activeMatchState.speed] || 450;

    const timer = setInterval(() => {
      tickMatchMinute();
    }, intervalMs);

    return () => clearInterval(timer);
  }, [activeMatchState, tickMatchMinute, hasStartedPlaying]);

  // Efekt konfetti przy wygranej po ostatnim gwizdku
  useEffect(() => {
    if (activeMatchState?.isFinished) {
      const isHome = activeMatchState.homeClubId === activeClubId;
      const won = isHome
        ? activeMatchState.scoreHome > activeMatchState.scoreAway
        : activeMatchState.scoreAway > activeMatchState.scoreHome;
      if (won) {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
        });
      }
    }
  }, [activeMatchState?.isFinished, activeMatchState?.scoreHome, activeMatchState?.scoreAway, activeClubId]);

  // Przewijanie komentarza na sam dół przy nowym wydarzeniu
  useEffect(() => {
    commentaryEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMatchState?.events.length]);

  if (!activeMatchState) return null;

  const homeClub = clubs[activeMatchState.homeClubId];
  const awayClub = clubs[activeMatchState.awayClubId];
  if (!homeClub || !awayClub) return null;

  const myClub = clubs[activeClubId] || homeClub;
  const isHomeUser = myClub.id === homeClub.id;
  const userSubsUsed = isHomeUser ? activeMatchState.homeSubsUsed : activeMatchState.awaySubsUsed;
  const availableSubSlots = 5 - userSubsUsed;

  const myStartingPlayers = myClub.tactics.startingIds.map((id) => players[id]).filter(Boolean);
  const myBenchPlayers = myClub.tactics.benchIds.map((id) => players[id]).filter(Boolean);

  // Dodaj zmianę do kolejki
  const handleAddPendingSub = () => {
    if (!selectedSubOut || !selectedSubIn) return;
    if (pendingSubs.length + userSubsUsed >= 5) {
      alert('Nie możesz zaplanować więcej niż 5 zmian w meczu!');
      return;
    }

    setPendingSubs((prev) => [...prev, { outId: selectedSubOut, inId: selectedSubIn }]);
    setSelectedSubOut(null);
    setSelectedSubIn(null);
  };

  // Anuluj wybraną zmianę z kolejki
  const handleRemovePendingSub = (idx: number) => {
    setPendingSubs((prev) => prev.filter((_, i) => i !== idx));
  };

  // Zatwierdź wszystkie zaplanowane zmiany na raz
  const handleConfirmAllPendingSubs = () => {
    pendingSubs.forEach((pair) => {
      makeInGameSubstitution(pair.outId, pair.inId);
    });
    setPendingSubs([]);
    setSelectedSubOut(null);
    setSelectedSubIn(null);
    setSubModalOpen(false);
  };

  const handleStartMatch = () => {
    setHasStartedPlaying(true);
    if (activeMatchState.isPaused) {
      toggleMatchPause();
    }
  };

  // Dokładna pozycja piłkarza
  const getDetailedPositionLabel = (p: Player, idx: number) => {
    if (p.position === 'BR') return 'BR (Bramkarz)';
    if (p.position === 'OB') {
      if (idx === 1) return 'OL (Lewy obrońca)';
      if (idx === 4) return 'OP (Prawy obrońca)';
      return 'OŚ (Środkowy obrońca)';
    }
    if (p.position === 'PO') {
      if (idx === 5) return 'PL (Lewy skrzydłowy)';
      if (idx === 8) return 'PP (Prawy skrzydłowy)';
      return 'PŚ (Środkowy pomocnik)';
    }
    return 'NŚ (Napastnik)';
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex flex-col justify-between overflow-y-auto p-3 sm:p-5 text-white select-none leading-snug">
      
      {/* ================= EKRAN PRZEDMECZOWY (PRE-MATCH PREVIEW) ================= */}
      {!hasStartedPlaying && activeMatchState.currentMinute === 0 ? (
        <div className="max-w-4xl mx-auto w-full my-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col gap-6">
          <div className="text-center">
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-black rounded-full uppercase tracking-widest">
              Przedmeczowa odprawa w szatni
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white uppercase mt-2">
              {homeClub.name} vs {awayClub.name}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Stadion {homeClub.name} • Pojemność {homeClub.stadium.capacity.toLocaleString('pl-PL')} miejsc • Słonecznie, 21°C
            </p>
          </div>

          {/* Porównanie zespołów */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Gospodarze */}
            <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl flex flex-col gap-3">
              <div className="flex items-center gap-3 border-b border-slate-800 pb-2">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm border border-white/20"
                  style={{ backgroundColor: homeClub.primaryColor, color: homeClub.secondaryColor }}
                >
                  {homeClub.shortName}
                </div>
                <div>
                  <div className="font-bold text-white text-sm">{homeClub.name}</div>
                  <div className="text-[11px] text-slate-400">Wyjściowa XI</div>
                </div>
              </div>

              <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto pr-1 text-xs">
                {homeClub.tactics.startingIds.map((id, idx) => {
                  const p = players[id];
                  if (!p) return null;
                  return (
                    <div key={id} className="flex items-center justify-between p-1.5 rounded-lg bg-slate-900/60 border border-slate-800">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black px-1 rounded bg-slate-800 text-emerald-400">
                          {p.position}
                        </span>
                        <span className="font-bold text-slate-200">{p.firstName} {p.lastName}</span>
                      </div>
                      <span className="text-emerald-400 font-black">OVR {p.overall}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Goście */}
            <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl flex flex-col gap-3">
              <div className="flex items-center gap-3 border-b border-slate-800 pb-2">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm border border-white/20"
                  style={{ backgroundColor: awayClub.primaryColor, color: awayClub.secondaryColor }}
                >
                  {awayClub.shortName}
                </div>
                <div>
                  <div className="font-bold text-white text-sm">{awayClub.name}</div>
                  <div className="text-[11px] text-slate-400">Wyjściowa XI</div>
                </div>
              </div>

              <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto pr-1 text-xs">
                {awayClub.tactics.startingIds.map((id, idx) => {
                  const p = players[id];
                  if (!p) return null;
                  return (
                    <div key={id} className="flex items-center justify-between p-1.5 rounded-lg bg-slate-900/60 border border-slate-800">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black px-1 rounded bg-slate-800 text-emerald-400">
                          {p.position}
                        </span>
                        <span className="font-bold text-slate-200">{p.firstName} {p.lastName}</span>
                      </div>
                      <span className="text-emerald-400 font-black">OVR {p.overall}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Ostatnie ulepszenie taktyki przed gwizdkiem */}
          <div className="p-4 bg-slate-950/90 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-300 font-semibold">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span>Nastawienie drużyny:</span>
              <select
                value={myClub.tactics.mentality}
                onChange={(e) => makeInGameTacticsChange({ mentality: e.target.value as Mentality })}
                className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="very_defensive">Obrona Częstochowy</option>
                <option value="defensive">Defensywne</option>
                <option value="balanced">Zrównoważone</option>
                <option value="attacking">Ofensywne</option>
                <option value="all_out_attack">Wszystko na jedną kartę</option>
              </select>
            </div>

            <button
              onClick={handleStartMatch}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-black text-sm shadow-xl shadow-emerald-950/60 border border-emerald-400/40 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Play className="w-5 h-5 fill-white" />
              <span>GRAJ MECZ</span>
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* ================= 1. TABLICA WYNIKÓW (SCOREBOARD) ================= */}
          <div className="max-w-6xl mx-auto w-full bg-slate-900/90 rounded-3xl border border-emerald-500/30 p-4 sm:p-5 shadow-2xl">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Gospodarze */}
              <div className="flex items-center gap-3 flex-1 justify-end text-right">
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-white">{homeClub.name}</h2>
                  <div className="text-[11px] text-slate-400">Gospodarz</div>
                </div>
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg shadow border border-white/20"
                  style={{ backgroundColor: homeClub.primaryColor, color: homeClub.secondaryColor }}
                >
                  {homeClub.shortName}
                </div>
              </div>

              {/* Wynik i Zegar */}
              <div className="flex flex-col items-center px-5 py-1.5 bg-slate-950/80 rounded-2xl border border-slate-800">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-400 uppercase tracking-wider mb-0.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{activeMatchState.isFinished ? 'Koniec meczu (90\')' : `${activeMatchState.currentMinute}' MINUTA`}</span>
                </div>

                <div className="text-3xl sm:text-4xl font-black tracking-tighter text-emerald-400 flex items-center gap-3">
                  <span>{activeMatchState.scoreHome}</span>
                  <span className="text-slate-600">:</span>
                  <span>{activeMatchState.scoreAway}</span>
                </div>

                <div className="w-32 sm:w-44 h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden border border-slate-700">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300"
                    style={{ width: `${Math.min(100, (activeMatchState.currentMinute / 90) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Goście */}
              <div className="flex items-center gap-3 flex-1 justify-start text-left">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg shadow border border-white/20"
                  style={{ backgroundColor: awayClub.primaryColor, color: awayClub.secondaryColor }}
                >
                  {awayClub.shortName}
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-white">{awayClub.name}</h2>
                  <div className="text-[11px] text-slate-400">Goście</div>
                </div>
              </div>
            </div>

            {activeMatchState.isHalfTime && !activeMatchState.isFinished && (
              <div className="mt-3 p-2 bg-amber-500/20 border border-amber-400/40 rounded-xl text-center text-amber-300 text-xs font-bold animate-pulse">
                ☕ PRZERWA W MECZU (45&apos;) – Czas na uwagi w szatni i zmiany w składzie!
              </div>
            )}
          </div>

          {/* ================= 2. SEKCJA RELACJI I STATYSTYK ================= */}
          <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-5 my-4 flex-1 items-start">
            {/* Relacja radiowa */}
            <div className="lg:col-span-7 bg-slate-900/90 rounded-3xl border border-slate-800 p-4 flex flex-col shadow-xl h-[380px]">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-red-500 animate-pulse" />
                  <h3 className="text-xs font-black text-white uppercase tracking-wider">
                    Studio Radiowe S-13 (Komentarz na żywo)
                  </h3>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto flex flex-col gap-2 pr-1 text-xs">
                {activeMatchState.events.length === 0 ? (
                  <div className="text-center text-slate-500 my-auto">
                    Sędzia daje znak do rozpoczęcia spotkania! Trwa walka w środku pola...
                  </div>
                ) : (
                  activeMatchState.events.map((ev) => (
                    <div
                      key={ev.id}
                      className={`p-2.5 rounded-xl border leading-relaxed ${
                        ev.type === 'goal' || ev.type === 'penalty_goal'
                          ? 'bg-emerald-950/80 border-emerald-500/80 text-emerald-200 font-bold shadow'
                          : ev.type === 'red_card'
                          ? 'bg-red-950/80 border-red-500/80 text-red-200 font-bold'
                          : ev.type === 'yellow_card'
                          ? 'bg-amber-950/50 border-amber-500/50 text-amber-200'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-black bg-slate-800 text-emerald-400">
                          {ev.minute}&apos;
                        </span>
                        <span className="text-[10px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded bg-slate-700 text-slate-200">
                          {ev.type === 'goal' ? '⚽ GOOOOL!' : ev.type === 'yellow_card' ? '🟨 ŻÓŁTA KARTKA' : 'AKCJA'}
                        </span>
                      </div>
                      <p className="text-xs">{ev.description}</p>
                    </div>
                  ))
                )}
                <div ref={commentaryEndRef} />
              </div>
            </div>

            {/* Statystyki meczu */}
            <div className="lg:col-span-5 bg-slate-900/90 rounded-3xl border border-slate-800 p-4 flex flex-col justify-between shadow-xl h-[380px]">
              <div>
                <h3 className="text-xs font-black text-white uppercase tracking-wider mb-3 border-b border-slate-800 pb-2 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  Statystyki Meczu
                </h3>

                <div className="flex flex-col gap-3 text-xs font-semibold">
                  <div>
                    <div className="flex justify-between text-slate-400 mb-1">
                      <span>{activeMatchState.stats.possessionHome}%</span>
                      <span className="text-slate-300">Posiadanie piłki</span>
                      <span>{activeMatchState.stats.possessionAway}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full flex overflow-hidden">
                      <div className="h-full bg-emerald-500" style={{ width: `${activeMatchState.stats.possessionHome}%` }} />
                      <div className="h-full bg-blue-500" style={{ width: `${activeMatchState.stats.possessionAway}%` }} />
                    </div>
                  </div>

                  <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                    <span className="font-bold text-white">{activeMatchState.stats.shotsHome}</span>
                    <span className="text-slate-400">Strzały łączne</span>
                    <span className="font-bold text-white">{activeMatchState.stats.shotsAway}</span>
                  </div>

                  <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                    <span className="font-bold text-emerald-400">{activeMatchState.stats.shotsOnTargetHome}</span>
                    <span className="text-slate-400">Strzały celne</span>
                    <span className="font-bold text-emerald-400">{activeMatchState.stats.shotsOnTargetAway}</span>
                  </div>

                  <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                    <span className="font-bold text-white">{activeMatchState.stats.cornersHome}</span>
                    <span className="text-slate-400">Rzuty rożne</span>
                    <span className="font-bold text-white">{activeMatchState.stats.cornersAway}</span>
                  </div>

                  <div className="flex justify-between items-center py-1">
                    <span className="font-bold text-white">{activeMatchState.stats.foulsHome}</span>
                    <span className="text-slate-400">Faule</span>
                    <span className="font-bold text-white">{activeMatchState.stats.foulsAway}</span>
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 text-center border-t border-slate-800 pt-2">
                Wykorzystane zmiany: <strong className="text-white">{userSubsUsed} / 5</strong>
              </div>
            </div>
          </div>

          {/* ================= 3. DOLNY PANEL STEROWANIA ================= */}
          <div className="max-w-6xl mx-auto w-full bg-slate-900/95 border border-slate-800 rounded-3xl p-3.5 shadow-2xl flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {!activeMatchState.isFinished ? (
                <>
                  <button
                    onClick={toggleMatchPause}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs shadow transition-all ${
                      activeMatchState.isPaused
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                        : 'bg-amber-600 hover:bg-amber-500 text-white'
                    }`}
                  >
                    {activeMatchState.isPaused ? (
                      <>
                        <Play className="w-4 h-4 fill-white" />
                        <span>WZNÓW MECZ</span>
                      </>
                    ) : (
                      <>
                        <Pause className="w-4 h-4 fill-white" />
                        <span>PAUZA / TAKTYKA</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                    {[1, 2, 5, 10].map((spd) => (
                      <button
                        key={spd}
                        onClick={() => setMatchSpeed(spd as 1 | 2 | 5 | 10)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all ${
                          activeMatchState.speed === spd
                            ? 'bg-emerald-500 text-slate-950'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {spd}x
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <button
                  onClick={finishMatchDay}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-black text-xs shadow-xl transition-all"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>ZAKOŃCZ KOLEJKĘ I PRZEJDŹ DALEJ</span>
                </button>
              )}
            </div>

            {!activeMatchState.isFinished && (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    if (!activeMatchState.isPaused) toggleMatchPause();
                    setSubModalOpen(true);
                  }}
                  disabled={userSubsUsed >= 5}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white text-xs font-bold border border-slate-700 transition-all"
                >
                  <ArrowRightLeft className="w-4 h-4 text-emerald-400" />
                  <span>Zmiany w Meczu ({userSubsUsed}/5)</span>
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* ================= 4. MODAL WIELU ZMIAN NA RAZ (MULTI-SUB MODAL) ================= */}
      {subModalOpen && (
        <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-3xl w-full shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <ArrowRightLeft className="w-5 h-5 text-emerald-400" />
                  Strefa Zmian Menedżera (Wykorzystano: {userSubsUsed} / 5)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Możesz zaplanować od 1 do {availableSubSlots} zmian na raz i zatwierdzić je wszystkie jednym kliknięciem.
                </p>
              </div>
              <button
                onClick={() => {
                  setPendingSubs([]);
                  setSubModalOpen(false);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Wybór par zamiany */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Kto schodzi z boiska */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold text-red-400 uppercase tracking-wider">
                  Kto opuszcza boisko (Schodzi):
                </span>
                <div className="flex flex-col gap-1.5 max-h-56 overflow-y-auto pr-1">
                  {myStartingPlayers.map((p, idx) => {
                    const isAlreadyQueued = pendingSubs.some((s) => s.outId === p.id);
                    return (
                      <button
                        key={p.id}
                        disabled={isAlreadyQueued}
                        onClick={() => setSelectedSubOut(p.id)}
                        className={`flex items-center justify-between p-2.5 rounded-xl border text-left text-xs transition-all ${
                          selectedSubOut === p.id
                            ? 'bg-red-500/20 border-red-400 text-white font-bold ring-2 ring-red-400/30'
                            : isAlreadyQueued
                            ? 'opacity-40 bg-slate-950 border-slate-900 cursor-not-allowed'
                            : 'bg-slate-950/70 border-slate-800 text-slate-200 hover:border-slate-600'
                        }`}
                      >
                        <div>
                          <div className="font-bold flex items-center gap-1.5">
                            <span className="px-1.5 py-0.2 rounded bg-red-950 text-red-300 font-black text-[10px]">
                              {getDetailedPositionLabel(p, idx).split(' ')[0]}
                            </span>
                            <span>{p.firstName} {p.lastName}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            Forma: <strong>{p.form}/10</strong> • OVR: {p.overall}
                          </div>
                        </div>

                        <div className="text-right">
                          <span className={`text-xs font-bold ${p.condition > 75 ? 'text-emerald-400' : 'text-amber-400'}`}>
                            {p.condition}%
                          </span>
                          <div className="w-12 h-1 bg-slate-800 rounded-full mt-1">
                            <div className="h-full bg-emerald-400" style={{ width: `${p.condition}%` }} />
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Kto wchodzi z ławki */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  Kto wchodzi z ławki (Wchodzi):
                </span>
                <div className="flex flex-col gap-1.5 max-h-56 overflow-y-auto pr-1">
                  {myBenchPlayers.map((p, idx) => {
                    const isAlreadyQueued = pendingSubs.some((s) => s.inId === p.id);
                    return (
                      <button
                        key={p.id}
                        disabled={isAlreadyQueued}
                        onClick={() => setSelectedSubIn(p.id)}
                        className={`flex items-center justify-between p-2.5 rounded-xl border text-left text-xs transition-all ${
                          selectedSubIn === p.id
                            ? 'bg-emerald-500/20 border-emerald-400 text-white font-bold ring-2 ring-emerald-400/30'
                            : isAlreadyQueued
                            ? 'opacity-40 bg-slate-950 border-slate-900 cursor-not-allowed'
                            : 'bg-slate-950/70 border-slate-800 text-slate-200 hover:border-slate-600'
                        }`}
                      >
                        <div>
                          <div className="font-bold flex items-center gap-1.5">
                            <span className="px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 font-black text-[10px]">
                              {p.position}
                            </span>
                            <span>{p.firstName} {p.lastName}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            Forma: <strong>{p.form}/10</strong> • Kondycja: {p.condition}%
                          </div>
                        </div>

                        <div className="text-right font-black text-emerald-400 text-sm">
                          OVR {p.overall}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Przycisk dodania do kolejki */}
            {selectedSubOut && selectedSubIn && (
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-300">
                  Zaplanowano zamianę: <strong className="text-red-400">{players[selectedSubOut]?.lastName}</strong> ➔ <strong className="text-emerald-400">{players[selectedSubIn]?.lastName}</strong>
                </span>
                <button
                  onClick={handleAddPendingSub}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Dodaj zmianę do kolejki</span>
                </button>
              </div>
            )}

            {/* Kolejka zaplanowanych zmian */}
            {pendingSubs.length > 0 && (
              <div className="flex flex-col gap-2 bg-slate-950/80 p-3 rounded-2xl border border-slate-800">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  Zaplanowane zmiany ({pendingSubs.length}):
                </span>
                <div className="flex flex-col gap-1.5">
                  {pendingSubs.map((pair, i) => {
                    const outP = players[pair.outId];
                    const inP = players[pair.inId];
                    return (
                      <div key={i} className="p-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-red-400 font-bold">SCHODZI: {outP?.lastName}</span>
                          <span className="text-slate-600">➔</span>
                          <span className="text-emerald-400 font-bold">WCHODZI: {inP?.lastName}</span>
                        </div>
                        <button
                          onClick={() => handleRemovePendingSub(i)}
                          className="p-1 text-slate-400 hover:text-red-400 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Stopka z zatwierdzeniem */}
            <div className="flex items-center justify-between border-t border-slate-800 pt-4">
              <button
                onClick={() => {
                  setPendingSubs([]);
                  setSubModalOpen(false);
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
              >
                Anuluj
              </button>

              <button
                onClick={handleConfirmAllPendingSubs}
                disabled={pendingSubs.length === 0 && (!selectedSubOut || !selectedSubIn)}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 disabled:opacity-40 text-white text-xs font-black shadow-lg transition-all"
              >
                Potwierdź Wszystkie Zmiany ({pendingSubs.length || (selectedSubOut && selectedSubIn ? 1 : 0)})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
