import type { Lang } from '../i18n';

/** Typographie française : espace insécable avant « : ; ? ! » et à l'intérieur des guillemets. */
export function typo(text: string, lang: Lang = 'fr'): string {
  if (lang !== 'fr') return text;
  return text.replace(/ ([:;?!»])/g, '\u00a0$1').replace(/« /g, '«\u00a0');
}
