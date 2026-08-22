'use client';

import React, { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import {
  Calendar,
  Coins,
  Trophy,
  Users,
  Play,
  Save,
  CheckCircle2,
  Tv,
  ArrowRightLeft,
  Home
} from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onExitToMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, onExitToMenu }) => {
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

  const navItems = [
    { id: 'tactics', label: 'Skład & Taktyka', icon: Users },
    { id: 'table', label: 'Tabela & Wyniki', icon: Trophy },
    { id: 'transfers', label: 'Transfery', icon: ArrowRightLeft },
    { id: 'finances', label: 'Finanse & Stadion', icon: Coins },
    { id: 'news', label: 'Wiadomości', icon: Tv },
  ];

  return (
    <header className="bg-slate-900/95 border-b border-emerald-800/40 sticky top-0 z-40 backdrop-blur shadow-xl">
      {/* Pasek statusu klubu */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-sm">
        {/* Lewa strona: Powrót do menu + Klub i Menedżer */}
        <div className="flex items-center gap-3">
          <button
            onClick={onExitToMenu}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-all border border-slate-700"
            title="Powrót do Menu Głównego"
          >
            <Home className="w-4 h-4 text-emerald-400" />
          </button>

          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center font-black text-base shadow-md border border-white/20"
            style={{
              backgroundColor: activeClub?.primaryColor || '#059669',
              color: activeClub?.secondaryColor || '#ffffff',
            }}
          >
            {activeClub?.shortName || 'PLM'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-base tracking-wide">
                {activeClub?.name || 'Klub'}
              </span>
              {gameMode === 'two_players' && (
                <span className="px-2 py-0.5 rounded text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  Gracz {activeManagerIndex}: {activeManager?.name}
                </span>
              )}
            </div>
            <div className="text-xs text-slate-400 flex items-center gap-2">
              <span>{activeClub?.city}</span>
              <span>•</span>
              <span className="text-emerald-400">Pojemność: {activeClub?.stadium.capacity.toLocaleString('pl-PL')}</span>
            </div>
          </div>
        </div>

        {/* Środek: Switcher 2 graczy (jeśli aktywny) & Data/Runda */}
        <div className="flex items-center gap-4 bg-slate-950/70 px-3.5 py-1.5 rounded-xl border border-slate-800">
          {gameMode === 'two_players' && (
            <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-700">
              <button
                onClick={() => setActiveManagerIndex(1)}
                className={`px-2.5 py-1 rounded text-xs font-bold transition-all ${
                  activeManagerIndex === 1
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Gracz 1 ({managers[0]?.name})
              </button>
              <button
                onClick={() => setActiveManagerIndex(2)}
                className={`px-2.5 py-1 rounded text-xs font-bold transition-all ${
                  activeManagerIndex === 2
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Gracz 2 ({managers[1]?.name})
              </button>
            </div>
          )}

          <div className="flex items-center gap-2 text-slate-300 text-xs font-medium">
            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
            <span>Kolejka {currentRound} / {totalRounds}</span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-400">{gameDate}</span>
          </div>

          <div className="flex items-center gap-1.5 text-amber-400 font-semibold text-xs bg-amber-950/40 px-2.5 py-1 rounded-lg border border-amber-800/40">
            <Coins className="w-3.5 h-3.5" />
            <span>{(activeClub?.finances.balance || 0).toLocaleString('pl-PL')} PLN</span>
          </div>
        </div>

        {/* Prawa strona: Zapis & Przycisk Dnia Meczowego */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-medium transition-all"
            title="Zapisz grę lokalnie i w chmurze Supabase"
          >
            {saveSuccess ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Zapisano!</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5 text-slate-400" />
                <span>{isSaving ? 'Zapisywanie...' : 'Zapisz'}</span>
              </>
            )}
          </button>

          <button
            onClick={startMatchDay}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-sm shadow-lg shadow-emerald-900/40 border border-emerald-400/40 hover:scale-105 active:scale-95 transition-all"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>ROZEGRAJ MECZ</span>
          </button>
        </div>
      </div>

      {/* Dolna nawigacja zakładek */}
      <div className="max-w-7xl mx-auto px-4 flex gap-1 border-t border-slate-800/80">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-all ${
                isActive
                  ? 'border-emerald-500 text-emerald-400 bg-emerald-950/30'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
