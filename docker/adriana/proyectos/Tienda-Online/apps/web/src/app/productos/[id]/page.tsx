'use client';

import { ShoppingCart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { apiRequest } from '@/lib/api';
import { Product } from '@/lib/types';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { token, user, refreshCartCount } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    apiRequest<Product>(`/products/${id}`)
      .then(setProduct)
      .catch((err) => setError(err instanceof Error ? err.message : 'No se encontro el producto'));
  }, [id]);

  async function addToCart() {
    if (!token) return router.push('/login');
    setMessage('');
    setError('');
    try {
      await apiRequest('/cart/items', {
        method: 'POST',
        token,
        body: JSON.stringify({ productId: Number(id), quantity }),
      });
      await refreshCartCount();
      setMessage('Figura incluida en el carrito');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo incluir en el carrito');
    }
  }

  if (!product) return <p className={error ? 'error' : 'muted'}>{error || 'Cargando producto...'}</p>;

  return (
    <section className="detail">
      {product.imageUrl ? (
        <img
          className="product-image"
          src={product.imageUrl}
          alt={product.name}
        />
      ) : (
        <div className="product-image" />
      )}
      <div className="panel form-grid">
        <h1>{product.name}</h1>
        <p className="muted">{product.description}</p>
        <span className="price">{Number(product.price).toFixed(2)} EUR</span>
        <p>Stock disponible: {product.stock}</p>
        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}
        {user ? (
          <>
            <label>
              Cantidad
              <input
                type="number"
                min="1"
                max={product.stock}
                value={quantity}
                onChange={(event) => setQuantity(Number(event.target.value))}
              />
            </label>
            <button type="button" onClick={addToCart}>
              <ShoppingCart size={18} />
              Incluir al carrito
            </button>
          </>
        ) : (
          <button type="button" onClick={() => router.push('/login')}>
            Login para comprar
          </button>
        )}
      </div>
    </section>
  );
}
