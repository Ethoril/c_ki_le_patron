/**
 * État applicatif : mesures courantes, profils nommés (localStorage), options
 * d'affichage. La saisie est un BROUILLON : le moteur ne régénère pas le
 * patron en temps réel. `generatedMeasurements` est le jeu de mesures figé au
 * dernier clic sur « Générer » — on peut ainsi modifier plusieurs mesures
 * liées (poitrine, carrures…) sans passer par des états intermédiaires
 * incohérents où les pièces se chevauchent.
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Measurements, MeasurementKey } from "./engine/measurements";
import { DEMO_MEASUREMENTS } from "./engine/measurements";

type State = {
  /** Brouillon de saisie (formulaire). */
  measurements: Measurements;
  /** Mesures du patron affiché (dernier « Générer ») ; null tant qu'aucune génération. */
  generatedMeasurements: Measurements | null;
  profiles: Record<string, Measurements>;
  modeConstruction: boolean;
  setMeasurement: (key: MeasurementKey, value: number | undefined) => void;
  /** Remplace tout le jeu de mesures (profil, import JSON) et régénère : le jeu est cohérent. */
  setMeasurements: (m: Measurements) => void;
  /** Fige le brouillon courant comme mesures du patron. */
  generer: () => void;
  /** Revient aux mesures de base (profil de démonstration du livre) et régénère. */
  reset: () => void;
  saveProfile: (name: string) => void;
  loadProfile: (name: string) => void;
  deleteProfile: (name: string) => void;
  toggleModeConstruction: () => void;
};

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      measurements: DEMO_MEASUREMENTS,
      generatedMeasurements: DEMO_MEASUREMENTS,
      profiles: { "Démo (valeurs du livre)": DEMO_MEASUREMENTS },
      modeConstruction: true,
      setMeasurement: (key, value) =>
        set((s) => ({ measurements: { ...s.measurements, [key]: value } })),
      setMeasurements: (m) => set({ measurements: { ...m }, generatedMeasurements: { ...m } }),
      generer: () => set((s) => ({ generatedMeasurements: { ...s.measurements } })),
      reset: () =>
        set({ measurements: { ...DEMO_MEASUREMENTS }, generatedMeasurements: { ...DEMO_MEASUREMENTS } }),
      saveProfile: (name) =>
        set((s) => ({ profiles: { ...s.profiles, [name]: { ...s.measurements } } })),
      loadProfile: (name) => {
        const p = get().profiles[name];
        if (p) get().setMeasurements(p);
      },
      deleteProfile: (name) =>
        set((s) => {
          const profiles = { ...s.profiles };
          delete profiles[name];
          return { profiles };
        }),
      toggleModeConstruction: () => set((s) => ({ modeConstruction: !s.modeConstruction })),
    }),
    {
      name: "patrons-store",
      // au rechargement, le patron affiché repart des mesures persistées
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<State>;
        return {
          ...current,
          ...p,
          generatedMeasurements: p.measurements ?? current.measurements,
        };
      },
    },
  ),
);
