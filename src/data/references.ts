import type { ImageMetadata } from 'astro';
import type { L } from '../i18n';
import standard from '../assets/logos/standard-liege.png';
import parma from '../assets/logos/parma-calcio.png';
import vannes from '../assets/logos/vannes-oc.png';

export interface ReferenceGroup {
  club: string;
  logo: ImageMetadata;
  /** Championnat et saisons concernées. */
  frame: L;
  context: L;
  people: { name: string; role: L; note?: L }[];
}

export const references: ReferenceGroup[] = [
  {
    club: 'Standard de Liège',
    logo: standard,
    frame: { fr: 'Jupiler Pro League, 2025-2026', en: 'Jupiler Pro League, 2025-2026' },
    context: {
      fr: "J'interviens en tant que Data Scientist / Data Analyst Scout dans le cadre de la structuration et de la mise en place des processus data dédiés au recrutement. Je contribue au développement d'outils d'analyse et d'aide à la décision permettant d'identifier des profils de joueurs pertinents et d'optimiser les stratégies de scouting.",
      en: 'I work as Data Scientist / Data Analyst Scout, structuring and setting up the data processes dedicated to recruitment. I contribute to building analysis and decision-support tools that help identify relevant player profiles and optimise scouting strategies.',
    },
    people: [
      { name: 'Jérôme Bonnissel', role: { fr: 'Directeur du Recrutement', en: 'Head of Recruitment' } },
      { name: 'Marc Wilmots', role: { fr: 'Directeur Sportif', en: 'Sporting Director' } },
    ],
  },
  {
    club: 'Parma Calcio 1913',
    logo: parma,
    frame: { fr: 'Serie B puis Serie A, 2022-2024', en: 'Serie B then Serie A, 2022-2024' },
    context: {
      fr: "J'ai travaillé sous la direction de Sébastien Coustou et de Mathieu Lacome lors des saisons 2022-2023 et 2023-2024. J'y ai notamment contribué à un projet d'estimation de la valeur marchande des joueurs, mené des analyses statistiques ponctuelles et préparé des tables de données destinées aux projets de data visualisation. Une expérience dans un environnement professionnel exigeant, orienté performance et prise de décision.",
      en: "I worked under Sébastien Coustou and Mathieu Lacome during the 2022-2023 and 2023-2024 seasons. I contributed in particular to a project estimating players' market value, carried out ad hoc statistical analyses and prepared data tables for data visualisation projects. An experience in a demanding professional environment, focused on performance and decision-making.",
    },
    people: [
      { name: 'Sébastien Coustou', role: { fr: 'Head of Data & Analytics', en: 'Head of Data & Analytics' } },
      { name: 'Mathieu Lacome', role: { fr: 'Chief of Performance', en: 'Chief of Performance' } },
    ],
  },
  {
    club: 'Vannes Olympique Club',
    logo: vannes,
    frame: { fr: 'National 2, 2022-2023', en: 'National 2, 2022-2023' },
    context: {
      fr: "J'ai collaboré avec Sullivan Coppalle lors de la saison 2022-2023. J'étais chargé de concevoir et transmettre chaque semaine un tableau de bord de suivi de la charge externe des joueurs, intégrant des objectifs individualisés afin d'optimiser la performance et la préparation physique.",
      en: "I worked with Sullivan Coppalle during the 2022-2023 season. I was responsible for designing and delivering a weekly dashboard tracking players' external load, with individualised targets to optimise performance and physical preparation.",
    },
    people: [
      {
        name: 'Sullivan Coppalle',
        role: { fr: 'Préparateur physique et entraîneur adjoint', en: 'Fitness coach and assistant coach' },
      },
    ],
  },
];
