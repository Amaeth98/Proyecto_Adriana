'use client';

import { FormEvent, useState } from 'react';
import { Product } from '@/lib/types';

type Props = {
  initial?: Partial<Product>;
  submitLabel: string;
  onSubmit: (product: {
    name: string;
    description: string;
    price: number;
    stock: number;
    imageUrl?: string;
  }) => Promise<void>;
};

export function ProductForm({ initial, submitLabel, onSubmit }: Props) {
  const [name, setName] = useState(initial?.name ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [price, setPrice] = useState(initial?.price ?? '');
  const [stock, setStock] = useState(String(initial?.stock ?? 0));
  const [imageUrl, setImageUrl] = useState(initial?.imageUrl ?? '');
  const [error, setError] = useState('');

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');
    try {
      await onSubmit({
        name,
        description,
        price: Number(price),
        stock: Number(stock),
        imageUrl: imageUrl || undefined,
      });
      if (!initial?.id) {
        setName('');
        setDescription('');
        setPrice('');
        setStock('0');
        setImageUrl('');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar');
    }
  }

  return (
    <form className="panel form-grid" onSubmit={handleSubmit}>
      {error && <p className="error">{error}</p>}
      <label>
        Nombre
        <input value={name} onChange={(event) => setName(event.target.value)} required />
      </label>
      <label>
        Descripcion
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          required
        />
      </label>
      <div className="split">
        <label>
          Precio
          <input
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            type="number"
            min="0.01"
            step="0.01"
            required
          />
        </label>
        <label>
          Stock
          <input
            value={stock}
            onChange={(event) => setStock(event.target.value)}
            type="number"
            min="0"
            required
          />
        </label>
      </div>
      <label>
        Imagen URL
        <input value={imageUrl} onChange={(event) => setImageUrl(event.target.value)} />
      </label>
      <button type="submit">{submitLabel}</button>
    </form>
  );
}
