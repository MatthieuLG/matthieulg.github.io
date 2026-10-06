/**
 * Accès aux données ouvertes StatsBomb (https://github.com/statsbomb/open-data).
 * Les fichiers JSON sont lus directement depuis le dépôt public, sans clé ni serveur.
 */
const BASE = 'https://raw.githubusercontent.com/statsbomb/open-data/master/data';

/** Compétitions proposées : `competition_id/season_id`. */
export const competitions = [
  { id: '43/106', label: 'FIFA World Cup 2022' },
  { id: '55/282', label: 'UEFA Euro 2024' },
  { id: '223/282', label: 'Copa América 2024' },
  { id: '72/107', label: "FIFA Women's World Cup 2023" },
  { id: '53/315', label: "UEFA Women's Euro 2025" },
];

declare global {
  interface Window {
    /** Données figées, indexées par chemin : sert aux démonstrations hors ligne. */
    __SB_SNAPSHOT__?: Record<string, { data: unknown; total?: number }>;
  }
}

/** Compétitions réellement disponibles (toutes en ligne, celles de l'instantané hors ligne). */
export function availableCompetitions() {
  const snap = typeof window !== 'undefined' ? window.__SB_SNAPSHOT__ : undefined;
  return snap ? competitions.filter((c) => `matches/${c.id}.json` in snap) : competitions;
}

export interface ApiCall {
  path: string;
  /** Durée de l'appel en millisecondes. */
  ms: number;
  /** Nombre d'éléments reçus. */
  count: number;
  snapshot: boolean;
}

async function get<T>(path: string): Promise<{ data: T; call: ApiCall }> {
  const snap = typeof window !== 'undefined' ? window.__SB_SNAPSHOT__ : undefined;
  if (snap) {
    const hit = snap[path];
    if (!hit) throw new Error(`Absent de l'instantané : ${path}`);
    const data = hit.data as T;
    return { data, call: { path, ms: 0, count: hit.total ?? (Array.isArray(data) ? data.length : 0), snapshot: true } };
  }
  const t0 = performance.now();
  const res = await fetch(`${BASE}/${path}`);
  if (!res.ok) throw new Error(`HTTP ${res.status} sur ${path}`);
  const data = (await res.json()) as T;
  return {
    data,
    call: { path, ms: Math.round(performance.now() - t0), count: Array.isArray(data) ? data.length : 0, snapshot: false },
  };
}

/* ───────────── Matchs ───────────── */

export interface MatchInfo {
  id: number;
  date: string;
  stage: string;
  home: { id: number; name: string; score: number };
  away: { id: number; name: string; score: number };
}

interface RawMatch {
  match_id: number;
  match_date: string;
  kick_off: string | null;
  home_team: { home_team_id: number; home_team_name: string };
  away_team: { away_team_id: number; away_team_name: string };
  home_score: number;
  away_score: number;
  competition_stage: { name: string };
}

/** Matchs d'une compétition, du plus récent au plus ancien (la finale en premier). */
export async function loadMatches(competition: string): Promise<{ matches: MatchInfo[]; call: ApiCall }> {
  const { data, call } = await get<RawMatch[]>(`matches/${competition}.json`);
  const matches = data
    .map((m) => ({
      id: m.match_id,
      date: m.match_date,
      kick: m.kick_off ?? '',
      stage: m.competition_stage.name,
      home: { id: m.home_team.home_team_id, name: m.home_team.home_team_name, score: m.home_score },
      away: { id: m.away_team.away_team_id, name: m.away_team.away_team_name, score: m.away_score },
    }))
    .sort((a, b) => (b.date + b.kick).localeCompare(a.date + a.kick));
  return { matches, call };
}

/* ───────────── Événements d'un match ───────────── */

export type Side = 'home' | 'away';

export interface Shot {
  id: string;
  side: Side;
  player: string;
  period: number;
  minute: number;
  /** Temps écoulé en secondes sur un axe continu (arrêts de jeu compris). */
  t: number;
  /** Position sur un terrain 120 × 80, l'équipe à domicile attaquant vers la droite. */
  x: number;
  y: number;
  endX: number;
  endY: number;
  xg: number;
  outcome: string;
  type: string;
  bodyPart: string;
  goal: boolean;
}

export interface MatchData {
  shots: Shot[];
  /** Tirs de la séance de tirs au but, hors xG. */
  shootout: { home: number; away: number } | null;
  ownGoals: { side: Side; t: number; period: number; minute: number }[];
  /** Fin de chaque période sur l'axe continu, en secondes. */
  periodEnds: number[];
  duration: number;
  totalEvents: number;
  calls: ApiCall[];
}

