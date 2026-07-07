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
  const generatedMeasurements = useStore((s) => s.generatedMeasurements);
  const generer = useStore((s) => s.generer);
  const modeConstruction = useStore((s) => s.modeConstruction);
  const toggleModeConstruction = useStore((s) => s.toggleModeConstruction);
  const [onglet, setOnglet] = useState<Onglet>("mesures");

  // validation en continu sur le BROUILLON (retour immédiat dans le formulaire)
  const errors = useMemo(() => validateBounds(measurements), [measurements]);
  const warnings = useMemo(() => checkCoherence(measurements), [measurements]);

  // le patron n'est régénéré qu'au clic sur « Générer » (jeu de mesures figé)
  const pattern = useMemo(
    () =>
      generatedMeasurements && validateBounds(generatedMeasurements).length === 0
        ? generate(generatedMeasurements)
        : null,
    [generatedMeasurements],
  );

  const dirty = useMemo(
    () => JSON.stringify(measurements) !== JSON.stringify(generatedMeasurements),
    [measurements, generatedMeasurements],
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
            onClick={() => pattern && generatedMeasurements && downloadSvg(pattern.pieces, generatedMeasurements)}
            className="rounded border border-blue-600 px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-50 disabled:opacity-40"
          >
            Exporter SVG 1:1
          </button>
          <button
            disabled={!pattern}
            onClick={async () => {
              if (!pattern || !generatedMeasurements) return;
              // import dynamique : jsPDF (~350 ko) n'est chargé qu'à la demande
              const { downloadPdf } = await import("./render/export-pdf");
              downloadPdf(pattern.pieces, generatedMeasurements);
            }}
            className="rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-40"
          >
            Exporter PDF A4
          </button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <aside className="flex w-80 shrink-0 flex-col border-r border-gray-200 bg-gray-50">
          <div className="border-b border-gray-200 bg-white p-3">
            <button
              disabled={errors.length > 0 || !dirty}
              onClick={generer}
              className="w-full rounded bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Générer le patron
            </button>
            {errors.length > 0 ? (
              <p className="mt-1.5 text-xs text-red-600">Corriger les mesures en erreur avant de générer.</p>
            ) : dirty ? (
              <p className="mt-1.5 text-xs text-amber-700">
                Mesures modifiées : le patron affiché ne les reflète pas encore.
              </p>
            ) : (
              <p className="mt-1.5 text-xs text-gray-400">Le patron est à jour.</p>
            )}
          </div>
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
                <p className="text-sm text-gray-500">Générer le patron pour voir les valeurs calculées.</p>
              ))}
          </div>
        </aside>

        <main className="relative min-w-0 flex-1">
          {pattern ? (
            <>
              <Viewer pattern={pattern} construction={modeConstruction} />
              {dirty && (
                <div className="pointer-events-none absolute left-1/2 top-3 -translate-x-1/2 rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-800 shadow-sm">
                  Patron généré avec les mesures précédentes — cliquer « Générer le patron »
                </div>
              )}
            </>
          ) : (
            <div className="flex h-full items-center justify-center text-gray-400">
              Saisir des mesures valides puis cliquer « Générer le patron »
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
