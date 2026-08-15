# MVP Template - Plataforma de Gestão (v1.1.0)

Este é o template padrão oficial para desenvolvimento ágil de MVPs e protótipos na empresa. Ele utiliza Next.js (App Router) com TypeScript, Tailwind CSS, Shadcn/ui, e integrações com o Firebase estruturadas sobre conceitos de **Atomic Design**.

## Tecnologias Principais

- **Framework:** Next.js (App Router)
- **Estilização:** Tailwind CSS & Shadcn/ui
- **Banco de Dados & Autenticação:** Firebase (Auth, Firestore, Storage)
- **Testes Unitários:** Vitest & React Testing Library (RTL)
- **Validador Arquitetural:** Dependency Cruiser
- **Arquitetura de Componentes:** Baseada em Atomic Design (Atoms, Molecules, Organisms)

---

## Como Iniciar um Novo Projeto

### Passo 1: Configurar Variáveis de Ambiente
O repositório vem configurado por padrão com credenciais dummy (`demo-project`) no arquivo `.env` para que o projeto funcione **imediatamente out-of-the-box (Modo Mock)**. 

Para conectar ao seu banco real do Firebase:
1. Duplique o arquivo `.env.example` e renomeie-o para `.env` (se já não existir):
   ```bash
   cp .env.example .env
   ```
2. Substitua os placeholders do Firebase pelas credenciais reais do seu projeto do console do Firebase.

### Passo 2: Instalar as Dependências
Instale todos os pacotes necessários utilizando o npm:
```bash
npm install
```

### Passo 3: Executar o Servidor de Desenvolvimento
```bash
npm run dev
```
A aplicação estará rodando em `http://localhost:3000`.

---

## Modo de Teste Local (Mock Mode)
Se nenhuma credencial real do Firebase for fornecida no `.env` (mantendo as chaves dummy padrões), o template entra automaticamente em **Modo Mock (Client-side)**:
- **Login Livre:** Você pode entrar com qualquer usuário e senha (ex: `admin@template.com` / `admin`).
- **Sessão Local:** A autenticação e fluxo de estado da aplicação funcionarão localmente persistidos em memória e no `localStorage` do navegador, dispensando qualquer banco de dados físico.

---

## Estrutura do Projeto (Atomic Design)

- `/app`: Páginas, rotas públicas/autenticadas e layouts principais do Next.js.
- `/components`: Componentes visuais organizados por nível de complexidade:
  - `/ui`: Componentes elementares (Atoms), como `Button`, `Input`, `Card`.
  - `/molecules`: Combinações simples de átomos.
  - `/organisms`: Componentes de alta complexidade e lógica integrada (ex: `AppSidebar`).
- `/contexts`: Contextos do React para controle de estado (ex: autenticação).
- `/hooks`: Hooks customizados e utilitários de estado.
- `/lib`: Configurações de serviços (Firebase), utilitários globais e interfaces de tipos.
- `/tests`: Arquivos de configuração global e helpers genéricos de testes.

---

## Testes Automatizados e Validação

Este template possui scripts dedicados para garantir a qualidade do código e a integridade da arquitetura de componentes:

### 1. Testes Unitários de Componentes (Vitest)
Executa a suíte de testes rápidos cobrindo comportamentos de componentes de UI e lógica do projeto:
```bash
# Executa todos os testes uma única vez
npm run test

# Executa em modo watch (desenvolvimento ativo)
npm run test:watch
```

### 2. Linter Arquitetural (Dependency Cruiser)
Valida se as fronteiras de dependência do Atomic Design não foram violadas (ex: impede que um componente básico sob `components/ui` importe lógica de `components/organisms`):
```bash
npm run test:arch
```

### 3. Build de Produção
Gera a versão compilada e otimizada para implantação em produção:
```bash
npm run build
```
