/** Panneau des valeurs calculées par le moteur, avec avertissements de la méthode. */

import type { DraftReport } from "../engine/types";

export function ValuesPanel({ report }: { report: DraftReport }) {
  return (
    <div className="space-y-2">
      {report.warnings.length > 0 && (
        <div className="rounded-lg border border-amber-300 bg-amber-50 p-2 text-xs text-amber-800">
          {report.warnings.map((w) => (
            <p key={w.code}>⚠ {w.message}</p>
          ))}
        </div>
      )}
      <table className="w-full text-xs">
        <tbody>
          {report.values.map((v) => (
            <tr key={v.key} className="border-b border-gray-100 last:border-0">
              <td className="py-1 pr-2 text-gray-600">{v.label}</td>
              <td className="py-1 text-right font-mono font-medium text-gray-900">
                {v.value.toFixed(2).replace(/\.?0+$/, "").replace(".", ",")}
                {v.unit && <span className="ml-1 text-gray-400">{v.unit}</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
