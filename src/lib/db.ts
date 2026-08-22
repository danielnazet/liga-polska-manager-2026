import { supabase } from './supabase';
import { Club, League, Player } from '@/types';
import { LEAGUES_DATA } from '@/data/leagues';
import { CLUBS_DATA } from '@/data/clubsData';

// Pobieranie wszystkich lig z bazy danych Supabase
export async function getLeaguesFromDatabase(): Promise<Record<string, League>> {
  try {
    const { data, error } = await supabase.from('leagues').select('*').order('tier', { ascending: true });
    if (error || !data || data.length === 0) {
      return LEAGUES_DATA;
    }

    const leaguesMap: Record<string, League> = {};
    data.forEach((row) => {
      leaguesMap[row.id] = {
        id: row.id,
        name: row.name,
        shortName: row.short_name,
        tier: row.tier,
        clubIds: LEAGUES_DATA[row.id]?.clubIds || [],
        relegationSpots: row.relegation_spots || 3,
        promotionSpots: row.promotion_spots || 2,
        playoffSpots: row.playoff_spots || 0,
      };
    });
    return leaguesMap;
  } catch (err) {
    console.warn('Błąd pobierania lig z bazy (używam danych lokalnych):', err);
    return LEAGUES_DATA;
  }
}

// Pobieranie wszystkich klubów z bazy danych Supabase
export async function getClubsFromDatabase(): Promise<Record<string, Club>> {
  try {
    const { data, error } = await supabase.from('clubs').select('*');
    if (error || !data || data.length === 0) {
      return CLUBS_DATA;
    }

    const clubsMap: Record<string, Club> = {};
    data.forEach((row) => {
      clubsMap[row.id] = {
        id: row.id,
        name: row.name,
        shortName: row.short_name,
        city: row.city,
        leagueId: row.league_id,
        primaryColor: row.primary_color,
        secondaryColor: row.secondary_color,
        reputation: row.reputation,
        stadium: {
          capacity: row.stadium_capacity,
          seatedCapacity: row.stadium_seated,
          floodlights: row.has_floodlights,
          heatedPitch: row.has_heated_pitch,
          ticketPrice: row.ticket_price,
          medicalFacilityLevel: row.medical_level || 1,
          youthAcademyLevel: row.youth_academy_level || 1,
          trainingFacilityLevel: row.training_facility_level || 1,
        },
        finances: {
          balance: Number(row.balance),
          wageBudget: row.wage_budget,
          transferBudget: Number(row.transfer_budget),
          seasonTicketHolders: row.season_ticket_holders,
          mainSponsorWeekly: row.main_sponsor_weekly,
          stadiumBandsWeekly: row.stadium_bands_weekly,
          tvRightsWeekly: row.tv_rights_weekly,
          bankLoanRemaining: Number(row.bank_loan || 0),
          bankLoanWeeklyPayment: row.bank_loan_weekly_payment || 0,
        },
        tactics: CLUBS_DATA[row.id]?.tactics || {
          formation: '4-4-2',
          mentality: 'balanced',
          aggression: 'normal',
          startingIds: [],
          benchIds: [],
        },
      };
    });
    return clubsMap;
  } catch (err) {
    console.warn('Błąd pobierania klubów z bazy (używam danych lokalnych):', err);
    return CLUBS_DATA;
  }
}
