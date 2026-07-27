# Deploy do Rota90

Este projeto é 100% front-end hoje (sem back-end), então o deploy é simples:
é só um site estático. Vercel e Netlify têm plano gratuito que fica **sempre no
ar, sem dormir** — diferente de back-ends gratuitos (tipo Render), que hibernam
depois de um tempo sem uso.

O repositório Git já está inicializado dentro desta pasta (`git log` mostra o
commit inicial). Você só precisa criar um repositório vazio no GitHub e subir.

## Passo 1 — Subir pro GitHub

1. Cria um repositório novo, vazio, no GitHub (sem README/gitignore — já tem aqui).
2. No terminal, dentro da pasta `rota90`:

```bash
git remote add origin https://github.com/SEU-USUARIO/rota90.git
git branch -M main
git push -u origin main
```

(troca `SEU-USUARIO` pelo seu usuário do GitHub — o mesmo `jorgemeert` que você
já usa nos outros projetos)

## Passo 2 — Deploy na Vercel (recomendado)

1. Cria conta em [vercel.com](https://vercel.com) usando login do GitHub.
2. Clica em **Add New → Project**.
3. Seleciona o repositório `rota90`.
4. A Vercel detecta sozinha que é Create React App — não precisa mudar nada
   (build command `npm run build`, output `build`).
5. Clica em **Deploy**.

Em 1-2 minutos você tem uma URL tipo `rota90-jorgemeert.vercel.app`, já rodando
24h, com HTTPS automático. Todo `git push` novo na branch `main` atualiza o site
sozinho.

## Alternativa — Netlify

Mesma lógica: [netlify.com](https://netlify.com) → **Add new site → Import an
existing project** → conecta o GitHub → seleciona o repositório → build command
`npm run build`, publish directory `build` → **Deploy**.

## Importante sobre os dados

Como os dados ficam salvos no `localStorage` do navegador (não em um banco de
dados), cada pessoa que acessar o site terá seus próprios dados **só naquele
navegador**. Isso não muda com o deploy — é a mesma limitação de antes, só que
agora acessível pela internet em vez de só na sua máquina.

## Quando tiver o back-end (Flask)

Quando você migrar pra um back-end de verdade (Flask + banco de dados), o
front-end continua no Vercel/Netlify, mas passa a fazer chamadas para uma API
hospedada separadamente (ex.: Render, Railway). Nesse momento entra a
configuração de variável de ambiente com a URL da API e ajuste de CORS no
back-end para aceitar requisições vindas do domínio da Vercel/Netlify.
