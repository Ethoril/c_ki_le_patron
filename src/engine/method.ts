/**
 * TOUTES les constantes de la méthode (Teresa Gilewska, « Les patrons de base
 * sur mesure », Eyrolles, 2019). Aucune de ces valeurs ne doit apparaître en
 * dur dans le code de construction (cahier des charges §2.3).
 *
 * Transcription v2 validée sur les planches : docs/methode/buste.md fait
 * autorité. Les marqueurs [transcription] signalent les choix v1 que le livre
 * ne chiffre pas explicitement (cf. la note de méthode).
 */

export const METHOD = {
  /** Pente de l'épaule dos, en degrés sous l'horizontale (p. 41). */
  ANGLE_EPAULE_DOS: 18,
  /** Pente de l'épaule devant, en degrés sous l'horizontale, pince fermée (p. 41). */
  ANGLE_EPAULE_DEVANT: 26,

  /** Largeur d'encolure = tour de cou / 6 + 1 (p. 39 ; ex. 38 → 7,33). */
  ENCOLURE_LARGEUR: (tourCou: number) => tourCou / 6 + 1,
  /** Profondeur d'encolure dos = tour de cou / 16, portée SOUS la ligne d'épaule (p. 40 ; ex. 2,38). */
  ENCOLURE_PROFONDEUR_DOS: (tourCou: number) => tourCou / 16,
  /** Profondeur d'encolure devant = largeur d'encolure EXACTE + 2 (p. 40 ; ex. 9,33). */
  ENCOLURE_PROFONDEUR_DEVANT: (largeurEncolure: number) => largeurEncolure + 2,

  /**
   * Arrondi du livre : au demi-centimètre SUPÉRIEUR — pour l'AFFICHAGE
   * uniquement (p. 40 : « il vaut mieux travailler avec une mesure exacte »).
   * Le moteur construit toujours avec les valeurs exactes.
   */
  ARRONDI_AFFICHAGE: (v: number) => Math.ceil(v * 2) / 2,

  /** Ligne d'emmanchure : mi-distance ligne d'épaule dos ↔ taille (p. 34, ét. 7). */
  LIGNE_EMMANCHURE: (longueurDos: number) => longueurDos / 2,
  /** Ligne de carrure : 1/3 de la distance épaule↔emmanchure, reporté depuis l'emmanchure, soit longueur dos / 3 (p. 34, ét. 8). */
  LIGNE_CARRURE: (longueurDos: number) => longueurDos / 3,

  /** Largeurs du gabarit : dos = poitrine/4 − 1 ; devant = poitrine/4 + 1 (p. 34 ét. 6, p. 35 ét. 10). */
  DEMI_LARGEUR_AJUSTEMENT: 1,

  /** Bissectrice d'emmanchure dos : la courbe passe à 1,5 cm du coin carrure/emmanchure (p. 42, ét. 2). */
  BISSECTRICE_EMMANCHURE_DOS: 1.5,
  /** Bissectrice d'emmanchure devant : 2,5 cm (p. 42, ét. 2). */
  BISSECTRICE_EMMANCHURE_DEVANT: 2.5,
  /** Platitude d'emmanchure : l'arrivée au point de côté est plate sur 1 cm (p. 42, ét. 3). */
  PLATITUDE_EMMANCHURE: 1,

  /** Valeur de la pince bretelle = tour de poitrine / 20 + 1 (p. 52 ; ex. 88 → 5,4). */
  PINCE_BRETELLE: (tourPoitrine: number) => tourPoitrine / 20 + 1,

  /**
   * Pince d'épaule dos, option « valeur absorbée » (p. 47, fig. 4) : pas de
   * pince tracée, l'épaule dos garde ~1 cm d'excédent sur l'épaule devant,
   * résorbé en embu au montage. [transcription : dos = épaule mesurée,
   * devant = épaule − 1 ; l'alternative dos = épaule + 1 est notée dans la
   * note de méthode]
   */
  EMBU_EPAULE_DOS: 1,

  /** Sommet de la pince de taille devant : 2 cm sous le saillant. [transcription, planches p. 54] */
  RETRAIT_SOMMET_PINCE_DEVANT: 2,
  /**
   * Sommet de la pince demi-dos : 2 cm au-dessus de la ligne d'emmanchure,
   * entre emmanchure et carrure comme sur les planches (p. 55, fig. 2).
   * [transcription : le livre ne chiffre pas cette hauteur]
   */
  RETRAIT_SOMMET_PINCE_DOS: 2,

  /** Plafonds de répartition des pinces de taille (p. 55). */
  PLAFOND_PINCE_DEVANT: 3,
  /** Pinces de côté : même valeur dos et devant, ≤ 4 cm chacune (p. 54-55). */
  PLAFOND_COTE: 4,
  PLAFOND_PINCE_DEMI_DOS: 2,
  /** Milieu dos, facultative : 1-2 cm max ; au-delà de 1 cm le livre prévoit une pince supplémentaire (p. 55, 58). */
  PLAFOND_MILIEU_DOS: 2,
  SEUIL_MILIEU_DOS_SANS_AVERTISSEMENT: 1,

  /**
   * Platitude des pinces de taille : 2 à 4 cm, inversement proportionnelle à
   * la valeur (valeur 3 → 2 cm ; valeur 1-1,5 → ≥ 3 cm ; p. 59).
   * [transcription de la proportion : platitude = 5 − valeur, bornée 2..4]
   */
  PLATITUDE_PINCE: (valeur: number) => Math.min(4, Math.max(2, 5 - valeur)),

  /** Tensions des splines, par courbe, ajustables après comparaison aux planches (§4.4). */
  TENSION: {
    emmanchureDos: 0,
    emmanchureDevant: 0,
  },
} as const;

