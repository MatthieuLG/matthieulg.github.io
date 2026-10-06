import type { L } from '../i18n';

export type ProjectCategory = 'football' | 'padel' | 'bot';

export interface Project {
  id: string;
  title: L;
  category: ProjectCategory;
  /** Nature du projet, affichée après la discipline. */
  domain: L;
  /** Cadre du projet. */
  context: L;
  year: number;
  /** Distinction éventuelle, affichée sous le titre. */
  award?: L;
  description: L;
  steps: L<string[]>;
  stack: string[];
  links: { label: L; href: string }[];
}

export const categories: { id: ProjectCategory | 'all'; label: L }[] = [
  { id: 'all', label: { fr: 'Tous', en: 'All' } },
  { id: 'football', label: { fr: 'Football', en: 'Football' } },
  { id: 'padel', label: { fr: 'Padel', en: 'Padel' } },
  { id: 'bot', label: { fr: 'Bot', en: 'Bot' } },
];

const personal: L = { fr: 'Projet personnel', en: 'Personal project' };
const onLinkedIn: L = { fr: 'Voir le projet sur LinkedIn', en: 'View the project on LinkedIn' };

export const projects: Project[] = [
  {
    id: 'impact-touches',
    title: {
      fr: "Analyse de l'impact des touches dans le football moderne",
      en: 'Analysing the impact of throw-ins in modern football',
    },
    category: 'football',
    domain: { fr: 'recherche', en: 'research' },
    context: { fr: 'Opta Forum 2024, Londres', en: 'Opta Forum 2024, London' },
    year: 2024,
    award: { fr: 'Lauréat Opta Forum Research 2024', en: 'Opta Forum Research 2024 winner' },
    description: {
      fr: "Projet de recherche présenté lors de l'Opta Forum 2024 à Londres. L'étude analyse l'impact stratégique des touches dans le football moderne à partir de données événementielles Opta, afin d'identifier comment certaines équipes génèrent des séquences offensives et des occasions de but à partir de ces phases de jeu.",
      en: 'Research project presented at the Opta Forum 2024 in London. The study analyses the strategic impact of throw-ins in modern football using Opta event data, to identify how some teams generate attacking sequences and goal-scoring chances from these phases of play.',
    },
    steps: {
      fr: [
        'Extraction et préparation des événements Opta liés aux touches sur plusieurs matchs',
        'Catégorisation des touches selon le contexte de jeu',
        'Analyse des séquences de passes initiées par une touche',
        'Modélisation des probabilités de localisation des passes après une touche',
        "Présentation des résultats lors de l'Opta Forum 2024 devant des professionnels de l'industrie",
      ],
      en: [
        'Extraction and preparation of Opta throw-in events across multiple matches',
        'Categorisation of throw-ins by game context',
        'Analysis of passing sequences initiated by a throw-in',
        'Modelling of pass location probabilities after a throw-in',
        'Presentation of the results at the Opta Forum 2024 in front of industry professionals',
      ],
    },
    stack: ['Python', 'Opta Data', 'Pandas', 'Football Analytics', 'Data Visualization'],
    links: [
      {
        label: { fr: 'Voir la présentation en vidéo', en: 'Watch the video presentation' },
        href: 'https://vimeo.com/932522182/0e5b88c070',
      },
    ],
  },
  {
    id: 'post-match-opta',
    title: {
      fr: "Application d'analyse post-match Opta",
      en: 'Opta post-match analysis application',
    },
    category: 'football',
    domain: { fr: 'data analytics', en: 'data analytics' },
    context: personal,
    year: 2023,
    description: {
      fr: "Développement d'une application Streamlit dédiée à l'analyse post-match de données événementielles Opta. Le projet permet d'explorer et visualiser rapidement les principaux insights d'une rencontre à partir des événements de match, dans une logique d'aide à l'analyse de performance.",
      en: 'A Streamlit application dedicated to post-match analysis of Opta event data. The project makes it quick to explore and visualise the key insights of a match from its events, as a support for performance analysis.',
    },
    steps: {
      fr: [
        'Structuration et préparation des données événementielles Opta après match',
        'Nettoyage, transformation et organisation des événements pour analyse',
        "Développement d'une interface Streamlit interactive pour explorer les données",
        "Création de visualisations et d'indicateurs pour faciliter la lecture de la performance",
        'Présentation du projet via une démonstration vidéo publiée sur LinkedIn',
      ],
      en: [
        'Structuring and preparing Opta event data after the match',
        'Cleaning, transforming and organising events for analysis',
        'Building an interactive Streamlit interface to explore the data',
        'Creating visualisations and indicators that make performance easier to read',
        'Presenting the project through a video demo published on LinkedIn',
      ],
    },
    stack: ['Python', 'Streamlit', 'Opta', 'Pandas', 'Data Visualization'],
    links: [
      {
        label: onLinkedIn,
        href: 'https://www.linkedin.com/posts/matthieu-le-gall_dataanalytics-sportsanalytics-optadata-activity-7143564780174266368-nGUO',
      },
    ],
  },
  {
    id: 'xg-xgot',
    title: {
      fr: 'Modèle xG / xGOT & shot placement',
      en: 'xG / xGOT model & shot placement',
    },
    category: 'football',
    domain: { fr: 'machine learning', en: 'machine learning' },
    context: personal,
    year: 2024,
    description: {
      fr: "Développement d'une application Streamlit d'analyse de tirs à partir de données événementielles Opta. Le projet combine des visualisations de shot placement et de préférences sur penalty avec deux modèles de machine learning dédiés au calcul du xG et du xGOT. Démonstration réalisée sur les données du joueur Himad Abdelli (SCO Angers).",
      en: 'A Streamlit shot analysis application built on Opta event data. The project combines shot placement and penalty preference visualisations with two machine learning models that compute xG and xGOT. Demonstrated on data from the player Himad Abdelli (SCO Angers).',
    },
    steps: {
      fr: [
        'Préparation et structuration des données de tirs issues des événements Opta',
        'Développement de visualisations pour analyser le placement des tirs et les préférences sur penalty',
        'Conception de deux modèles de machine learning pour estimer le xG et le xGOT',
        'Intégration des sorties modèles dans une interface Streamlit interactive',
        "Présentation du cas d'usage sur Himad Abdelli (SCO Angers) via une démonstration vidéo",
      ],
      en: [
        'Preparing and structuring shot data from Opta events',
        'Building visualisations to analyse shot placement and penalty preferences',
        'Designing two machine learning models to estimate xG and xGOT',
        'Integrating model outputs into an interactive Streamlit interface',
        'Presenting the use case on Himad Abdelli (SCO Angers) through a video demo',
      ],
    },
    stack: ['Python', 'Streamlit', 'Opta', 'Pandas', 'Machine Learning', 'Data Visualization'],
    links: [
      {
        label: onLinkedIn,
        href: 'https://www.linkedin.com/posts/matthieu-le-gall_streamlit-optaevent-scoangers-activity-7148389615584911360-1_5W',
      },
    ],
  },
  {
    id: 'afcon-dashboard',
    title: { fr: 'AFCON Analytics Dashboard', en: 'AFCON Analytics Dashboard' },
    category: 'football',
    domain: { fr: 'dataviz', en: 'dataviz' },
    context: personal,
    year: 2024,
    description: {
      fr: "Création d'un dashboard interactif dédié à la Coupe d'Afrique des Nations permettant d'explorer les données des sélections, joueurs et clubs représentés dans la compétition. Le projet inclut également un algorithme de prédiction du vainqueur basé sur l'ELO des nations et l'historique des résultats.",
      en: "An interactive dashboard dedicated to the Africa Cup of Nations, for exploring data on the national teams, players and clubs represented in the competition. The project also includes an algorithm predicting the winner, based on the nations' ELO ratings and historical results.",
    },
    steps: {
      fr: [
        'Collecte et structuration des données sur les sélections, joueurs et clubs participant à la CAN',
        "Création d'un modèle de prédiction basé sur l'ELO des nations et les résultats historiques",
        "Développement d'un dashboard interactif sous Tableau pour explorer les données",
        'Intégration de visualisations sur la composition des sélections et la répartition par club',
        'Publication du dashboard interactif en ligne',
      ],
      en: [
        'Collecting and structuring data on the teams, players and clubs taking part in AFCON',
        'Building a prediction model based on national ELO ratings and historical results',
        'Developing an interactive Tableau dashboard to explore the data',
        'Adding visualisations of squad composition and distribution by club',
        'Publishing the interactive dashboard online',
      ],
    },
    stack: ['Tableau', 'Python', 'Data Visualization', 'Football Data'],
    links: [
      {
        label: onLinkedIn,
        href: 'https://www.linkedin.com/posts/matthieu-le-gall_afcon-dashboard-activity-7151280568469450753-JyQ9',
      },
    ],
  },
  {
    id: 'national-dashboard',
    title: {
      fr: 'Championnat National Performance Dashboard',
      en: 'Championnat National Performance Dashboard',
    },
    category: 'football',
    domain: { fr: 'dataviz', en: 'dataviz' },
    context: personal,
    year: 2024,
    description: {
      fr: "Développement d'un dashboard d'analyse du Championnat National basé sur les métriques avancées xG et xP (Expected Points). Le projet permet de comparer les performances réelles et attendues des équipes afin d'identifier les surperformances et sous-performances au cours de la saison.",
      en: "A dashboard analysing the French Championnat National using the advanced metrics xG and xP (Expected Points). The project compares teams' actual and expected performance to identify over- and under-performance over the season.",
    },
    steps: {
      fr: [
        'Collecte des données de matchs et des statistiques avancées via FootyStats',
        'Nettoyage et transformation des données avec Power Query',
        'Calcul des métriques avancées : xG et Expected Points (xP) avec Python',
        "Construction d'un dashboard interactif dans Power BI",
        'Analyse des performances et identification des écarts entre résultats réels et attendus',
      ],
      en: [
        'Collecting match data and advanced statistics via FootyStats',
        'Cleaning and transforming the data with Power Query',
        'Computing advanced metrics: xG and Expected Points (xP) with Python',
        'Building an interactive dashboard in Power BI',
        'Analysing performance and identifying gaps between actual and expected results',
      ],
    },
    stack: ['Python', 'Power BI', 'Power Query', 'Football Analytics', 'Data Visualization'],
    links: [
      {
        label: onLinkedIn,
        href: 'https://www.linkedin.com/posts/matthieu-le-gall_datasport-datafootball-python-activity-7279549462513913856-hCNx',
      },
    ],
  },
  {
    id: 'padel-similarity',
    title: {
      fr: 'Padel Performance & Player Similarity Dashboard',
      en: 'Padel Performance & Player Similarity Dashboard',
    },
    category: 'padel',
    domain: { fr: 'dataviz', en: 'dataviz' },
    context: personal,
    year: 2024,
    description: {
      fr: "Création d'un dashboard Power BI pour analyser une saison personnelle de padel (21 tournois disputés). Le projet explore les performances individuelles, l'évolution du nombre de licenciés en France et inclut un algorithme de similarité permettant d'identifier les joueurs du club présentant un profil statistique proche.",
      en: 'A Power BI dashboard analysing a personal padel season (21 tournaments played). The project explores individual performance and the growth in registered players in France, and includes a similarity algorithm that identifies club players with a close statistical profile.',
    },
    steps: {
      fr: [
        'Collecte et structuration des données de tournois, classements et performances',
        "Analyse de l'évolution du nombre de licenciés padel en France",
        "Construction d'un dashboard Power BI pour suivre les performances sur 21 tournois",
        "Développement d'un algorithme de similarité entre joueurs basé sur performances et classement",
        'Identification des profils joueurs les plus proches au sein du club Breizh Padel',
      ],
      en: [
        'Collecting and structuring tournament, ranking and performance data',
        'Analysing the growth in registered padel players in France',
        'Building a Power BI dashboard to track performance across 21 tournaments',
        'Developing a player similarity algorithm based on performance and ranking',
        'Identifying the closest player profiles within the Breizh Padel club',
      ],
    },
    stack: ['Power BI', 'Python', 'Data Visualization', 'Sports Analytics'],
    links: [
      {
        label: onLinkedIn,
        href: 'https://www.linkedin.com/posts/matthieu-le-gall_padel-dataviz-powerbi-activity-7313933958616920064-OltW',
      },
    ],
  },
  {
    id: 'ticket-bot',
    title: { fr: 'Ticket Monitoring & Alert Bot', en: 'Ticket Monitoring & Alert Bot' },
    category: 'bot',
    domain: { fr: 'web scraping', en: 'web scraping' },
    context: personal,
    year: 2024,
    description: {
      fr: "Développement d'un bot de veille automatisée pour surveiller les billets remis en vente sur les plateformes de billetterie des Jeux Olympiques de Paris 2024 et de l'Olympique de Marseille. Le système scrape en continu les annonces disponibles, récupère les catégories, compétitions et tarifs, puis envoie des alertes Telegram dès qu'un billet correspondant à des critères définis devient disponible.",
      en: 'An automated monitoring bot that watches for tickets put back on sale on the ticketing platforms of the Paris 2024 Olympic Games and Olympique de Marseille. The system continuously scrapes available listings, retrieves categories, competitions and prices, then sends Telegram alerts as soon as a ticket matching defined criteria becomes available.',
    },
    steps: {
      fr: [
        'Scraping automatisé des billets remis en vente sur les plateformes ciblées',
        'Extraction des informations clés : événement, catégorie, prix et disponibilité',
        'Filtrage des billets selon des critères personnalisés',
        "Déclenchement d'alertes en temps réel via un bot Telegram",
        "Mise en place d'une veille continue pour détecter rapidement les opportunités",
      ],
      en: [
        'Automated scraping of tickets put back on sale on the targeted platforms',
        'Extracting key information: event, category, price and availability',
        'Filtering tickets against custom criteria',
        'Triggering real-time alerts through a Telegram bot',
        'Running continuous monitoring to catch opportunities quickly',
      ],
    },
    stack: ['Python', 'Web Scraping', 'Telegram Bot', 'Automation', 'Data Monitoring'],
    links: [],
  },
];
