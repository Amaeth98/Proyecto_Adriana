'use client';

import { Pencil, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProductForm } from '@/components/ProductForm';
import { useAuth } from '@/components/AuthProvider';
import { apiRequest } from '@/lib/api';
import { Product } from '@/lib/types';

type ProductPayload = {
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl?: string;
};

export default function ManageProductsPage() {
  const router = useRouter();
  const { token, user, ready } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [editing, setEditing] = useState<Product | null>(null);
  const [error, setError] = useState('');

  async function loadProducts() {
    setProducts(await apiRequest<Product[]>('/products'));
  }

  useEffect(() => {
    if (!ready) return;
    if (!token) router.push('/login');
    else if (user && user.role !== 'admin') router.push('/productos');
    else if (!user) router.push('/login');
    else void loadProducts();
  }, [ready, token, user, router]);

  async function createProduct(product: ProductPayload) {
    if (!token) return;
    await apiRequest('/products', {
      method: 'POST',
      token,
      body: JSON.stringify(product),
    });
    await loadProducts();
  }

  async function updateProduct(product: ProductPayload) {
    if (!token || !editing) return;
    await apiRequest(`/products/${editing.id}`, {
      method: 'PATCH',
      token,
      body: JSON.stringify(product),
    });
    setEditing(null);
    await loadProducts();
  }

  async function removeProduct(id: number) {
    if (!token) return;
    setError('');
    try {
      await apiRequest(`/products/${id}`, { method: 'DELETE', token });
      await loadProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo borrar');
    }
  }

  return (
    <>
      <div className="page-title">
        <div>
          <h1>Gestionar productos</h1>
          <p>Añade, edita o elimina los productos que aparecen en la tienda.</p>
        </div>
      </div>
      {error && <p className="error">{error}</p>}
      <ProductForm
        key={editing?.id ?? 'new'}
        initial={editing ?? undefined}
        submitLabel={editing ? 'Actualizar producto' : 'Crear producto'}
        onSubmit={editing ? updateProduct : createProduct}
      />
      <table className="table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Stock</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{Number(product.price).toFixed(2)} EUR</td>
              <td>{product.stock}</td>
              <td>
                <div className="actions">
                  <button type="button" className="secondary" onClick={() => setEditing(product)}>
                    <Pencil size={17} />
                  </button>
                  <button type="button" className="danger" onClick={() => removeProduct(product.id)}>
                    <Trash2 size={17} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
