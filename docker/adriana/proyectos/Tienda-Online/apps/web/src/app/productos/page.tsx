'use client';

import Link from 'next/link';
import { Minus, Plus, Search, ShoppingCart } from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { apiRequest } from '@/lib/api';
import { Product } from '@/lib/types';

export default function ProductsPage() {
  const router = useRouter();
  const { token, user, refreshCartCount } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  async function loadProducts(nextQuery = '') {
    setError('');
    try {
      const suffix = nextQuery ? `?query=${encodeURIComponent(nextQuery)}` : '';
      setProducts(await apiRequest<Product[]>(`/products${suffix}`));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudieron cargar los productos');
    }
  }

  useEffect(() => {
    void loadProducts();
  }, []);

  function search(event: FormEvent) {
    event.preventDefault();
    void loadProducts(query);
  }

  function quantityFor(product: Product) {
    return quantities[product.id] ?? 1;
  }

  function updateQuantity(product: Product, nextQuantity: number) {
    const bounded = Math.min(product.stock, Math.max(1, nextQuantity));
    setQuantities((current) => ({
      ...current,
      [product.id]: bounded,
    }));
  }

  async function addToCart(product: Product) {
    if (!token) {
      router.push('/login');
      return;
    }

    setError('');
    setMessage('');
    try {
      await apiRequest('/cart/items', {
        method: 'POST',
        token,
        body: JSON.stringify({
          productId: product.id,
          quantity: quantityFor(product),
        }),
      });
      await refreshCartCount();
      setMessage(`${product.name} incluida en el carrito`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo incluir en el carrito');
    }
  }

  return (
    <>
      <div className="page-title">
        <div>
          <h1>Figuras de setas</h1>
          <p>Busca tu fungi favorito para decorar tu vida con el.</p>
        </div>
        <form className="toolbar" onSubmit={search}>
          <input
            placeholder="Buscar amanita, bosque, ceramica..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <button type="submit">
            <Search size={18} />
            Buscar
          </button>
        </form>
      </div>
      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}
      <div className="product-grid">
        {products.map((product) => (
          <article className="product-card" key={product.id}>
            <Link href={`/productos/${product.id}`} className="product-link">
              {product.imageUrl ? (
                <img className="product-image" src={product.imageUrl} alt={product.name} />
              ) : (
                <div className="product-image" />
              )}
            </Link>
            <div className="product-body">
              <Link href={`/productos/${product.id}`} className="product-title-link">
                <h2>{product.name}</h2>
              </Link>
              <div className="product-meta">
                <span className="price">{Number(product.price).toFixed(2)} EUR</span>
                <span className="stock">Stock: {product.stock}</span>
              </div>
              <div className="cart-inline">
                {user && (
                  <div className="quantity-stepper" aria-label={`Cantidad de ${product.name}`}>
                    <button
                      type="button"
                      className="secondary"
                      onClick={() => updateQuantity(product, quantityFor(product) - 1)}
                      disabled={quantityFor(product) <= 1}
                    >
                      <Minus size={16} />
                    </button>
                    <span>{quantityFor(product)}</span>
                    <button
                      type="button"
                      className="secondary"
                      onClick={() => updateQuantity(product, quantityFor(product) + 1)}
                      disabled={quantityFor(product) >= product.stock}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                )}
                <button type="button" onClick={() => addToCart(product)}>
                  <ShoppingCart size={18} />
                  {user ? 'Anadir' : 'Login'}
                </button>
              </div>
              <Link href={`/productos/${product.id}`} className="detail-link">
                Ver detalle
              </Link>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
