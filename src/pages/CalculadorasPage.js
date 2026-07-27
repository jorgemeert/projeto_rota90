import React, { useState } from "react";
import TopBar from "../components/TopBar";
import Tabs from "../components/Tabs";
import CompoundInterestCalculator from "../components/CompoundInterestCalculator";
import GoalCalculator from "../components/GoalCalculator";
import InstallmentCalculator from "../components/InstallmentCalculator";

const TABS = [
  { id: "juros", label: "Juros compostos" },
  { id: "meta", label: "Meta mensal" },
  { id: "parcelamento", label: "Parcelado vs à vista" }
];

const DESCRIPTIONS = {
  juros: "Veja como seu dinheiro cresce com aportes mensais e juros compostos ao longo do tempo.",
  meta: "Descubra quanto guardar por mês para bater uma meta financeira dentro do prazo.",
  parcelamento: "Compare o custo total de parcelar uma compra contra pagar à vista."
};

export default function CalculadorasPage({ onOpenSidebar }) {
  const [active, setActive] = useState("juros");

  return (
    <div>
      <TopBar title="Calculadoras" onOpenSidebar={onOpenSidebar} />
      <div className="space-y-4">
        <Tabs tabs={TABS} active={active} onChange={setActive} />

        <div className="bg-card rounded-xl shadow-card border border-line p-5">
          <p className="text-xs text-muted mb-4">{DESCRIPTIONS[active]}</p>
          {active === "juros" && <CompoundInterestCalculator />}
          {active === "meta" && <GoalCalculator />}
          {active === "parcelamento" && <InstallmentCalculator />}
        </div>
      </div>
    </div>
  );
}
