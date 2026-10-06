import type { Lang } from '../i18n';

const formats: Record<Lang, Intl.DateTimeFormat> = {
  fr: new Intl.DateTimeFormat('fr-FR', { month: 'short', year: 'numeric' }),
  en: new Intl.DateTimeFormat('en-GB', { month: 'short', year: 'numeric' }),
};

/** 'AAAA-MM' → « sept. 2025 » / "Sept 2025" */
export function formatMonth(date: string, lang: Lang): string {
  const [y, m] = date.split('-').map(Number);
  return formats[lang].format(new Date(Date.UTC(y, m - 1, 15)));
}

/** Période lisible ; `ongoing` est affiché si le poste est en cours. */
export function formatPeriod(start: string, end: string | null, lang: Lang, ongoing: string): string {
  return `${formatMonth(start, lang)} – ${end ? formatMonth(end, lang) : ongoing}`;
}

/** Découpe « texte **surligné** texte » en segments. */
export function parseMarks(text: string): { text: string; mark: boolean }[] {
  return text
    .split(/(\*\*[^*]+\*\*)/g)
    .filter(Boolean)
    .map((part) =>
      part.startsWith('**') ? { text: part.slice(2, -2), mark: true } : { text: part, mark: false },
    );
}
