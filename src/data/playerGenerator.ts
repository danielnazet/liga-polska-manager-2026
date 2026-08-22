import { Player, Position } from '@/types';

// Autentyczne gwiazdy polskich lig na rok 2026 / aktualne realia
export const FAMOUS_PLAYERS: Record<string, Partial<Player>[]> = {
  lech_poznan: [
    { firstName: 'Bartosz', lastName: 'Mrozek', position: 'BR', overall: 78, age: 26 },
    { firstName: 'Michał', lastName: 'Gurgul', position: 'OB', overall: 76, age: 20 },
    { firstName: 'Antonio', lastName: 'Milić', position: 'OB', overall: 79, age: 31 },
    { firstName: 'Alex', lastName: 'Douglas', position: 'OB', overall: 78, age: 24 },
    { firstName: 'Joel', lastName: 'Pereira', position: 'OB', overall: 79, age: 28 },
    { firstName: 'Radosław', lastName: 'Murawski', position: 'PO', overall: 78, age: 32 },
    { firstName: 'Afonso', lastName: 'Sousa', position: 'PO', overall: 80, age: 25 },
    { firstName: 'Antoni', lastName: 'Kozubal', position: 'PO', overall: 79, age: 21 },
    { firstName: 'Ali', lastName: 'Gholizadeh', position: 'PO', overall: 81, age: 29 },
    { firstName: 'Patrik', lastName: 'Walemark', position: 'PO', overall: 80, age: 24 },
    { firstName: 'Mikael', lastName: 'Ishak', position: 'NA', overall: 83, age: 33 },
    { firstName: 'Filip', lastName: 'Szymczak', position: 'NA', overall: 75, age: 24 },
    { firstName: 'Dino', lastName: 'Hotić', position: 'PO', overall: 76, age: 30 },
    { firstName: 'Elias', lastName: 'Andersson', position: 'OB', overall: 75, age: 29 },
    { firstName: 'Filip', lastName: 'Bednarek', position: 'BR', overall: 74, age: 33 },
  ],
  legia_warszawa: [
    { firstName: 'Kacper', lastName: 'Tobiasz', position: 'BR', overall: 78, age: 23 },
    { firstName: 'Rafał', lastName: 'Augustyniak', position: 'OB', overall: 78, age: 32 },
    { firstName: 'Steve', lastName: 'Kapuadi', position: 'OB', overall: 78, age: 28 },
    { firstName: 'Radovan', lastName: 'Pankov', position: 'OB', overall: 77, age: 30 },
    { firstName: 'Ruben', lastName: 'Vinagre', position: 'OB', overall: 82, age: 26 },
    { firstName: 'Pawel', lastName: 'Wszołek', position: 'PO', overall: 80, age: 33 },
    { firstName: 'Bartosz', lastName: 'Kapustka', position: 'PO', overall: 80, age: 29 },
    { firstName: 'Maxi', lastName: 'Oyedele', position: 'PO', overall: 78, age: 21 },
    { firstName: 'Luquinhas', lastName: 'Silva', position: 'PO', overall: 81, age: 29 },
    { firstName: 'Marc', lastName: 'Gual', position: 'NA', overall: 81, age: 29 },
    { firstName: 'Migouel', lastName: 'Alfarela', position: 'NA', overall: 77, age: 28 },
    { firstName: 'Tomas', lastName: 'Pekhart', position: 'NA', overall: 76, age: 36 },
    { firstName: 'Ryoya', lastName: 'Morishita', position: 'PO', overall: 78, age: 28 },
    { firstName: 'Jan', lastName: 'Ziółkowski', position: 'OB', overall: 74, age: 20 },
    { firstName: 'Gabriel', lastName: 'Kobylak', position: 'BR', overall: 74, age: 24 },
  ],
  rakow_czestochowa: [
    { firstName: 'Kacper', lastName: 'Trelowski', position: 'BR', overall: 77, age: 22 },
    { firstName: 'Fran', lastName: 'Tudor', position: 'OB', overall: 81, age: 30 },
    { firstName: 'Zoran', lastName: 'Arsenić', position: 'OB', overall: 79, age: 31 },
    { firstName: 'Milan', lastName: 'Rundić', position: 'OB', overall: 76, age: 33 },
    { firstName: 'Jean', lastName: 'Carlos', position: 'PO', overall: 78, age: 29 },
    { firstName: 'Gustav', lastName: 'Berggren', position: 'PO', overall: 79, age: 28 },
    { firstName: 'Vladyslav', lastName: 'Kochergin', position: 'PO', overall: 80, age: 29 },
    { firstName: 'Michael', lastName: 'Ameyaw', position: 'PO', overall: 79, age: 25 },
    { firstName: 'Ivi', lastName: 'Lopez', position: 'PO', overall: 82, age: 31 },
    { firstName: 'Jonatan', lastName: 'Braut Brunes', position: 'NA', overall: 79, age: 25 },
    { firstName: 'Patryk', lastName: 'Makuch', position: 'NA', overall: 77, age: 26 },
    { firstName: 'Erick', lastName: 'Ouma', position: 'OB', overall: 78, age: 28 },
    { firstName: 'Peter', lastName: 'Barath', position: 'PO', overall: 76, age: 23 },
    { firstName: 'Bogdan', lastName: 'Racovitan', position: 'OB', overall: 77, age: 25 },
    { firstName: 'Dusan', lastName: 'Kuciak', position: 'BR', overall: 73, age: 40 },
  ],
  jagiellonia_bialystok: [
    { firstName: 'Sławomir', lastName: 'Abramowicz', position: 'BR', overall: 77, age: 21 },
    { firstName: 'Michal', lastName: 'Sacek', position: 'OB', overall: 78, age: 29 },
    { firstName: 'Mateusz', lastName: 'Skrzypczak', position: 'OB', overall: 78, age: 25 },
    { firstName: 'Adrian', lastName: 'Dieguez', position: 'OB', overall: 79, age: 29 },
    { firstName: 'Joao', lastName: 'Moutinho', position: 'OB', overall: 77, age: 27 },
    { firstName: 'Taras', lastName: 'Romanczuk', position: 'PO', overall: 80, age: 34 },
    { firstName: 'Nene', lastName: 'Silva', position: 'PO', overall: 81, age: 30 },
    { firstName: 'Jarosław', lastName: 'Kubicki', position: 'PO', overall: 76, age: 30 },
    { firstName: 'Kristoffer', lastName: 'Hansen', position: 'PO', overall: 79, age: 31 },
    { firstName: 'Jesus', lastName: 'Imaz', position: 'NA', overall: 83, age: 35 },
    { firstName: 'Afimico', lastName: 'Pululu', position: 'NA', overall: 81, age: 26 },
    { firstName: 'Darko', lastName: 'Churlinov', position: 'PO', overall: 78, age: 25 },
    { firstName: 'Miki', lastName: 'Villar', position: 'PO', overall: 76, age: 29 },
    { firstName: 'Tomas', lastName: 'Silva', position: 'OB', overall: 75, age: 25 },
    { firstName: 'Maksymilian', lastName: 'Stryjek', position: 'BR', overall: 75, age: 29 },
  ],
  pogon_szczecin: [
    { firstName: 'Valentin', lastName: 'Cojocaru', position: 'BR', overall: 78, age: 30 },
    { firstName: 'Linus', lastName: 'Wahlqvist', position: 'OB', overall: 78, age: 29 },
    { firstName: 'Benedikt', lastName: 'Zech', position: 'OB', overall: 77, age: 34 },
    { firstName: 'Leonardo', lastName: 'Koutris', position: 'OB', overall: 78, age: 30 },
    { firstName: 'Mariusz', lastName: 'Malec', position: 'OB', overall: 76, age: 30 },
    { firstName: 'Rafał', lastName: 'Kurzawa', position: 'PO', overall: 77, age: 33 },
    { firstName: 'Alexander', lastName: 'Gorgon', position: 'PO', overall: 78, age: 37 },
    { firstName: 'Fredrik', lastName: 'Ulvestad', position: 'PO', overall: 79, age: 33 },
    { firstName: 'Kacper', lastName: 'Łukasiak', position: 'PO', overall: 76, age: 22 },
    { firstName: 'Kamil', lastName: 'Grosicki', position: 'PO', overall: 82, age: 37 },
    { firstName: 'Efthymios', lastName: 'Koulouris', position: 'NA', overall: 82, age: 29 },
    { firstName: 'Wahan', lastName: 'Biczachczjan', position: 'PO', overall: 78, age: 26 },
    { firstName: 'Adrian', lastName: 'Przybysz', position: 'PO', overall: 74, age: 21 },
    { firstName: 'Patryk', lastName: 'Paryzek', position: 'NA', overall: 73, age: 20 },
    { firstName: 'Krzysztof', lastName: 'Kamiński', position: 'BR', overall: 73, age: 35 },
  ],
  gornik_zabrze: [
    { firstName: 'Michał', lastName: 'Szromnik', position: 'BR', overall: 76, age: 32 },
    { firstName: 'Kryspin', lastName: 'Szcześniak', position: 'OB', overall: 76, age: 24 },
    { firstName: 'Josema', lastName: 'Sanchez', position: 'OB', overall: 77, age: 29 },
    { firstName: 'Rafał', lastName: 'Janicki', position: 'OB', overall: 76, age: 33 },
    { firstName: 'Erik', lastName: 'Janza', position: 'OB', overall: 79, age: 32 },
    { firstName: 'Damian', lastName: 'Rasak', position: 'PO', overall: 78, age: 29 },
    { firstName: 'Patrik', lastName: 'Hellebrand', position: 'PO', overall: 76, age: 26 },
    { firstName: 'Taofeek', lastName: 'Ismaheel', position: 'PO', overall: 77, age: 24 },
    { firstName: 'Lukas', lastName: 'Podolski', position: 'PO', overall: 80, age: 40 },
    { firstName: 'Luka', lastName: 'Zahović', position: 'NA', overall: 77, age: 30 },
    { firstName: 'Sinan', lastName: 'Bakış', position: 'NA', overall: 76, age: 31 },
    { firstName: 'Norbert', lastName: 'Wojtuszek', position: 'PO', overall: 74, age: 24 },
    { firstName: 'Kamil', lastName: 'Lukoszek', position: 'PO', overall: 74, age: 23 },
    { firstName: 'Dominik', lastName: 'Szala', position: 'OB', overall: 73, age: 20 },
    { firstName: 'Filip', lastName: 'Majchrowicz', position: 'BR', overall: 74, age: 26 },
  ],
  wisla_krakow: [
    { firstName: 'Anton', lastName: 'Chichkan', position: 'BR', overall: 75, age: 30 },
    { firstName: 'Alan', lastName: 'Uryga', position: 'OB', overall: 76, age: 32 },
    { firstName: 'Joseph', lastName: 'Colley', position: 'OB', overall: 76, age: 26 },
    { firstName: 'Giannis', lastName: 'Kiakos', position: 'OB', overall: 74, age: 27 },
    { firstName: 'Bartosz', lastName: 'Jaroch', position: 'OB', overall: 75, age: 30 },
    { firstName: 'Marc', lastName: 'Carbo', position: 'PO', overall: 78, age: 31 },
    { firstName: 'Kacper', lastName: 'Duda', position: 'PO', overall: 76, age: 21 },
    { firstName: 'Olivier', lastName: 'Sukiennicki', position: 'PO', overall: 75, age: 22 },
    { firstName: 'Jesus', lastName: 'Alfaro', position: 'PO', overall: 77, age: 34 },
    { firstName: 'Tamas', lastName: 'Kiss', position: 'PO', overall: 75, age: 25 },
    { firstName: 'Angel', lastName: 'Rodado', position: 'NA', overall: 81, age: 28 },
    { firstName: 'Lukasz', lastName: 'Zwoliński', position: 'NA', overall: 77, age: 32 },
    { firstName: 'Frederico', lastName: 'Duarte', position: 'PO', overall: 75, age: 26 },
    { firstName: 'Igor', lastName: 'Łasicki', position: 'OB', overall: 74, age: 30 },
    { firstName: 'Patryk', lastName: 'Letkiewicz', position: 'BR', overall: 72, age: 20 },
  ],
  ruch_chorzow: [
    { firstName: 'Martin', lastName: 'Turk', position: 'BR', overall: 74, age: 22 },
    { firstName: 'Szymon', lastName: 'Szymański', position: 'OB', overall: 74, age: 29 },
    { firstName: 'Maciej', lastName: 'Sadlok', position: 'OB', overall: 75, age: 36 },
    { firstName: 'Martin', lastName: 'Konczkowski', position: 'OB', overall: 76, age: 32 },
    { firstName: 'Filip', lastName: 'Borowski', position: 'OB', overall: 73, age: 22 },
    { firstName: 'Mateusz', lastName: 'Szwoch', position: 'PO', overall: 76, age: 32 },
    { firstName: 'Denis', lastName: 'Ventura', position: 'PO', overall: 75, age: 30 },
    { firstName: 'Soma', lastName: 'Novothny', position: 'NA', overall: 76, age: 31 },
    { firstName: 'Daniel', lastName: 'Szczepan', position: 'NA', overall: 77, age: 30 },
    { firstName: 'Miłosz', lastName: 'Kozak', position: 'PO', overall: 75, age: 28 },
    { firstName: 'Lukasz', lastName: 'Moneta', position: 'PO', overall: 73, age: 31 },
    { firstName: 'Jakub', lastName: 'Szymański', position: 'BR', overall: 72, age: 25 },
  ],
  wieczysta_krakow: [
    { firstName: 'Antoni', lastName: 'Mikułko', position: 'BR', overall: 72, age: 21 },
    { firstName: 'Michał', lastName: 'Pazdan', position: 'OB', overall: 76, age: 38 },
    { firstName: 'Konrad', lastName: 'Kasolik', position: 'OB', overall: 72, age: 28 },
    { firstName: 'Rafał', lastName: 'Pietrzak', position: 'OB', overall: 75, age: 33 },
    { firstName: 'Bartosz', lastName: 'Brzęk', position: 'OB', overall: 72, age: 20 },
    { firstName: 'Jacek', lastName: 'Góralski', position: 'PO', overall: 78, age: 33 },
    { firstName: 'Tomasz', lastName: 'Swędrowski', position: 'PO', overall: 74, age: 32 },
    { firstName: 'Lisandro', lastName: 'Semedo', position: 'PO', overall: 76, age: 29 },
    { firstName: 'Goku', lastName: 'Roman', position: 'PO', overall: 76, age: 32 },
    { firstName: 'Dani', lastName: 'Sandoval', position: 'PO', overall: 75, age: 27 },
    { firstName: 'Manuel', lastName: 'Torres', position: 'NA', overall: 75, age: 34 },
    { firstName: 'Chuma', lastName: 'Gonzalez', position: 'NA', overall: 74, age: 28 },
    { firstName: 'Dawid', lastName: 'Kiedrowicz', position: 'PO', overall: 71, age: 22 },
  ]
};

