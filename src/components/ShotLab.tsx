import { motion, useReducedMotion } from 'framer-motion';
import { ChevronDown, RotateCw } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { DemoText } from '../i18n/demo';
import type { Lang } from '../i18n';
import {
  availableCompetitions,
  competitions,
  displayMinute,
  loadMatch,
  loadMatches,
  type ApiCall,
  type MatchData,
  type MatchInfo,
  type Shot,
  type Side,
} from '../lib/statsbomb';

interface Props {
  t: DemoText;
  lang: Lang;
}

const CRAIE = 'var(--color-craie)';
const PELOUSE = 'var(--color-pelouse)';
const BALLON = 'var(--color-ballon)';
const BRUME = 'var(--color-brume)';

const ON_TARGET = ['Goal', 'Saved', 'Saved to Post'];
const radius = (xg: number) => 0.9 + Math.sqrt(xg) * 2.7;

/** Largeur réelle d'un élément, pour dessiner un graphique à la bonne échelle. */
function useWidth<T extends HTMLElement>() {
  const [node, setNode] = useState<T | null>(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    if (!node) return;
    const observer = new ResizeObserver(([entry]) => setWidth(Math.round(entry.contentRect.width)));
    observer.observe(node);
    return () => observer.disconnect();
  }, [node]);
  return [setNode, width] as const;
}

/* ───────────── Terrain (repère StatsBomb : 120 × 80) ───────────── */

function PitchLines() {
  const line = { vectorEffect: 'non-scaling-stroke' as const };
  return (
    <g fill="none" stroke={CRAIE} strokeOpacity={0.26} strokeWidth={1}>
      <rect x={0} y={0} width={120} height={80} {...line} />
      <line x1={60} y1={0} x2={60} y2={80} {...line} />
      <circle cx={60} cy={40} r={10} {...line} />
      <rect x={0} y={18} width={18} height={44} {...line} />
      <rect x={102} y={18} width={18} height={44} {...line} />
      <rect x={0} y={30} width={6} height={20} {...line} />
      <rect x={114} y={30} width={6} height={20} {...line} />
      <rect x={-1.6} y={36} width={1.6} height={8} {...line} />
      <rect x={120} y={36} width={1.6} height={8} {...line} />
      <path d="M 18 32 A 10 10 0 0 1 18 48" {...line} />
      <path d="M 102 32 A 10 10 0 0 0 102 48" {...line} />
    </g>
  );
}

