import { expect, test, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import App from './App';

test('faz login, aciona a API e permite encerrar a sessão', async () => {
  const fetchMock = vi.fn()
    .mockResolvedValueOnce({ ok: true, json: async () => ({ token: 'demo-token' }) })
    .mockResolvedValueOnce({ ok: true, json: async () => ({ user: { name: 'Ana', email: 'ana@example.com' } }) })
    .mockResolvedValueOnce({ ok: true, json: async () => ({ users: [], demoData: true }) })
    .mockResolvedValueOnce({ ok: true, json: async () => ({ states: [], demoData: true }) })
    .mockResolvedValueOnce({ ok: true, json: async () => ({ message: 'Ação recebida, Ana.' }) });
  vi.stubGlobal('fetch', fetchMock);

  render(<App />);

  fireEvent.change(screen.getByLabelText('E-mail'), { target: { value: 'ana@example.com' } });
  fireEvent.change(screen.getByLabelText('Senha'), { target: { value: 'senha' } });
  fireEvent.click(screen.getByRole('button', { name: 'Entrar' }));

  expect(await screen.findByRole('heading', { name: 'Bom dia, Ana.' })).toBeTruthy();
  expect(fetchMock).toHaveBeenNthCalledWith(2, '/api/user/profile', {
    headers: { Authorization: 'Bearer demo-token' },
  });
  fireEvent.click(screen.getByRole('button', { name: /acionar a api/i }));
  expect((await screen.findByRole('status')).textContent).toContain('Ação recebida, Ana.');
  fireEvent.click(screen.getByRole('button', { name: 'Aumentar contador' }));
  expect(screen.getByText('01', { selector: '.quick-counter strong' })).toBeTruthy();
  fireEvent.click(screen.getByRole('button', { name: /sair/i }));
  await waitFor(() => expect(screen.getByRole('heading', { name: 'Entre no seu espaço.' })).toBeTruthy());
  vi.unstubAllGlobals();
});
