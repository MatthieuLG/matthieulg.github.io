# Portfolio V2 — Matthieu Le Gall

Astro · React · TypeScript · Tailwind CSS v4 · Framer Motion · Lucide.

## Commandes

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # sortie statique dans dist/
npm run preview
```

## Structure

```
src/
  i18n/index.ts          langues, textes d'interface FR/EN, adresses des pages
  i18n/demo.ts           textes de la démo live
  data/                  le contenu, chaque texte en { fr, en }
    profile.ts           identité, liens, texte d'accueil, coordonnées, sections de la nav
    parcours.ts          expériences + formation (source unique de la liste ET du terrain)
    projects.ts          projets (description, étapes, outils, liens)
    expertise.ts         chaîne de valeur + compétences
    references.ts        références, groupées par club
    press.ts             articles de presse
    site.ts              réglages techniques (mesure d'audience)
  lib/
    pitch.ts             géométrie du terrain, axe du temps (une ligne par année de début)
    dates.ts             formats de dates par langue, surlignage **terme**
    typo.ts              espaces insécables de la typographie française
    statsbomb.ts         lecture des données ouvertes StatsBomb (matchs, événements, tirs)
  styles/global.css      tokens (couleurs, typo) et classes partagées
  layouts/Base.astro     <head>, métadonnées, hreflang
  components/
    Home.astro           la page complète, pour une langue donnée
    Nav.astro            barre fixe, section active, menu mobile
    LangSwitch.astro     interrupteur FR / EN
    Hero.astro  Parcours.astro  Projets.astro  Expertise.astro
    References.astro  Press.astro  Contact.astro  Footer.astro
    CareerPitch.tsx      terrain interactif : séquence rejouable, ballon lié à la lecture (île React)
    Projects.tsx         index dépliable des projets (île React)
    DemoPage.astro       page de la démo live, pour une langue donnée
    ShotLab.tsx          shot map + course aux xG sur données live (île React)
  pages/index.astro      accueil français   →  /
  pages/en/index.astro   accueil anglais    →  /en/
  pages/_demo.astro      démo live, désactivée (le « _ » l'exclut du site)
  pages/404.astro        page introuvable   →  /404.html (servie par GitHub Pages)
public/docs/             CV PDF
public/robots.txt        renvoie vers le plan du site
```

## Deux langues

L'interrupteur FR / EN de la barre de navigation mène à la même section dans l'autre langue.
Chaque texte de `src/data` porte ses deux versions (`{ fr: '…', en: '…' }`) ; les libellés
d'interface sont dans `src/i18n/index.ts`. Pour un CV anglais, déposer le PDF dans
`public/docs/` et renseigner `cv.en` dans `src/data/profile.ts`.

Ajouter une expérience : une entrée dans `src/data/parcours.ts`. Le point est placé
automatiquement sur la ligne de son année de début (un diplôme, sur celle de son année d'obtention ;
l'axe va jusqu'à l'année du dernier build) ; `pitch.x` règle sa position en largeur.
Ajouter un projet, un article ou une référence : une entrée dans le fichier de données correspondant.

## Démo live (désactivée)

La démo n'est pas publiée pour le moment. Pour la réactiver : passer `demo` à `true` dans
`src/data/site.ts`, puis renommer `src/pages/_demo.astro` et `src/pages/en/_demo.astro` en `demo.astro`.
Le lien de navigation et le renvoi depuis Projets réapparaissent alors d'eux-mêmes.

Une fois active, `/demo/` lit les données ouvertes StatsBomb directement dans le navigateur
(`raw.githubusercontent.com/statsbomb/open-data`), sans clé ni serveur : liste des matchs,
événements et compositions, puis calcul des tirs, des xG cumulés et des plus grosses occasions.
Les compétitions proposées se règlent dans `src/lib/statsbomb.ts`.

Conditions d'utilisation StatsBomb : citer la source (fait en bas de page) et afficher leur logo,
à récupérer dans leur Media Pack (https://statsbomb.com/media-pack/).

## Mesure d'audience (sans cookies)

1. Créer un compte gratuit sur https://www.goatcounter.com et choisir un code (ex. `matthieulg`).
2. Renseigner ce code dans `src/data/site.ts` (`goatcounter: 'matthieulg'`).
3. Publier. Les visites se lisent sur `https://<code>.goatcounter.com`.

Aucun cookie, donc pas de bandeau de consentement. Le script n'est chargé que sur le site publié.
Les clics utiles sont comptés comme événements : `cv`, `email`, `video-opta-forum`,
`langue-en` / `langue-fr`.

## Plan du site

`sitemap-index.xml` est généré au build (avec les correspondances FR/EN) et déclaré dans `robots.txt`.

## Identité

| Token     | Valeur    | Rôle                                             |
| --------- | --------- | ------------------------------------------------ |
| `pelouse` | `#0d3b2e` | le terrain : zones de visualisation              |
| `craie`   | `#eef1ea` | le rapport : zones de lecture                    |
| `encre`   | `#0a1f18` | texte sur craie                                  |
| `ballon`  | `#ffd84a` | l'attention : poste actuel, actif, surlignage    |

Une seule famille, Archivo variable : large et grasse pour les titres, normale pour
le texte, étroite pour les chiffres.

## Déploiement GitHub Pages

Le workflow `.github/workflows/deploy.yml` construit et publie à chaque push sur `main`.
Dans le dépôt `matthieulg.github.io` : Settings → Pages → Source : **GitHub Actions**.
