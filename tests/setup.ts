import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Executa cleanup após cada teste para evitar vazamentos de estado entre as asserções
afterEach(() => {
  cleanup();
});
