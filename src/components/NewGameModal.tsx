'use client';

import React, { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { GameMode } from '@/types';
import { Trophy, User, Users, Play, Shield, Building, Coins } from 'lucide-react';

interface NewGameModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewGameModal: React.FC<NewGameModalProps> = ({ isOpen, onClose }) => {
  const { leagues, clubs, initNewGame } = useGameStore();

  const [mode, setMode] = useState<GameMode>('single_player');
  const [manager1Name, setManager1Name] = useState('Jan Kowalski');
  const [manager2Name, setManager2Name] = useState('Adam Nowak');
  const [selectedLeagueId, setSelectedLeagueId] = useState('ekstraklasa');
  const [selectedClub1Id, setSelectedClub1Id] = useState('lech_poznan');
  const [selectedClub2Id, setSelectedClub2Id] = useState('legia_warszawa');

  if (!isOpen) return null;

  const currentLeague = leagues[selectedLeagueId] || leagues.ekstraklasa;
  const leagueClubs = currentLeague.clubIds.map((id) => clubs[id]).filter(Boolean);

  const club1 = clubs[selectedClub1Id] || leagueClubs[0];
  const club2 = clubs[selectedClub2Id] || leagueClubs[1] || leagueClubs[0];

  const handleStartGame = () => {
    initNewGame({
      mode,
      manager1Name: manager1Name || 'Menedżer 1',
      manager1ClubId: selectedClub1Id,
      manager2Name: mode === 'two_players' ? manager2Name || 'Menedżer 2' : undefined,
      manager2ClubId: mode === 'two_players' ? selectedClub2Id : undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-4xl w-full shadow-2xl flex flex-col gap-6 my-auto">
        {/* Tytuł */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mb-3 shadow-lg shadow-emerald-950/50">
            <Trophy className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase">
            Polska Liga Manager 2026
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Wybierz tryb, polską ligę od Ekstraklasy do Okręgówki i poprowadź swój klub na szczyt!
          </p>
        </div>

        {/* Wybór trybu (1 Gracz vs 2 Graczy) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => setMode('single_player')}
            className={`p-4 rounded-2xl border flex items-center gap-4 transition-all text-left ${
              mode === 'single_player'
                ? 'bg-emerald-950/60 border-emerald-500 text-white ring-2 ring-emerald-500/30'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Tryb Kariery (1 Gracz)</div>
              <div className="text-xs text-slate-400">Prowadzisz wybrany klub, reszta ligi sterowana przez AI</div>
            </div>
          </button>

          <button
            onClick={() => setMode('two_players')}
            className={`p-4 rounded-2xl border flex items-center gap-4 transition-all text-left ${
              mode === 'two_players'
                ? 'bg-emerald-950/60 border-emerald-500 text-white ring-2 ring-emerald-500/30'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Tryb 2 Graczy (Hotseat)</div>
              <div className="text-xs text-slate-400">Dwóch graczy wybiera po klubie i rywalizuje w tej samej grze</div>
            </div>
          </button>
        </div>

        {/* Dane menedżerów */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-slate-400 block mb-1 font-semibold">Imię i Nazwisko Menedżera 1:</label>
            <input
              type="text"
              value={manager1Name}
              onChange={(e) => setManager1Name(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {mode === 'two_players' && (
            <div>
              <label className="text-xs text-slate-400 block mb-1 font-semibold">Imię i Nazwisko Menedżera 2:</label>
              <input
                type="text"
                value={manager2Name}
                onChange={(e) => setManager2Name(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          )}
        </div>

        {/* Wybór Ligi */}
        <div>
          <label className="text-xs text-slate-400 block mb-2 font-semibold uppercase tracking-wider">
            Wybierz Szczebel Ligowy:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
            {Object.values(leagues).map((lg) => (
              <button
                key={lg.id}
                onClick={() => {
                  setSelectedLeagueId(lg.id);
                  if (clubs[lg.clubIds[0]]) setSelectedClub1Id(lg.clubIds[0]);
                  if (clubs[lg.clubIds[1]]) setSelectedClub2Id(lg.clubIds[1]);
                }}
                className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  selectedLeagueId === lg.id
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/60'
                    : 'bg-slate-950/80 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {lg.name}
              </button>
            ))}
          </div>
        </div>

        {/* Wybór Klubu dla Gracza 1 */}
        <div className="flex flex-col gap-2">
          <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
            Wybierz Klub dla Gracza 1:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 max-h-48 overflow-y-auto p-1 bg-slate-950/50 rounded-2xl border border-slate-800">
            {leagueClubs.map((club) => (
              <button
                key={club.id}
                onClick={() => setSelectedClub1Id(club.id)}
                className={`p-2.5 rounded-xl border flex items-center gap-2.5 text-left text-xs transition-all ${
                  selectedClub1Id === club.id
                    ? 'bg-emerald-950/80 border-emerald-500 text-white font-bold ring-2 ring-emerald-500/30'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div
                  className="w-6 h-6 rounded flex items-center justify-center text-[10px] font-black shrink-0"
                  style={{ backgroundColor: club.primaryColor, color: club.secondaryColor }}
                >
                  {club.shortName}
                </div>
                <span className="truncate">{club.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Wybór Klubu dla Gracza 2 (jeśli aktywny tryb 2P) */}
        {mode === 'two_players' && (
          <div className="flex flex-col gap-2">
            <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              Wybierz Klub dla Gracza 2:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 max-h-48 overflow-y-auto p-1 bg-slate-950/50 rounded-2xl border border-slate-800">
              {leagueClubs.map((club) => (
                <button
                  key={club.id}
                  onClick={() => setSelectedClub2Id(club.id)}
                  className={`p-2.5 rounded-xl border flex items-center gap-2.5 text-left text-xs transition-all ${
                    selectedClub2Id === club.id
                      ? 'bg-amber-950/80 border-amber-500 text-white font-bold ring-2 ring-amber-500/30'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div
                    className="w-6 h-6 rounded flex items-center justify-center text-[10px] font-black shrink-0"
                    style={{ backgroundColor: club.primaryColor, color: club.secondaryColor }}
                  >
                    {club.shortName}
                  </div>
                  <span className="truncate">{club.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Podsumowanie wybranego klubu 1 */}
        {club1 && (
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black shadow"
                style={{ backgroundColor: club1.primaryColor, color: club1.secondaryColor }}
              >
                {club1.shortName}
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">{club1.name}</h4>
                <span className="text-slate-400">{club1.city} • Reputacja: {club1.reputation}/100</span>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-1.5 text-slate-300">
                <Building className="w-4 h-4 text-emerald-400" />
                <span>Stadion: {club1.stadium.capacity.toLocaleString('pl-PL')}</span>
              </div>
              <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                <Coins className="w-4 h-4" />
                <span>Budżet: {club1.finances.balance.toLocaleString('pl-PL')} PLN</span>
              </div>
            </div>
          </div>
        )}

        {/* Przycisk startu */}
        <button
          onClick={handleStartGame}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-black text-base shadow-xl shadow-emerald-950/60 border border-emerald-400/40 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
        >
          <Play className="w-5 h-5 fill-white" />
          <span>ROZPOCZNIJ SEZON 2026</span>
        </button>
      </div>
    </div>
  );
};
