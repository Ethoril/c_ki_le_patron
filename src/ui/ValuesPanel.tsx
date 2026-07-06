/**
 * Panneau des valeurs calculées par le moteur, avec avertissements de la
 * méthode. Le moteur calcule exact ; pour les valeurs que le livre arrondit
 * sur ses planches (flag `arrondi`), l'arrondi au 1/2 cm supérieur est
 * affiché à côté de la valeur exacte (p. 40).
 */

import type { DraftReport } from "../engine/types";
import { METHOD } from "../engine/method";

const fmt = (v: number) => v.toFixed(2).replace(/\.?0+$/, "").replace(".", ",");

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
          {report.values.map((v) => {
            const arrondi = METHOD.ARRONDI_AFFICHAGE(v.value);
            return (
              <tr key={v.key} className="border-b border-gray-100 last:border-0">
                <td className="py-1 pr-2 text-gray-600">
                  {v.label}
                  {v.bookRef && <span className="ml-1 text-gray-400">({v.bookRef})</span>}
                </td>
                <td className="py-1 text-right font-mono font-medium text-gray-900">
                  {fmt(v.value)}
                  {v.arrondi && arrondi !== v.value && (
                    <span className="ml-1 text-gray-400">≈ {fmt(arrondi)}</span>
                  )}
                  {v.unit && <span className="ml-1 text-gray-400">{v.unit}</span>}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
