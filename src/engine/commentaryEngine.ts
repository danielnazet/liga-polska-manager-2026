import { MatchEvent } from '@/types';

export const RADIO_PHRASES = {
  goal: [
    'GOOOOOOOL! Co za trafienie! {player} dopada do bezpańskiej piłki i pakuje ją prosto w okienko bramki!',
    'BRAMKA! {player} uderza z woleja nie do obrony! Stadion eksplodował z radości!',
    'GOL DLA {club}! Znakomita akcja oskrzydlająca, podanie od {assist} i {player} dopełnia formalności!',
    'ALEŻ TRAFIENIE! {player} huknął jak z armaty z 20 metrów! Bramkarz bez najmniejszych szans!',
    'GOOOOL! Precyzyjny strzał głową po dośrodkowaniu! {player} najwyżej wyskoczył w polu karnym!',
    'BRAMKA DLA {club}! {player} minął obrońcę zwodem na zamach i ze stoickim spokojem posłał piłkę obok bezradnego golkipera!'
  ],
  penalty_goal: [
    'GOOOOL Z RZUTU KARNEGO! {player} podchodzi do jedenastki, chwila skupienia... i pewny strzał w lewy róg! Bramkarz zmylony!',
    'BRAMKA! {player} bezlitośnie egzekwuje rzut karny! Posłał bramkarza w jedną stronę, a piłkę w drugą!'
  ],
  penalty_miss: [
    'NIE MA BRAMKI! {player} fatalnie marnuje rzut karny! Piłka szybuje wysoko ponad poprzeczką!',
    'CO ZA OBRONA! Bramkarz wyczuwa intencje strzelca i z wielką klasą paruje strzał {player} z 11 metrów!'
  ],
  save: [
    'Kapitalna interwencja bramkarza! Wyciągnął się jak struna po strzale {player} i sparował piłkę na rzut rożny!',
    'Co za parada! {player} strzelał z bliska, ale bramkarz instynktownie odbija piłkę końcami palców!',
    'Bramkarz ratuje swój zespół przed utratą gola! Znakomicie skrócił kąt i zablokował próbę {player}!'
  ],
  post: [
    'SŁUPEK! Niewiele brakowało! {player} uderzył z ostrego kąta i ostemplował słupek bramki rywali!',
    'POPRZECZKA! Bomba, którą posłał {player}, zatrzęsła konstrukcją bramki! Jęknęły trybuny!'
  ],
  shot: [
    'Groźny strzał z dystansu! {player} zdecydował się na uderzenie zza pola karnego, piłka minimalnie mija słupek.',
    '{player} dochodzi do sytuacji strzeleckiej, jednak uderza zbyt lekko i obrońca przejmuje futbolówkę.',
    'Pociągnął z dystansu {player}! Piłka po rykoszecie przelatuje tuż obok bramki.'
  ],
  yellow_card: [
    'ŻÓŁTA KARTKA! Ostry wślizg od tyłu. Sędzia przerywa grę i upomina {player}.',
    'Żółta kartka dla {player} za taktyczny faul i przerwanie groźnego kontrataku.',
    'Sędzia sięga do kieszonki! {player} ukarany żółtym kartonikiem za dyskusje z arbitrem.'
  ],
  red_card: [
    'CZERWONA KARTKA! Brutalny faul wyprostowaną nogą! {player} wylatuje z boiska i osłabia swój zespół!',
    'DRUGA ŻÓŁTA I W KONSEKWENCJI CZERWONA! {player} musi opuścić plac gry! Nerwy puściły w kluczowym momencie!'
  ],
  injury: [
    'KONTUZJA! {player} zwija się z bólu na murawie. Sztab medyczny wbiega na boisko z noszami...',
    'Nieprzyjemne zderzenie głowami. {player} potrzebuje natychmiastowej pomocy medycznej.'
  ],
  offside: [
    'Chorągiewka sędziego liniowego w górze! {player} złapany w pułapkę ofsajdową.',
    'Brak timingu w ataku! {player} wybiegł o ułamek sekundy za wcześnie - spalony.'
  ],
  foul: [
    'Faul w środkowej strefie boiska. {player} ostro powstrzymuje rywala.',
    'Twarda walka o piłkę przy linii bocznej. Sędzia odgwizduje przewinienie zawodnika {club}.'
  ],
  sub: [
    'ZMIANA W ZESPOLE {club}: Plac gry opuszcza {playerOut}, a w jego miejsce melduje się {playerIn}.'
  ]
};

export function getCommentaryText(
  type: MatchEvent['type'],
  data: {
    clubName: string;
    playerName?: string;
    assistName?: string;
    playerOutName?: string;
    playerInName?: string;
  }
): string {
  const list = RADIO_PHRASES[type as keyof typeof RADIO_PHRASES] || RADIO_PHRASES.shot;
  const template = list[Math.floor(Math.random() * list.length)];
  
  return template
    .replace('{club}', data.clubName || 'Drużyna')
    .replace('{player}', data.playerName || 'Zawodnik')
    .replace('{assist}', data.assistName || 'partner')
    .replace('{playerOut}', data.playerOutName || 'zawodnik')
    .replace('{playerIn}', data.playerInName || 'zmiennik');
}
