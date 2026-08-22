'use client';

import React, { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import {
  Calendar,
  Coins,
  Play,
  Save,
  CheckCircle2,
  Menu,
  Building
} from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onExitToMenu: () => void;
  onToggleMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onExitToMenu,
  onToggleMobileMenu,
}) => {
  const {
    clubs,
    managers,
    activeManagerIndex,
    setActiveManagerIndex,
    gameMode,
    currentRound,
    totalRounds,
    gameDate,
    startMatchDay,
    saveGame,
  } = useGameStore();

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const activeManager = managers[activeManagerIndex - 1] || managers[0];
  const activeClub = activeManager ? clubs[activeManager.clubId] : null;

  const handleSave = async () => {
    setIsSaving(true);
    const ok = await saveGame();
    setIsSaving(false);
    if (ok) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    }
  };

  const pageTitles: Record<string, string> = {
    tactics: 'Zarządzanie Składem i Taktyką',
    table: 'Tabela Ligowa i Terminarz',
    transfers: 'Rynek Transferowy i Baza Piłkarzy',
    finances: 'Finanse Klubu i Infrastruktura',
    news: 'Wiadomości ze Świata Futbolu',
  };

  return (
    <header className="bg-slate-900/95 border-b border-slate-800 sticky top-0 z-20 backdrop-blur-md shadow-md py-3 px-4 sm:px-6">
      <div className="w-full flex items-center justify-between gap-4">
        {/* Lewa strona: Mobile Hamburger + Tytuł sekcji / Herb klubu */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileMenu}
            className="md:hidden p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700"
            aria-label="Otwórz menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {activeClub && (
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs shadow border border-white/20 shrink-0"
                style={{
                  backgroundColor: activeClub.primaryColor || '#059669',
                  color: activeClub.secondaryColor || '#ffffff',
                }}
              >
                {activeClub.shortName}
              </div>

              <div>
                <h1 className="text-sm font-black text-white tracking-wide truncate">
                  {pageTitles[activeTab] || 'Dashboard'}
                </h1>
                <div className="text-[11px] text-slate-400 flex items-center gap-2">
                  <span>{activeClub.name}</span>
                  <span className="text-slate-600">•</span>
                  <span>Menedżer: {activeManager?.name}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Środek: Data, Runda i Stan Konta */}
        <div className="hidden sm:flex items-center gap-3 bg-slate-950/80 px-3.5 py-1.5 rounded-2xl border border-slate-800 text-xs">
          {gameMode === 'two_players' && (
            <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-700 mr-1">
              <button
                onClick={() => setActiveManagerIndex(1)}
                className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                  activeManagerIndex === 1 ? 'bg-emerald-600 text-white' : 'text-slate-400'
                }`}
              >
                G1
              </button>
              <button
                onClick={() => setActiveManagerIndex(2)}
                className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                  activeManagerIndex === 2 ? 'bg-emerald-600 text-white' : 'text-slate-400'
                }`}
              >
                G2
              </button>
            </div>
          )}

          <div className="flex items-center gap-1.5 text-slate-300 font-medium">
            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
            <span>Kolejka {currentRound} / {totalRounds}</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">{gameDate}</span>
          </div>

          <div className="flex items-center gap-1.5 text-emerald-400 font-bold bg-emerald-950/40 px-2.5 py-1 rounded-xl border border-emerald-800/40">
            <Coins className="w-3.5 h-3.5" />
            <span>{(activeClub?.finances.balance || 0).toLocaleString('pl-PL')} PLN</span>
          </div>
        </div>

        {/* Prawa strona: Akcje (Zapisz & Rozegraj Mecz) */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold transition-all"
            title="Zapisz grę"
          >
            {saveSuccess ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Zapisano!</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5 text-slate-400" />
                <span>{isSaving ? '...' : 'Zapisz'}</span>
              </>
            )}
          </button>

          <button
            onClick={startMatchDay}
            className="flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-black text-xs sm:text-sm shadow-md shadow-emerald-950/50 border border-emerald-400/40 hover:scale-105 active:scale-95 transition-all"
          >
            <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-white" />
            <span>ROZEGRAJ MECZ</span>
          </button>
        </div>
      </div>
    </header>
  );
};
