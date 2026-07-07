/** Mensurations : type, bornes physiques (erreurs) et cohérence méthode (avertissements). */

export type Measurements = {
  /** Tour de poitrine (cm). */
  tourPoitrine: number;
  /** Tour de taille (cm). */
  tourTaille: number;
  /** Tour de bassin (cm). */
  tourBassin: number;
  /** Tour de cou (cm). */
  tourCou: number;
  /** Carrure dos (cm). */
  carrureDos: number;
  /** Carrure devant (cm). */
  carrureDevant: number;
  /** Longueur du dos : du ras-du-cou sur la ligne d'épaule à la taille (cm, p. 18). */
  longueurDos: number;
  /** Longueur devant : de la ligne d'épaule à la taille, en passant sur le sein (cm). */
  longueurDevant: number;
  /** Hauteur de poitrine : de la ligne d'épaule au saillant, verticalement (cm, p. 50). */
  hauteurPoitrine: number;
  /** Écart de poitrine : distance entre les deux saillants (cm). */
  ecartPoitrine: number;
  /** Longueur d'épaule (cm). */
  longueurEpaule: number;
  /**
   * Pente d'épaule (cm, OPTIONNELLE) : dénivelé vertical entre le point
   * d'encolure côté cou et la pointe d'épaule. Renseignée, elle remplace les
   * angles 18°/26° du livre (buste.md §Extensions hors livre) ; absente, les
   * angles de la méthode s'appliquent.
   */
  penteEpaule?: number;
  /**
   * Aisance globale (cm au tour, OPTIONNELLE, 0–5, défaut produit 2) :
   * ajoutée aux tours de poitrine et de taille avant division (buste.md
   * §Extensions hors livre). Absente = 0 = patron de base du livre.
   */
  aisance?: number;
};

export type MeasurementKey = keyof Measurements;

export type MeasurementField = {
  key: MeasurementKey;
  label: string;
  /** Famille pour le regroupement du formulaire. */
  group: "contours" | "longueurs" | "largeurs" | "poitrine" | "reglages";
  min: number;
  max: number;
  /** Champ facultatif : vide = comportement par défaut de la méthode. */
  optional?: boolean;
  /** Aide affichée sous le champ. */
  hint?: string;
};

export const MEASUREMENT_FIELDS: MeasurementField[] = [
  { key: "tourPoitrine", label: "Tour de poitrine", group: "contours", min: 60, max: 160 },
  { key: "tourTaille", label: "Tour de taille", group: "contours", min: 45, max: 150 },
  { key: "tourBassin", label: "Tour de bassin", group: "contours", min: 60, max: 170 },
  { key: "tourCou", label: "Tour de cou", group: "contours", min: 26, max: 55 },
  { key: "longueurDos", label: "Longueur dos", group: "longueurs", min: 30, max: 60 },
  { key: "longueurDevant", label: "Longueur devant", group: "longueurs", min: 30, max: 65 },
  { key: "carrureDos", label: "Carrure dos", group: "largeurs", min: 26, max: 55 },
  { key: "carrureDevant", label: "Carrure devant", group: "largeurs", min: 24, max: 52 },
  { key: "longueurEpaule", label: "Longueur d'épaule", group: "largeurs", min: 8, max: 20 },
  {
    key: "penteEpaule",
    label: "Pente d'épaule",
    group: "largeurs",
    min: 1,
    max: 9,
    optional: true,
    hint: "Optionnelle — dénivelé vertical encolure → pointe d'épaule ; à vide, angles du livre (18°/26°).",
  },
  { key: "hauteurPoitrine", label: "Hauteur de poitrine", group: "poitrine", min: 18, max: 40 },
  { key: "ecartPoitrine", label: "Écart de poitrine", group: "poitrine", min: 12, max: 30 },
  {
    key: "aisance",
    label: "Aisance",
    group: "reglages",
    min: 0,
    max: 5,
    optional: true,
    hint: "Ajoutée au tour de poitrine et de taille ; 0 = patron de base du livre, sans aisance.",
  },
];

/** Aisance proposée par défaut (cm au tour) — le patron du livre reste accessible à 0. */
export const AISANCE_DEFAUT = 2;

/**
 * Profil de démonstration : valeurs d'exemple du livre (poitrine 88, taille 68,
 * bassin 92, cou 38) complétées par des mesures cohérentes pour une taille 38.
 */
export const DEMO_MEASUREMENTS: Measurements = {
  tourPoitrine: 88,
  tourTaille: 68,
  tourBassin: 92,
  tourCou: 38,
  carrureDos: 35,
  carrureDevant: 33,
  longueurDos: 41,
  longueurDevant: 44,
  hauteurPoitrine: 26,
  ecartPoitrine: 18,
  longueurEpaule: 13,
  aisance: AISANCE_DEFAUT,
};

export type ValidationError = { key: MeasurementKey; message: string };
export type ValidationWarning = { code: string; message: string };

/** Niveau 1 — bornes physiques : erreurs BLOQUANTES. */
export function validateBounds(m: Measurements): ValidationError[] {
  const errors: ValidationError[] = [];
  for (const f of MEASUREMENT_FIELDS) {
    const v = m[f.key];
    if (v === undefined) {
      // les champs optionnels vides prennent le comportement par défaut de la méthode
      if (!f.optional) errors.push({ key: f.key, message: `${f.label} : valeur manquante ou invalide` });
    } else if (!Number.isFinite(v)) {
      errors.push({ key: f.key, message: `${f.label} : valeur manquante ou invalide` });
    } else if (v < f.min || v > f.max) {
      errors.push({ key: f.key, message: `${f.label} : doit être entre ${f.min} et ${f.max} cm` });
    }
  }
  return errors;
}

/** Niveau 2 — cohérence issue de la méthode : avertissements NON bloquants. */
export function checkCoherence(m: Measurements): ValidationWarning[] {
  const warnings: ValidationWarning[] = [];
  if (m.carrureDevant >= m.carrureDos) {
    warnings.push({
      code: "carrure-devant-superieure",
      message:
        "Carrure devant ≥ carrure dos : le livre signale que c'est presque toujours une erreur de prise de mesure.",
    });
  }
  if (m.longueurDevant <= m.longueurDos) {
    warnings.push({
      code: "longueur-devant-courte",
      message: "Longueur devant ≤ longueur dos : vérifier la prise de mesure (le devant passe sur le sein).",
    });
  }
  if (m.tourTaille >= m.tourPoitrine) {
    warnings.push({
      code: "taille-superieure-poitrine",
      message: "Tour de taille ≥ tour de poitrine : le patron de base n'aura pas de pinces de taille.",
    });
  }
  if (m.hauteurPoitrine >= m.longueurDevant) {
    warnings.push({
      code: "hauteur-poitrine-incoherente",
      message: "Hauteur de poitrine ≥ longueur devant : le saillant serait sous la taille.",
    });
  }
  if (m.penteEpaule !== undefined && m.penteEpaule > 0.7 * m.longueurEpaule) {
    warnings.push({
      code: "pente-epaule-forte",
      message:
        "Pente d'épaule > 0,7 × longueur d'épaule (angle au-delà de 45°) : vérifier la prise de mesure, l'angle sera plafonné à 45°.",
    });
  }
  return warnings;
}
