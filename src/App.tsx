import { useMemo, useState } from "react";
import { useStore } from "./store";
import { validateBounds, checkCoherence } from "./engine/measurements";
import { generate } from "./engine/generate";
import { Viewer } from "./ui/Viewer";
import { MeasurementsForm } from "./ui/MeasurementsForm";
import { Profiles } from "./ui/Profiles";
import { ValuesPanel } from "./ui/ValuesPanel";
import { downloadSvg } from "./render/export-svg";

type Onglet = "mesures" | "profils" | "valeurs";

export default function App() {
  const measurements = useStore((s) => s.measurements);
  const modeConstruction = useStore((s) => s.modeConstruction);
  const toggleModeConstruction = useStore((s) => s.toggleModeConstruction);
  const [onglet, setOnglet] = useState<Onglet>("mesures");

  const errors = useMemo(() => validateBounds(measurements), [measurements]);
  const warnings = useMemo(() => checkCoherence(measurements), [measurements]);
  const pattern = useMemo(
    () => (errors.length === 0 ? generate(measurements) : null),
    [errors, measurements],
  );

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-2">
        <div>
          <h1 className="text-lg font-bold text-gray-900">Patrons de base sur mesure</h1>
          <p className="text-xs text-gray-500">
            Buste (demi-dos + demi-devant) — méthode T. Gilewska — sans coutures ni aisance
          </p>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-1.5 text-sm text-gray-700">
            <input type="checkbox" checked={modeConstruction} onChange={toggleModeConstruction} />
            Mode construction
          </label>
          <button
            disabled={!pattern}
            onClick={() => pattern && downloadSvg(pattern.pieces, measurements)}
            className="rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-40"
          >
            Exporter SVG 1:1
          </button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <aside className="flex w-80 shrink-0 flex-col border-r border-gray-200 bg-gray-50">
          <nav className="flex border-b border-gray-200 text-sm">
            {(
              [
                ["mesures", "Mesures"],
                ["profils", "Profils"],
                ["valeurs", "Valeurs"],
              ] as [Onglet, string][]
            ).map(([id, label]) => (
              <button
                key={id}
                onClick={() => setOnglet(id)}
                className={`flex-1 px-2 py-2 ${
                  onglet === id ? "border-b-2 border-blue-600 font-semibold text-blue-700" : "text-gray-600"
                }`}
              >
                {label}
              </button>
            ))}
          </nav>
          <div className="min-h-0 flex-1 overflow-y-auto p-3">
            {onglet === "mesures" && <MeasurementsForm errors={errors} warnings={warnings} />}
            {onglet === "profils" && <Profiles />}
            {onglet === "valeurs" &&
              (pattern ? (
                <ValuesPanel report={pattern.report} />
              ) : (
                <p className="text-sm text-gray-500">Corriger les mesures pour générer le patron.</p>
              ))}
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          {pattern ? (
            <Viewer pattern={pattern} construction={modeConstruction} />
          ) : (
            <div className="flex h-full items-center justify-center text-gray-400">
              Mesures invalides — voir le formulaire
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
