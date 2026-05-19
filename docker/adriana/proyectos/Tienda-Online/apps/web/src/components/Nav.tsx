'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut, Settings, ShoppingCart, UserCog } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from './AuthProvider';

const baseLinks = [
  { href: '/', label: 'Inicio' },
  { href: '/productos', label: 'Productos' },
];

function MushroomLogo() {
  return (
    <svg
      aria-hidden="true"
      className="brand-icon"
      fill="none"
      height="24"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.5 11.2C3.5 6.8 7.2 4 12 4s8.5 2.8 8.5 7.2c0 1.2-.9 2.2-2.1 2.2H5.6c-1.2 0-2.1-1-2.1-2.2Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="M9.7 13.4c-.2 2.4-.9 4.5-2.2 6.1h9c-1.3-1.6-2-3.7-2.2-6.1"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="M8.2 8.7h.1M12 7.1h.1M15.8 8.7h.1"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2.5"
      />
    </svg>
  );
}

export function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, cartCount, logout } = useAuth();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const settingsRef = useRef<HTMLDivElement | null>(null);

  const links = user
    ? [
        ...baseLinks,
        ...(user.role === 'admin'
          ? [
              { href: '/gestionar-productos', label: 'Gestionar productos' },
              { href: '/usuarios', label: 'Usuarios' },
            ]
          : []),
      ]
    : [
        ...baseLinks,
        { href: '/login', label: 'Login' },
        { href: '/registro', label: 'Registro' },
      ];

  function closeSession() {
    logout();
    setSettingsOpen(false);
    router.push('/');
  }

  useEffect(() => {
    function closeOnOutsideClick(event: MouseEvent) {
      if (!settingsRef.current?.contains(event.target as Node)) {
        setSettingsOpen(false);
      }
    }

    document.addEventListener('mousedown', closeOnOutsideClick);
    return () => document.removeEventListener('mousedown', closeOnOutsideClick);
  }, []);

  return (
    <header className="site-header">
      <Link href="/" className="brand">
        <MushroomLogo />
        Fungi Decor
      </Link>
      <nav className="main-nav">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={pathname === link.href ? 'active' : undefined}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      {user ? (
        <div className="session">
          <Link href="/carrito" className="icon-link cart-icon" title="Carrito">
            <ShoppingCart size={24} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
          <div className="settings-menu" ref={settingsRef}>
            <button
              type="button"
              className="icon-link"
              title="Ajustes"
              onClick={() => setSettingsOpen((open) => !open)}
            >
              <Settings size={18} />
            </button>
            {settingsOpen && (
              <div className="settings-dropdown">
                <div className="settings-user">
                  <UserCog size={16} />
                  <span>{user.name}</span>
                </div>
                <Link href="/ajustes" onClick={() => setSettingsOpen(false)}>
                  <UserCog size={16} />
                  Editar perfil
                </Link>
                <button type="button" onClick={closeSession}>
                  <LogOut size={16} />
                  Cerrar sesion
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <Link href="/carrito" className="icon-link" title="Carrito">
          <ShoppingCart size={24} />
        </Link>
      )}
    </header>
  );
}