/** Répartition de la valeur à absorber à la taille U = (poitrine − taille)/4, par quart (p. 54-58). */
export type RepartitionTaille = {
  /** Pince de côté : MÊME valeur dos et devant (p. 54, ét. 2-3). */
  cote: number;
  /** Pince du devant (axe par le saillant). */
  pinceDevant: number;
  /** Pince du demi-dos. */
  pinceDemiDos: number;
  /** Reprise au milieu dos (facultative, remplie en dernier recours). */
  milieuDos: number;
  /** Excédents non absorbés (avertissement « pince supplémentaire », p. 58). */
  excedentDos: number;
  excedentDevant: number;
  /** Vrai si la méthode demande une pince supplémentaire (milieu dos > 1 cm ou excédent). */
  pinceSupplementaire: boolean;
};

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/**
 * Algorithme de la note de méthode (docs/methode/buste.md §Répartition),
 * reproduisant l'exemple normatif du livre (p. 57, fig. 3, U = 5 →
 * côté 2, devant 3, demi-dos 2, milieu dos 1).
 */
export function repartirPincesTaille(aAbsorber: number): RepartitionTaille {
  const U = Math.max(0, aAbsorber);
  // côté : le minimum permettant pince devant ≤ 3, borné au plafond de 4
  const cote = clamp(U - METHOD.PLAFOND_PINCE_DEVANT, 0, METHOD.PLAFOND_COTE);
  const pinceDevant = Math.min(METHOD.PLAFOND_PINCE_DEVANT, U - cote);
  const excedentDevant = U - cote - pinceDevant;
  const pinceDemiDos = Math.min(METHOD.PLAFOND_PINCE_DEMI_DOS, U - cote);
  const milieuDosBrut = U - cote - pinceDemiDos;
  const milieuDos = Math.min(milieuDosBrut, METHOD.PLAFOND_MILIEU_DOS);
  const excedentDos = milieuDosBrut - milieuDos;
  return {
    cote,
    pinceDevant,
    pinceDemiDos,
    milieuDos,
    excedentDos,
    excedentDevant,
    pinceSupplementaire:
      milieuDosBrut > METHOD.SEUIL_MILIEU_DOS_SANS_AVERTISSEMENT || excedentDevant > 0,
  };
}