const POLISH_FIRST_NAMES = [
  'Jakub', 'Kacper', 'Mateusz', 'Michał', 'Filip', 'Szymon', 'Bartosz', 'Jan', 'Piotr', 'Wojciech',
  'Tomasz', 'Kamil', 'Dawid', 'Patryk', 'Maciej', 'Rafał', 'Paweł', 'Krzysztof', 'Łukasz', 'Adrian',
  'Damian', 'Mikołaj', 'Igor', 'Sebastian', 'Oskar', 'Dominik', 'Hubert', 'Marcin', 'Karol', 'Konrad'
];

const POLISH_LAST_NAMES = [
  'Nowak', 'Kowalski', 'Wiśniewski', 'Wójcik', 'Kowalczyk', 'Kamiński', 'Lewandowski', 'Zieliński', 'Szymański', 'Woźniak',
  'Dąbrowski', 'Kozłowski', 'Jankowski', 'Mazur', 'Wojciechowski', 'Kwiatkowski', 'Krawczyk', 'Kaczmarek', 'Piotrowski', 'Grabowski',
  'Pawłowski', 'Michalski', 'Nowicki', 'Adamczyk', 'Dudek', 'Zając', 'Wieczorek', 'Jabłoński', 'Król', 'Majewski',
  'Olszewski', 'Jaworski', 'Malinowski', 'Pawlak', 'Witkowski', 'Walczak', 'Stępień', 'Górski', 'Rutkowski', 'Michalak'
];