export default function ShotLab({ t, lang }: Props) {
  const reduceMotion = useReducedMotion();
  const [comps, setComps] = useState(competitions);
  const [comp, setComp] = useState(competitions[0].id);
  const [matches, setMatches] = useState<MatchInfo[] | null>(null);
  const [matchesCall, setMatchesCall] = useState<ApiCall | null>(null);
  const [matchId, setMatchId] = useState<number | null>(null);
  const [data, setData] = useState<MatchData | null>(null);
  const [shownId, setShownId] = useState<number | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [attempt, setAttempt] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [hover, setHover] = useState<string | null>(null);
  const cache = useRef(new Map<number, MatchData>());
  const [raceRef, raceWidth] = useWidth<HTMLDivElement>();

  const int = useMemo(() => new Intl.NumberFormat(lang), [lang]);
  const dec = useMemo(() => new Intl.NumberFormat(lang, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), [lang]);

  useEffect(() => setComps(availableCompetitions()), []);

  /* 1. Liste des matchs de la compétition */
  useEffect(() => {
    let cancelled = false;
    setStatus('loading');
    setMatches(null);
    setMatchesCall(null);
    loadMatches(comp)
      .then(({ matches: list, call }) => {
        if (cancelled) return;
        setMatches(list);
        setMatchesCall(call);
        setMatchId(list[0]?.id ?? null);
      })
      .catch(() => !cancelled && setStatus('error'));
    return () => {
      cancelled = true;
    };
  }, [comp, attempt]);

  /* 2. Événements du match sélectionné */
  const match = matches?.find((m) => m.id === matchId) ?? null;
  useEffect(() => {
    if (!match) return;
    let cancelled = false;
    const done = (d: MatchData) => {
      if (cancelled) return;
      setData(d);
      setShownId(match.id);
      setSelected(null);
      setHover(null);
      setStatus('ready');
    };
    const cached = cache.current.get(match.id);
    if (cached) {
      done(cached);
      return;
    }
    setStatus('loading');
    loadMatch(match)
      .then((d) => {
        cache.current.set(match.id, d);
        done(d);
      })
      .catch(() => !cancelled && setStatus('error'));
    return () => {
      cancelled = true;
    };
  }, [match, attempt]);

  /* ── Valeurs dérivées ── */
  const shown = matches?.find((m) => m.id === shownId) ?? null;
  const shots = data?.shots ?? [];
  const stat = (side: Side) => {
    const own = shots.filter((s) => s.side === side);
    return {
      xg: own.reduce((sum, s) => sum + s.xg, 0),
      shots: own.length,
      onTarget: own.filter((s) => ON_TARGET.includes(s.outcome)).length,
    };
  };
  const home = stat('home');
  const away = stat('away');
  const teamName = (side: Side) => (shown ? shown[side].name : '');
  const chances = useMemo(() => [...shots].sort((a, b) => b.xg - a.xg).slice(0, 5), [shots]);
  const focus = shots.find((s) => s.id === (hover ?? selected)) ?? null;
  const stale = status === 'loading' && data !== null;

  const describe = (s: Shot) => {
    const parts = [s.type !== 'Open Play' ? (t.types[s.type] ?? s.type) : null, t.bodyParts[s.bodyPart] ?? s.bodyPart, t.outcomes[s.outcome] ?? s.outcome];
    return parts.filter(Boolean).join(', ');
  };

  /* ── Journal des appels ── */
  const unit = (call: ApiCall) => {
    if (call.path.startsWith('matches')) return `${int.format(call.count)} ${t.unitMatches}`;
    if (call.path.startsWith('lineups')) return `${int.format(call.count)} ${t.unitTeams}`;
    return `${int.format(call.count)} ${t.unitEvents} → ${int.format(shots.length)} ${t.unitShots}`;
  };
  const log: { path: string; result: string; time: string }[] = [];
  if (matchesCall) log.push({ path: matchesCall.path, result: unit(matchesCall), time: matchesCall.snapshot ? t.snapshot : `${int.format(matchesCall.ms)} ms` });
  else log.push({ path: `matches/${comp}.json`, result: status === 'error' ? '—' : t.pending, time: '' });
  if (match) {
    if (status === 'ready' && data && shownId === match.id) {
      data.calls.forEach((c) => log.push({ path: c.path, result: unit(c), time: c.snapshot ? t.snapshot : `${int.format(c.ms)} ms` }));
    } else {
      ['events', 'lineups'].forEach((kind) => log.push({ path: `${kind}/${match.id}.json`, result: status === 'error' ? '—' : t.pending, time: '' }));
    }
  }

  /* ── Course aux xG ── */
  const race = useMemo(() => {
    if (!data || raceWidth === 0) return null;
    const W = raceWidth;
    const H = W < 520 ? 230 : 270;
    const m = { l: 30, r: 12, t: 12, b: 26 };
    const top = Math.max(1, Math.ceil(Math.max(home.xg, away.xg) * 2) / 2);
    const x = (sec: number) => m.l + (sec / data.duration) * (W - m.l - m.r);
    const y = (v: number) => H - m.b - (v / top) * (H - m.t - m.b);
    const build = (side: Side) => {
      let cum = 0;
      let d = `M ${x(0)} ${y(0)}`;
      const goals: { x: number; y: number }[] = [];
      for (const s of data.shots.filter((shot) => shot.side === side)) {
        d += ` H ${x(s.t).toFixed(1)}`;
        cum += s.xg;
        d += ` V ${y(cum).toFixed(1)}`;
        if (s.goal) goals.push({ x: x(s.t), y: y(cum) });
      }
      d += ` H ${x(data.duration)}`;
      // Buts contre son camp : comptés au score, sans xG.
      for (const og of data.ownGoals.filter((o) => o.side === side)) {
        const before = data.shots.filter((s) => s.side === side && s.t <= og.t).reduce((sum, s) => sum + s.xg, 0);
        goals.push({ x: x(og.t), y: y(before) });
      }
      return { d, goals, endY: y(cum) };
    };
    const step = top <= 2 ? 0.5 : 1;
    const yTicks = Array.from({ length: Math.floor(top / step) + 1 }, (_, i) => i * step);
    const labels = [t.halfTime, "90'", "105'", "120'"];
    const xTicks = [{ sec: 0, label: "0'" }, ...data.periodEnds.map((sec, i) => ({ sec, label: labels[i] }))];
    return { W, H, m, x, y, home: build('home'), away: build('away'), yTicks, xTicks };
  }, [data, raceWidth, home.xg, away.xg, t.halfTime]);

  const instant = reduceMotion ? { duration: 0 } : undefined;

  return (
    <div className="@container">
      {/* ── Sélecteurs ── */}
      <div className="grid gap-5 sm:grid-cols-2 lg:max-w-[52rem]">
        <label className="block">
          <span className="text-[0.875rem] text-brume">{t.competition}</span>
          <span className="relative mt-1.5 block">
            <select className="field" value={comp} onChange={(e) => setComp(e.target.value)}>
              {comps.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-brume" size={18} aria-hidden="true" />
          </span>
        </label>

        <label className="block">
          <span className="text-[0.875rem] text-brume">{t.match}</span>
          <span className="relative mt-1.5 block">
            <select
              className="field"
              value={matchId ?? ''}
              disabled={!matches}
              onChange={(e) => setMatchId(Number(e.target.value))}
            >
              {!matches && <option value="">{t.pending}</option>}
              {matches &&
                [...new Set(matches.map((m) => m.stage))].map((stage) => (
                  <optgroup key={stage} label={t.stages[stage] ?? stage}>
                    {matches
                      .filter((m) => m.stage === stage)
                      .map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.home.name} {m.home.score}–{m.away.score} {m.away.name}
                        </option>
                      ))}
                  </optgroup>
                ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-brume" size={18} aria-hidden="true" />
          </span>
        </label>
      </div>

      {/* ── Journal des appels ── */}
      <ol aria-label={t.calls} className="mt-6 bg-pelouse-ombre px-4 py-3.5 text-[0.875rem] sm:px-5">
        {log.map((row) => (
          <li
            key={row.path}
            className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-3 gap-y-0.5 py-1.5 sm:grid-cols-[2.5rem_minmax(0,1.1fr)_minmax(0,1fr)_5.5rem]"
          >
            <span className="font-semibold text-ballon-clair">GET</span>
            <span className="truncate font-medium text-craie">/{row.path}</span>
            <span className="col-start-2 text-brume sm:col-start-auto">{row.result}</span>
            <span className="figures col-start-2 text-brume sm:col-start-auto sm:text-right">{row.time}</span>
          </li>
        ))}
      </ol>

      {status === 'error' && (
        <div role="alert" className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4 border-l-2 border-ballon pl-5">
          <p className="max-w-[52ch]">{t.error}</p>
          <button type="button" className="btn btn-ligne" onClick={() => setAttempt((n) => n + 1)}>
            <RotateCw size={17} aria-hidden="true" />
            {t.retry}
          </button>
        </div>
      )}

      {status === 'loading' && !data && <p className="mt-10 text-brume">{t.loading}</p>}

      {data && shown && (
        <div className={`transition-opacity duration-200 ${stale ? 'opacity-40' : ''}`} aria-busy={stale}>
          {/* ── Score et statistiques ── */}
          <div className="mt-12 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-x-4 sm:gap-x-9 lg:mt-16">
            <p className="display text-balance text-right text-[clamp(1.05rem,4.4cqi,2.75rem)] leading-[0.95]">{shown.home.name}</p>
            <p className="figures whitespace-nowrap text-[clamp(2.75rem,9cqi,5.5rem)] font-bold leading-none">
              {shown.home.score}
              <span className="mx-[0.18em] text-brume">–</span>
              {shown.away.score}
            </p>
            <p className="display text-balance text-[clamp(1.05rem,4.4cqi,2.75rem)] leading-[0.95]">{shown.away.name}</p>
          </div>
          {data.shootout && (
            <p className="mt-3 text-center text-[0.9375rem] text-brume">
              {t.shootout} <span className="figures ml-1 font-semibold text-craie">{data.shootout.home} – {data.shootout.away}</span>
            </p>
          )}

          <dl className="mx-auto mt-8 max-w-[44rem] space-y-2.5">
            {[
              { label: t.xg, a: home.xg, b: away.xg, fmt: (v: number) => dec.format(v) },
              { label: t.shots, a: home.shots, b: away.shots, fmt: (v: number) => int.format(v) },
              { label: t.onTarget, a: home.onTarget, b: away.onTarget, fmt: (v: number) => int.format(v) },
            ].map((row) => {
              const max = Math.max(row.a, row.b, 0.0001);
              const bar = (v: number, lead: boolean) => (
                <span className="block h-[3px]" style={{ width: `${(v / max) * 100}%`, background: lead ? CRAIE : 'color-mix(in srgb, var(--color-brume) 55%, transparent)' }} />
              );
              return (
                <div key={row.label} className="grid grid-cols-[minmax(0,1fr)_8.5rem_minmax(0,1fr)] items-center gap-x-3">
                  <dd className="flex items-center justify-end gap-3">
                    <span className="flex flex-1 justify-end">{bar(row.a, row.a >= row.b)}</span>
                    <span className="figures w-12 text-right text-[1.1875rem] font-semibold">{row.fmt(row.a)}</span>
                  </dd>
                  <dt className="text-center text-[0.875rem] text-brume">{row.label}</dt>
                  <dd className="flex items-center gap-3">
                    <span className="figures w-12 text-[1.1875rem] font-semibold">{row.fmt(row.b)}</span>
                    <span className="flex flex-1">{bar(row.b, row.b >= row.a)}</span>
                  </dd>
                </div>
              );
            })}
          </dl>

          {/* ── Shot map + grosses occasions ── */}
          <div key={shown.id} className="mt-12 grid gap-x-14 gap-y-14 lg:mt-16 lg:grid-cols-[minmax(0,1.9fr)_minmax(0,1fr)]">
            <div>
            <div className="flex justify-between gap-6 text-[0.875rem] text-brume">
              <span>{t.shotsOf} {shown.away.name}</span>
              <span className="text-right">{t.shotsOf} {shown.home.name}</span>
            </div>
            <svg viewBox="-2.5 -1.5 125 83" className="mt-2 block w-full select-none" role="group" aria-label={t.mapLabel}>
              <PitchLines />

              {focus && (
                <line x1={focus.x} y1={focus.y} x2={focus.endX} y2={focus.endY} stroke={BALLON} strokeWidth={0.35} strokeDasharray="1 0.9" />
              )}

              {[...shots]
                .sort((a, b) => b.xg - a.xg)
                .map((s) => {
                  const order = shots.indexOf(s);
                  const isFocus = focus?.id === s.id;
                  const onTarget = ON_TARGET.includes(s.outcome);
                  const r = radius(s.xg);
                  return (
                    <motion.circle
                      key={s.id}
                      cx={s.x}
                      cy={s.y}
                      initial={{ r: reduceMotion ? r : 0 }}
                      animate={{ r }}
                      transition={instant ?? { duration: 0.28, delay: 0.15 + (order / Math.max(shots.length, 1)) * 1.1, ease: 'easeOut' }}
                      fill={s.goal ? BALLON : onTarget ? CRAIE : PELOUSE}
                      fillOpacity={s.goal ? 1 : onTarget ? 0.78 : 0.9}
                      stroke={isFocus ? BALLON : s.goal ? BALLON : CRAIE}
                      strokeOpacity={isFocus || s.goal ? 1 : 0.75}
                      strokeWidth={isFocus ? 0.7 : 0.3}
                      className="cursor-pointer outline-none"
                      role="button"
                      tabIndex={0}
                      aria-label={`${displayMinute(s.period, s.minute)} ${s.player}, ${teamName(s.side)}, xG ${dec.format(s.xg)}, ${describe(s)}`}
                      onPointerEnter={() => setHover(s.id)}
                      onPointerLeave={() => setHover(null)}
                      onFocus={() => setHover(s.id)}
                      onBlur={() => setHover(null)}
                      onClick={() => setSelected(s.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setSelected(s.id);
                        }
                      }}
                    />
                  );
                })}
            </svg>

            {/* Détail du tir pointé */}
            <div aria-live="polite" className="mt-4 grid min-h-[4.25rem] grid-cols-[minmax(0,1fr)_auto] items-center gap-x-6 border-y border-craie/15 py-3">
              {focus ? (
                <>
                  <p className="leading-[1.35]">
                    <span className="figures mr-3 text-[1.375rem] font-bold">{displayMinute(focus.period, focus.minute)}</span>
                    <span className="text-[1.0625rem] font-semibold">{focus.player}</span>
                    <span className="ml-2 text-brume">{teamName(focus.side)}</span>
                    <span className="block text-[0.9375rem] text-brume">{describe(focus)}</span>
                  </p>
                  <p className="text-right leading-none">
                    <span className={`figures text-[2rem] font-bold ${focus.goal ? 'text-ballon' : ''}`}>{dec.format(focus.xg)}</span>
                    <span className="ml-1.5 text-[0.875rem] text-brume">xG</span>
                  </p>
                </>
              ) : (
                <p className="col-span-2 text-brume">{t.pick}</p>
              )}
            </div>

            <ul className="mt-4 flex flex-wrap gap-x-7 gap-y-2 text-[0.8125rem] text-brume">
              <li className="flex items-center gap-2"><span className="size-3 rounded-full bg-ballon" aria-hidden="true" />{t.legendGoal}</li>
              <li className="flex items-center gap-2"><span className="size-3 rounded-full bg-craie/80" aria-hidden="true" />{t.legendOnTarget}</li>
              <li className="flex items-center gap-2"><span className="size-3 rounded-full border-[1.5px] border-craie/75" aria-hidden="true" />{t.legendOff}</li>
              <li>{t.legendSize}</li>
            </ul>
            </div>

            <section>
              <h2 className="text-[1.25rem] font-bold [font-stretch:104%]">{t.chancesTitle}</h2>
              <ol className="mt-5 border-b border-craie/15">
                {chances.map((s) => {
                  const on = focus?.id === s.id;
                  return (
                    <li key={s.id} className="border-t border-craie/15">
                      <button
                        type="button"
                        onClick={() => setSelected(s.id)}
                        onPointerEnter={() => setHover(s.id)}
                        onPointerLeave={() => setHover(null)}
                        onFocus={() => setHover(s.id)}
                        onBlur={() => setHover(null)}
                        aria-pressed={selected === s.id}
                        className="grid w-full grid-cols-[3.25rem_minmax(0,1fr)_auto] items-baseline gap-x-3 py-3.5 text-left"
                      >
                        <span className="figures text-[1.0625rem] font-semibold text-brume">{displayMinute(s.period, s.minute)}</span>
                        <span className="min-w-0">
                          <span className={`block font-semibold transition-colors ${on ? 'text-ballon-clair' : ''}`}>{s.player}</span>
                          <span className="block text-[0.875rem] text-brume">
                            {teamName(s.side)}, {(t.outcomes[s.outcome] ?? s.outcome).toLowerCase()}
                          </span>
                        </span>
                        <span className={`figures text-[1.375rem] font-bold ${s.goal ? 'text-ballon' : ''}`}>{dec.format(s.xg)}</span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </section>
          </div>

          {/* ── Course aux xG ── */}
          <div className="mt-16 lg:mt-20">
            <section>
              <h2 className="text-[1.25rem] font-bold [font-stretch:104%]">{t.raceTitle}</h2>
              <p className="mt-1.5 text-[0.9375rem] text-brume">{t.raceText}</p>
              <ul className="mt-5 flex flex-wrap gap-x-7 gap-y-1.5 text-[0.9375rem]">
                <li className="flex items-center gap-2.5">
                  <span className="h-[2.5px] w-6 bg-craie" aria-hidden="true" />
                  <span className="font-semibold">{shown.home.name}</span>
                  <span className="figures text-brume">{dec.format(home.xg)}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="h-[2.5px] w-6 bg-brume/70" aria-hidden="true" />
                  <span className="font-semibold">{shown.away.name}</span>
                  <span className="figures text-brume">{dec.format(away.xg)}</span>
                </li>
              </ul>

              <div ref={raceRef} className="mt-4">
                {race && (
                  <svg key={shown.id} width={race.W} height={race.H} className="block" aria-hidden="true">
                    {race.yTicks.map((v) => (
                      <g key={v}>
                        <line x1={race.m.l} x2={race.W - race.m.r} y1={race.y(v)} y2={race.y(v)} stroke={CRAIE} strokeOpacity={v === 0 ? 0.4 : 0.1} />
                        <text x={race.m.l - 8} y={race.y(v)} textAnchor="end" dominantBaseline="central" fontSize={12} fill={BRUME} style={{ fontStretch: '75%' }}>
                          {v % 1 === 0 ? v : dec.format(v).replace(/0$/, '')}
                        </text>
                      </g>
                    ))}
                    {race.xTicks.map((tick, i) => (
                      <g key={tick.sec}>
                        {i > 0 && i < race.xTicks.length - 1 && (
                          <line x1={race.x(tick.sec)} x2={race.x(tick.sec)} y1={race.m.t} y2={race.H - race.m.b} stroke={CRAIE} strokeOpacity={0.16} strokeDasharray="3 4" />
                        )}
                        <text
                          x={race.x(tick.sec)}
                          y={race.H - 6}
                          textAnchor={i === 0 ? 'start' : i === race.xTicks.length - 1 ? 'end' : 'middle'}
                          fontSize={12}
                          fill={BRUME}
                          style={{ fontStretch: '75%' }}
                        >
                          {tick.label}
                        </text>
                      </g>
                    ))}
                    {(['away', 'home'] as const).map((side) => (
                      <g key={side}>
                        <motion.path
                          d={race[side].d}
                          fill="none"
                          stroke={side === 'home' ? CRAIE : BRUME}
                          strokeOpacity={side === 'home' ? 1 : 0.7}
                          strokeWidth={side === 'home' ? 2.25 : 2}
                          strokeLinejoin="round"
                          initial={{ pathLength: reduceMotion ? 1 : 0 }}
                          animate={{ pathLength: 1 }}
                          transition={instant ?? { duration: 1.25, delay: 0.15, ease: 'linear' }}
                        />
                        {race[side].goals.map((g, i) => (
                          <motion.circle
                            key={i}
                            cx={g.x}
                            cy={g.y}
                            r={5}
                            fill={BALLON}
                            stroke={PELOUSE}
                            strokeWidth={2}
                            initial={{ opacity: reduceMotion ? 1 : 0 }}
                            animate={{ opacity: 1 }}
                            transition={instant ?? { duration: 0.2, delay: 0.15 + ((g.x - race.m.l) / (race.W - race.m.l - race.m.r)) * 1.25 }}
                          />
                        ))}
                      </g>
                    ))}
                  </svg>
                )}
              </div>
            </section>
          </div>
        </div>
      )}

      <p className="mt-14 text-[0.875rem] text-brume">
        {t.source}{' '}
        <a className="link text-craie" href="https://github.com/statsbomb/open-data" target="_blank" rel="noopener">
          {t.sourceLink}
        </a>
      </p>
    </div>
  );
}
