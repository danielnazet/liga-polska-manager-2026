'use client';

import React, { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import {
  Coins,
  Building,
  Lightbulb,
  Flame,
  Stethoscope,
  Ticket,
  TrendingUp,
  TrendingDown,
  Sliders,
  Check
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

  const [wageRatio, setWageRatio] = useState<number>(50);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!activeClub) return null;

  const stadium = activeClub.stadium;
  const finances = activeClub.finances;

  const weeklyIncome =
    finances.mainSponsorWeekly + finances.stadiumBandsWeekly + finances.tvRightsWeekly;
  const weeklyExpenses =
    finances.wageBudget +
    finances.bankLoanWeeklyPayment +
    Math.round(stadium.capacity * 0.4 + (stadium.floodlights ? 3000 : 0) + (stadium.heatedPitch ? 5000 : 0));

  const totalBudgetPool = finances.balance;
  const calculatedWageBudget = Math.round((totalBudgetPool * (wageRatio / 100)) / 10);
  const calculatedTransferBudget = Math.round(totalBudgetPool * ((100 - wageRatio) / 100));

  const handleSaveBudget = () => {
    setSuccessMessage('Przeniesiono środki budżetowe!');
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  return (
    <div className="flex flex-col gap-4 text-slate-100 font-sans leading-snug">
      {successMessage && (
        <div className="p-3 rounded-xl bg-emerald-600/20 border border-emerald-500/50 text-emerald-300 text-xs font-bold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* 1. BILANS FINANSOWY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Stan Konta</span>
            <Coins className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white mt-2">
            {finances.balance.toLocaleString('pl-PL')} <span className="text-xs font-semibold text-slate-400">PLN</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Kredyt: <strong className="text-red-400">{finances.bankLoanRemaining.toLocaleString('pl-PL')} PLN</strong>
          </div>
        </div>

        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Przychody / Tydzień</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400 mt-2">
            +{weeklyIncome.toLocaleString('pl-PL')} <span className="text-xs font-semibold text-slate-400">PLN</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Sponsor: {finances.mainSponsorWeekly.toLocaleString('pl-PL')} PLN
          </div>
        </div>

        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Wydatki / Tydzień</span>
            <TrendingDown className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl font-black text-red-400 mt-2">
            -{weeklyExpenses.toLocaleString('pl-PL')} <span className="text-xs font-semibold text-slate-400">PLN</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Pensje zawodników: {finances.wageBudget.toLocaleString('pl-PL')} PLN
          </div>
        </div>
      </div>

      {/* 2. ZARZĄDZANIE BUDŻETEM */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 shadow-md flex flex-col gap-3">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
          <Sliders className="w-4 h-4 text-emerald-400" />
          <h3 className="text-xs font-black text-white uppercase tracking-wider">
            Zarządzanie Podziałem Budżetu (Przesuwanie środków)
          </h3>
        </div>

        <p className="text-[11px] text-slate-400">
          Zdecyduj o proporcjach podziału środków klubowych między budżet na tygodniowe pensje a budżet na transfery.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-emerald-400">Płace: {wageRatio}%</span>
              <span className="text-amber-400">Transfery: {100 - wageRatio}%</span>
            </div>

            <input
              type="range"
              min={10}
              max={90}
              value={wageRatio}
              onChange={(e) => setWageRatio(Number(e.target.value))}
              className="w-full accent-emerald-500 bg-slate-950 cursor-pointer h-2 rounded-lg"
            />
          </div>

          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 flex flex-col gap-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Budżet Płacowy:</span>
              <strong className="text-emerald-400 font-black">{calculatedWageBudget.toLocaleString('pl-PL')} PLN / tydz.</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Budżet Transferowy:</span>
              <strong className="text-amber-400 font-black">{calculatedTransferBudget.toLocaleString('pl-PL')} PLN</strong>
            </div>

            <button
              onClick={handleSaveBudget}
              className="mt-1 w-full py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs shadow transition-all"
            >
              Zatwierdź Podział Budżetu
            </button>
          </div>
        </div>
      </div>

      {/* 3. ROZBUDOWA STADIONU */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-4 bg-slate-900/90 rounded-2xl border border-slate-800 p-4 shadow-md flex flex-col gap-3">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
            <Ticket className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-black text-white uppercase">Polityka Biletowa</h3>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-slate-400">Cena biletu:</span>
              <span className="text-base font-black text-emerald-400">{stadium.ticketPrice} PLN</span>
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
          </div>

          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 text-xs flex flex-col gap-1.5">
            <div className="flex justify-between">
              <span className="text-slate-400">Pojemność stadionu:</span>
              <strong className="text-white">{stadium.capacity.toLocaleString('pl-PL')} miejsc</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Karnety:</span>
              <strong className="text-amber-400">{finances.seasonTicketHolders.toLocaleString('pl-PL')}</strong>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 bg-slate-900/90 rounded-2xl border border-slate-800 p-4 shadow-md flex flex-col gap-3">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
            <Building className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-black text-white uppercase">Infrastruktura Stadionu</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 flex items-center justify-between gap-2">
              <div>
                <div className="font-bold text-white text-xs flex items-center gap-1">
                  <Building className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Trybuny (+2 000 miejsc)</span>
                </div>
                <div className="text-[10px] text-slate-400">500 000 PLN</div>
              </div>
              <button
                onClick={() => upgradeStadiumFacility(activeClub.id, 'capacity')}
                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-[11px]"
              >
                Rozbuduj
              </button>
            </div>

            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 flex items-center justify-between gap-2">
              <div>
                <div className="font-bold text-white text-xs flex items-center gap-1">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                  <span>Jupitery</span>
                </div>
                <div className="text-[10px] text-slate-400">
                  {stadium.floodlights ? <span className="text-emerald-400">Tak</span> : '250 000 PLN'}
                </div>
              </div>
              {!stadium.floodlights && (
                <button
                  onClick={() => upgradeStadiumFacility(activeClub.id, 'floodlights')}
                  className="px-2.5 py-1 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg text-[11px]"
                >
                  Kup
                </button>
              )}
            </div>

            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 flex items-center justify-between gap-2">
              <div>
                <div className="font-bold text-white text-xs flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-red-400" />
                  <span>Podgrzewana Murawa</span>
                </div>
                <div className="text-[10px] text-slate-400">
                  {stadium.heatedPitch ? <span className="text-emerald-400">Tak</span> : '300 000 PLN'}
                </div>
              </div>
              {!stadium.heatedPitch && (
                <button
                  onClick={() => upgradeStadiumFacility(activeClub.id, 'pitch')}
                  className="px-2.5 py-1 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg text-[11px]"
                >
                  Kup
                </button>
              )}
            </div>

            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 flex items-center justify-between gap-2">
              <div>
                <div className="font-bold text-white text-xs flex items-center gap-1">
                  <Stethoscope className="w-3.5 h-3.5 text-blue-400" />
                  <span>Medycyna (Poz. {stadium.medicalFacilityLevel}/5)</span>
                </div>
                <div className="text-[10px] text-slate-400">300 000 PLN</div>
              </div>
              {stadium.medicalFacilityLevel < 5 && (
                <button
                  onClick={() => upgradeStadiumFacility(activeClub.id, 'medical')}
                  className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-[11px]"
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
