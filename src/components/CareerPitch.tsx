import { animate, motion, useMotionValue, useReducedMotion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { PITCH, type PitchNode } from '../lib/pitch';

interface Props {
  nodes: PitchNode[];
  /** Lignes de l'axe du temps, la plus récente en premier. */
  years: { year: number; y: number }[];
  /** Textes, dans la langue de la page. */
  label: string;
  hint: string;
  replayLabel: string;
}

/* ── Géométrie (mètres) ── */
const W = PITCH.width;
const L = PITCH.length;
const MID = W / 2;
const BOX_X = (W - PITCH.boxWidth) / 2;
const SIX_X = (W - PITCH.sixWidth) / 2;
const GOAL_X = (W - PITCH.goalWidth) / 2;
const ARC_DX = Math.sqrt(PITCH.centerCircle ** 2 - (PITCH.boxDepth - PITCH.spot) ** 2);
const NODE_R = 2.4;
const DIAMOND = 1.3; // demi-côté du losange
const BALL_R = 1.15;
/** Départ de la course « formation », près de notre ligne de but. */
const RUN_START = L - 1.5;

/* ── Rythme de la séquence (secondes) ── */
const T_FORMATION = 0.15;
const RUN = 1;
const T_FIRST_PASS = 0.75;
const PASS = 0.36;

const CRAIE = 'var(--color-craie)';
const PELOUSE = 'var(--color-pelouse)';
const BALLON = 'var(--color-ballon)';
const ENCRE = 'var(--color-encre)';
const BRUME = 'var(--color-brume)';

const halo = { stroke: PELOUSE, strokeWidth: 1.2, strokeLinejoin: 'round' as const, paintOrder: 'stroke' };
const smooth = (t: number) => t * t * (3 - 2 * t);
const wait = (seconds: number) => new Promise((resolve) => setTimeout(resolve, seconds * 1000));

/** Tracé du terrain : discret, statique, rendu dès le HTML. */
function Markings() {
  const line = { vectorEffect: 'non-scaling-stroke' as const };
  return (
    <g fill="none" stroke={CRAIE} strokeOpacity={0.22} strokeWidth={1}>
      <rect x={0} y={0} width={W} height={L} {...line} />
      <line x1={0} y1={L / 2} x2={W} y2={L / 2} {...line} />
      <circle cx={MID} cy={L / 2} r={PITCH.centerCircle} {...line} />
      {[0, 1].map((side) => {
        const boxY = side === 0 ? 0 : L - PITCH.boxDepth;
        const sixY = side === 0 ? 0 : L - PITCH.sixDepth;
        const arcY = side === 0 ? PITCH.boxDepth : L - PITCH.boxDepth;
        return (
          <g key={side}>
            <rect x={BOX_X} y={boxY} width={PITCH.boxWidth} height={PITCH.boxDepth} {...line} />
            <rect x={SIX_X} y={sixY} width={PITCH.sixWidth} height={PITCH.sixDepth} {...line} />
            <path
              d={`M ${MID - ARC_DX} ${arcY} A ${PITCH.centerCircle} ${PITCH.centerCircle} 0 0 ${side} ${MID + ARC_DX} ${arcY}`}
              {...line}
            />
          </g>
        );
      })}
      {/* But adverse : la direction de la séquence */}
      <rect x={GOAL_X} y={-1.8} width={PITCH.goalWidth} height={1.8} {...line} />
    </g>
  );
}

export default function CareerPitch({ nodes, years, label, hint, replayLabel }: Props) {
  const reduceMotion = useReducedMotion();
  const [ready, setReady] = useState(false);
  /** Incrémenté à chaque relance : les tracés se rejouent. */
  const [run, setRun] = useState(0);
  const [playing, setPlaying] = useState(false);
  /** Entrée de la liste en cours de lecture. */
  const [active, setActive] = useState<string | null>(null);
  /** Le ballon est entre deux points. */
  const [inFlight, setInFlight] = useState(false);
  const [hover, setHover] = useState<string | null>(null);

  const formation = useMemo(
    () => nodes.filter((n) => n.kind === 'formation').sort((a, b) => b.y - a.y),
    [nodes],
  );
  const sequence = useMemo(
    () => nodes.filter((n) => n.kind === 'experience').sort((a, b) => (a.n ?? 0) - (b.n ?? 0)),
    [nodes],
  );
  const current = sequence.find((n) => n.current) ?? sequence[sequence.length - 1];
  const runTopY = formation.length ? formation[formation.length - 1].y : RUN_START;

  /* Passes : segments entre deux expériences consécutives, arrêtés au bord des points. */
  const passes = useMemo(
    () =>
      sequence.slice(0, -1).map((from, i) => {
        const to = sequence[i + 1];
        const dx = to.x - from.x;
        const dy = to.y - from.y;
        const len = Math.hypot(dx, dy);
        const gap = NODE_R + 1.1;
        return {
          key: `${from.id}-${to.id}`,
          d: `M ${from.x + (dx / len) * gap} ${from.y + (dy / len) * gap} L ${to.x - (dx / len) * gap} ${to.y - (dy / len) * gap}`,
        };
      }),
    [sequence],
  );

  /* Instant d'apparition de chaque point pendant la séquence. */
  const appearAt = (node: PitchNode) => {
    if (reduceMotion) return 0;
    if (node.kind === 'formation') {
      // Le diplôme apparaît quand la course l'atteint.
      return T_FORMATION + RUN * ((RUN_START - node.y) / Math.max(RUN_START - runTopY, 1));
    }
    return T_FIRST_PASS + sequence.indexOf(node) * PASS;
  };
  const tEnd = reduceMotion ? 0 : T_FIRST_PASS + (sequence.length - 1) * PASS;

  /* ── Le ballon ── */
  const ballX = useMotionValue(current?.x ?? 0);
  const ballY = useMotionValue(current?.y ?? 0);
  const ballOpacity = useMotionValue(0);
  /** Position dictée par la lecture ; le ballon la rejoint dès que la séquence est terminée. */
  const target = useRef({ x: current?.x ?? 0, y: current?.y ?? 0 });
  const busy = useRef(true);

  useEffect(() => setReady(true), []);

  /* Lecture : le ballon reste sur le poste lu, puis part vers le suivant à l'approche de l'entrée suivante. */
  useEffect(() => {
    const entries = Array.from(document.querySelectorAll<HTMLElement>('[data-entry]'));
    const section = document.getElementById('parcours');
    const byId = new Map(nodes.map((n) => [n.id, n]));
    if (!section || entries.length === 0 || !current) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const readingLine = window.innerHeight * 0.45;
      const box = section.getBoundingClientRect();
      const tops = entries.map((el) => el.getBoundingClientRect().top);

      let index = -1;
      for (let i = 0; i < tops.length; i++) if (tops[i] <= readingLine) index = i;

      const inSection = box.top <= readingLine && box.bottom > readingLine;
      const reading = inSection && index >= 0 ? (entries[index].dataset.entry ?? null) : null;
      setActive((prev) => (prev === reading ? prev : reading));

      // Position du ballon
      let pos = { x: current.x, y: current.y };
      let flying = false;
      const here = index >= 0 ? byId.get(entries[index].dataset.entry ?? '') : undefined;
      if (here) {
        pos = { x: here.x, y: here.y };
        const next = index < entries.length - 1 ? byId.get(entries[index + 1].dataset.entry ?? '') : undefined;
        if (next) {
          const progress = (readingLine - tops[index]) / Math.max(tops[index + 1] - tops[index], 1);
          // Le ballon part sur le dernier tiers de l'entrée (d'un coup si les animations sont réduites).
          const raw = Math.min(Math.max((progress - 0.66) / 0.34, 0), 1);
          const t = reduceMotion ? (raw >= 1 ? 1 : 0) : smooth(raw);
          pos = { x: here.x + (next.x - here.x) * t, y: here.y + (next.y - here.y) * t };
          flying = t > 0.02 && t < 0.98;
        }
      }
      target.current = pos;
      if (!busy.current) {
        ballX.set(pos.x);
        ballY.set(pos.y);
      }
      setInFlight((prev) => (prev === flying ? prev : flying));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    const enter = (e: Event) => setHover((e.currentTarget as HTMLElement).dataset.entry ?? null);
    const leave = () => setHover(null);
    entries.forEach((el) => {
      el.addEventListener('pointerenter', enter);
      el.addEventListener('pointerleave', leave);
    });

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      entries.forEach((el) => {
        el.removeEventListener('pointerenter', enter);
        el.removeEventListener('pointerleave', leave);
      });
      if (frame) cancelAnimationFrame(frame);
    };
  }, [nodes, current, reduceMotion, ballX, ballY]);

  /* L'entrée lue est marquée dans la liste (numéro plein). */
  useEffect(() => {
    document.querySelectorAll<HTMLElement>('[data-entry]').forEach((el) => {
      el.toggleAttribute('data-active', el.dataset.entry === active);
    });
  }, [active]);

  /* La séquence : le ballon circule de la première à la dernière expérience, au rythme des passes. */
  useEffect(() => {
    if (!ready || sequence.length === 0) return;
    let cancelled = false;
    const controls: { stop: () => void }[] = [];

    const settle = () => {
      busy.current = false;
      ballX.set(target.current.x);
      ballY.set(target.current.y);
      ballOpacity.set(1);
      setPlaying(false);
    };
    if (reduceMotion) {
      settle();
      return;
    }

    const move = async (to: { x: number; y: number }, duration: number, ease: 'linear' | 'easeInOut') => {
      const a = animate(ballX, to.x, { duration, ease });
      const b = animate(ballY, to.y, { duration, ease });
      controls.push(a, b);
      await Promise.all([a, b]);
    };

    (async () => {
      busy.current = true;
      setPlaying(true);
      ballOpacity.set(0);
      ballX.set(sequence[0].x);
      ballY.set(sequence[0].y);
      await wait(T_FIRST_PASS);
      if (cancelled) return;
      ballOpacity.set(1);
      for (let i = 1; i < sequence.length; i++) {
        await move(sequence[i], PASS, 'linear');
        if (cancelled) return;
      }
      // Retour à la position de lecture si la page a défilé entre-temps.
      await wait(0.25);
      if (cancelled) return;
      if (Math.hypot(target.current.x - ballX.get(), target.current.y - ballY.get()) > 0.5) {
        await move(target.current, 0.5, 'easeInOut');
        if (cancelled) return;
      }
      settle();
    })();

    return () => {
      cancelled = true;
      controls.forEach((c) => c.stop());
    };
  }, [ready, run, reduceMotion, sequence, ballX, ballY, ballOpacity]);

  const replay = useCallback(() => setRun((n) => n + 1), []);

  /* Point mis en avant : celui que l'on survole, sinon celui qui a le ballon. */
  const focusId = hover ?? (inFlight || playing ? null : active);
  const focusNode = nodes.find((n) => n.id === focusId);
  const show = ready ? 1 : 0;

  return (
    <div className="flex h-full flex-col px-5 pb-10 pt-2 sm:px-8 lg:pb-5 lg:pt-[4.75rem]">
      <svg
        viewBox={`-9 -3.5 ${W + 11.5} ${L + 6}`}
        className="mx-auto min-h-0 w-full max-w-[30rem] flex-1 select-none lg:max-w-none"
        role="group"
        aria-label={label}
      >
        <Markings />

        {/* Axe du temps le long de la ligne de touche */}
        <g aria-hidden="true">
          {years.map(({ year, y }) => (
            <g key={year}>
              <line x1={-1.2} y1={y} x2={0} y2={y} stroke={CRAIE} strokeOpacity={0.45} strokeWidth={1} vectorEffect="non-scaling-stroke" />
              <text
                x={-2.3}
                y={y}
                textAnchor="end"
                dominantBaseline="central"
                className="pitch-year"
                fill={BRUME}
                style={{ fontStretch: '75%', fontVariantNumeric: 'tabular-nums', fontWeight: 500 }}
              >
                {year}
              </text>
            </g>
          ))}
        </g>

        {/* Formation : une course le long du couloir gauche, chaque diplôme marquant la fin d'un cycle */}
        {formation.length > 0 && (
          <motion.line
            key={`run-${run}`}
            x1={formation[0].x}
            x2={formation[0].x}
            y1={RUN_START}
            initial={{ y2: RUN_START, opacity: 0 }}
            animate={ready ? { y2: runTopY + DIAMOND * Math.SQRT2 + 0.6, opacity: 1 } : undefined}
            transition={{ duration: reduceMotion ? 0 : RUN, delay: reduceMotion ? 0 : T_FORMATION, ease: 'linear' }}
            stroke={CRAIE}
            strokeOpacity={0.6}
            strokeWidth={0.34}
            strokeDasharray="0.01 1.3"
            strokeLinecap="round"
          />
        )}

        {/* Expériences : une séquence de passes */}
        {passes.map((pass, i) => (
          <motion.path
            key={`${pass.key}-${run}`}
            d={pass.d}
            fill="none"
            stroke={CRAIE}
            strokeOpacity={0.9}
            strokeWidth={0.22}
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={ready ? { pathLength: 1, opacity: 1 } : undefined}
            transition={{
              pathLength: { duration: reduceMotion ? 0 : PASS, delay: reduceMotion ? 0 : T_FIRST_PASS + i * PASS, ease: 'linear' },
              opacity: { duration: 0.01, delay: reduceMotion ? 0 : T_FIRST_PASS + i * PASS },
            }}
          />
        ))}

        {/* La suite : trajectoire vers le but */}
        {current && (
          <motion.line
            key={`next-${run}`}
            x1={current.x + (MID - current.x) * 0.28}
            y1={current.y - NODE_R - 1.4}
            x2={MID}
            y2={0.8}
            stroke={BALLON}
            strokeWidth={0.22}
            strokeDasharray="0.9 1.1"
            initial={{ opacity: 0 }}
            animate={{ opacity: show }}
            transition={{ duration: reduceMotion ? 0 : 0.5, delay: tEnd + (reduceMotion ? 0 : 0.25) }}
          />
        )}

        {/* Le ballon : il circule sous les points, et disparaît derrière celui qui le reçoit */}
        <motion.circle cx={ballX} cy={ballY} r={BALL_R} fill={BALLON} style={{ opacity: ballOpacity }} aria-hidden="true" />

        {/* Repère du point survolé, ou de celui qui a le ballon */}
        {focusNode && (
          <motion.circle
            key={focusNode.id}
            cx={focusNode.x}
            cy={focusNode.y}
            r={NODE_R + 1.5}
            fill="none"
            stroke={BALLON}
            strokeWidth={0.3}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: reduceMotion ? 0 : 0.2 }}
          />
        )}

        {/* Points et libellés */}
        {nodes.map((node) => {
          const isFocus = node.id === focusId;
          const strong = isFocus || node.current;
          const fill = node.current ? BALLON : isFocus ? CRAIE : PELOUSE;
          const ink = node.current ? ENCRE : isFocus ? PELOUSE : CRAIE;
          const labelX = node.x + (node.kind === 'experience' ? NODE_R + 1.9 : DIAMOND * Math.SQRT2 + 1.5);

          return (
            <motion.g
              key={`${node.id}-${run}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: show }}
              transition={{ duration: reduceMotion ? 0 : 0.25, delay: appearAt(node) }}
            >
              <a
                href={`#${node.id}`}
                className="pitch-node"
                aria-label={`${node.label}${node.sub ? `, ${node.sub}` : ''} — ${hint}`}
                onPointerEnter={() => setHover(node.id)}
                onPointerLeave={() => setHover(null)}
                onFocus={() => setHover(node.id)}
                onBlur={() => setHover(null)}
              >
                {/* Zone de clic élargie */}
                <circle cx={node.x} cy={node.y} r={4.4} fill="transparent" />

                {node.kind === 'experience' ? (
                  <>
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={NODE_R}
                      fill={fill}
                      stroke={node.current ? BALLON : CRAIE}
                      strokeWidth={0.24}
                      style={{ transition: 'fill 0.2s' }}
                    />
                    <text
                      x={node.x}
                      y={node.y}
                      dy="0.04em"
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize={2.7}
                      fill={ink}
                      style={{ fontWeight: 700, fontStretch: '75%', transition: 'fill 0.2s' }}
                    >
                      {node.n}
                    </text>
                  </>
                ) : (
                  <rect
                    x={node.x - DIAMOND}
                    y={node.y - DIAMOND}
                    width={DIAMOND * 2}
                    height={DIAMOND * 2}
                    transform={`rotate(45 ${node.x} ${node.y})`}
                    fill={isFocus ? CRAIE : PELOUSE}
                    stroke={CRAIE}
                    strokeWidth={0.24}
                    style={{ transition: 'fill 0.2s' }}
                  />
                )}

                <text
                  x={labelX}
                  y={node.y - (node.sub ? 1.3 : 0)}
                  dy="0.04em"
                  dominantBaseline="central"
                  className="pitch-label"
                  fill={node.current ? BALLON : CRAIE}
                  fillOpacity={strong ? 1 : 0.92}
                  {...halo}
                  style={{ fontWeight: strong ? 700 : 600, fontStretch: '92%' }}
                >
                  {node.label}
                </text>
                {node.sub && (
                  <text
                    x={labelX}
                    y={node.y + 1.75}
                    dy="0.04em"
                    dominantBaseline="central"
                    className="pitch-sub"
                    fill={BRUME}
                    {...halo}
                    style={{ fontWeight: 500, fontStretch: '92%' }}
                  >
                    {node.sub}
                  </text>
                )}
              </a>
            </motion.g>
          );
        })}
      </svg>

      <div className="mt-3 flex justify-center">
        <button
          type="button"
          onClick={replay}
          disabled={playing}
          className="inline-flex h-11 items-center gap-2.5 px-3 text-[0.875rem] font-semibold text-brume transition-colors hover:text-craie disabled:opacity-40 disabled:hover:text-brume"
        >
          <RotateCcw size={16} strokeWidth={2.2} aria-hidden="true" />
          {replayLabel}
        </button>
      </div>
    </div>
  );
}
