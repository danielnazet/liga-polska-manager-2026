'use client';

import React, { useState, useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import { MainMenu } from '@/components/MainMenu';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { TacticsPitch } from '@/components/TacticsPitch';
import { LeagueTable } from '@/components/LeagueTable';
import { TransfersView } from '@/components/TransfersView';
import { FinancesView } from '@/components/FinancesView';
import { NewsView } from '@/components/NewsView';
import { LiveMatchScreen } from '@/components/LiveMatchScreen';
import { Trophy } from 'lucide-react';

export default function Home() {
  const { managers, clubs, loadSavedGame, activeMatchState } = useGameStore();

  const [viewMode, setViewMode] = useState<'menu' | 'game'>('menu');
  const [activeTab, setActiveTab] = useState<string>('tactics');
  const [isLoaded, setIsLoaded] = useState(false);
  const [isOpenMobile, setIsOpenMobile] = useState(false);

  useEffect(() => {
    // Sprawdź czy jest zapisana gra w localStorage
    const saved = localStorage.getItem('plm2026_save_game');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        loadSavedGame(parsed);
      } catch (err) {
        console.error('Error loading save:', err);
      }
    }
    setIsLoaded(true);
  }, [loadSavedGame]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-bold tracking-wider text-slate-400">
            Ładowanie Polska Liga Manager 2026...
          </span>
        </div>
      </div>
    );
  }

  // 1. EKRAN STARTOWY / MENU GŁÓWNE
  if (viewMode === 'menu' || managers.length === 0) {
    return <MainMenu onStartGame={() => setViewMode('game')} />;
  }

  // 2. WIDOK W GRZE (DASHBOARD Z SIDEBAREM)
  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-100 font-sans">
      {/* Panel Boczny (Sidebar) */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onExitToMenu={() => setViewMode('menu')}
        isOpenMobile={isOpenMobile}
        setIsOpenMobile={setIsOpenMobile}
      />

      {/* Główny obszar zawartości (Górny pasek + Treść) */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onExitToMenu={() => setViewMode('menu')}
          onToggleMobileMenu={() => setIsOpenMobile(true)}
        />

        {/* Główna zawartość aktywnej zakładki */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'tactics' && <TacticsPitch />}
          {activeTab === 'table' && <LeagueTable />}
          {activeTab === 'transfers' && <TransfersView />}
          {activeTab === 'finances' && <FinancesView />}
          {activeTab === 'news' && <NewsView />}
        </main>

        {/* Stopka aplikacji */}
        <footer className="border-t border-slate-900 bg-slate-950/90 py-4 px-6 text-xs text-slate-500 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-emerald-500" />
            <span>Polska Liga Manager 2026 • Inspirowane kultowym LPM 2005</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setViewMode('menu')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-semibold transition-all hover:text-white"
            >
              <span>Menu Główne</span>
            </button>
          </div>
        </footer>
      </div>

      {/* Ekran Meczu na Żywo (nakładka podczas meczu) */}
      {activeMatchState && <LiveMatchScreen />}
    </div>
  );
}
