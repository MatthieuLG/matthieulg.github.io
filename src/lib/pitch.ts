/**
 * Géométrie d'un terrain réglementaire (mètres), en vue portrait :
 * x = largeur (0 à 68), y = longueur (0 = ligne de but adverse, 105 = notre ligne de but).
 * La longueur sert d'axe du temps : on attaque vers le haut, du premier diplôme à aujourd'hui.
 */
export const PITCH = {
  width: 68,
  length: 105,
  centerCircle: 9.15,
  boxWidth: 40.32,
  boxDepth: 16.5,
  sixWidth: 18.32,
  sixDepth: 5.5,
  spot: 11,
  goalWidth: 7.32,
} as const;

export interface TimeAxis {
  /** Une ligne par année (étapes et année en cours), la plus récente en haut. */
  rows: { year: number; y: number }[];
  /** Position d'une année quelconque (interpolée entre deux lignes). */
  yOf: (year: number) => number;
}

/** Lignes du terrain que les libellés doivent éviter : surfaces et ligne médiane. */
const LINES = [PITCH.boxDepth, PITCH.length / 2, PITCH.length - PITCH.boxDepth];

/**
 * Axe du temps ordinal : chaque année où une étape a lieu reçoit une ligne, ainsi que l'année
 * en cours, et les lignes sont réparties régulièrement sur la longueur du terrain.
 * Le départ et le pas sont choisis pour tenir les libellés à l'écart des lignes du terrain,
 * quel que soit le nombre d'années.
 */
export function buildTimeAxis(eventYears: number[], currentYear?: number): TimeAxis {
  // Après la dernière étape, l'axe continue année par année jusqu'à l'année en cours.
  const last = Math.max(...eventYears);
  const tail = currentYear ? Array.from({ length: Math.max(0, currentYear - last) }, (_, i) => last + 1 + i) : [];
  const years = [...new Set([...eventYears, ...tail])].sort((a, b) => b - a);
  const n = years.length;
  // Seules les années qui portent une étape ont un libellé à protéger.
  const labelled = years.map((y) => eventYears.includes(y));

  let best = { top: 2, step: n > 1 ? 82 / (n - 1) : 0, score: -1 };
  for (let top = 1.5; top <= 5; top += 0.25) {
    for (let bottom = 78; bottom <= 94; bottom += 0.25) {
      const step = n > 1 ? (bottom - top) / (n - 1) : 0;
      let clearance = Infinity;
      for (let i = 0; i < n; i++) {
        if (!labelled[i]) continue;
        for (const line of LINES) clearance = Math.min(clearance, Math.abs(top + i * step - line));
      }
      // À dégagement suffisant, on préfère le tracé le plus étiré.
      const score = Math.min(clearance, 3.2) * 100 + step;
      if (score > best.score) best = { top, step, score };
    }
  }
  const rows = years.map((year, i) => ({ year, y: +(best.top + i * best.step).toFixed(2) }));

  const yOf = (year: number) => {
    const exact = rows.find((r) => r.year === year);
    if (exact) return exact.y;
    if (year > rows[0].year) return rows[0].y;
    if (year < rows[rows.length - 1].year) return rows[rows.length - 1].y;
    const above = [...rows].reverse().find((r) => r.year > year)!;
    const below = rows.find((r) => r.year < year)!;
    const t = (year - below.year) / (above.year - below.year);
    return +(below.y + (above.y - below.y) * t).toFixed(2);
  };

  return { rows, yOf };
}

export interface PitchNode {
  id: string;
  kind: 'experience' | 'formation';
  /** Numéro dans la séquence (expériences uniquement). */
  n?: number;
  label: string;
  sub?: string;
  x: number;
  y: number;
  current?: boolean;
}
