import { Club, Player, MatchEvent, LiveMatchState, Fixture } from '@/types';
import { getCommentaryText } from './commentaryEngine';

export interface MatchTeams {
  homeClub: Club;
  awayClub: Club;
  homePlayers: Record<string, Player>;
  awayPlayers: Record<string, Player>;
}

export function createInitialLiveMatchState(
  fixtureId: string,
  homeClubId: string,
  awayClubId: string
): LiveMatchState {
  return {
    matchId: fixtureId,
    homeClubId,
    awayClubId,
    currentMinute: 0,
    scoreHome: 0,
    scoreAway: 0,
    isPaused: false,
    isFinished: false,
    isHalfTime: false,
    speed: 2,
    events: [],
    stats: {
      shotsHome: 0,
      shotsAway: 0,
      shotsOnTargetHome: 0,
      shotsOnTargetAway: 0,
      possessionHome: 50,
      possessionAway: 50,
      cornersHome: 0,
      cornersAway: 0,
      foulsHome: 0,
      foulsAway: 0,
      yellowCardsHome: 0,
      yellowCardsAway: 0,
      redCardsHome: 0,
      redCardsAway: 0,
    },
    homeSubsUsed: 0,
    awaySubsUsed: 0,
  };
}

export function calculateTeamPower(
  club: Club,
  playersMap: Record<string, Player>,
  startingIds: string[]
) {
  const activePlayers = startingIds
    .map((id) => playersMap[id])
    .filter(Boolean);

  if (activePlayers.length === 0) {
    return { overall: 50, def: 50, mid: 50, fwd: 50, gk: 50 };
  }

  const gk = activePlayers.find((p) => p.position === 'BR') || activePlayers[0];
  const defs = activePlayers.filter((p) => p.position === 'OB');
  const mids = activePlayers.filter((p) => p.position === 'PO');
  const fwds = activePlayers.filter((p) => p.position === 'NA');

  const avg = (arr: Player[], key: keyof Player) =>
    arr.length > 0
      ? arr.reduce((sum, p) => sum + (Number(p[key]) || 50) * (p.condition / 100), 0) / arr.length
      : 45;

  const gkPower = gk.goalkeeping * (gk.condition / 100);
  const defPower = avg(defs, 'defending');
  const midPower = avg(mids, 'playmaking');
  const fwdPower = avg(fwds, 'scoring');

  let mentalityMod = 1.0;
  if (club.tactics.mentality === 'attacking') mentalityMod = 1.1;
  if (club.tactics.mentality === 'all_out_attack') mentalityMod = 1.2;
  if (club.tactics.mentality === 'defensive') mentalityMod = 0.9;
  if (club.tactics.mentality === 'very_defensive') mentalityMod = 0.8;

  return {
    gk: gkPower,
    def: defPower * (club.tactics.mentality.includes('defensive') ? 1.15 : 1.0),
    mid: midPower,
    fwd: fwdPower * mentalityMod,
    overall: (gkPower + defPower + midPower + fwdPower) / 4,
  };
}

