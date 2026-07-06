/** Formulaire de mensurations, groupé par familles, pas de 0,5 cm, validation à deux niveaux. */

import { MEASUREMENT_FIELDS } from "../engine/measurements";
import type { ValidationError, ValidationWarning } from "../engine/measurements";
import { useStore } from "../store";

const GROUPES: { id: (typeof MEASUREMENT_FIELDS)[number]["group"]; label: string }[] = [
  { id: "contours", label: "Contours" },
  { id: "longueurs", label: "Longueurs" },
  { id: "largeurs", label: "Largeurs" },
  { id: "poitrine", label: "Poitrine" },
];

export function MeasurementsForm({
  errors,
  warnings,
}: {
  errors: ValidationError[];
  warnings: ValidationWarning[];
}) {
  const measurements = useStore((s) => s.measurements);
  const setMeasurement = useStore((s) => s.setMeasurement);

  return (
    <div className="space-y-4">
      {GROUPES.map((g) => (
        <fieldset key={g.id} className="rounded-lg border border-gray-200 p-3">
          <legend className="px-1 text-xs font-semibold uppercase tracking-wide text-gray-500">{g.label}</legend>
          <div className="grid grid-cols-2 gap-x-3 gap-y-2">
            {MEASUREMENT_FIELDS.filter((f) => f.group === g.id).map((f) => {
              const error = errors.find((e) => e.key === f.key);
              return (
                <label key={f.key} className="block text-sm">
                  <span className="text-gray-700">{f.label}</span>
                  <div className="mt-0.5 flex items-center gap-1">
                    <input
                      type="number"
                      step={0.5}
                      min={f.min}
                      max={f.max}
                      value={measurements[f.key]}
                      onChange={(e) => setMeasurement(f.key, e.target.valueAsNumber)}
                      className={`w-full rounded border px-2 py-1 text-sm ${
                        error ? "border-red-500 bg-red-50" : "border-gray-300"
                      }`}
                    />
                    <span className="text-xs text-gray-400">cm</span>
                  </div>
                  {error && <p className="mt-0.5 text-xs text-red-600">{error.message}</p>}
                </label>
              );
            })}
          </div>
        </fieldset>
      ))}
      {warnings.length > 0 && (
        <div className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-xs text-amber-800">
          <p className="mb-1 font-semibold">Cohérence des mesures</p>
          <ul className="list-disc space-y-1 pl-4">
            {warnings.map((w) => (
              <li key={w.code}>{w.message}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
