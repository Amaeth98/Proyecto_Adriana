'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, Save } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { apiRequest } from '@/lib/api';
import { AuthUser, User } from '@/lib/types';

export default function SettingsPage() {
  const router = useRouter();
  const { token, user, updateUser, logout } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user || !token) {
      router.push('/login');
      return;
    }

    setName(user.name);
    setEmail(user.email);
  }, [user, token, router]);

  async function saveProfile(event: FormEvent) {
    event.preventDefault();
    if (!token || !user) return;

    setMessage('');
    setError('');
    try {
      const body = {
        name,
        email,
        ...(password ? { password } : {}),
      };
      const updated = await apiRequest<User>('/users/profile', {
        method: 'PATCH',
        token,
        body: JSON.stringify(body),
      });
      const nextUser: AuthUser = {
        sub: updated.id,
        name: updated.name,
        email: updated.email,
        role: updated.role,
      };
      updateUser(nextUser);
      setPassword('');
      setMessage('Perfil actualizado correctamente');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo actualizar el perfil');
    }
  }

  function closeSession() {
    logout();
    router.push('/');
  }

  return (
    <section className="settings-layout">
      <div className="panel form-grid">
        <div>
          <h1>Ajustes</h1>
          <p className="muted">Edita los datos de tu perfil.</p>
        </div>
        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}
        <form className="form-grid" onSubmit={saveProfile}>
          <label>
            Nombre
            <input value={name} onChange={(event) => setName(event.target.value)} required />
          </label>
          <label>
            Email
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              required
            />
          </label>
          <label>
            Nueva password
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              minLength={6}
              placeholder="Dejar en blanco para no cambiarla"
            />
          </label>
          <button type="submit">
            <Save size={18} />
            Guardar cambios
          </button>
        </form>
      </div>
      <aside className="panel form-grid">
        <h2>Sesion</h2>
        <p className="muted">
          Al cerrar sesion se elimina el token JWT guardado en el navegador.
        </p>
        <button type="button" className="danger" onClick={closeSession}>
          <LogOut size={18} />
          Cerrar sesion
        </button>
      </aside>
    </section>
  );
}
