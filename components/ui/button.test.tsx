import React from 'react';
import { screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { Button } from './button';
import { runGenericComponentTests, render } from '@/tests/test-utils';
import userEvent from '@testing-library/user-event';

describe('Componente Button (Atom)', () => {
  // Roda a suíte genérica de testes automatizados (renderização, classes Tailwind e ref do data-testid)
  runGenericComponentTests(Button, {}, { testDisabledState: true, children: 'Button Text' });

  test('deve aplicar as classes corretas de variante (ex: variant="destructive")', () => {
    const { container } = render(<Button variant="destructive">Destrutivo</Button>);
    expect(container.firstChild).toHaveClass('bg-destructive');
  });

  test('deve aplicar as classes corretas de tamanho (ex: size="sm")', () => {
    const { container } = render(<Button size="sm">Pequeno</Button>);
    expect(container.firstChild).toHaveClass('h-9');
  });

  test('deve disparar evento onClick ao ser clicado pelo usuário', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Enviar</Button>);
    
    const button = screen.getByRole('button', { name: /enviar/i });
    await userEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
