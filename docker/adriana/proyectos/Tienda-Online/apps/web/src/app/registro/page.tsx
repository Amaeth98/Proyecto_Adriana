'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { apiRequest } from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const passwordChecks = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /\d/.test(password),
  };
  const securePassword = Object.values(passwordChecks).every(Boolean);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');
    if (!securePassword) {
      setError('La password debe tener 8 caracteres, mayuscula, minuscula y numero');
      return;
    }
    if (password !== repeatPassword) {
      setError('Las passwords no coinciden');
      return;
    }
    try {
      await apiRequest('/users', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      });
      router.push('/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo registrar');
    }
  }

  return (
    <section className="panel form-grid">
      <h1>Registro</h1>
      <p className="muted">Los nuevos usuarios se registran siempre con perfil usuario.</p>
      {error && <p className="error">{error}</p>}
      <form className="form-grid" onSubmit={handleSubmit}>
        <label>
          Nombre
          <input value={name} onChange={(event) => setName(event.target.value)} required />
        </label>
        <label>
          Email
          <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" required />
        </label>
        <label>
          Password
          <div className="password-field">
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type={showPassword ? 'text' : 'password'}
              minLength={8}
              required
            />
            <button
              type="button"
              className="secondary"
              onClick={() => setShowPassword((visible) => !visible)}
              title={showPassword ? 'Ocultar password' : 'Mostrar password'}
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
        </label>
        <label>
          Repetir password
          <div className="password-field">
            <input
              value={repeatPassword}
              onChange={(event) => setRepeatPassword(event.target.value)}
              type={showPassword ? 'text' : 'password'}
              minLength={8}
              required
            />
            <button
              type="button"
              className="secondary"
              onClick={() => setShowPassword((visible) => !visible)}
              title={showPassword ? 'Ocultar password' : 'Mostrar password'}
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
        </label>
        <ul className="password-rules">
          <li className={passwordChecks.length ? 'ok' : undefined}>Minimo 8 caracteres</li>
          <li className={passwordChecks.upper ? 'ok' : undefined}>Una mayuscula</li>
          <li className={passwordChecks.lower ? 'ok' : undefined}>Una minuscula</li>
          <li className={passwordChecks.number ? 'ok' : undefined}>Un numero</li>
        </ul>
        <button type="submit">Crear cuenta</button>
      </form>
    </section>
  );
}
