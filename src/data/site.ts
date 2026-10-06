/** Réglages techniques du site. */
export const site = {
  /**
   * Démo live (shot map sur données StatsBomb) : désactivée pour le moment.
   * Pour la réactiver : passer à `true`, puis renommer `src/pages/_demo.astro` en `demo.astro`
   * et `src/pages/en/_demo.astro` en `demo.astro`.
   */
  demo: false,

  /**
   * Mesure d'audience sans cookies (GoatCounter).
   * Créer un compte gratuit sur https://www.goatcounter.com, choisir un code (ex. « matthieulg »)
   * et le renseigner ici. Tant que le champ est vide, aucun script n'est chargé.
   * Les statistiques se consultent sur https://<code>.goatcounter.com
   */
  goatcounter: '',
};
