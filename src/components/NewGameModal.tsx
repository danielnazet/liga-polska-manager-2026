'use client';

import React, { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { GameMode } from '@/types';
import {
  Trophy,
  User,
  Users,
  Play,
  Shield,
  Building,
  Coins,
  Layers,
  Globe,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Wifi,
  Key
} from 'lucide-react';

interface NewGameModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewGameModal: React.FC<NewGameModalProps> = ({ isOpen, onClose }) => {
  const { leagues, clubs, initNewGame } = useGameStore();

  // Etap kreatora (1: Menedżer, 2: Liga, 3: Klub, 4: Podsumowanie)
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Formularz
  const [mode, setMode] = useState<GameMode>('single_player');
  const [onlineType, setOnlineType] = useState<'create' | 'join'>('create');
  const [lobbyCode, setLobbyCode] = useState<string>('PLM-' + Math.floor(1000 + Math.random() * 9000));
  const [joinCodeInput, setJoinCodeInput] = useState<string>('');

  const [manager1Name, setManager1Name] = useState('Jan Kowalski');
  const [manager2Name, setManager2Name] = useState('Adam Nowak');
  const [selectedLeagueId, setSelectedLeagueId] = useState('ekstraklasa');
  const [selectedClub1Id, setSelectedClub1Id] = useState('legia_warszawa');
  const [selectedClub2Id, setSelectedClub2Id] = useState('lech_poznan');

  if (!isOpen) return null;

  const currentLeague = leagues[selectedLeagueId] || leagues.ekstraklasa;
  const leagueClubs = (currentLeague?.clubIds || []).map((id) => clubs[id]).filter(Boolean);

  const club1 = clubs[selectedClub1Id] || leagueClubs[0];
  const club2 = clubs[selectedClub2Id] || leagueClubs[1] || leagueClubs[0];

  const handleNextStep = () => {
    if (step < 4) setStep((s) => (s + 1) as any);
  };

  const handlePrevStep = () => {
    if (step > 1) setStep((s) => (s - 1) as any);
  };

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
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-3xl w-full shadow-2xl flex flex-col gap-6 my-auto max-h-[95vh] overflow-y-auto">
        {/* Tytuł & Stepper */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mb-2 shadow-lg">
            <Trophy className="w-6 h-6" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase">
            Polska Liga Manager 2026
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Nowa Kariera Menedżerska • Krok {step} z 4
          </p>

          {/* Stepper Dots & Labels */}
          <div className="flex items-center justify-center gap-2 sm:gap-4 mt-4 max-w-lg mx-auto">
            <div className={`flex items-center gap-1 text-xs font-bold ${step >= 1 ? 'text-emerald-400' : 'text-slate-600'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${step >= 1 ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-500'}`}>1</span>
              <span className="hidden sm:inline">Menedżer</span>
            </div>

            <div className={`h-0.5 w-6 ${step >= 2 ? 'bg-emerald-500' : 'bg-slate-800'}`} />

            <div className={`flex items-center gap-1 text-xs font-bold ${step >= 2 ? 'text-emerald-400' : 'text-slate-600'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${step >= 2 ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-500'}`}>2</span>
              <span className="hidden sm:inline">Liga</span>
            </div>

            <div className={`h-0.5 w-6 ${step >= 3 ? 'bg-emerald-500' : 'bg-slate-800'}`} />

            <div className={`flex items-center gap-1 text-xs font-bold ${step >= 3 ? 'text-emerald-400' : 'text-slate-600'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${step >= 3 ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-500'}`}>3</span>
              <span className="hidden sm:inline">Klub</span>
            </div>

            <div className={`h-0.5 w-6 ${step >= 4 ? 'bg-emerald-500' : 'bg-slate-800'}`} />

            <div className={`flex items-center gap-1 text-xs font-bold ${step >= 4 ? 'text-emerald-400' : 'text-slate-600'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${step >= 4 ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-500'}`}>4</span>
              <span className="hidden sm:inline">Start</span>
            </div>
          </div>
        </div>

        {/* ==================== KROK 1: MENEDŻER & TRYB GRY ==================== */}
        {step === 1 && (
          <div className="flex flex-col gap-5">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">
              1. Wybierz Tryb Rozgrywki i Dane Menedżera
            </h2>

            {/* Wybór Trybu: Kariera 1P vs Online 2P */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => setMode('single_player')}
                className={`p-4 rounded-2xl border flex items-center gap-4 transition-all text-left ${
                  mode === 'single_player'
                    ? 'bg-emerald-950/60 border-emerald-500 text-white ring-2 ring-emerald-500/30'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">Tryb Kariery (Single Player)</div>
                  <div className="text-xs text-slate-400">Grasz sam wybranym klubem przeciwko AI</div>
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
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                  <Wifi className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">Tryb 2 Graczy (Online Multiplayer)</div>
                  <div className="text-xs text-slate-400">Grajcie razem przez internet w 2 osoby</div>
                </div>
              </button>
            </div>

            {/* Konfiguracja Online Multiplayer */}
            {mode === 'two_players' && (
              <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 flex flex-col gap-3">
                <div className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                  <Wifi className="w-4 h-4" />
                  <span>Konfiguracja Pokoju Online dla 2 Graczy:</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setOnlineType('create')}
                    className={`p-3 rounded-xl border text-xs font-bold transition-all text-center ${
                      onlineType === 'create'
                        ? 'bg-emerald-600 border-emerald-400 text-white'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    Stwórz Nowy Pokój (Host)
                  </button>

                  <button
                    onClick={() => setOnlineType('join')}
                    className={`p-3 rounded-xl border text-xs font-bold transition-all text-center ${
                      onlineType === 'join'
                        ? 'bg-emerald-600 border-emerald-400 text-white'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    Dołącz Kodem
                  </button>
                </div>

                {onlineType === 'create' ? (
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-400">Twój Kod Lobby dla Gracza 2:</span>
                    <strong className="text-emerald-400 font-mono text-sm tracking-wider">{lobbyCode}</strong>
                  </div>
                ) : (
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Wpisz Kod Lobby od Znajomego:</label>
                    <input
                      type="text"
                      placeholder="Np. PLM-8492"
                      value={joinCodeInput}
                      onChange={(e) => setJoinCodeInput(e.target.value.toUpperCase())}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white uppercase font-mono"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Dane Menedżera */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1 font-semibold">
                  Imię i Nazwisko Menedżera 1:
                </label>
                <input
                  type="text"
                  value={manager1Name}
                  onChange={(e) => setManager1Name(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {mode === 'two_players' && (
                <div>
                  <label className="text-xs text-slate-400 block mb-1 font-semibold">
                    Imię i Nazwisko Menedżera 2:
                  </label>
                  <input
                    type="text"
                    value={manager2Name}
                    onChange={(e) => setManager2Name(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================== KROK 2: WYBÓR LIGI ==================== */}
        {step === 2 && (
          <div className="flex flex-col gap-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">
              2. Wybierz Polską Ligę (Piramida I - IX)
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-72 overflow-y-auto p-1">
              {Object.values(leagues).map((lg) => (
                <button
                  key={lg.id}
                  onClick={() => {
                    setSelectedLeagueId(lg.id);
                    if (lg.clubIds[0] && clubs[lg.clubIds[0]]) setSelectedClub1Id(lg.clubIds[0]);
                    if (lg.clubIds[1] && clubs[lg.clubIds[1]]) setSelectedClub2Id(lg.clubIds[1]);
                  }}
                  className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                    selectedLeagueId === lg.id
                      ? 'bg-emerald-950/80 border-emerald-500 text-white ring-2 ring-emerald-500/30'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="text-[10px] font-black text-emerald-400 uppercase">
                      Poziom {lg.tier}
                    </div>
                    <div className="text-sm font-bold text-white mt-0.5">{lg.name}</div>
                  </div>

                  <div className="text-[11px] text-slate-500 mt-2">
                    {lg.clubIds.length} Drużyn • Awans: {lg.promotionSpots}
                  </div>
                </button>
              ))}
            </div>

            <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 text-xs text-slate-300">
              Selected League: <strong className="text-white">{currentLeague.name}</strong> • Liczba drużyn w lidze:{' '}
              <strong className="text-emerald-400">{leagueClubs.length}</strong>
            </div>
          </div>
        )}

        {/* ==================== KROK 3: WYBÓR KLUBU ==================== */}
        {step === 3 && (
          <div className="flex flex-col gap-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">
              3. Wybierz Klub z Ligi: {currentLeague.name}
            </h2>

            {/* Wybór Klubu dla Gracza 1 */}
            <div className="flex flex-col gap-2">
              <label className="text-xs text-slate-400 font-semibold uppercase">
                Wybierz Klub dla Gracza 1 ({manager1Name}):
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-56 overflow-y-auto p-1">
                {leagueClubs.map((club) => (
                  <button
                    key={club.id}
                    onClick={() => setSelectedClub1Id(club.id)}
                    className={`p-3 rounded-2xl border flex items-center gap-3 text-left transition-all ${
                      selectedClub1Id === club.id
                        ? 'bg-emerald-950/80 border-emerald-500 text-white font-bold ring-2 ring-emerald-500/30'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black shrink-0 border border-white/20"
                      style={{ backgroundColor: club.primaryColor, color: club.secondaryColor }}
                    >
                      {club.shortName}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold truncate text-white">{club.name}</div>
                      <div className="text-[10px] text-slate-400 truncate">{club.city}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Wybór Klubu dla Gracza 2 (jeśli tryb 2P) */}
            {mode === 'two_players' && (
              <div className="flex flex-col gap-2 mt-2">
                <label className="text-xs text-slate-400 font-semibold uppercase">
                  Wybierz Klub dla Gracza 2 ({manager2Name}):
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-48 overflow-y-auto p-1">
                  {leagueClubs.map((club) => (
                    <button
                      key={club.id}
                      onClick={() => setSelectedClub2Id(club.id)}
                      className={`p-3 rounded-2xl border flex items-center gap-3 text-left transition-all ${
                        selectedClub2Id === club.id
                          ? 'bg-amber-950/80 border-amber-500 text-white font-bold ring-2 ring-amber-500/30'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black shrink-0 border border-white/20"
                        style={{ backgroundColor: club.primaryColor, color: club.secondaryColor }}
                      >
                        {club.shortName}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold truncate text-white">{club.name}</div>
                        <div className="text-[10px] text-slate-400 truncate">{club.city}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================== KROK 4: PODSUMOWANIE ==================== */}
        {step === 4 && (
          <div className="flex flex-col gap-5">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">
              4. Podsumowanie Kariery Menedżerskiej
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Gracz 1 */}
              <div className="bg-slate-950/80 p-5 rounded-3xl border border-slate-800 flex flex-col gap-3">
                <div className="text-xs font-bold text-emerald-400 uppercase">Gracz 1</div>
                <div className="text-lg font-black text-white">{manager1Name}</div>

                {club1 && (
                  <div className="mt-2 p-3 bg-slate-900 rounded-2xl border border-slate-800 flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs"
                      style={{ backgroundColor: club1.primaryColor, color: club1.secondaryColor }}
                    >
                      {club1.shortName}
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm">{club1.name}</div>
                      <div className="text-xs text-slate-400">{currentLeague.name}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Gracz 2 jeśli 2P */}
              {mode === 'two_players' && (
                <div className="bg-slate-950/80 p-5 rounded-3xl border border-slate-800 flex flex-col gap-3">
                  <div className="text-xs font-bold text-amber-400 uppercase">Gracz 2 (Online)</div>
                  <div className="text-lg font-black text-white">{manager2Name}</div>

                  {club2 && (
                    <div className="mt-2 p-3 bg-slate-900 rounded-2xl border border-slate-800 flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs"
                        style={{ backgroundColor: club2.primaryColor, color: club2.secondaryColor }}
                      >
                        {club2.shortName}
                      </div>
                      <div>
                        <div className="font-bold text-white text-sm">{club2.name}</div>
                        <div className="text-xs text-slate-400">{currentLeague.name}</div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* PRZYCISKI NAWIGACJI KREATORA */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          {step > 1 ? (
            <button
              onClick={handlePrevStep}
              className="px-5 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-2 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Wstecz</span>
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-2xl bg-slate-950 hover:bg-slate-800 text-slate-400 text-xs font-bold transition-all"
            >
              Anuluj
            </button>
          )}

          {step < 4 ? (
            <button
              onClick={handleNextStep}
              className="px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-950/60 transition-all"
            >
              <span>Dalej</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleStartGame}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-black text-sm shadow-xl shadow-emerald-950/50 border border-emerald-400/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>ROZPOCZNIJ KARIERĘ</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
