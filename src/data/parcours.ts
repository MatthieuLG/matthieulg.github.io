import type { ImageMetadata } from 'astro';
import type { L } from '../i18n';
import standard from '../assets/logos/standard-liege.png';
import datatim from '../assets/logos/datatim.png';
import armees from '../assets/logos/ministere-armees.png';
import parma from '../assets/logos/parma-calcio.png';
import vannes from '../assets/logos/vannes-oc.png';
import usc from '../assets/logos/union-sport-cycle.png';

/**
 * Dates au format `AAAA-MM`. `end: null` = poste en cours.
 * Dans `highlights`, les termes entre **double astérisque** sont surlignés.
 * `pitch` place le point sur le terrain : `x` en mètres sur la largeur (0 à 68),
 * la position en longueur vient de l'année de début (expérience) ou d'obtention (diplôme).
 */
export const contracts = {
  cdi: { fr: 'CDI', en: 'Permanent' },
  alternance: { fr: 'Alternance', en: 'Work-study' },
  stage: { fr: 'Stage', en: 'Internship' },
  independant: { fr: 'Indépendant', en: 'Freelance' },
} satisfies Record<string, L>;

export interface Experience {
  id: string;
  /** Rang chronologique, 1 = première expérience. */
  order: number;
  role: L;
  org: L;
  place: L;
  contract: keyof typeof contracts;
  start: string;
  end: string | null;
  logo: ImageMetadata;
  highlights: L<string[]>;
  pitch: { x: number; label: L };
}

export interface Formation {
  id: string;
  title: L;
  school: string;
  place: string;
  level?: L;
  startYear: number;
  endYear: number;
  description?: L;
  /** Sur le terrain : niveau en première ligne, diplôme en seconde. */
  pitch: { x: number; label: L; sub?: L };
}

const same = (s: string): L => ({ fr: s, en: s });

export const experiences: Experience[] = [
  {
    id: 'standard-liege',
    order: 6,
    role: same('Data Scientist & Data Analyst Scout'),
    org: same('Standard de Liège'),
    place: { fr: 'Liège, Belgique', en: 'Liège, Belgium' },
    contract: 'cdi',
    start: '2025-09',
    end: null,
    logo: standard,
    highlights: {
      fr: [
        "Construction de zéro de l'écosystème data scouting : collecte, traitement et consolidation des données **StatsBomb** & **SkillCorner**.",
        "Développement de **modèles d'évaluation de joueurs** et d'outils de comparaison de profils pour le staff recrutement.",
        "Dashboards et visualisations sous **Power BI** et **Streamlit** pour l'aide à la décision.",
        'Pipelines automatisés de **matching multi-fournisseurs** (joueurs, équipes, saisons, compétitions).',
        'Application interne Streamlit : exploration des performances, **watchlists**, analyse des matchs à venir.',
      ],
      en: [
        'Building the scouting data ecosystem from scratch: collection, processing and consolidation of **StatsBomb** & **SkillCorner** data.',
        'Development of **player evaluation models** and profile comparison tools for the recruitment staff.',
        'Dashboards and visualisations in **Power BI** and **Streamlit** to support decision-making.',
        'Automated **multi-provider matching** pipelines (players, teams, seasons, competitions).',
        'Internal Streamlit application: performance exploration, **watchlists**, upcoming match analysis.',
      ],
    },
    pitch: { x: 33, label: same('Standard de Liège') },
  },
  {
    id: 'datatim',
    order: 5,
    role: {
      fr: 'Data Scientist & Chargé de Projets Décisionnels',
      en: 'Data Scientist & BI Project Officer',
    },
    org: same('Datatim'),
    place: same('Rennes, France'),
    contract: 'cdi',
    start: '2024-12',
    end: '2025-08',
    logo: datatim,
    highlights: {
      fr: [
        'Accompagnement de **PME** dans la mise en place de solutions décisionnelles : architecture data, ETL, automatisation, IA.',
        'Conception de **rapports interactifs** et tableaux de bord, consolidation et maintenance des solutions.',
        'Veille technologique active sur les outils **BI & IA**.',
      ],
      en: [
        'Supporting **SMEs** in setting up business intelligence solutions: data architecture, ETL, automation, AI.',
        'Design of **interactive reports** and dashboards, consolidation and maintenance of the solutions.',
        'Active technology watch on **BI & AI** tools.',
      ],
    },
    pitch: { x: 38, label: same('Datatim') },
  },
  {
    id: 'ministere-armees',
    order: 2,
    role: { fr: 'Apprenti Data Scientist', en: 'Apprentice Data Scientist' },
    org: { fr: 'Ministère des Armées', en: 'French Ministry of Armed Forces' },
    place: same('Bruz, France'),
    contract: 'alternance',
    start: '2021-10',
    end: '2024-09',
    logo: armees,
    highlights: {
      fr: [
        'Démonstrateur de **Machine Learning** pour le matching automatique CV / fiche de poste, dashboard QlikSense associé.',
        'Démonstrateur de **Deep Learning** pour la reconnaissance automatique de bateaux sur images satellitaires.',
        'Démonstrateur de **Deep Learning** pour la détection de voix Deepfake, interface interactive Streamlit.',
        "Contribution au projet **MatchCV** (Programme 10% — DINUM x Insee) pour faciliter l'accès à l'emploi public.",
      ],
      en: [
        '**Machine Learning** demonstrator for automatic CV / job description matching, with its QlikSense dashboard.',
        '**Deep Learning** demonstrator for automatic ship recognition in satellite imagery.',
        '**Deep Learning** demonstrator for deepfake voice detection, with an interactive Streamlit interface.',
        'Contribution to the **MatchCV** project (Programme 10% — DINUM x Insee) to make public-sector jobs more accessible.',
      ],
    },
    pitch: { x: 30, label: { fr: 'Ministère des Armées', en: 'Ministry of Armed Forces' } },
  },
  {
    id: 'parma-calcio',
    order: 4,
    role: { fr: 'Stagiaire Data Scientist', en: 'Data Scientist Intern' },
    org: same('Parma Calcio 1913'),
    place: { fr: 'Parme, Italie', en: 'Parma, Italy' },
    contract: 'stage',
    start: '2023-05',
    end: '2023-08',
    logo: parma,
    highlights: {
      fr: [
        "Conception d'un modèle **XGBoost** d'estimation de la valeur marchande des joueurs lors d'un transfert.",
        'Préparation des données via requêtes **SQL**, optimisation et ajustement des hyperparamètres.',
        "Réalisation d'une **application Streamlit** interactive et documentation complète du projet.",
      ],
      en: [
        "Design of an **XGBoost** model estimating players' market value at the time of a transfer.",
        'Data preparation through **SQL** queries, optimisation and hyperparameter tuning.',
        'Development of an interactive **Streamlit application** and full project documentation.',
      ],
    },
    pitch: { x: 30.5, label: same('Parma Calcio 1913') },
  },
  {
    id: 'vannes-oc',
    order: 3,
    role: same('Data Analyst'),
    org: same('Vannes Olympique Club'),
    place: same('Vannes, France'),
    contract: 'independant',
    start: '2022-07',
    end: '2023-06',
    logo: vannes,
    highlights: {
      fr: [
        'Analyse des données **GPS** pour évaluer la performance et la charge externe des joueurs.',
        'Tableau de bord **Power BI** hebdomadaire avec objectifs individualisés par joueur.',
      ],
      en: [
        "Analysis of **GPS** data to assess players' performance and external load.",
        'Weekly **Power BI** dashboard with individualised targets for each player.',
      ],
    },
    pitch: { x: 39.5, label: same('Vannes OC') },
  },
  {
    id: 'union-sport-cycle',
    order: 1,
    role: {
      fr: "Chargé d'étude & Business/Data Analyst",
      en: 'Research Officer & Business/Data Analyst',
    },
    org: same('Union Sport & Cycle'),
    place: same('Paris, France'),
    contract: 'alternance',
    start: '2020-09',
    end: '2021-09',
    logo: usc,
    highlights: {
      fr: [
        "Conception et pilotage d'**enquêtes quantitatives** : questionnaires, codage, analyse, restitution.",
        'Tableaux de bord **Power BI** et définition de KPI pour la prise de décision.',
        'Études de marché sectorielles (ski, tennis, cyclisme) au service des stratégies commerciales.',
      ],
      en: [
        'Design and management of **quantitative surveys**: questionnaires, coding, analysis, reporting.',
        '**Power BI** dashboards and KPI definition to support decision-making.',
        'Sector market studies (skiing, tennis, cycling) to inform commercial strategies.',
      ],
    },
    pitch: { x: 38.5, label: same('Union Sport & Cycle') },
  },
];

