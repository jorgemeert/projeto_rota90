# Rota90 — Organização Financeira Pessoal

Front-end (React + Tailwind + Recharts) para organização financeira pessoal:
login/cadastro, Orçamento por período (Receitas/Despesas), Investimentos (reserva
de emergência), Patrimônio, Calculadoras e Central de Ajuda — com estado
compartilhado em memória (Context + useReducer) e persistência automática no
navegador via `localStorage`.

## Como rodar

```bash
npm install
npm start
```

Abre em `http://localhost:3000`.

## Build de produção

```bash
npm run build
```

## Login e cadastro

Antes de entrar no app, a pessoa passa por login/cadastro (com "esqueci minha
senha" client-only, já que não há servidor de e-mail). Contas e sessão ficam
salvas no `localStorage`, e cada conta tem seus próprios dados financeiros
(chave de armazenamento isolada por e-mail). A senha é transformada em hash
(SHA-256 + salt) antes de ser salva — não é hash forte tipo bcrypt/argon2, mas
já evita guardar senha em texto puro no cliente.

**Ainda assim, isso é um MVP/demo, não uma autenticação de produção.** Sem
back-end, qualquer coisa salva no navegador pode ser inspecionada por quem tem
acesso àquele navegador. Para produção de verdade: back-end com hash forte
(bcrypt/argon2), tokens de sessão (JWT ou similar) e HTTPS.

## Sobre os dados

- Os dados ficam salvos automaticamente no navegador (localStorage) — não
  precisa preencher tudo de novo toda vez que abrir o app.
- Isso funciona só naquele navegador/dispositivo (não sincroniza entre
  aparelhos). Por isso, a página de **Configurações** tem **Exportar/Importar
  dados** (arquivo `.json`) para backup manual ou troca de dispositivo.
- Também há uma opção de "Limpar todos os dados" em Configurações.

## Páginas

- **Visão geral**: resumo consolidado + onboarding para quem está começando.
- **Orçamento**: navegação por mês/período, receitas (salário + renda extra
  por período, com composição percentual), despesas fixas/variáveis por
  categoria com data de vencimento, resumo de fluxo, edição e exclusão (com
  confirmação) de lançamentos, filtro por descrição/categoria.
- **Investimentos**: calculadora de reserva de emergência (6/12 meses),
  progresso em formato de escudo, alocação por local (caixinha, banco, Tesouro
  Selic).
- **Patrimônio**: ativos e dívidas, com edição inline, confirmação de exclusão
  e patrimônio líquido calculado.
- **Calculadoras**: juros compostos (com gráfico de evolução), meta mensal,
  parcelado vs. à vista.
- **Ajuda**: FAQ, guia rápido em 3 etapas e formulário de suporte.
- **Configurações**: gestão de categorias (com renomear), backup (exportar/
  importar) e limpeza de dados salvos.

## O que foi ajustado nesta rodada

- **Configuração de salário**: escolha entre **Fixo** (define uma vez — por
  valor mensal, por dia trabalhado ou por hora trabalhada — e o valor mensal é
  calculado e aplicado automaticamente todo mês, sem precisar preencher de
  novo) ou **Variável** (digita o valor manualmente todo mês, para quem não
  tem um salário certo).
- **Modo escuro**, com botão na sidebar (e nas telas de login/cadastro) — fica
  salvo e é aplicado automaticamente na próxima visita.
- **Despesas fixas recorrentes**: ao cadastrar uma despesa fixa, você escolhe
  entre "tempo indeterminado" (continua aparecendo todo mês até editar/remover)
  ou "até uma data específica" (some sozinha depois daquele mês — útil para
  financiamentos e parcelamentos). Não precisa mais lançar a mesma conta todo mês.
- Edição de lançamentos (antes só dava para excluir e recriar).
- Confirmação antes de excluir qualquer item (despesa, ativo, categoria).
- Filtro por descrição/categoria funcionando de verdade no Orçamento.
- Recuperação de senha (client-only).
- Exportar/Importar dados em JSON.
- Conceito de período/mês no Orçamento, com navegação entre meses.
- Card de "Patrimônio total protegido" ligando Investimentos e Patrimônio.
- Onboarding simples para quem ainda não lançou nada.
- Feedback visual (toasts) após adicionar/editar/remover.
- Senha com hash (SHA-256 + salt) em vez de texto puro.

## Sobre as despesas fixas recorrentes

Elas são guardadas como um "molde" (categoria, valor, dia de vencimento, início
e — se aplicável — fim), não como um lançamento por mês. Isso tem uma
consequência importante: **editar ou remover uma despesa fixa afeta todos os
meses em que ela aparece**, inclusive meses já visualizados no passado, porque
a lista de cada mês é calculada a partir desse molde, e não salva mês a mês.
Se um valor mudou num mês específico (ex.: conta de luz variou), lance a
diferença como despesa variável naquele mês, em vez de editar o valor fixo.


## O que ainda fica de fora (de propósito, por escopo)

- **Testes automatizados**: não há suíte de testes. Para um projeto que vai
  crescer, vale adicionar (React Testing Library, por exemplo).
- **Auditoria de acessibilidade completa**: os modais fecham com Esc e têm
  `aria-label` nos botões de ícone, mas não houve uma auditoria completa de
  navegação por teclado/leitor de tela.
- **Autenticação de produção**: como explicado acima, ainda depende de um
  back-end de verdade para ser segura para dados reais.
- **Sincronização entre dispositivos**: sem back-end, cada navegador tem seus
  próprios dados — por isso o exportar/importar como alternativa manual.

## Próximos passos sugeridos

- Trocar o `localStorage` por uma API (endpoints REST) para sincronizar entre
  dispositivos e ter autenticação de verdade.
- Adicionar testes automatizados conforme o projeto crescer.