export function simulateMatchMinute(
  state: LiveMatchState,
  teams: MatchTeams
): { nextState: LiveMatchState; newEvents: MatchEvent[] } {
  if (state.isFinished || state.isPaused) {
    return { nextState: state, newEvents: [] };
  }

  const minute = state.currentMinute + 1;
  const newEvents: MatchEvent[] = [];
  const homePower = calculateTeamPower(teams.homeClub, teams.homePlayers, teams.homeClub.tactics.startingIds);
  const awayPower = calculateTeamPower(teams.awayClub, teams.awayPlayers, teams.awayClub.tactics.startingIds);

  // Home advantage (+5% power)
  const homeEffectiveMid = homePower.mid * 1.05;
  const awayEffectiveMid = awayPower.mid;
  const totalMid = homeEffectiveMid + awayEffectiveMid;
  const homePossessionShare = Math.round((homeEffectiveMid / totalMid) * 100);

  // Dynamic possession update
  const updatedStats = { ...state.stats };
  updatedStats.possessionHome = Math.round((state.stats.possessionHome * 0.9) + (homePossessionShare * 0.1));
  updatedStats.possessionAway = 100 - updatedStats.possessionHome;

  let scoreHome = state.scoreHome;
  let scoreAway = state.scoreAway;

  // Chance of match incident per minute (~12-16% chance per minute)
  const incidentRoll = Math.random();

  if (incidentRoll < 0.14) {
    // Decide who attacks based on midfield power
    const isHomeAttack = Math.random() * totalMid < homeEffectiveMid;
    const attackingClub = isHomeAttack ? teams.homeClub : teams.awayClub;
    const defendingClub = isHomeAttack ? teams.awayClub : teams.homeClub;
    const attackingPlayersMap = isHomeAttack ? teams.homePlayers : teams.awayPlayers;
    const defendingPlayersMap = isHomeAttack ? teams.awayPlayers : teams.homePlayers;
    const attackingIds = attackingClub.tactics.startingIds;
    const attackPower = isHomeAttack ? homePower.fwd : awayPower.fwd;
    const defensePower = isHomeAttack ? awayPower.def : homePower.def;
    const gkPower = isHomeAttack ? awayPower.gk : homePower.gk;

    const availableAttackers = attackingIds
      .map((id) => attackingPlayersMap[id])
      .filter((p) => p && (p.position === 'NA' || p.position === 'PO'));
    const shooter = availableAttackers.length > 0
      ? availableAttackers[Math.floor(Math.random() * availableAttackers.length)]
      : Object.values(attackingPlayersMap)[0];

    const assistCandidate = availableAttackers.find((p) => p.id !== shooter?.id);

    if (isHomeAttack) updatedStats.shotsHome++;
    else updatedStats.shotsAway++;

    // Calculate goal probability
    const shotQuality = (attackPower / (attackPower + defensePower + gkPower * 0.8));
    const goalRoll = Math.random();

    if (goalRoll < shotQuality * 0.35) {
      // GOAL!
      if (isHomeAttack) {
        scoreHome++;
        updatedStats.shotsOnTargetHome++;
      } else {
        scoreAway++;
        updatedStats.shotsOnTargetAway++;
      }

      if (shooter) shooter.goals = (shooter.goals || 0) + 1;
      if (assistCandidate) assistCandidate.assists = (assistCandidate.assists || 0) + 1;

      const desc = getCommentaryText('goal', {
        clubName: attackingClub.name,
        playerName: `${shooter?.firstName} ${shooter?.lastName}`,
        assistName: assistCandidate ? `${assistCandidate.firstName} ${assistCandidate.lastName}` : undefined,
      });

      newEvents.push({
        id: `ev_${minute}_${Math.random()}`,
        minute,
        type: 'goal',
        clubId: attackingClub.id,
        playerId: shooter?.id,
        playerName: `${shooter?.firstName} ${shooter?.lastName}`,
        assistPlayerId: assistCandidate?.id,
        assistPlayerName: assistCandidate ? `${assistCandidate.firstName} ${assistCandidate.lastName}` : undefined,
        description: desc,
        scoreHome,
        scoreAway,
        isHighlight: true,
      });
    } else if (goalRoll < 0.6) {
      // Parada bramkarza / Rzut rożny
      if (isHomeAttack) {
        updatedStats.shotsOnTargetHome++;
        updatedStats.cornersHome++;
      } else {
        updatedStats.shotsOnTargetAway++;
        updatedStats.cornersAway++;
      }

      const desc = getCommentaryText('save', {
        clubName: defendingClub.name,
        playerName: `${shooter?.firstName} ${shooter?.lastName}`,
      });

      newEvents.push({
        id: `ev_${minute}_${Math.random()}`,
        minute,
        type: 'save',
        clubId: defendingClub.id,
        playerId: shooter?.id,
        playerName: `${shooter?.firstName} ${shooter?.lastName}`,
        description: desc,
        scoreHome,
        scoreAway,
      });
    } else if (goalRoll < 0.75) {
      // Słupek lub poprzeczka
      const desc = getCommentaryText('post', {
        clubName: attackingClub.name,
        playerName: `${shooter?.firstName} ${shooter?.lastName}`,
      });

      newEvents.push({
        id: `ev_${minute}_${Math.random()}`,
        minute,
        type: 'post',
        clubId: attackingClub.id,
        playerId: shooter?.id,
        playerName: `${shooter?.firstName} ${shooter?.lastName}`,
        description: desc,
        scoreHome,
        scoreAway,
        isHighlight: true,
      });
    } else {
      // Niecelny strzał
      const desc = getCommentaryText('shot', {
        clubName: attackingClub.name,
        playerName: `${shooter?.firstName} ${shooter?.lastName}`,
      });

      newEvents.push({
        id: `ev_${minute}_${Math.random()}`,
        minute,
        type: 'shot',
        clubId: attackingClub.id,
        playerId: shooter?.id,
        playerName: `${shooter?.firstName} ${shooter?.lastName}`,
        description: desc,
        scoreHome,
        scoreAway,
      });
    }
  } else if (incidentRoll < 0.17) {
    // Faul lub kartka
    const isHomeFoul = Math.random() > 0.5;
    const foulClub = isHomeFoul ? teams.homeClub : teams.awayClub;
    const playersMap = isHomeFoul ? teams.homePlayers : teams.awayPlayers;
    const starting = foulClub.tactics.startingIds;
    const fouler = playersMap[starting[Math.floor(Math.random() * starting.length)]];

    if (isHomeFoul) updatedStats.foulsHome++;
    else updatedStats.foulsAway++;

    const cardRoll = Math.random();
    if (cardRoll < 0.2) {
      // Żółta kartka
      if (isHomeFoul) updatedStats.yellowCardsHome++;
      else updatedStats.yellowCardsAway++;
      if (fouler) fouler.yellowCards = (fouler.yellowCards || 0) + 1;

      const desc = getCommentaryText('yellow_card', {
        clubName: foulClub.name,
        playerName: `${fouler?.firstName} ${fouler?.lastName}`,
      });

      newEvents.push({
        id: `ev_${minute}_${Math.random()}`,
        minute,
        type: 'yellow_card',
        clubId: foulClub.id,
        playerId: fouler?.id,
        playerName: `${fouler?.firstName} ${fouler?.lastName}`,
        description: desc,
        scoreHome,
        scoreAway,
        isHighlight: true,
      });
    } else if (cardRoll < 0.23 && fouler?.yellowCards && fouler.yellowCards >= 2) {
      // Czerwona kartka
      if (isHomeFoul) updatedStats.redCardsHome++;
      else updatedStats.redCardsAway++;
      if (fouler) fouler.redCards = (fouler.redCards || 0) + 1;

      const desc = getCommentaryText('red_card', {
        clubName: foulClub.name,
        playerName: `${fouler?.firstName} ${fouler?.lastName}`,
      });

      newEvents.push({
        id: `ev_${minute}_${Math.random()}`,
        minute,
        type: 'red_card',
        clubId: foulClub.id,
        playerId: fouler?.id,
        playerName: `${fouler?.firstName} ${fouler?.lastName}`,
        description: desc,
        scoreHome,
        scoreAway,
        isHighlight: true,
      });
    }
  }

  // Slight condition fatigue per minute
  if (minute % 10 === 0) {
    [...teams.homeClub.tactics.startingIds, ...teams.awayClub.tactics.startingIds].forEach((id) => {
      const p = teams.homePlayers[id] || teams.awayPlayers[id];
      if (p && p.condition > 30) {
        p.condition = Math.max(25, p.condition - 1);
      }
    });
  }

  const isHalfTime = minute === 45;
  const isFinished = minute >= 90;

  return {
    nextState: {
      ...state,
      currentMinute: minute,
      scoreHome,
      scoreAway,
      isHalfTime,
      isFinished,
      isPaused: isHalfTime ? true : state.isPaused,
      stats: updatedStats,
      events: [...newEvents, ...state.events],
    },
    newEvents,
  };
}

// Błyskawiczna symulacja meczów AI w tle
export function simulateFullMatchQuickly(
  fixture: Fixture,
  homeClub: Club,
  awayClub: Club,
  homePlayers: Record<string, Player>,
  awayPlayers: Record<string, Player>
): Fixture {
  const teams: MatchTeams = { homeClub, awayClub, homePlayers, awayPlayers };
  let state = createInitialLiveMatchState(fixture.id, homeClub.id, awayClub.id);

  for (let m = 1; m <= 90; m++) {
    state.isPaused = false;
    const { nextState } = simulateMatchMinute(state, teams);
    state = nextState;
  }

  // Ustal frekwencję na stadionie
  const maxCap = homeClub.stadium.capacity;
  const repAvg = (homeClub.reputation + awayClub.reputation) / 2;
  const attendance = Math.min(
    maxCap,
    Math.round(maxCap * (repAvg / 110) * (0.6 + Math.random() * 0.4))
  );

  return {
    ...fixture,
    played: true,
    scoreHome: state.scoreHome,
    scoreAway: state.scoreAway,
    events: state.events,
    attendance,
  };
}
