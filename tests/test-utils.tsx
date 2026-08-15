import React from 'react';
import { render as rtlRender, screen } from '@testing-library/react';
import { expect, test } from 'vitest';

// Renderizador customizado (caso seja necessário envelopar com Providers no futuro)
export function render(ui: React.ReactElement, options = {}) {
  return rtlRender(ui, { ...options });
}

/**
 * Roda asserções genéricas padrão em componentes atômicos de interface.
 * Útil para testar rapidamente repasse de classes do Tailwind, atributos padrão e estados.
 */
export function runGenericComponentTests(
  Component: React.ComponentType<any>,
  defaultProps: any = {},
  options: {
    testDisabledState?: boolean;
    disabledPropName?: string;
    children?: React.ReactNode;
  } = {}
) {
  test('deve renderizar o componente com sucesso', () => {
    const { container } = render(
      <Component {...defaultProps}>
        {options.children}
      </Component>
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  test('deve repassar e mesclar classes CSS adicionais (Tailwind/className)', () => {
    const testClass = 'custom-test-class-name';
    const { container } = render(
      <Component {...defaultProps} className={testClass}>
        {options.children}
      </Component>
    );
    expect(container.firstChild).toHaveClass(testClass);
  });

  test('deve repassar atributos HTML padrão como data-testid', () => {
    render(
      <Component {...defaultProps} data-testid="generic-element">
        {options.children}
      </Component>
    );
    expect(screen.getByTestId('generic-element')).toBeInTheDocument();
  });

  if (options.testDisabledState) {
    test('deve respeitar a propriedade disabled', () => {
      const propName = options.disabledPropName || 'disabled';
      const props = { ...defaultProps, [propName]: true };
      
      render(
        <Component {...props} data-testid="disabled-element">
          {options.children}
        </Component>
      );
      
      const element = screen.getByTestId('disabled-element');
      expect(element).toBeDisabled();
    });
  }
}
