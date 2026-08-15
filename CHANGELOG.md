# CHANGELOG

## [1.1.0] - 2026-07-02

### Adicionado
- Configuração do framework de testes unitários **Vitest** integrado com `@testing-library/react` e ambiente virtual `jsdom`.
- Criado helper utilitário genérico `tests/test-utils.tsx` contendo a função `runGenericComponentTests` para automatizar testes repetitivos de componentes atômicos (como renderização, mesclagem de Tailwind `className`, repasse de atributos e estados).
- Criados arquivos de testes unitários de exemplo para os componentes `Button` (`components/ui/button.test.tsx`) e `Input` (`components/ui/input.test.tsx`).
- Configuração do linter arquitetural **Dependency Cruiser** (`.dependency-cruiser.js`) que valida automaticamente o grafo de importações e garante que regras do *Atomic Design* não sejam violadas (ex: atoms importando organismos).
- Adicionados os scripts `npm run test` (roda testes uma vez), `npm run test:watch` (watch mode) e `npm run test:arch` (validação de arquitetura).

## [1.0.0] - 2026-07-02

### Adicionado
- Modo de autenticação mock/teste local (client-side in-memory & localStorage) que é ativado automaticamente caso não sejam fornecidas credenciais de produção do Firebase.
- Arquivos `.env` e `.env.example` populados com credenciais do Firebase no formato template/dummy para assegurar o funcionamento do compilador sem erros de validação da API key.
- Arquivo de configuração `.eslintrc.json` configurado de forma padrão no template.

### Alterado
- Renomeados todos os cabeçalhos, títulos de páginas, metadados de layout e chaves de tokens locais de "Q Vida" / "qvida-platform" para "MVP Template" / "mvp-template".
- Atualizado o `README.md` com as instruções para o novo template padrão genérico.
- Alterada a role padrão de novos usuários criados de `"family member"` para `"user"`.
- Corrigido bug no botão de Logout (`user-profile.tsx`) que não invocava a função `logout`.

### Removido
- Removido o item de menu "Família" da barra de navegação principal.
- Excluído todo o domínio, páginas de rota e componentes da árvore genealógica de "Família" (`app/(auth)/familia`, `components/organisms/family`).
- Excluído o contexto (`contexts/family.context.tsx`), serviço (`lib/services/family.service.ts`) e interface de tipos (`lib/interfaces/family.interface.ts`) referentes à Família.
