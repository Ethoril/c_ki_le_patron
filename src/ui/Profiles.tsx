/** Profils de mesures : sauvegarde locale nommée, import/export JSON. */

import { useRef, useState } from "react";
import { useStore } from "../store";
import { MEASUREMENT_FIELDS, type Measurements } from "../engine/measurements";

export function Profiles() {
  const profiles = useStore((s) => s.profiles);
  const measurements = useStore((s) => s.measurements);
  const { saveProfile, loadProfile, deleteProfile, setMeasurements } = useStore();
  const [name, setName] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const exportJson = () => {
    const blob = new Blob([JSON.stringify({ profils: profiles, courant: measurements }, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "profils-patrons.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const importJson = async (file: File) => {
    try {
      const data = JSON.parse(await file.text());
      const incoming: Record<string, Measurements> = data.profils ?? data;
      let count = 0;
      for (const [n, m] of Object.entries(incoming)) {
        if (MEASUREMENT_FIELDS.every((f) => typeof (m as Measurements)[f.key] === "number")) {
          useStore.setState((s) => ({ profiles: { ...s.profiles, [n]: m } }));
          count++;
        }
      }
      if (data.courant) setMeasurements(data.courant);
      if (count === 0) alert("Aucun profil valide dans ce fichier.");
    } catch {
      alert("Fichier JSON illisible.");
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-1">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nom du profil…"
          className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
        />
        <button
          onClick={() => name.trim() && (saveProfile(name.trim()), setName(""))}
          className="rounded bg-gray-800 px-2 py-1 text-sm text-white hover:bg-gray-700"
        >
          Enregistrer
        </button>
      </div>
      <ul className="divide-y divide-gray-100 rounded border border-gray-200">
        {Object.keys(profiles).map((n) => (
          <li key={n} className="flex items-center justify-between px-2 py-1 text-sm">
            <button onClick={() => loadProfile(n)} className="truncate text-left text-blue-700 hover:underline" title="Charger">
              {n}
            </button>
            <button onClick={() => deleteProfile(n)} className="ml-2 text-gray-400 hover:text-red-600" title="Supprimer">
              ✕
            </button>
          </li>
        ))}
      </ul>
      <div className="flex gap-2 text-xs">
        <button onClick={exportJson} className="rounded border border-gray-300 px-2 py-1 hover:bg-gray-50">
          Exporter JSON
        </button>
        <button onClick={() => fileRef.current?.click()} className="rounded border border-gray-300 px-2 py-1 hover:bg-gray-50">
          Importer JSON
        </button>
        <input
          ref={fileRef}
          type="file"
          accept=".json,application/json"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) importJson(f);
            e.target.value = "";
          }}
        />
      </div>
    </div>
  );
}
