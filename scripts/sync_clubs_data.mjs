import fs from 'fs';

// 1. Parsuj SQL
const sqlContent = fs.readFileSync('d:/liga/supabase/full_schema_and_seed.sql', 'utf8');

const clubRegex = /\('([^']+)',\s*'([^']+)',\s*'([^']+)',\s*'([^']+)',\s*'([^']+)',\s*'([^']+)',\s*'([^']+)',\s*(\d+),\s*(\d+),\s*(\d+),\s*(true|false),\s*(true|false),\s*(\d+),\s*(\d+),\s*(\d+),\s*(\d+),\s*(\d+),\s*(\d+),\s*(\d+),\s*(\d+)\)/g;

const clubs = {};

let match;
while ((match = clubRegex.exec(sqlContent)) !== null) {
  const [
    _,
    id,
    name,
    shortName,
    city,
    leagueId,
    primaryColor,
    secondaryColor,
    reputation,
    stadiumCapacity,
    stadiumSeated,
    hasFloodlights,
    hasHeatedPitch,
    ticketPrice,
    balance,
    wageBudget,
    transferBudget,
    seasonTicketHolders,
    mainSponsorWeekly,
    stadiumBandsWeekly,
    tvRightsWeekly,
  ] = match;

  clubs[id] = {
    id,
    name,
    shortName,
    city,
    leagueId,
    primaryColor,
    secondaryColor,
    reputation: parseInt(reputation, 10),
    stadium: {
      capacity: parseInt(stadiumCapacity, 10),
      seatedCapacity: parseInt(stadiumSeated, 10),
      floodlights: hasFloodlights === 'true',
      heatedPitch: hasHeatedPitch === 'true',
      medicalFacilityLevel: Math.min(5, Math.max(1, Math.floor(parseInt(reputation, 10) / 20))),
      youthAcademyLevel: Math.min(5, Math.max(1, Math.floor(parseInt(reputation, 10) / 20))),
      trainingFacilityLevel: Math.min(5, Math.max(1, Math.floor(parseInt(reputation, 10) / 20))),
      ticketPrice: parseInt(ticketPrice, 10),
    },
    finances: {
      balance: parseInt(balance, 10),
      wageBudget: parseInt(wageBudget, 10),
      transferBudget: parseInt(transferBudget, 10),
      seasonTicketHolders: parseInt(seasonTicketHolders, 10),
      mainSponsorWeekly: parseInt(mainSponsorWeekly, 10),
      stadiumBandsWeekly: parseInt(stadiumBandsWeekly, 10),
      tvRightsWeekly: parseInt(tvRightsWeekly, 10),
      bankLoanRemaining: 0,
      bankLoanWeeklyPayment: 0,
    },
    tactics: {
      formation: '4-4-2',
      mentality: 'balanced',
      aggression: 'normal',
      startingIds: [],
      benchIds: [],
    },
  };
}

console.log(`Wyekstrahowano ${Object.keys(clubs).length} klubów z SQL!`);

// 2. Parsuj leagues.ts
const leaguesContent = fs.readFileSync('d:/liga/src/data/leagues.ts', 'utf8');
const leagueBlockRegex = /([a-z0-9_]+):\s*{\s*id:\s*'([^']+)',\s*name:\s*'([^']+)',\s*shortName:\s*'([^']+)',\s*tier:\s*(\d+),\s*clubIds:\s*\[([^\]]+)\]/g;

let lMatch;
let totalLeagueClubs = 0;
while ((lMatch = leagueBlockRegex.exec(leaguesContent)) !== null) {
  const [_, key, leagueId, leagueName, leagueShort, tierStr, clubIdsStr] = lMatch;
  const tier = parseInt(tierStr, 10);
  const clubIds = clubIdsStr
    .split(',')
    .map((s) => s.trim().replace(/['"]/g, ''))
    .filter(Boolean);

  totalLeagueClubs += clubIds.length;

  for (const clubId of clubIds) {
    if (!clubs[clubId]) {
      const name = clubId.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
      const words = name.split(' ');
      const shortName = words.length >= 2 ? (words[0][0] + words[1].substring(0, 2)).toUpperCase() : name.substring(0, 3).toUpperCase();
      
      clubs[clubId] = {
        id: clubId,
        name: name,
        shortName: shortName,
        city: 'Polska',
        leagueId: leagueId,
        primaryColor: '#059669',
        secondaryColor: '#ffffff',
        reputation: Math.max(35, 90 - tier * 6),
        stadium: {
          capacity: Math.max(500, 20000 - tier * 2200),
          seatedCapacity: Math.max(200, 15000 - tier * 1800),
          floodlights: tier <= 4,
          heatedPitch: tier <= 2,
          medicalFacilityLevel: Math.max(1, 6 - tier),
          youthAcademyLevel: Math.max(1, 6 - tier),
          trainingFacilityLevel: Math.max(1, 6 - tier),
          ticketPrice: Math.max(5, 70 - tier * 7),
        },
        finances: {
          balance: Math.max(50000, 15000000 - tier * 1800000),
          wageBudget: Math.max(5000, 350000 - tier * 40000),
          transferBudget: Math.max(2000, 6000000 - tier * 700000),
          seasonTicketHolders: Math.max(50, 12000 - tier * 1400),
          mainSponsorWeekly: Math.max(500, 70000 - tier * 8000),
          stadiumBandsWeekly: Math.max(100, 35000 - tier * 4000),
          tvRightsWeekly: Math.max(200, 90000 - tier * 11000),
          bankLoanRemaining: 0,
          bankLoanWeeklyPayment: 0,
        },
        tactics: {
          formation: '4-4-2',
          mentality: 'balanced',
          aggression: 'normal',
          startingIds: [],
          benchIds: [],
        },
      };
    }
  }
}

console.log(`Łącznie w bazie TypeScriptowej: ${Object.keys(clubs).length} klubów!`);

const tsContent = `import { Club } from '@/types';\n\nexport const CLUBS_DATA: Record<string, Club> = ${JSON.stringify(clubs, null, 2)};\n`;

fs.writeFileSync('d:/liga/src/data/clubsData.ts', tsContent, 'utf8');
console.log('Pomyślnie zsynchronizowano src/data/clubsData.ts!');
