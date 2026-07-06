/** État applicatif : mesures courantes, profils nommés (localStorage), options d'affichage. */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Measurements, MeasurementKey } from "./engine/measurements";
import { DEMO_MEASUREMENTS } from "./engine/measurements";

type State = {
  measurements: Measurements;
  profiles: Record<string, Measurements>;
  modeConstruction: boolean;
  setMeasurement: (key: MeasurementKey, value: number) => void;
  setMeasurements: (m: Measurements) => void;
  saveProfile: (name: string) => void;
  loadProfile: (name: string) => void;
  deleteProfile: (name: string) => void;
  toggleModeConstruction: () => void;
};

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      measurements: DEMO_MEASUREMENTS,
      profiles: { "Démo (valeurs du livre)": DEMO_MEASUREMENTS },
      modeConstruction: true,
      setMeasurement: (key, value) =>
        set((s) => ({ measurements: { ...s.measurements, [key]: value } })),
      setMeasurements: (m) => set({ measurements: m }),
      saveProfile: (name) =>
        set((s) => ({ profiles: { ...s.profiles, [name]: { ...s.measurements } } })),
      loadProfile: (name) => {
        const p = get().profiles[name];
        if (p) set({ measurements: { ...p } });
      },
      deleteProfile: (name) =>
        set((s) => {
          const profiles = { ...s.profiles };
          delete profiles[name];
          return { profiles };
        }),
      toggleModeConstruction: () => set((s) => ({ modeConstruction: !s.modeConstruction })),
    }),
    { name: "patrons-store" },
  ),
);