interface RawEvent {
  id: string;
  period: number;
  minute: number;
  second: number;
  type: { name: string };
  team?: { id: number };
  player?: { id: number; name: string };
  location?: number[];
  shot?: {
    statsbomb_xg: number;
    end_location: number[];
    outcome: { name: string };
    type: { name: string };
    body_part: { name: string };
  };
}

interface RawLineup {
  lineup: { player_id: number; player_name: string; player_nickname: string | null }[];
}

/** Minute de début théorique de chaque période (convention StatsBomb). */
const PERIOD_START = [0, 45, 90, 105].map((m) => m * 60);

/** Charge les événements et les compositions d'un match, puis en extrait les tirs. */
export async function loadMatch(match: MatchInfo): Promise<MatchData> {
  const [events, lineups] = await Promise.all([
    get<RawEvent[]>(`events/${match.id}.json`),
    get<RawLineup[]>(`lineups/${match.id}.json`).catch(() => null),
  ]);

  // Nom d'usage des joueurs (« Lionel Messi » plutôt que l'état civil complet).
  const names = new Map<number, string>();
  lineups?.data.forEach((team) =>
    team.lineup.forEach((p) => names.set(p.player_id, p.player_nickname ?? p.player_name)),
  );

  // Durée réelle de chaque période : l'axe du temps enchaîne les périodes sans chevauchement.
  const raw = events.data;
  const clock = (e: RawEvent) => e.minute * 60 + e.second;
  const lengths: number[] = [];
  for (let p = 1; p <= 4; p++) {
    const inPeriod = raw.filter((e) => e.period === p);
    if (inPeriod.length === 0) break;
    lengths.push(Math.max(...inPeriod.map(clock)) - PERIOD_START[p - 1]);
  }
  const offsets = lengths.map((_, i) => lengths.slice(0, i).reduce((a, b) => a + b, 0));
  const elapsed = (e: RawEvent) => offsets[e.period - 1] + (clock(e) - PERIOD_START[e.period - 1]);
  const sideOf = (e: RawEvent): Side => (e.team?.id === match.home.id ? 'home' : 'away');

  const shots: Shot[] = [];
  const shootout = { home: 0, away: 0 };
  let hasShootout = false;

  for (const e of raw) {
    if (e.type.name !== 'Shot' || !e.shot || !e.location) continue;
    const side = sideOf(e);
    const goal = e.shot.outcome.name === 'Goal';
    if (e.period > 4) {
      hasShootout = true;
      if (goal) shootout[side] += 1;
      continue;
    }
    // L'équipe à domicile attaque vers la droite ; l'adversaire est renvoyé en miroir vers la gauche.
    const flip = side === 'away';
    const fx = (x: number) => (flip ? 120 - x : x);
    const fy = (y: number) => (flip ? 80 - y : y);
    shots.push({
      id: e.id,
      side,
      player: e.player ? (names.get(e.player.id) ?? e.player.name) : '',
      period: e.period,
      minute: e.minute,
      t: elapsed(e),
      x: fx(e.location[0]),
      y: fy(e.location[1]),
      endX: fx(e.shot.end_location[0]),
      endY: fy(e.shot.end_location[1]),
      xg: e.shot.statsbomb_xg,
      outcome: e.shot.outcome.name,
      type: e.shot.type.name,
      bodyPart: e.shot.body_part.name,
      goal,
    });
  }

  const ownGoals = raw
    .filter((e) => e.type.name === 'Own Goal For' && e.period <= 4)
    .map((e) => ({ side: sideOf(e), t: elapsed(e), period: e.period, minute: e.minute }));

  const periodEnds = lengths.map((len, i) => offsets[i] + len);
  const total = events.call.count;

  return {
    shots: shots.sort((a, b) => a.t - b.t),
    shootout: hasShootout ? shootout : null,
    ownGoals,
    periodEnds,
    duration: periodEnds[periodEnds.length - 1] ?? 90 * 60,
    totalEvents: total,
    calls: [events.call, ...(lineups ? [lineups.call] : [])],
  };
}

/** Minute affichée façon feuille de match : « 23' », « 45+3' ». */
export function displayMinute(period: number, minute: number): string {
  const regular = [45, 90, 105, 120][Math.min(period, 4) - 1];
  const m = minute + 1;
  return m > regular ? `${regular}+${m - regular}'` : `${m}'`;
}
