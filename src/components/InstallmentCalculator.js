import React, { useMemo, useState } from "react";
import { Scale } from "lucide-react";

function formatBRL(value) {
  return Number(value || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function InstallmentCalculator() {
  const [cashPrice, setCashPrice] = useState("1000");
  const [installments, setInstallments] = useState("10");
  const [installmentValue, setInstallmentValue] = useState("110");

  const result = useMemo(() => {
    const cash = Number(cashPrice) || 0;
    const n = Number(installments) || 0;
    const value = Number(installmentValue) || 0;
    const totalInstallment = n * value;
    const difference = totalInstallment - cash;
    const percentExtra = cash > 0 ? (difference / cash) * 100 : 0;
    return { totalInstallment, difference, percentExtra };
  }, [cashPrice, installments, installmentValue]);

  const worseThanCash = result.difference > 0;

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <div>
          <label className="text-xs font-medium text-muted block mb-1">Valor à vista</label>
          <input
            type="number"
            inputMode="decimal"
            value={cashPrice}
            onChange={(e) => setCashPrice(e.target.value)}
            className="w-full p-2 border border-line rounded-lg text-sm bg-card text-ink focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted block mb-1">Nº de parcelas</label>
          <input
            type="number"
            inputMode="numeric"
            value={installments}
            onChange={(e) => setInstallments(e.target.value)}
            className="w-full p-2 border border-line rounded-lg text-sm bg-card text-ink focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted block mb-1">Valor de cada parcela</label>
          <input
            type="number"
            inputMode="decimal"
            value={installmentValue}
            onChange={(e) => setInstallmentValue(e.target.value)}
            className="w-full p-2 border border-line rounded-lg text-sm bg-card text-ink focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
      </div>

      <div className="bg-surface border border-line rounded-lg p-4 flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
            worseThanCash ? "bg-expense-light" : "bg-primary-light"
          }`}
        >
          <Scale size={18} className={worseThanCash ? "text-expense" : "text-primary-dark"} />
        </div>
        <div>
          <p className="text-xs text-muted">Total parcelado: {formatBRL(result.totalInstallment)}</p>
          {worseThanCash ? (
            <p className="font-display text-lg font-bold text-expense">
              {formatBRL(result.difference)} a mais ({result.percentExtra.toFixed(1)}%)
            </p>
          ) : (
            <p className="font-display text-lg font-bold text-primary">
              Parcelado sai igual ou mais barato
            </p>
          )}
          <p className="text-xs text-muted mt-0.5">Comparado a pagar {formatBRL(cashPrice)} à vista.</p>
        </div>
      </div>
    </div>
  );
}
