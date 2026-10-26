# Ritmo

Aplicação demonstrativa em React/Vite e Node.js/Express. Inclui dashboard com resumo eleitoral, administração de usuários fictícios e consulta das imagens que originaram os dados. Login, tokens e cadastros ficam em memória; não use este exemplo como autenticação de produção.

## Estrutura

```text
.
├── server/
│   ├── data.js         # Equipe demonstrativa e recorte de estados
│   └── server.js       # API Express na porta 4000
├── src/
│   ├── components/     # Navegação, resumo, usuários e análise
│   ├── App.jsx         # Login e integração com a API
│   ├── Admin.css       # Estilos do painel administrativo
│   └── App.test.jsx    # Teste de fluxo React
├── tests/
│   └── e2e/            # Testes end-to-end Playwright
├── img/                # Capturas de referência exibidas na análise
├── playwright.config.js
├── index.html
├── package.json
└── vite.config.js      # Proxy de /api para o Express
```

## Executar no Codespaces

Na raiz do projeto, instale as dependências e inicie frontend e backend juntos:

```bash
npm install
npm run dev
```

Abra a porta `3000` no navegador do Codespaces. Para executar apenas a API, use `npm run server` (porta `4000`). Qualquer e-mail válido e senha não vazia funcionam no login demonstrativo.

## Verificação

```bash
npm test -- --run
npm run build
npm run test:e2e
```

Para abrir a interface interativa do Playwright:

```bash
npm run test:e2e:ui
```

No Codespaces, abra a porta `9323` para acessar a interface. O Playwright inicia frontend e API automaticamente quando necessário.

## Publicar e validar no GitHub

O projeto inclui um workflow de integração contínua em `.github/workflows/ci.yml`. Em cada push ou pull request para a branch principal, ele instala as dependências com `npm ci`, executa os testes unitários, valida o build e roda os testes end-to-end no Chromium. Relatórios e resultados locais do Playwright, dependências, build e arquivos `.env` são ignorados pelo Git; não adicione credenciais ou dados pessoais ao repositório.

Antes de publicar, confira os arquivos que serão enviados:

```bash
git status --short
git diff --check
```

Depois, crie o repositório no GitHub, adicione o remote e envie a branch conforme o fluxo da equipe. O campo `private` em `package.json` impede publicação no npm, mas não impede versionar o projeto no GitHub.

## Desafios técnicos e soluções

### Alinhamento entre teste e aplicação

**Desafio:** o teste apontava para `localhost:3001`, enquanto o Vite serve o frontend na porta `3000`. Além disso, a API Express usa a porta `4000` e precisa estar ativa para os fluxos autenticados.

**Solução:** configurei `baseURL` como `http://127.0.0.1:3000` em `playwright.config.js` e defini `webServer` para iniciar `npm run dev` antes dos testes. Esse script levanta Vite e Express em conjunto; o Vite encaminha as chamadas `/api` para a API na porta `4000`. Assim, o Playwright prepara o ambiente e aguarda o frontend ficar disponível antes de executar os testes.

### Integração com o runner do Playwright

**Desafio:** o teste original inicializava o Chromium diretamente com `chromium.launch()`, em vez de usar o runner do Playwright. Esse formato não integra o ciclo de execução e a visualização dos testes à interface interativa.

**Solução:** adaptei os fluxos para usar `test` e a fixture `page` do Playwright Test. Os arquivos em `tests/e2e/` seguem o padrão `*.spec.js` e são descobertos pelo `testMatch: '**/*.spec.js'`; podem ser executados tanto pelo runner convencional quanto pela UI.

### Execução da CLI neste ambiente

**Desafio:** neste Codespace, o executável `playwright` não estava disponível em `node_modules/.bin`, apesar de o pacote `@playwright/test` estar instalado.

**Solução:** configurei os scripts npm para chamar diretamente `node_modules/@playwright/test/cli.js`. Isso permite executar os testes e abrir a UI sem depender do link binário ausente.

### Acesso à interface no Codespaces

**Desafio:** a UI precisa escutar numa interface acessível pelo encaminhamento de portas do Codespaces, e não apenas no loopback interno do processo.

**Solução:** o script `test:e2e:ui` inicia a UI em `0.0.0.0:9323`. No Codespaces, basta abrir ou encaminhar a porta `9323` para interagir com os testes.

### Validação do fluxo

Os testes end-to-end cobrem login, contador, chamada à API, busca e filtro de usuários, criação de usuário e visualização dos dados eleitorais. Após a reorganização, `npm run test:e2e` concluiu com **2 testes aprovados**; os testes unitários e o build de produção também passaram. Para repetir a validação, execute os comandos listados em [Verificação](#verificação); para inspecionar e executar os fluxos pela interface, use `npm run test:e2e:ui`.

O recorte numérico da tela foi transcrito manualmente de seis estados legíveis na captura. Revise a imagem original em `img/` antes de reutilizar os valores.