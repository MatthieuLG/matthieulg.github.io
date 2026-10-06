import type { L } from '../i18n';

export interface PressItem {
  source: string;
  year: number;
  /** Titre original de l'article (en français dans les deux versions du site). */
  title: string;
  description: L;
  href: string;
  site: string;
}

export const press: PressItem[] = [
  {
    source: 'DH Les Sports',
    year: 2026,
    title:
      'Filtres datas, visionnages et feeling humain : les secrets de la nouvelle cellule de recrutement du Standard et de son développeur français',
    description: {
      fr: 'Reportage sur la structuration de la cellule data scouting du Standard de Liège et le rôle de la data dans les décisions de recrutement.',
      en: "Feature on how Standard de Liège's data scouting unit was built, and on the role of data in recruitment decisions.",
    },
    href: 'https://www.dhnet.be/sports/football/division-1a/standard/2026/04/18/filtres-datas-visionnages-et-feeling-humain-les-secrets-de-la-nouvelle-cellule-de-recrutement-du-standard-et-de-son-developpeur-francais-IFBDNGK6DFEGLA2GARFR6QNSAE/',
    site: 'dhnet.be',
  },
  {
    source: 'Ouest-France',
    year: 2024,
    title: "Avec les big data, ce Sinagot analyse l'impact des touches dans le football professionnel",
    description: {
      fr: "Interview sur la recherche présentée à l'Opta Forum 2024 à Londres, analysant l'impact stratégique des touches dans le football moderne à partir de données événementielles.",
      en: 'Interview about the research presented at the Opta Forum 2024 in London, analysing the strategic impact of throw-ins in modern football using event data.',
    },
    href: 'https://www.ouest-france.fr/bretagne/sene-56860/entretien-avec-les-big-data-ce-sinagot-analyse-limpact-des-touches-dans-le-football-professionnel-3f043ea6-fd5d-11ee-ace2-9fae4b2f67b4',
    site: 'ouest-france.fr',
  },
];
