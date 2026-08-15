import React from 'react';
import { screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { Input } from './input';
import { runGenericComponentTests, render } from '@/tests/test-utils';
import userEvent from '@testing-library/user-event';

describe('Componente Input (Atom)', () => {
  // Roda a suíte genérica de testes
  runGenericComponentTests(Input, { type: 'text' }, { testDisabledState: true });

  test('deve atualizar o valor quando o usuário digita no input', async () => {
    render(<Input placeholder="Digite seu nome" />);
    
    const input = screen.getByPlaceholderText('Digite seu nome');
    expect(input).toHaveValue('');
    
    await userEvent.type(input, 'Germano');
    expect(input).toHaveValue('Germano');
  });

  test('deve alterar o foco do elemento quando clicado', async () => {
    render(<Input placeholder="Campo Foco" />);
    
    const input = screen.getByPlaceholderText('Campo Foco');
    expect(input).not.toHaveFocus();
    
    await userEvent.click(input);
    expect(input).toHaveFocus();
  });
});
