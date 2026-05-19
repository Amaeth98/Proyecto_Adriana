'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { apiRequest } from '@/lib/api';
import { AuthUser } from '@/lib/types';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');
    try {
      const response = await apiRequest<{ token: string; user: AuthUser }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      login(response.token, response.user);
      router.push('/productos');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo iniciar sesion');
    }
  }

  return (
    <section className="panel form-grid">
      <h1>Login</h1>
      <p className="muted">Genera el token JWT para acceder al carrito y a la gestion.</p>
      {error && <p className="error">{error}</p>}
      <form className="form-grid" onSubmit={handleSubmit}>
        <label>
          Email
          <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" />
        </label>
        <label>
          Password
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
          />
        </label>
        <button type="submit">Entrar</button>
      </form>
    </section>
  );
}
