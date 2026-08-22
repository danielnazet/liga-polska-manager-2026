'use client';

import React from 'react';
import { useGameStore } from '@/store/gameStore';
import {
  Coins,
  Building,
  Lightbulb,
  Flame,
  Stethoscope,
  GraduationCap,
  Dumbbell,
  Ticket,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

export const FinancesView: React.FC = () => {
  const {
    clubs,
    managers,
    activeManagerIndex,
    updateTicketPrice,
    upgradeStadiumFacility,
  } = useGameStore();

  const activeManager = managers[activeManagerIndex - 1] || managers[0];
  const activeClub = activeManager ? clubs[activeManager.clubId] : null;

  if (!activeClub) return null;

  const stadium = activeClub.stadium;
  const finances = activeClub.finances;

  const weeklyIncome =
    finances.mainSponsorWeekly + finances.stadiumBandsWeekly + finances.tvRightsWeekly;
  const weeklyExpenses =
    finances.wageBudget +
    finances.bankLoanWeeklyPayment +
    Math.round(stadium.capacity * 0.4 + (stadium.floodlights ? 3000 : 0) + (stadium.heatedPitch ? 5000 : 0));

  const netWeekly = weeklyIncome - weeklyExpenses;

  return (
    <div className="flex flex-col gap-6">
      {/* 1. BILANS FINANSOWY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Stan Konta</span>
            <Coins className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-white mt-3">
            {finances.balance.toLocaleString('pl-PL')} <span className="text-sm font-semibold text-slate-400">PLN</span>
          </div>
          <div className="text-xs text-slate-400 mt-2">
            Kredyt bankowy:{' '}
            <strong className="text-red-400">{finances.bankLoanRemaining.toLocaleString('pl-PL')} PLN</strong>
          </div>
        </div>

        <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tygodniowe Przychody</span>
            <TrendingUp className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-emerald-400 mt-3">
            +{weeklyIncome.toLocaleString('pl-PL')} <span className="text-sm font-semibold text-slate-400">PLN</span>
          </div>
          <div className="text-xs text-slate-400 mt-2">
            Sponsor główny: {finances.mainSponsorWeekly.toLocaleString('pl-PL')} PLN
          </div>
        </div>

        <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tygodniowe Wydatki</span>
            <TrendingDown className="w-5 h-5 text-red-400" />
          </div>
          <div className="text-3xl font-black text-red-400 mt-3">
            -{weeklyExpenses.toLocaleString('pl-PL')} <span className="text-sm font-semibold text-slate-400">PLN</span>
          </div>
          <div className="text-xs text-slate-400 mt-2">
            Wynagrodzenia piłkarzy: {finances.wageBudget.toLocaleString('pl-PL')} PLN
          </div>
        </div>
      </div>

      {/* 2. CENY BILETÓW & ROZBUDOWA STADIONU */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Zarządzanie biletami */}
        <div className="lg:col-span-4 bg-slate-900/90 rounded-3xl border border-slate-800 p-6 shadow-xl flex flex-col gap-5">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Ticket className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              Polityka Biletowa
            </h3>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-slate-400">Cena biletu na mecz:</span>
              <span className="text-lg font-black text-emerald-400">{stadium.ticketPrice} PLN</span>
            </div>
            <input
              type="range"
              min={10}
              max={150}
              step={5}
              value={stadium.ticketPrice}
              onChange={(e) => updateTicketPrice(activeClub.id, Number(e.target.value))}
              className="w-full accent-emerald-500 bg-slate-950 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>10 PLN (Tani)</span>
              <span>150 PLN (Drogi)</span>
            </div>
          </div>

          <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 text-xs flex flex-col gap-2">
            <div className="flex justify-between">
              <span className="text-slate-400">Pojemność stadionu:</span>
              <strong className="text-white">{stadium.capacity.toLocaleString('pl-PL')} miejsc</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Posiadacze karnetów:</span>
              <strong className="text-amber-400">{finances.seasonTicketHolders.toLocaleString('pl-PL')}</strong>
            </div>
          </div>
        </div>

        {/* Centrum Inwestycji i Infrastruktury */}
        <div className="lg:col-span-8 bg-slate-900/90 rounded-3xl border border-slate-800 p-6 shadow-xl flex flex-col gap-5">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Building className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              Centrum Rozwoju Infrastruktury Stadionu
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Rozbudowa pojemności */}
            <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 flex items-center justify-between gap-3">
              <div>
                <div className="font-bold text-white text-xs flex items-center gap-1.5">
                  <Building className="w-4 h-4 text-emerald-400" />
                  <span>Nowe Trybuny (+2 000 miejsc)</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1">Koszt: 500 000 PLN</div>
              </div>
              <button
                onClick={() => upgradeStadiumFacility(activeClub.id, 'capacity')}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-950/50"
              >
                Rozbuduj
              </button>
            </div>

            {/* Oświetlenie (Jupitery) */}
            <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 flex items-center justify-between gap-3">
              <div>
                <div className="font-bold text-white text-xs flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-amber-400" />
                  <span>Jupitery / Oświetlenie</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Status: {stadium.floodlights ? <span className="text-emerald-400">Zainstalowane</span> : 'Brak (250 000 PLN)'}
                </div>
              </div>
              {!stadium.floodlights && (
                <button
                  onClick={() => upgradeStadiumFacility(activeClub.id, 'floodlights')}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-xs shadow-md shadow-amber-950/50"
                >
                  Kup
                </button>
              )}
            </div>

            {/* Podgrzewana murawa */}
            <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 flex items-center justify-between gap-3">
              <div>
                <div className="font-bold text-white text-xs flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-red-400" />
                  <span>Podgrzewana Murawa</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Status: {stadium.heatedPitch ? <span className="text-emerald-400">Zainstalowana</span> : 'Brak (300 000 PLN)'}
                </div>
              </div>
              {!stadium.heatedPitch && (
                <button
                  onClick={() => upgradeStadiumFacility(activeClub.id, 'pitch')}
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-xs shadow-md shadow-red-950/50"
                >
                  Kup
                </button>
              )}
            </div>

            {/* Gabinet medyczny */}
            <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 flex items-center justify-between gap-3">
              <div>
                <div className="font-bold text-white text-xs flex items-center gap-1.5">
                  <Stethoscope className="w-4 h-4 text-blue-400" />
                  <span>Gabinet Medyczny (Poz. {stadium.medicalFacilityLevel}/5)</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1">Koszt: 300 000 PLN</div>
              </div>
              {stadium.medicalFacilityLevel < 5 && (
                <button
                  onClick={() => upgradeStadiumFacility(activeClub.id, 'medical')}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs shadow-md shadow-blue-950/50"
                >
                  Ulepsz
                </button>
              )}
            </div>

            {/* Szkółka juniorów */}
            <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 flex items-center justify-between gap-3">
              <div>
                <div className="font-bold text-white text-xs flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-purple-400" />
                  <span>Szkółka Juniorów (Poz. {stadium.youthAcademyLevel}/5)</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1">Koszt: 400 000 PLN</div>
              </div>
              {stadium.youthAcademyLevel < 5 && (
                <button
                  onClick={() => upgradeStadiumFacility(activeClub.id, 'youth')}
                  className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs shadow-md shadow-purple-950/50"
                >
                  Ulepsz
                </button>
              )}
            </div>

            {/* Baza treningowa */}
            <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 flex items-center justify-between gap-3">
              <div>
                <div className="font-bold text-white text-xs flex items-center gap-1.5">
                  <Dumbbell className="w-4 h-4 text-emerald-400" />
                  <span>Baza Treningowa (Poz. {stadium.trainingFacilityLevel}/5)</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1">Koszt: 350 000 PLN</div>
              </div>
              {stadium.trainingFacilityLevel < 5 && (
                <button
                  onClick={() => upgradeStadiumFacility(activeClub.id, 'training')}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-950/50"
                >
                  Ulepsz
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
