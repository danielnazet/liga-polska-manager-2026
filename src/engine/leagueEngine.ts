import { Fixture, Standing, League, Club, NewsItem } from '@/types';

// Generowanie terminarza kołowego (Round-Robin) dla ligi
export function generateFixturesForLeague(league: League): Fixture[] {
  const clubs = [...league.clubIds];
  if (clubs.length % 2 !== 0) {
    clubs.push('BYE');
  }

  const numClubs = clubs.length;
  const numRounds = (numClubs - 1) * 2; // Runda jesienna i wiosenna
  const halfRounds = numClubs - 1;
  const fixtures: Fixture[] = [];

  for (let r = 0; r < halfRounds; r++) {
    const roundNumber = r + 1;
    for (let i = 0; i < numClubs / 2; i++) {
      const home = clubs[i];
      const away = clubs[numClubs - 1 - i];

      if (home !== 'BYE' && away !== 'BYE') {
        fixtures.push({
          id: `fix_${league.id}_r${roundNumber}_${home}_${away}`,
          leagueId: league.id,
          round: roundNumber,
          homeClubId: r % 2 === 0 ? home : away,
          awayClubId: r % 2 === 0 ? away : home,
          played: false,
        });
      }
    }

    // Rotacja zespołów (poza pierwszym)
    const last = clubs.pop()!;
    clubs.splice(1, 0, last);
  }

  // Rewanże (Runda wiosenna)
  const firstHalfFixtures = [...fixtures];
  firstHalfFixtures.forEach((f) => {
    fixtures.push({
      id: `fix_${league.id}_r${f.round + halfRounds}_${f.awayClubId}_${f.homeClubId}`,
      leagueId: league.id,
      round: f.round + halfRounds,
      homeClubId: f.awayClubId,
      awayClubId: f.homeClubId,
      played: false,
    });
  });

  return fixtures;
}

export function calculateInitialStandings(clubIds: string[]): Standing[] {
  return clubIds.map((clubId) => ({
    clubId,
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    goalDifference: 0,
    points: 0,
    form: [],
  }));
}

export function updateLeagueStandings(
  currentStandings: Standing[],
  completedFixtures: Fixture[]
): Standing[] {
  const standingsMap = new Map<string, Standing>();

  // Reset counters for recalculation
  currentStandings.forEach((s) => {
    standingsMap.set(s.clubId, {
      clubId: s.clubId,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0,
      form: [],
    });
  });

  completedFixtures
    .filter((f) => f.played && f.scoreHome !== undefined && f.scoreAway !== undefined)
    .forEach((f) => {
      const home = standingsMap.get(f.homeClubId);
      const away = standingsMap.get(f.awayClubId);
      if (!home || !away) return;

      const sh = f.scoreHome!;
      const sa = f.scoreAway!;

      home.played++;
      away.played++;
      home.goalsFor += sh;
      home.goalsAgainst += sa;
      away.goalsFor += sa;
      away.goalsAgainst += sh;

      if (sh > sa) {
        home.won++;
        home.points += 3;
        away.lost++;
        home.form.push('W');
        away.form.push('L');
      } else if (sh === sa) {
        home.drawn++;
        home.points += 1;
        away.drawn++;
        away.points += 1;
        home.form.push('D');
        away.form.push('D');
      } else {
        home.lost++;
        away.won++;
        away.points += 3;
        home.form.push('L');
        away.form.push('W');
      }

      home.goalDifference = home.goalsFor - home.goalsAgainst;
      away.goalDifference = away.goalsFor - away.goalsAgainst;
    });

  // Sortowanie tabeli: Punkty > Różnica bramek > Bramki zdobyte
  return Array.from(standingsMap.values()).sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
    return b.goalsFor - a.goalsFor;
  });
}

// Tygodniowe rozliczenie finansowe klubu
export function processClubWeeklyFinances(
  club: Club,
  homeMatchAttendance?: number
): { updatedClub: Club; summary: { income: number; expenses: number; net: number } } {
  let income = 0;
  let expenses = 0;

  // Przychody
  income += club.finances.mainSponsorWeekly;
  income += club.finances.stadiumBandsWeekly;
  income += club.finances.tvRightsWeekly;

  // Przychód z dnia meczowego (bilety)
  if (homeMatchAttendance && homeMatchAttendance > 0) {
    const nonSeasonTicketHolders = Math.max(0, homeMatchAttendance - club.finances.seasonTicketHolders);
    const matchDayIncome = nonSeasonTicketHolders * club.stadium.ticketPrice;
    income += matchDayIncome;
  }

  // Wydatki
  expenses += club.finances.wageBudget;
  expenses += club.finances.bankLoanWeeklyPayment;
  // Koszty utrzymania stadionu i obiektów
  const stadiumUpkeep = Math.round(club.stadium.capacity * 0.4 + (club.stadium.floodlights ? 3000 : 0) + (club.stadium.heatedPitch ? 5000 : 0));
  expenses += stadiumUpkeep;

  const net = income - expenses;
  const newBalance = club.finances.balance + net;
  const newLoan = Math.max(0, club.finances.bankLoanRemaining - club.finances.bankLoanWeeklyPayment);

  const updatedClub: Club = {
    ...club,
    finances: {
      ...club.finances,
      balance: newBalance,
      bankLoanRemaining: newLoan,
    },
  };

  return {
    updatedClub,
    summary: { income, expenses, net },
  };
}

export function generateWeeklyNews(
  round: number,
  standings: Standing[],
  clubs: Record<string, Club>
): NewsItem[] {
  const news: NewsItem[] = [];
  const leader = standings[0] ? clubs[standings[0].clubId] : null;

  if (leader) {
    news.push({
      id: `news_r${round}_leader_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      date: `2026-08-22`,
      round,
      category: 'league',
      title: `${leader.name} na czele tabeli po ${round}. kolejce!`,
      content: `Dzięki równej formie i znakomitej postawie formacji ofensywnej ${leader.name} pewnie przewodzi ligowej stawce. Kibice marzą o mistrzostwie i pucharach.`,
      clubId: leader.id,
    });
  }

  news.push({
    id: `news_r${round}_transfer_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    date: `2026-08-22`,
    round,
    category: 'transfer',
    title: `Gorączka na rynku transferowym w Polsce`,
    content: `Kluby intensywnie poszukują wzmocnień przed decydującą fazą rozgrywek. Skauci obserwują wyróżniających się graczy w niższych ligach.`,
  });

  return news;
}