export function generatePlayer(
  clubId: string,
  tier: number,
  targetPosition?: Position,
  overrideOverall?: number
): Player {
  const id = `p_${clubId}_${Math.random().toString(36).substring(2, 9)}`;
  const positions: Position[] = ['BR', 'OB', 'OB', 'OB', 'OB', 'PO', 'PO', 'PO', 'PO', 'NA', 'NA'];
  const position = targetPosition || positions[Math.floor(Math.random() * positions.length)];
  
  const firstName = POLISH_FIRST_NAMES[Math.floor(Math.random() * POLISH_FIRST_NAMES.length)];
  const lastName = POLISH_LAST_NAMES[Math.floor(Math.random() * POLISH_LAST_NAMES.length)];
  const age = Math.floor(Math.random() * 16) + 18; // 18 - 34

  // Tier 1 (Ekstraklasa): 72-84
  // Tier 2 (1. Liga): 65-76
  // Tier 3 (2. Liga): 58-70
  // Tier 4 (3. Liga): 50-62
  // Tier 5 (Okręgówka): 40-54
  let baseOverall = 75;
  if (tier === 1) baseOverall = 74 + Math.floor(Math.random() * 8);
  else if (tier === 2) baseOverall = 66 + Math.floor(Math.random() * 9);
  else if (tier === 3) baseOverall = 60 + Math.floor(Math.random() * 9);
  else if (tier === 4) baseOverall = 52 + Math.floor(Math.random() * 9);
  else baseOverall = 44 + Math.floor(Math.random() * 9);

  const overall = overrideOverall ?? baseOverall;

  // Obliczenie atrybutów bazowych
  const goalkeeping = position === 'BR' ? overall + Math.floor(Math.random() * 4) : Math.max(15, overall - 45);
  const defending = position === 'OB' ? overall + Math.floor(Math.random() * 3) : position === 'PO' ? Math.max(25, overall - 15) : Math.max(15, overall - 35);
  const playmaking = position === 'PO' ? overall + Math.floor(Math.random() * 4) : position === 'OB' ? Math.max(25, overall - 18) : position === 'NA' ? Math.max(30, overall - 10) : Math.max(15, overall - 40);
  const scoring = position === 'NA' ? overall + Math.floor(Math.random() * 4) : position === 'PO' ? Math.max(30, overall - 12) : Math.max(15, overall - 35);

  // Wartość rynkowa i pensja
  const marketValue = Math.round(Math.pow(overall / 10, 4.2) * 150 * (tier === 5 ? 0.3 : 1));
  const salary = Math.max(500, Math.round(marketValue * 0.0018 + (tier === 1 ? 5000 : tier === 2 ? 2000 : 300)));

  return {
    id,
    clubId,
    firstName,
    lastName,
    age,
    position,
    overall,
    goalkeeping: Math.min(99, Math.max(10, goalkeeping)),
    defending: Math.min(99, Math.max(10, defending)),
    playmaking: Math.min(99, Math.max(10, playmaking)),
    scoring: Math.min(99, Math.max(10, scoring)),
    condition: 90 + Math.floor(Math.random() * 11), // 90-100%
    form: 6 + Math.floor(Math.random() * 4), // 6-9
    morale: 7 + Math.floor(Math.random() * 4),
    stamina: 60 + Math.floor(Math.random() * 35),
    goals: 0,
    assists: 0,
    cleanSheets: 0,
    yellowCards: 0,
    redCards: 0,
    matchesPlayed: 0,
    averageRating: 6.5,
    salary,
    contractYears: Math.floor(Math.random() * 3) + 1,
    marketValue,
    isInjured: false,
    isSuspended: false,
  };
}

