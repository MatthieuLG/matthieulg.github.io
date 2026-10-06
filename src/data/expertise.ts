import type { L } from '../i18n';

/** Ce que la data peut apporter : les quatre maillons de la chaîne, dans l'ordre. */
export const services: { title: L; text: L }[] = [
  {
    title: { fr: 'Collecte & structuration', en: 'Collection & structuring' },
    text: {
      fr: 'Systèmes pour récupérer, nettoyer et organiser les données de performance, physiques et événementielles.',
      en: 'Systems to retrieve, clean and organise performance, physical and event data.',
    },
  },
  {
    title: { fr: 'Analyse des performances', en: 'Performance analysis' },
    text: {
      fr: "Identification des tendances, forces, faiblesses et leviers d'amélioration individuels et collectifs.",
      en: 'Identifying trends, strengths, weaknesses and levers for individual and collective improvement.',
    },
  },
  {
    title: { fr: 'Indicateurs avancés', en: 'Advanced indicators' },
    text: {
      fr: 'Métriques, scores et modèles prédictifs pour mieux comprendre et anticiper les performances.',
      en: 'Metrics, scores and predictive models to better understand and anticipate performance.',
    },
  },
  {
    title: { fr: 'Visualisation percutante', en: 'Impactful visualisation' },
    text: {
      fr: 'Dashboards lisibles et directement utiles pour joueurs, staff technique et direction sportive.',
      en: 'Clear dashboards that are directly useful to players, coaching staff and sporting management.',
    },
  },
];

export const skills: { group: L; items: L<string[]> }[] = [
  {
    group: { fr: 'Gestion & structuration des données', en: 'Data management & structuring' },
    items: {
      fr: ['Web scraping', 'Bases de données', 'Requêtage SQL', 'Automatisation de flux', 'API'],
      en: ['Web scraping', 'Databases', 'SQL querying', 'Workflow automation', 'APIs'],
    },
  },
  {
    group: { fr: 'Analyse & modélisation', en: 'Analysis & modelling' },
    items: {
      fr: ['KPI avancés', 'Machine Learning', 'Deep Learning', 'Statistiques avancées', 'NLP'],
      en: ['Advanced KPIs', 'Machine Learning', 'Deep Learning', 'Advanced statistics', 'NLP'],
    },
  },
  {
    group: { fr: 'Visualisation & aide à la décision', en: 'Visualisation & decision support' },
    items: {
      fr: ['Power BI', 'Tableau', 'Streamlit', 'RShiny', 'Qlik Sense'],
      en: ['Power BI', 'Tableau', 'Streamlit', 'RShiny', 'Qlik Sense'],
    },
  },
  {
    group: { fr: 'Langages & outils techniques', en: 'Programming languages & tools' },
    items: {
      fr: ['Python', 'SQL', 'R', 'Power Query'],
      en: ['Python', 'SQL', 'R', 'Power Query'],
    },
  },
  {
    group: { fr: 'Sources de données sportives', en: 'Sports data sources' },
    items: {
      fr: ['Opta (Stats Perform)', 'StatsBomb', 'Wyscout', 'SkillCorner', 'GPS tracking'],
      en: ['Opta (Stats Perform)', 'StatsBomb', 'Wyscout', 'SkillCorner', 'GPS tracking'],
    },
  },
  {
    group: { fr: 'Langues', en: 'Spoken languages' },
    items: {
      fr: ['Anglais B2', 'Espagnol B1'],
      en: ['French (native)', 'English B2', 'Spanish B1'],
    },
  },
];
