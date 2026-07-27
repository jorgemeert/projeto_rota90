import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatPeriodLabel, shiftPeriod } from "../utils/period";

export default function PeriodSelector({ period, onChange }) {
  return (
    <div className="inline-flex items-center gap-1 bg-card border border-line rounded-lg px-1 py-1">
      <button
        onClick={() => onChange(shiftPeriod(period, -1))}
        className="p-1.5 text-muted hover:text-ink rounded-md hover:bg-surface"
        aria-label="Mês anterior"
      >
        <ChevronLeft size={16} />
      </button>
      <span className="text-sm font-medium text-ink px-2 min-w-[130px] text-center">
        {formatPeriodLabel(period)}
      </span>
      <button
        onClick={() => onChange(shiftPeriod(period, 1))}
        className="p-1.5 text-muted hover:text-ink rounded-md hover:bg-surface"
        aria-label="Próximo mês"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
