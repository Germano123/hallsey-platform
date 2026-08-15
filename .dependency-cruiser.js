/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: 'no-atoms-importing-molecules-or-organisms',
      comment: 'Componentes atômicos básicos (components/ui) não devem importar Molecules ou Organisms para evitar acoplamento.',
      severity: 'error',
      from: { path: '^components/ui/' },
      to: { path: '(^components/organisms/|^components/molecules/)' }
    },
    {
      name: 'no-molecules-importing-organisms',
      comment: 'Molecules não devem depender de Organisms (reversão de dependência de complexidade).',
      severity: 'error',
      from: { path: '^components/molecules/' },
      to: { path: '^components/organisms/' }
    },
    {
      name: 'no-lib-importing-ui-layer',
      comment: 'A lógica de infraestrutura e serviços (lib) não deve importar componentes visuais ou páginas.',
      severity: 'error',
      from: { path: '^lib/' },
      to: { path: '(^components/|^app/)' }
    }
  ],
  options: {
    doNotFollow: {
      path: 'node_modules'
    },
    tsPreCompilationDeps: true,
    tsConfig: {
      fileName: 'tsconfig.json'
    }
  }
};