export function generateClubSquad(clubId: string, tier: number): Player[] {
  const famous = FAMOUS_PLAYERS[clubId] || [];
  const squad: Player[] = [];

  // 1. Dodaj gwiazdy, jeśli klub ma zdefiniowane
  famous.forEach((fp) => {
    const p = generatePlayer(clubId, tier, fp.position, fp.overall);
    if (fp.firstName) p.firstName = fp.firstName;
    if (fp.lastName) p.lastName = fp.lastName;
    if (fp.age) p.age = fp.age;
    squad.push(p);
  });

  // 2. Uzupełnij kadrę do 20 zawodników (2 BR, 7 OB, 7 PO, 4 NA)
  const countGK = squad.filter((p) => p.position === 'BR').length;
  const countDEF = squad.filter((p) => p.position === 'OB').length;
  const countMID = squad.filter((p) => p.position === 'PO').length;
  const countFWD = squad.filter((p) => p.position === 'NA').length;

  for (let i = countGK; i < 2; i++) squad.push(generatePlayer(clubId, tier, 'BR'));
  for (let i = countDEF; i < 7; i++) squad.push(generatePlayer(clubId, tier, 'OB'));
  for (let i = countMID; i < 7; i++) squad.push(generatePlayer(clubId, tier, 'PO'));
  for (let i = countFWD; i < 4; i++) squad.push(generatePlayer(clubId, tier, 'NA'));

  return squad;
}
