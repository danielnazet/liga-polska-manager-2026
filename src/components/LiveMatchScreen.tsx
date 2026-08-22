'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useGameStore } from '@/store/gameStore';
import {
  Play,
  Pause,
  FastForward,
  CheckCircle,
  Radio,
  Clock,
  Shield,
  Zap,
  Activity,
  ArrowRightLeft,
  X
} from 'lucide-react';
import { Mentality, Player } from '@/types';
import confetti from 'canvas-confetti';

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

  const [subModalOpen, setSubModalOpen] = useState(false);
  const [selectedSubOut, setSelectedSubOut] = useState<string | null>(null);
  const [selectedSubIn, setSelectedSubIn] = useState<string | null>(null);
  const commentaryEndRef = useRef<HTMLDivElement>(null);

  const activeManager = managers[activeManagerIndex - 1] || managers[0];
  const activeClubId = activeManager?.clubId;

  // Automatyczny timer minutowy meczu
  useEffect(() => {
    if (!activeMatchState || activeMatchState.isPaused || activeMatchState.isFinished) return;

    // Prędkości: 1x = 1000ms, 2x = 500ms, 5x = 150ms, 10x = 50ms
    const intervals: Record<number, number> = { 1: 900, 2: 450, 5: 120, 10: 40 };
    const intervalMs = intervals[activeMatchState.speed] || 450;

    const timer = setInterval(() => {
      tickMatchMinute();
    }, intervalMs);

    return () => clearInterval(timer);
  }, [activeMatchState, tickMatchMinute]);

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
  const myStartingPlayers = myClub.tactics.startingIds.map((id) => players[id]).filter(Boolean);
  const myBenchPlayers = myClub.tactics.benchIds.map((id) => players[id]).filter(Boolean);

  const handleConfirmSub = () => {
    if (!selectedSubOut || !selectedSubIn) return;
    makeInGameSubstitution(selectedSubOut, selectedSubIn);
    setSelectedSubOut(null);
    setSelectedSubIn(null);
    setSubModalOpen(false);
  };

  const isHomeUser = myClub.id === homeClub.id;
  const userSubsUsed = isHomeUser ? activeMatchState.homeSubsUsed : activeMatchState.awaySubsUsed;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex flex-col justify-between overflow-y-auto p-4 sm:p-6 text-white select-none">
      {/* 1. GŁÓWNA TABLICA WYNIKÓW (LED SCOREBOARD) */}
      <div className="max-w-6xl mx-auto w-full bg-slate-900/90 rounded-3xl border border-emerald-500/30 p-6 shadow-2xl shadow-emerald-950/50">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Gospodarze */}
          <div className="flex items-center gap-4 flex-1 justify-end text-right">
            <div>
              <h2 className="text-xl sm:text-2xl font-black tracking-wide text-white">
                {homeClub.name}
              </h2>
              <div className="text-xs text-slate-400 font-medium">Gospodarz • {homeClub.city}</div>
            </div>
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg border-2 border-white/20"
              style={{ backgroundColor: homeClub.primaryColor, color: homeClub.secondaryColor }}
            >
              {homeClub.shortName}
            </div>
          </div>

          {/* Wynik i Zegar */}
          <div className="flex flex-col items-center px-6 py-2 bg-slate-950/80 rounded-2xl border border-slate-800 shadow-inner">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest mb-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{activeMatchState.isFinished ? 'Koniec meczu (90\')' : `${activeMatchState.currentMinute}' MINUTA`}</span>
            </div>

            <div className="text-4xl sm:text-5xl font-black tracking-tighter text-emerald-400 flex items-center gap-3">
              <span>{activeMatchState.scoreHome}</span>
              <span className="text-slate-600">:</span>
              <span>{activeMatchState.scoreAway}</span>
            </div>

            {/* Pasek postępu meczu */}
            <div className="w-36 sm:w-48 h-2 bg-slate-800 rounded-full mt-3 overflow-hidden border border-slate-700">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300"
                style={{ width: `${Math.min(100, (activeMatchState.currentMinute / 90) * 100)}%` }}
              />
            </div>
          </div>

          {/* Goście */}
          <div className="flex items-center gap-4 flex-1 justify-start text-left">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg border-2 border-white/20"
              style={{ backgroundColor: awayClub.primaryColor, color: awayClub.secondaryColor }}
            >
              {awayClub.shortName}
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black tracking-wide text-white">
                {awayClub.name}
              </h2>
              <div className="text-xs text-slate-400 font-medium">Goście • {awayClub.city}</div>
            </div>
          </div>
        </div>

        {/* Panel pauzy w przerwie (45') */}
        {activeMatchState.isHalfTime && !activeMatchState.isFinished && (
          <div className="mt-4 p-3 bg-amber-500/20 border border-amber-400/40 rounded-xl text-center text-amber-300 text-sm font-bold animate-pulse">
            ☕ PRZERWA W MECZU (45&apos;) – Czas na uwagi w szatni, zmiany taktyczne i roszady w składzie!
          </div>
        )}
      </div>

      {/* 2. ŚRODKOWA SEKCJA: KOMENTARZ RADIOWY + STATYSTYKI */}
      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6 my-6 flex-1 items-start">
        {/* Lewa strona: Dynamiczny Komentarz Radiowy (Studio S-13) */}
        <div className="lg:col-span-7 bg-slate-900/90 rounded-3xl border border-slate-800 p-5 flex flex-col shadow-xl h-[420px]">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
            <div className="flex items-center gap-2">
              <Radio className="w-5 h-5 text-red-500 animate-pulse" />
              <h3 className="text-sm font-black text-white uppercase tracking-wider">
                Relacja Radiowa na Żywo (Studio S-13)
              </h3>
            </div>
            <span className="text-xs text-slate-400">Transmisja w toku</span>
          </div>

          {/* Strumień wiadomości radiowych */}
          <div className="flex-1 overflow-y-auto flex flex-col gap-2.5 pr-2">
            {activeMatchState.events.length === 0 ? (
              <div className="text-center text-slate-500 text-sm my-auto">
                Sędzia daje znak do rozpoczęcia spotkania! Trwa walka w środku pola...
              </div>
            ) : (
              activeMatchState.events.map((ev) => (
                <div
                  key={ev.id}
                  className={`p-3 rounded-2xl border text-xs sm:text-sm leading-relaxed transition-all ${
                    ev.type === 'goal' || ev.type === 'penalty_goal'
                      ? 'bg-emerald-950/80 border-emerald-500/80 text-emerald-200 font-bold shadow-lg shadow-emerald-950/50'
                      : ev.type === 'red_card'
                      ? 'bg-red-950/80 border-red-500/80 text-red-200 font-bold'
                      : ev.type === 'yellow_card'
                      ? 'bg-amber-950/50 border-amber-500/50 text-amber-200'
                      : ev.type === 'post'
                      ? 'bg-purple-950/50 border-purple-500/50 text-purple-200 font-semibold'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-black bg-slate-800 text-emerald-400 border border-slate-700">
                      {ev.minute}&apos;
                    </span>
                    <span
                      className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                        ev.type === 'goal'
                          ? 'bg-emerald-500 text-slate-950'
                          : ev.type === 'yellow_card'
                          ? 'bg-amber-400 text-slate-950'
                          : ev.type === 'red_card'
                          ? 'bg-red-600 text-white'
                          : ev.type === 'save'
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-700 text-slate-300'
                      }`}
                    >
                      {ev.type === 'goal'
                        ? '⚽ GOOOOL!'
                        : ev.type === 'yellow_card'
                        ? '🟨 ŻÓŁTA KARTKA'
                        : ev.type === 'red_card'
                        ? '🟥 CZERWONA KARTKA'
                        : ev.type === 'save'
                        ? '🧤 PARADA BRAMKARZA'
                        : ev.type === 'post'
                        ? '💥 SŁUPEK / POPRZECZKA'
                        : 'AKCJA'}
                    </span>
                  </div>
                  <p>{ev.description}</p>
                </div>
              ))
            )}
            <div ref={commentaryEndRef} />
          </div>
        </div>

        {/* Prawa strona: Statystyki na żywo */}
        <div className="lg:col-span-5 bg-slate-900/90 rounded-3xl border border-slate-800 p-5 flex flex-col justify-between shadow-xl h-[420px]">
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-slate-800 pb-3">
              <Activity className="w-4 h-4 text-emerald-400" />
              Statystyki Meczu
            </h3>

            <div className="flex flex-col gap-4 text-xs font-semibold">
              {/* Posiadanie piłki */}
              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>{activeMatchState.stats.possessionHome}%</span>
                  <span className="text-slate-300">Posiadanie piłki</span>
                  <span>{activeMatchState.stats.possessionAway}%</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full flex overflow-hidden">
                  <div
                    className="h-full bg-emerald-500"
                    style={{ width: `${activeMatchState.stats.possessionHome}%` }}
                  />
                  <div
                    className="h-full bg-blue-500"
                    style={{ width: `${activeMatchState.stats.possessionAway}%` }}
                  />
                </div>
              </div>

              {/* Strzały łączne */}
              <div className="flex justify-between items-center py-1.5 border-b border-slate-800/60">
                <span className="text-sm font-bold text-white">{activeMatchState.stats.shotsHome}</span>
                <span className="text-slate-400">Strzały łączne</span>
                <span className="text-sm font-bold text-white">{activeMatchState.stats.shotsAway}</span>
              </div>

              {/* Strzały celne */}
              <div className="flex justify-between items-center py-1.5 border-b border-slate-800/60">
                <span className="text-sm font-bold text-emerald-400">{activeMatchState.stats.shotsOnTargetHome}</span>
                <span className="text-slate-400">Strzały celne</span>
                <span className="text-sm font-bold text-emerald-400">{activeMatchState.stats.shotsOnTargetAway}</span>
              </div>

              {/* Rzuty rożne */}
              <div className="flex justify-between items-center py-1.5 border-b border-slate-800/60">
                <span className="text-sm font-bold text-white">{activeMatchState.stats.cornersHome}</span>
                <span className="text-slate-400">Rzuty rożne</span>
                <span className="text-sm font-bold text-white">{activeMatchState.stats.cornersAway}</span>
              </div>

              {/* Faule */}
              <div className="flex justify-between items-center py-1.5 border-b border-slate-800/60">
                <span className="text-sm font-bold text-white">{activeMatchState.stats.foulsHome}</span>
                <span className="text-slate-400">Faule</span>
                <span className="text-sm font-bold text-white">{activeMatchState.stats.foulsAway}</span>
              </div>

              {/* Kartki */}
              <div className="flex justify-between items-center py-1.5">
                <div className="flex items-center gap-1">
                  <span className="px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 font-bold text-[10px]">
                    {activeMatchState.stats.yellowCardsHome}
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-red-600 text-white font-bold text-[10px]">
                    {activeMatchState.stats.redCardsHome}
                  </span>
                </div>
                <span className="text-slate-400">Żółte / Czerwone</span>
                <div className="flex items-center gap-1">
                  <span className="px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 font-bold text-[10px]">
                    {activeMatchState.stats.yellowCardsAway}
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-red-600 text-white font-bold text-[10px]">
                    {activeMatchState.stats.redCardsAway}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 text-center border-t border-slate-800 pt-2">
            Wykorzystane zmiany: <strong className="text-white">{userSubsUsed} / 5</strong>
          </div>
        </div>
      </div>

      {/* 3. DOLNY PANEL STEROWANIA MENEDŻERA (INTERWENCJA NA ŻYWO) */}
      <div className="max-w-6xl mx-auto w-full bg-slate-900/95 border border-slate-800 rounded-3xl p-4 shadow-2xl flex flex-wrap items-center justify-between gap-4">
        {/* Lewa: Kontrola pauzy i prędkości */}
        <div className="flex items-center gap-2">
          {!activeMatchState.isFinished ? (
            <>
              <button
                onClick={toggleMatchPause}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-sm shadow-lg transition-all ${
                  activeMatchState.isPaused
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/40'
                    : 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-900/40'
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

              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-2xl border border-slate-800 ml-2">
                {[1, 2, 5, 10].map((spd) => (
                  <button
                    key={spd}
                    onClick={() => setMatchSpeed(spd as 1 | 2 | 5 | 10)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                      activeMatchState.speed === spd
                        ? 'bg-emerald-500 text-slate-950 shadow'
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
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-black text-sm shadow-xl shadow-emerald-950/60 border border-emerald-400/40 hover:scale-105 active:scale-95 transition-all"
            >
              <CheckCircle className="w-5 h-5" />
              <span>ZAKOŃCZ KOLEJKĘ I PRZEJDŹ DALEJ</span>
            </button>
          )}
        </div>

        {/* Prawa: Szybkie zmiany taktyki na żywo */}
        {!activeMatchState.isFinished && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-semibold">Nastawienie:</span>
              <select
                value={myClub.tactics.mentality}
                onChange={(e) => makeInGameTacticsChange({ mentality: e.target.value as Mentality })}
                className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="very_defensive">Obrona Częstochowy</option>
                <option value="defensive">Defensywne</option>
                <option value="balanced">Zrównoważone</option>
                <option value="attacking">Ofensywne</option>
                <option value="all_out_attack">Wszystko na jedną kartę</option>
              </select>
            </div>

            <button
              onClick={() => {
                if (!activeMatchState.isPaused) toggleMatchPause();
                setSubModalOpen(true);
              }}
              disabled={userSubsUsed >= 5}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white text-xs font-bold border border-slate-700 transition-all"
            >
              <ArrowRightLeft className="w-3.5 h-3.5 text-emerald-400" />
              <span>Zrób Zmianę ({userSubsUsed}/5)</span>
            </button>
          </div>
        )}
      </div>

      {/* 4. MODAL ZMIANY ZAWODNIKÓW NA ŻYWO (IN-GAME SUBS MODAL) */}
      {subModalOpen && (
        <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-2xl w-full shadow-2xl flex flex-col gap-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <ArrowRightLeft className="w-5 h-5 text-emerald-400" />
                Przeprowadź Zmianę ({userSubsUsed}/5)
              </h3>
              <button
                onClick={() => setSubModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Zawodnik schodzący z boiska */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold text-red-400 uppercase tracking-wider">
                  Kto opuszcza boisko:
                </span>
                <div className="flex flex-col gap-1.5 max-h-60 overflow-y-auto pr-1">
                  {myStartingPlayers.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedSubOut(p.id)}
                      className={`flex items-center justify-between p-2 rounded-xl border text-left text-xs transition-all ${
                        selectedSubOut === p.id
                          ? 'bg-red-500/20 border-red-400 text-white font-bold'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-600'
                      }`}
                    >
                      <span>
                        [{p.position}] {p.lastName}
                      </span>
                      <span className="text-slate-400">{p.condition}% kond.</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Zawodnik wchodzący z ławki */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  Kto wchodzi z ławki:
                </span>
                <div className="flex flex-col gap-1.5 max-h-60 overflow-y-auto pr-1">
                  {myBenchPlayers.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedSubIn(p.id)}
                      className={`flex items-center justify-between p-2 rounded-xl border text-left text-xs transition-all ${
                        selectedSubIn === p.id
                          ? 'bg-emerald-500/20 border-emerald-400 text-white font-bold'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-600'
                      }`}
                    >
                      <span>
                        [{p.position}] {p.lastName}
                      </span>
                      <span className="text-emerald-400">OVR {p.overall}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-800 pt-4">
              <button
                onClick={() => setSubModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
              >
                Anuluj
              </button>
              <button
                onClick={handleConfirmSub}
                disabled={!selectedSubOut || !selectedSubIn}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-xs font-bold shadow-lg shadow-emerald-950/50"
              >
                Potwierdź Zmianę
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
