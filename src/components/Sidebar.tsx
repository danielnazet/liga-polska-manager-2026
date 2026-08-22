'use client';

import React from 'react';
import { useGameStore } from '@/store/gameStore';
import {
  Trophy,
  Users,
  ArrowRightLeft,
  Coins,
  Calendar,
  Save,
  CheckCircle2,
  Play,
  Home,
  X,
  ChevronRight,
  Globe
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onExitToMenu: () => void;
  isOpenMobile: boolean;
  setIsOpenMobile: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onExitToMenu,
  isOpenMobile,
  setIsOpenMobile,
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

  const [isSaving, setIsSaving] = React.useState(false);
  const [saveSuccess, setSaveSuccess] = React.useState(false);

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
    {
      id: 'tactics',
      label: 'Skład & Taktyka',
      sublabel: 'Skład / Taktyka / Stałe fragmenty',
      icon: Users,
    },
    {
      id: 'table',
      label: 'Tabela & Wyniki',
      sublabel: 'Tabela / Wyniki / Terminarz / Ligi',
      icon: Trophy,
    },
    {
      id: 'transfers',
      label: 'Transfery & Rynek',
      sublabel: 'Baza graczy / Wolni agenci',
      icon: ArrowRightLeft,
    },
    {
      id: 'finances',
      label: 'Finanse & Stadion',
      sublabel: 'Przychody / Budżety / Rozbudowa',
      icon: Coins,
    },
    {
      id: 'news',
      label: 'Wiadomości ze Świata',
      sublabel: 'Świat / Ekstraklasa / Transfery',
      icon: Globe,
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-900 border-r border-slate-800 text-slate-100 w-72 select-none shadow-2xl">
      {/* 1. BRANDING & HEADER */}
      <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-950/60 border border-emerald-400/30">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-sm font-black tracking-wide text-white flex items-center gap-1">
              <span>PLM 2026</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded font-bold">PRO</span>
            </div>
            <div className="text-[11px] text-slate-400">Polska Liga Manager</div>
          </div>
        </div>

        {/* Przycisk zamknięcia na mobilkach */}
        <button
          onClick={() => setIsOpenMobile(false)}
          className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* 2. AKTUALNY KLUB & MENEDŻER */}
      {activeClub && (
        <div className="p-4 border-b border-slate-800/80 bg-slate-950/40">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900 border border-slate-800/90 shadow-md">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center font-black text-sm shadow-md border border-white/20 shrink-0"
              style={{
                backgroundColor: activeClub.primaryColor || '#059669',
                color: activeClub.secondaryColor || '#ffffff',
              }}
            >
              {activeClub.shortName}
            </div>

            <div className="min-w-0 flex-1">
              <div className="font-bold text-white text-sm truncate">{activeClub.name}</div>
              <div className="text-xs text-slate-400 truncate flex items-center gap-1.5">
                <span>{activeManager?.name || 'Menedżer'}</span>
              </div>
              <div className="text-[10px] text-emerald-400 font-semibold mt-0.5">
                {activeClub.finances.balance.toLocaleString('pl-PL')} PLN
              </div>
            </div>
          </div>

          {/* Switcher 2 graczy */}
          {gameMode === 'two_players' && (
            <div className="mt-3 flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setActiveManagerIndex(1)}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all text-center ${
                  activeManagerIndex === 1
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Gracz 1
              </button>
              <button
                onClick={() => setActiveManagerIndex(2)}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all text-center ${
                  activeManagerIndex === 2
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Gracz 2
              </button>
            </div>
          )}
        </div>
      )}

      {/* 3. MENU NAWIGACYJNE */}
      <div className="flex-1 py-4 px-3 flex flex-col gap-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-black uppercase tracking-wider text-slate-500">
          Główne Menu Nawigacji
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsOpenMobile(false);
              }}
              className={`w-full flex items-center justify-between p-3 rounded-2xl text-left transition-all group ${
                isActive
                  ? 'bg-emerald-950/80 border border-emerald-500/50 text-white shadow-lg shadow-emerald-950/40 ring-1 ring-emerald-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-xl transition-all ${
                    isActive
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700 group-hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className={`text-xs font-bold ${isActive ? 'text-white' : 'text-slate-200'}`}>
                    {item.label}
                  </div>
                  <div className="text-[10px] text-slate-500 truncate max-w-[150px]">
                    {item.sublabel}
                  </div>
                </div>
              </div>

              {isActive && <ChevronRight className="w-4 h-4 text-emerald-400" />}
            </button>
          );
        })}
      </div>

      {/* 4. DOLNE PRZYCISKI AKCJI & DNIA MECZOWEGO */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/80 flex flex-col gap-3">
        {/* Status Dnia Meczowego */}
        <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs">
          <div className="flex items-center gap-2 text-slate-400 font-medium">
            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
            <span>Kolejka {currentRound} / {totalRounds}</span>
          </div>
          <span className="text-[11px] text-slate-500 font-semibold">{gameDate}</span>
        </div>

        {/* Przycisk Rozegraj Mecz */}
        <button
          onClick={() => {
            startMatchDay();
            setIsOpenMobile(false);
          }}
          className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-black text-xs sm:text-sm shadow-xl shadow-emerald-950/60 border border-emerald-400/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>ROZEGRAJ MECZ</span>
        </button>

        {/* Przycisk Zapisz & Menu Główne */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold transition-all hover:text-white"
          >
            {saveSuccess ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Zapisano</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5 text-slate-400" />
                <span>{isSaving ? 'Zapis...' : 'Zapisz'}</span>
              </>
            )}
          </button>

          <button
            onClick={onExitToMenu}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 text-xs font-semibold transition-all"
            title="Powrót do ekranu startowego"
          >
            <Home className="w-3.5 h-3.5 text-slate-400" />
            <span>Menu</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Stały po lewej) */}
      <aside className="hidden md:block h-screen sticky top-0 shrink-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer (Wysuwany po kliknięciu hamburgera) */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div
            onClick={() => setIsOpenMobile(false)}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
          />
          {/* Drawer content */}
          <div className="relative z-10">{sidebarContent}</div>
        </div>
      )}
    </>
  );
};
