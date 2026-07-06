/**
 * TOUTES les constantes de la méthode (Teresa Gilewska, « Les patrons de base
 * sur mesure », Eyrolles). Aucune de ces valeurs ne doit apparaître en dur
 * dans le code de construction (cahier des charges §2.3).
 *
 * ⚠ Les références de pages sont à compléter/valider livre en main lors de la
 * relecture de docs/methode/buste.md — les valeurs marquées [À VALIDER] sont
 * des choix de transcription v1 documentés dans ce fichier de méthode.
 */

export const METHOD = {
  /** Pente de l'épaule dos, en degrés sous l'horizontale. */
  ANGLE_EPAULE_DOS: 18,
  /** Pente de l'épaule devant, en degrés sous l'horizontale (pince fermée). */
  ANGLE_EPAULE_DEVANT: 26,

  /** Largeur d'encolure = tour de cou / 6 + 1 (ex. du livre : 38 → 7,33, arrondi 7,5). */
  ENCOLURE_LARGEUR: (tourCou: number) => tourCou / 6 + 1,
  /** Profondeur d'encolure dos = tour de cou / 16 (ex. : 38 → 2,38, arrondi 2,5). */
  ENCOLURE_PROFONDEUR_DOS: (tourCou: number) => tourCou / 16,
  /** Profondeur d'encolure devant = largeur d'encolure (arrondie) + 2 (ex. : 7,5 → 9,5). */
  ENCOLURE_PROFONDEUR_DEVANT: (largeurArrondie: number) => largeurArrondie + 2,

  /** Arrondi de la méthode : au demi-centimètre le plus proche. */
  ARRONDI: (v: number) => Math.round(v * 2) / 2,

  /** Bissectrice d'emmanchure dos : la courbe passe à 1,5 cm du coin côté/poitrine. [À VALIDER : attribution dos/devant] */
  BISSECTRICE_EMMANCHURE_DOS: 1.5,
  /** Bissectrice d'emmanchure devant : 2,5 cm. [À VALIDER : attribution dos/devant] */
  BISSECTRICE_EMMANCHURE_DEVANT: 2.5,

  /** Valeur de la pince bretelle en cm, mesurée sur la ligne d'épaule. [À VALIDER : formule du livre] */
  PINCE_BRETELLE: 3,
  /** Distance du sommet de la pince de taille devant sous le saillant. [À VALIDER] */
  RETRAIT_SOMMET_PINCE_DEVANT: 2,
  /** Distance du sommet de la pince de taille dos au-dessus de la ligne de poitrine. [À VALIDER] */
  RETRAIT_SOMMET_PINCE_DOS: 2,

  /** Plafonds de répartition des pinces de taille (cahier §4.4). */
  PLAFOND_PINCE_DEVANT: 3,
  /** Plafond de la couture de côté : 4 cm au total, soit 2 par pièce (demi-dos / demi-devant). */
  PLAFOND_COTE_PAR_PIECE: 2,
  PLAFOND_PINCE_DEMI_DOS: 2,
  PLAFOND_MILIEU_DOS: 2,
  /** Valeur nominale prise au milieu dos avant de gonfler la pince demi-dos (1 à 2 cm). */
  NOMINAL_MILIEU_DOS: 1,

  /** Tensions des splines, par courbe, ajustables après comparaison aux planches (§4.4). */
  TENSION: {
    emmanchureDos: 0,
    emmanchureDevant: 0,
    encolure: 0,
  },
} as const;

/** Répartition d'une valeur à absorber à la taille pour UNE pièce (un quart du vêtement). */
export type RepartitionPinces = {
  /** Reprise à la couture de côté (cm). */
  cote: number;
  /** Pince principale de la pièce (devant : sous le saillant ; dos : pince demi-dos). */
  pince: number;
  /** Reprise au milieu dos (0 pour le devant). */
  milieuDos: number;
  /** Excédent non absorbé (déclenche l'avertissement « pince supplémentaire »). */
  excedent: number;
};

/**
 * Stratégie de répartition (fonction pure, testée sur cas extrêmes — §4.4).
 * Ordre de remplissage : côté → pince principale → milieu dos (dos uniquement)
 * → excédent signalé. [À VALIDER : ordre exact du livre]
 */
export function repartirPinces(aAbsorber: number, piece: "dos" | "devant"): RepartitionPinces {
  let reste = Math.max(0, aAbsorber);

  const cote = Math.min(reste, METHOD.PLAFOND_COTE_PAR_PIECE);
  reste -= cote;

  const plafondPince = piece === "devant" ? METHOD.PLAFOND_PINCE_DEVANT : METHOD.PLAFOND_PINCE_DEMI_DOS;
  let milieuDos = 0;
  let pince: number;

  if (piece === "dos") {
    // Le milieu dos prend sa valeur nominale d'abord, puis sert de variable
    // d'ajustement jusqu'à son plafond une fois la pince demi-dos saturée.
    milieuDos = Math.min(reste, METHOD.NOMINAL_MILIEU_DOS);
    reste -= milieuDos;
    pince = Math.min(reste, plafondPince);
    reste -= pince;
    const complement = Math.min(reste, METHOD.PLAFOND_MILIEU_DOS - milieuDos);
    milieuDos += complement;
    reste -= complement;
  } else {
    pince = Math.min(reste, plafondPince);
    reste -= pince;
  }

  return { cote, pince, milieuDos, excedent: reste };
}
