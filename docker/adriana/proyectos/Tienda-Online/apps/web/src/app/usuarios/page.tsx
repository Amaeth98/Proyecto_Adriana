'use client';

import { Save, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { ApiError, apiRequest } from '@/lib/api';
import { Role, User } from '@/lib/types';

export default function UsersPage() {
  const router = useRouter();
  const { token, user, ready, logout } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState('');

  async function loadUsers() {
    if (!token) return;
    setError('');
    try {
      setUsers(await apiRequest<User[]>('/users', { token }));
    } catch (err) {
      if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
        if (err.status === 401) logout();
        router.push(err.status === 401 ? '/login' : '/productos');
        return;
      }
      setError(err instanceof Error ? err.message : 'No se pudieron cargar los usuarios');
    }
  }

  useEffect(() => {
    if (!ready) return;
    if (!token) router.push('/login');
    else if (user && user.role !== 'admin') router.push('/productos');
    else if (!user) router.push('/login');
    else void loadUsers();
  }, [ready, token, user, router]);

  async function updateRole(id: number, role: Role) {
    if (!token) return;
    setError('');
    try {
      await apiRequest(`/users/${id}`, {
        method: 'PATCH',
        token,
        body: JSON.stringify({ role }),
      });
      await loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo actualizar');
    }
  }

  async function removeUser(id: number) {
    if (!token) return;
    await apiRequest(`/users/${id}`, { method: 'DELETE', token });
    await loadUsers();
  }

  return (
    <section className="panel form-grid">
      <h1>Usuarios</h1>
      <p className="muted">Gestion de perfil usuario/admin desde la web.</p>
      {error && <p className="error">{error}</p>}
      <table className="table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Perfil</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {users.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.email}</td>
              <td>
                <select
                  value={item.role}
                  onChange={(event) => updateRole(item.id, event.target.value as Role)}
                >
                  <option value="usuario">usuario</option>
                  <option value="admin">admin</option>
                </select>
              </td>
              <td>
                <div className="actions">
                  <button type="button" className="secondary" onClick={() => updateRole(item.id, item.role)}>
                    <Save size={17} />
                  </button>
                  <button type="button" className="danger" onClick={() => removeUser(item.id)}>
                    <Trash2 size={17} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
