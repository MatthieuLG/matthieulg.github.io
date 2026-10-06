import type { L } from '../i18n';

export const profile = {
  name: 'Matthieu Le Gall',
  firstName: 'Matthieu',
  lastName: 'Le Gall',
  role: 'Data Scientist & Data Analyst Scout',
  club: 'Standard de Liège',
  intro: {
    fr: "Diplômé ingénieur Big Data & IA, je mets la donnée au service du football : scouting, recrutement et performance. Au Standard de Liège, je construis de zéro l'écosystème data du recrutement, des pipelines StatsBomb et SkillCorner aux modèles d'évaluation de joueurs et aux outils d'aide à la décision du staff. Passé par Parma Calcio 1913 et le Vannes OC, formé par trois ans d'IA au Ministère des Armées, je garde la même exigence : transformer des données brutes en décisions claires.",
    en: "A graduate engineer in Big Data & AI, I put data to work for football: scouting, recruitment and performance. At Standard de Liège, I am building the recruitment department's data ecosystem from scratch, from StatsBomb and SkillCorner pipelines to player evaluation models and decision-support tools for the staff. With experience at Parma Calcio 1913 and Vannes OC, and three years of AI work at the French Ministry of Armed Forces, I hold to one standard: turning raw data into clear decisions.",
  } as L,
  email: 'legallmatthieu@gmx.fr',
  linkedin: 'https://www.linkedin.com/in/matthieu-le-gall/',
  linkedinLabel: 'Matthieu Le Gall',
  /** Un PDF par langue. La version anglaise reste à fournir : les deux pointent vers le même fichier. */
  cv: {
    fr: '/docs/CV_MatthieuLeGall.pdf',
    en: '/docs/CV_MatthieuLeGall.pdf',
  } as L,
  location: { fr: 'Europe · Mobile', en: 'Europe · Open to relocation' } as L,
  licence: { fr: 'Permis B – Véhiculé', en: 'Category B – Own vehicle' } as L,
  award: {
    label: {
      fr: "Lauréat de l'Opta Forum Research 2024 (Stats Perform), catégorie Event Data",
      en: 'Winner of the Opta Forum Research 2024 (Stats Perform), Event Data category',
    } as L,
    href: 'https://vimeo.com/932522182/0e5b88c070',
    linkLabel: { fr: 'Voir la présentation', en: 'Watch the presentation' } as L,
  },
  contact: {
    title: { fr: 'Discutons data & sport', en: "Let's talk data & sport" } as L,
    text: {
      fr: 'Ouvert à tout échange en analytics sportives, scouting data-driven ou performance analytics dans le sport.',
      en: 'Open to any conversation about sports analytics, data-driven scouting or performance analytics in sport.',
    } as L,
  },
  meta: {
    title: {
      fr: 'Matthieu Le Gall — Data & Analytics Sportives',
      en: 'Matthieu Le Gall — Sports Data & Analytics',
    } as L,
    description: {
      fr: 'Ingénieur Big Data & IA spécialisé en analytics sportives. Expériences au Standard de Liège, Parma Calcio, Vannes OC. Lauréat Opta Forum 2024.',
      en: 'Big Data & AI engineer specialised in sports analytics. Experience at Standard de Liège, Parma Calcio and Vannes OC. Opta Forum 2024 winner.',
    } as L,
  },
};

/** Sections de la page, dans l'ordre. Les identifiants sont communs aux deux langues. */
export const sections: { id: string; label: L }[] = [
  { id: 'parcours', label: { fr: 'Parcours', en: 'Career' } },
  { id: 'projets', label: { fr: 'Projets', en: 'Projects' } },
  { id: 'expertise', label: { fr: 'Expertise', en: 'Expertise' } },
  { id: 'references', label: { fr: 'Références', en: 'References' } },
  { id: 'presse', label: { fr: 'Presse', en: 'Press' } },
  { id: 'contact', label: { fr: 'Contact', en: 'Contact' } },
];
