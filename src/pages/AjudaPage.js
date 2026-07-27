import React, { useState } from "react";
import { LifeBuoy, BookOpenText, Send, CheckCircle2 } from "lucide-react";
import TopBar from "../components/TopBar";
import FaqAccordion from "../components/FaqAccordion";

const FAQ_ITEMS = [
  {
    question: "Como calcular minha reserva de emergência?",
    answer:
      "Multiplique seu custo mensal de vida por 6 (situação estável) ou 12 (renda variável ou incerta). Use a calculadora na página Investimentos para isso automaticamente."
  },
  {
    question: "O que são gastos fixos?",
    answer:
      "São despesas que se repetem todo mês com valor igual ou parecido, como aluguel, internet e assinaturas. Já os gastos variáveis mudam de valor mês a mês, como mercado e lazer."
  },
  {
    question: "Como quitar dívidas com mais eficiência?",
    answer:
      "Liste todas as dívidas com valor e juros. Priorize quitar primeiro as de juros mais altos (ex.: cartão de crédito e cheque especial) enquanto mantém o pagamento mínimo das demais."
  },
  {
    question: "Qual a diferença entre reserva de emergência e investimento?",
    answer:
      "A reserva precisa de liquidez imediata e baixo risco — é sua proteção contra imprevistos. Investimentos com foco em rentabilidade só fazem sentido depois que a reserva estiver completa."
  },
  {
    question: "Posso editar um lançamento depois de adicionado?",
    answer:
      "Nesta versão, você pode remover o lançamento na lista e adicionar novamente com os dados corretos."
  }
];

const GUIDES = [
  {
    title: "Etapa 1 · Organize seus gastos",
    text: "Separe despesas fixas de variáveis e categorize cada uma. Isso mostra pra onde seu dinheiro está indo de verdade antes de qualquer decisão."
  },
  {
    title: "Etapa 2 · Monte sua reserva",
    text: "Com os gastos organizados, calcule seu custo mensal de vida e comece a guardar até atingir de 6 a 12 meses de cobertura, priorizando liquidez."
  },
  {
    title: "Etapa 3 · Elimine dívidas caras",
    text: "Com a reserva formada, direcione o excedente para quitar dívidas com juros altos antes de pensar em investimentos de rentabilidade."
  }
];

export default function AjudaPage({ onOpenSidebar }) {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return;
    setSent(true);
    setForm({ name: "", email: "", message: "" });
  }

  return (
    <div>
      <TopBar title="Central de ajuda" onOpenSidebar={onOpenSidebar} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-card rounded-xl shadow-card border border-line p-5">
            <div className="flex items-center gap-2 mb-1">
              <LifeBuoy size={18} className="text-primary" />
              <h2 className="font-display font-semibold text-ink">Perguntas frequentes</h2>
            </div>
            <p className="text-xs text-muted mb-2">Respostas rápidas para as dúvidas mais comuns.</p>
            <FaqAccordion items={FAQ_ITEMS} />
          </div>

          <div className="bg-card rounded-xl shadow-card border border-line p-5">
            <div className="flex items-center gap-2 mb-1">
              <BookOpenText size={18} className="text-primary" />
              <h2 className="font-display font-semibold text-ink">Guia rápido do plano de 90 dias</h2>
            </div>
            <p className="text-xs text-muted mb-4">Consulta direta, sem curso ou vídeo — só o essencial.</p>
            <div className="space-y-4">
              {GUIDES.map((guide) => (
                <div key={guide.title} className="border-l-2 border-primary pl-3">
                  <h3 className="text-sm font-semibold text-ink">{guide.title}</h3>
                  <p className="text-sm text-muted leading-relaxed mt-0.5">{guide.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl shadow-card border border-line p-5">
          <h2 className="font-display font-semibold text-ink mb-1">Fale com o suporte</h2>
          <p className="text-xs text-muted mb-4">
            Não encontrou o que precisava? Manda sua dúvida ou feedback abaixo.
          </p>

          {sent ? (
            <div className="flex flex-col items-center text-center py-6">
              <CheckCircle2 size={28} className="text-primary mb-2" />
              <p className="text-sm font-medium text-ink">Mensagem enviada!</p>
              <p className="text-xs text-muted mt-1">Vamos responder o quanto antes.</p>
              <button
                onClick={() => setSent(false)}
                className="mt-4 text-xs font-medium text-primary hover:underline"
              >
                Enviar outra mensagem
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-medium text-muted block mb-1">Nome</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="w-full p-2 border border-line rounded-lg text-sm bg-card text-ink focus:outline-none focus:ring-2 focus:ring-primary/30"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted block mb-1">E-mail</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="w-full p-2 border border-line rounded-lg text-sm bg-card text-ink focus:outline-none focus:ring-2 focus:ring-primary/30"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted block mb-1">Mensagem</label>
                <textarea
                  value={form.message}
                  onChange={(e) => handleChange("message", e.target.value)}
                  rows={4}
                  className="w-full p-2 border border-line rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 text-sm font-medium text-white bg-primary py-2 rounded-lg hover:bg-primary-dark"
              >
                <Send size={14} /> Enviar
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
