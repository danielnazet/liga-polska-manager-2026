'use client';

import React, { useState, useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import {
  Trophy,
  Play,
  FolderOpen,
  Settings,
  BookOpen,
  Info,
  Calendar,
  Building,
  Volume2,
  VolumeX,
  Sparkles,
  ArrowRight,
  Shield,
  RotateCcw,
  Check
} from 'lucide-react';
import { NewGameModal } from './NewGameModal';
import { GameState } from '@/types';
import { loadGameFromCloud } from '@/lib/supabase';

interface MainMenuProps {
  onStartGame: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({ onStartGame }) => {
  const { loadSavedGame, clubs, leagues } = useGameStore();

  const [newGameOpen, setNewGameOpen] = useState(false);
  const [loadModalOpen, setLoadModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [encyclopediaOpen, setEncyclopediaOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);

  const [savedGamesList, setSavedGamesList] = useState<{ id: string; title: string; date: string; state: GameState }[]>([]);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Wczytanie listy lokalnych zapisów
  useEffect(() => {
    const saved = localStorage.getItem('plm2026_save_game');
    if (saved) {
      try {
        const parsed: GameState = JSON.parse(saved);
        const manager = parsed.managers[0];
        const club = parsed.clubs[manager?.clubId || ''];
        setSavedGamesList([
          {
            id: parsed.saveId || 'local_save',
            title: club ? `${club.name} (Sezon ${parsed.currentSeason}, Kol. ${parsed.currentRound})` : 'Zapisana Gra',
            date: parsed.gameDate || '2026-08-22',
            state: parsed,
          },
        ]);
      } catch (err) {
        console.error(err);
      }
    }
  }, [loadModalOpen]);

  const handleLoadGame = (state: GameState) => {
    loadSavedGame(state);
    setLoadModalOpen(false);
    onStartGame();
  };

  return (
    <div className="relative min-h-screen w-full bg-slate-950 text-white flex flex-col justify-between overflow-hidden select-none">
      {/* Tło graficzne stadionu z gradientem */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-emerald-950/40 pointer-events-none z-0" />
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Siatka liniowa w stylu retro */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b98108_1px,transparent_1px),linear-gradient(to_bottom,#10b98108_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* GÓRNY PASEK STARTOWY */}
      <header className="relative z-10 max-w-7xl w-full mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black tracking-widest text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/30">
            SEZON 2026
          </span>
          <span className="text-xs text-slate-400 font-medium">Oficjalny polski menedżer ligowy</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white transition-all"
            title={soundEnabled ? 'Wycisz dźwięki' : 'Włącz dźwięki'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>
        </div>
      </header>

      {/* GŁÓWNE MENU ŚRODKOWE */}
      <main className="relative z-10 max-w-4xl w-full mx-auto px-6 my-auto flex flex-col items-center text-center">
        {/* Logo / Tytuł */}
        <div className="mb-8 flex flex-col items-center">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-slate-950 shadow-2xl shadow-emerald-500/30 border-2 border-emerald-300/40 mb-4 animate-bounce duration-1000">
            <Trophy className="w-10 h-10" />
          </div>

          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-slate-400 drop-shadow-sm">
            Polska Liga
          </h1>
          <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-widest text-emerald-400 mt-1 flex items-center gap-2">
            <span>MANAGER 2026</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-md">
            Wskrześ ducha kultowego <em>Liga Polska Manager 2005</em>. Poprowadź klub od Ekstraklasy aż po Okręgówkę!
          </p>
        </div>

        {/* Przyciski Menu Głównego */}
        <div className="flex flex-col gap-3 w-full max-w-md">
          {/* NOWA GRA */}
          <button
            onClick={() => setNewGameOpen(true)}
            className="group py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-black text-base tracking-wide shadow-xl shadow-emerald-950/60 border border-emerald-400/50 hover:scale-105 active:scale-95 transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <Play className="w-5 h-5 fill-white" />
              <span>NOWA KARIERA</span>
            </div>
            <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
          </button>

          {/* WCZYTAJ GRĘ */}
          <button
            onClick={() => setLoadModalOpen(true)}
            className="py-3.5 px-6 rounded-2xl bg-slate-900/90 hover:bg-slate-850 text-white font-bold text-sm border border-slate-800 hover:border-slate-700 shadow-lg hover:scale-102 active:scale-98 transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-3 text-slate-200">
              <FolderOpen className="w-5 h-5 text-amber-400" />
              <span>WCZYTAJ ZAPIS</span>
            </div>
            <span className="text-xs text-slate-500">
              {savedGamesList.length > 0 ? `${savedGamesList.length} zapis` : 'Brak'}
            </span>
          </button>

          {/* ENCYKLOPEDIA / BAZA KLUBÓW */}
          <button
            onClick={() => setEncyclopediaOpen(true)}
            className="py-3.5 px-6 rounded-2xl bg-slate-900/90 hover:bg-slate-850 text-white font-bold text-sm border border-slate-800 hover:border-slate-700 shadow-lg hover:scale-102 active:scale-98 transition-all flex items-center gap-3 text-slate-200"
          >
            <BookOpen className="w-5 h-5 text-blue-400" />
            <span>BAZA KLUBÓW I LIG (5 SZCZEBLI)</span>
          </button>

          {/* USTAWIENIA */}
          <button
            onClick={() => setSettingsModalOpen(true)}
            className="py-3.5 px-6 rounded-2xl bg-slate-900/90 hover:bg-slate-850 text-white font-bold text-sm border border-slate-800 hover:border-slate-700 shadow-lg hover:scale-102 active:scale-98 transition-all flex items-center gap-3 text-slate-200"
          >
            <Settings className="w-5 h-5 text-slate-400" />
            <span>OPCJE & USTAWIENIA</span>
          </button>

          {/* O GRZE */}
          <button
            onClick={() => setAboutOpen(true)}
            className="py-3 px-6 rounded-2xl bg-slate-950/60 hover:bg-slate-900 text-slate-400 hover:text-white font-semibold text-xs border border-slate-900 hover:border-slate-800 transition-all flex items-center justify-center gap-2"
          >
            <Info className="w-4 h-4" />
            <span>O projekcie i historia LPM</span>
          </button>
        </div>
      </main>

      {/* STOPKA */}
      <footer className="relative z-10 max-w-7xl w-full mx-auto px-6 py-6 text-center text-xs text-slate-600 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>Polska Liga Manager 2026 • Wersja 1.0 (Next.js + Supabase)</span>
        <span>Stworzone dla fanów polskiej piłki nożnej</span>
      </footer>

      {/* 1. MODAL WCZYTYWANIA ZAPISU */}
      {loadModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl flex flex-col gap-4">
            <h3 className="text-base font-black text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <FolderOpen className="w-5 h-5 text-amber-400" />
              Wczytaj Zapis Kariery
            </h3>

            {savedGamesList.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-sm">
                Brak zapisanych gier. Rozpocznij nową karierę!
              </div>
            ) : (
              <div className="flex flex-col gap-2.5 max-h-72 overflow-y-auto">
                {savedGamesList.map((save) => (
                  <button
                    key={save.id}
                    onClick={() => handleLoadGame(save.state)}
                    className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-emerald-500 text-left transition-all flex items-center justify-between group"
                  >
                    <div>
                      <div className="font-bold text-white text-sm group-hover:text-emerald-400 transition-all">
                        {save.title}
                      </div>
                      <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        <span>Data: {save.date}</span>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-emerald-400 transition-all" />
                  </button>
                ))}
              </div>
            )}

            <button
              onClick={() => setLoadModalOpen(false)}
              className="mt-2 w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs"
            >
              Zamknij
            </button>
          </div>
        </div>
      )}

      {/* 2. MODAL ENCYKLOPEDII LIG I KLUBÓW */}
      {encyclopediaOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-3xl w-full shadow-2xl flex flex-col gap-4 max-h-[85vh] overflow-y-auto">
            <h3 className="text-base font-black text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <BookOpen className="w-5 h-5 text-blue-400" />
              Polska Piramida Ligowa 2026 ({Object.keys(clubs).length} klubów)
            </h3>

            <div className="flex flex-col gap-6">
              {Object.values(leagues).map((lg) => (
                <div key={lg.id} className="flex flex-col gap-2">
                  <div className="text-sm font-black text-emerald-400 uppercase tracking-wider">
                    {lg.name} ({lg.clubIds.length} drużyn)
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {lg.clubIds.map((cid) => {
                      const c = clubs[cid];
                      if (!c) return null;
                      return (
                        <div
                          key={cid}
                          className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2 text-xs"
                        >
                          <div
                            className="w-5 h-5 rounded flex items-center justify-center text-[9px] font-black shrink-0"
                            style={{ backgroundColor: c.primaryColor, color: c.secondaryColor }}
                          >
                            {c.shortName}
                          </div>
                          <span className="truncate text-slate-300 font-semibold">{c.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setEncyclopediaOpen(false)}
              className="mt-4 w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs"
            >
              Zamknij
            </button>
          </div>
        </div>
      )}

      {/* 3. MODAL USTAWIEŃ */}
      {settingsModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl flex flex-col gap-5">
            <h3 className="text-base font-black text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Settings className="w-5 h-5 text-slate-400" />
              Ustawienia Gry
            </h3>

            <div className="flex flex-col gap-4 text-xs font-semibold">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <span>Dźwięki i komentarz:</span>
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold ${soundEnabled ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'}`}
                >
                  {soundEnabled ? 'Włączone' : 'Wyłączone'}
                </button>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <span>Automatyczny zapis po kolejce:</span>
                <button
                  onClick={() => setAutoSaveEnabled(!autoSaveEnabled)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold ${autoSaveEnabled ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'}`}
                >
                  {autoSaveEnabled ? 'Włączony' : 'Wyłączony'}
                </button>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-slate-400">
                <span className="block text-white mb-1">Połączenie z bazą Supabase:</span>
                <span className="text-emerald-400">Aktywne (Chmura + Offline LocalStorage)</span>
              </div>
            </div>

            <button
              onClick={() => setSettingsModalOpen(false)}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs"
            >
              Zapisz Ustawienia
            </button>
          </div>
        </div>
      )}

      {/* 4. MODAL O GRZE */}
      {aboutOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl flex flex-col gap-4 text-xs leading-relaxed">
            <h3 className="text-base font-black text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Info className="w-5 h-5 text-emerald-400" />
              O projekcie Polska Liga Manager 2026
            </h3>

            <p className="text-slate-300">
              Projekt jest hołdem dla kultowej polskiej serii menedżerów piłkarskich <strong>Liga Polska Manager</strong>, tworzonej w latach 1995–2005 przez firmę <strong>MarkSoft</strong> i zespół <strong>Mariusza Trzaski</strong>.
            </p>
            <p className="text-slate-300">
              Gra została napisana od zera w oparciu o nowoczesny stos <strong>Next.js 15, TypeScript, Tailwind CSS i Supabase</strong>, zachowując niepowtarzalny klimat polskich boisk, relację radiową Studio S-13 i zarządzanie klubem od Ekstraklasy aż po ligi okręgowe.
            </p>

            <button
              onClick={() => setAboutOpen(false)}
              className="mt-2 w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs"
            >
              Zamknij
            </button>
          </div>
        </div>
      )}

      {/* KREATOR NOWEJ GRY */}
      <NewGameModal
        isOpen={newGameOpen}
        onClose={() => {
          setNewGameOpen(false);
          onStartGame();
        }}
      />
    </div>
  );
};