export const formations: Formation[] = [
  {
    id: 'ingenieur-cnam',
    title: {
      fr: "Diplôme d'Ingénieur — Big Data & Intelligence Artificielle",
      en: 'Engineering Degree — Big Data & Artificial Intelligence',
    },
    school: 'CNAM',
    place: 'Niort',
    level: { fr: 'Bac +5', en: "Master's level" },
    startYear: 2021,
    endYear: 2024,
    description: {
      fr: 'Spécialisé en Data Science, Machine Learning, Big Data et IA avec applications en modélisation prédictive et visualisation.',
      en: 'Specialised in Data Science, Machine Learning, Big Data and AI, with applications in predictive modelling and visualisation.',
    },
    pitch: {
      x: 4,
      label: { fr: 'Bac +5', en: "Master's level" },
      sub: { fr: 'Ingénieur', en: 'Engineering degree' },
    },
  },
  {
    id: 'dut-stid',
    title: {
      fr: 'DUT Statistique & Informatique Décisionnelle (STID)',
      en: 'DUT in Statistics & Business Intelligence (STID)',
    },
    school: 'IUT de Paris – Rives de Seine',
    place: 'Paris',
    level: { fr: 'Bac +2', en: 'Two-year degree' },
    startYear: 2019,
    endYear: 2021,
    description: {
      fr: 'Formation orientée analyse statistique, programmation, data visualisation et aide à la décision.',
      en: 'Training focused on statistical analysis, programming, data visualisation and decision support.',
    },
    pitch: {
      x: 4,
      label: { fr: 'Bac +2', en: '2-year degree' },
      sub: same('DUT STID'),
    },
  },
  {
    id: 'bac-s',
    title: {
      fr: 'Baccalauréat Scientifique — Section Européenne Anglais',
      en: 'Scientific Baccalauréat — European Section (English)',
    },
    school: 'Lycée Saint-Paul',
    place: 'Vannes',
    startYear: 2016,
    endYear: 2019,
    pitch: { x: 4, label: { fr: 'Bac S', en: 'Bac S' } },
  },
];

/** Ordre d'affichage des expériences : de la plus récente à la plus ancienne. */
export const experiencesByRecency = [...experiences].sort((a, b) => b.order - a.order);
