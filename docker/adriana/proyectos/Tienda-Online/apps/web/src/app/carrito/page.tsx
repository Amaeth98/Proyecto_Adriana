'use client';

import { ArrowLeft, CreditCard, History, Trash2 } from 'lucide-react';
import { MouseEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { ApiError, apiRequest } from '@/lib/api';
import { Cart, Payment, PaymentMethod } from '@/lib/types';

const paymentLabels: Record<PaymentMethod, string> = {
  card: 'Tarjeta',
  paypal: 'PayPal',
  transfer: 'Transferencia',
};

export default function CartPage() {
  const router = useRouter();
  const { token, ready, logout, refreshCartCount } = useAuth();
  const [cart, setCart] = useState<Cart>({ items: [], total: 0 });
  const [payments, setPayments] = useState<Payment[]>([]);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [holderName, setHolderName] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function loadCart() {
    if (!token) return;
    try {
      const nextCart = await apiRequest<Cart>('/cart', { token });
      setCart(nextCart);
      await refreshCartCount();
    } catch (err) {
      handleRequestError(err);
    }
  }

  async function loadPayments() {
    if (!token) return;
    try {
      setPayments(await apiRequest<Payment[]>('/cart/payments', { token }));
    } catch (err) {
      handleRequestError(err);
    }
  }

  useEffect(() => {
    if (!ready) return;
    if (!token) router.push('/login');
    else {
      void loadCart();
      void loadPayments();
    }
  }, [ready, token]);

  function handleRequestError(err: unknown) {
    if (err instanceof ApiError && err.status === 401) {
      logout();
      router.push('/login');
      return;
    }

    setError(err instanceof Error ? err.message : 'No se pudo cargar el carrito');
  }

  async function updateQuantity(id: number, quantity: number) {
    if (!token) return;
    try {
      await apiRequest(`/cart/items/${id}`, {
        method: 'PATCH',
        token,
        body: JSON.stringify({ quantity }),
      });
      await loadCart();
    } catch (err) {
      handleRequestError(err);
    }
  }

  async function removeItem(id: number) {
    if (!token) return;
    try {
      await apiRequest(`/cart/items/${id}`, { method: 'DELETE', token });
      await loadCart();
    } catch (err) {
      handleRequestError(err);
    }
  }

  function openCheckout(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    setError('');
    setMessage('');
    setCheckoutOpen(true);
  }

  async function confirmPayment() {
    if (!token) return;
    setError('');
    setMessage('');
    try {
      const response = await apiRequest<{
        message: string;
        paymentDate: string;
        paymentMethod: PaymentMethod;
        total: number;
      }>('/cart/pay', {
        method: 'POST',
        token,
        body: JSON.stringify({ method: paymentMethod, holderName }),
      });
      setMessage(
        `${response.message} con ${paymentLabels[response.paymentMethod]}. Fecha: ${new Date(
          response.paymentDate,
        ).toLocaleString()}`,
      );
      setCheckoutOpen(false);
      setHolderName('');
      await loadCart();
      await loadPayments();
    } catch (err) {
      handleRequestError(err);
    }
  }

  return (
    <div className="cart-page">
      {checkoutOpen && (
        <div className="modal-backdrop" onMouseDown={() => setCheckoutOpen(false)}>
          <section className="payment-modal panel form-grid" onMouseDown={(event) => event.stopPropagation()}>
            <button type="button" className="secondary back-button" onClick={() => setCheckoutOpen(false)}>
              <ArrowLeft size={17} />
              Volver al carrito
            </button>
            <div>
              <h1>Metodo de pago</h1>
              <p className="muted">Selecciona como quieres pagar este pedido.</p>
            </div>
            {error && <p className="error">{error}</p>}
            <div className="payment-options">
              {(['card', 'paypal', 'transfer'] as PaymentMethod[]).map((method) => (
                <label className="payment-option" key={method}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method}
                    checked={paymentMethod === method}
                    onChange={() => setPaymentMethod(method)}
                  />
                  <span>{paymentLabels[method]}</span>
                </label>
              ))}
            </div>
            {paymentMethod === 'card' && (
              <div className="split">
                <label>
                  Titular
                  <input
                    value={holderName}
                    onChange={(event) => setHolderName(event.target.value)}
                    placeholder="Nombre del titular"
                  />
                </label>
                <label>
                  Tarjeta
                  <input placeholder="**** **** **** 1234" disabled />
                </label>
              </div>
            )}
            <div className="payment-summary">
              <strong>Total</strong>
              <span>{cart.total.toFixed(2)} EUR</span>
            </div>
            <button type="button" onClick={confirmPayment}>
              <CreditCard size={18} />
              Confirmar pago
            </button>
          </section>
        </div>
      )}

      <section className="panel form-grid">
        <h1>Carrito</h1>
        <p className="muted">Solo se muestran productos sin fecha de pago.</p>
        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}
        {cart.items.length ? (
          <>
            <table className="table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Precio</th>
                  <th>Cantidad</th>
                  <th>Subtotal</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {cart.items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.product.name}</td>
                    <td>{Number(item.product.price).toFixed(2)} EUR</td>
                    <td>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(event) => updateQuantity(item.id, Number(event.target.value))}
                      />
                    </td>
                    <td>{item.subtotal.toFixed(2)} EUR</td>
                    <td>
                      <button className="danger" type="button" onClick={() => removeItem(item.id)}>
                        <Trash2 size={17} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <h2>Total: {cart.total.toFixed(2)} EUR</h2>
            <button type="button" onClick={openCheckout}>
              <CreditCard size={18} />
              Realizar pago
            </button>
          </>
        ) : (
          <p className="muted">No hay productos pendientes de pago.</p>
        )}
      </section>

      <section className="panel form-grid">
        <h2>
          <History size={19} />
          Pagos realizados
        </h2>
        {payments.length ? (
          <div className="payment-history">
            {payments.map((payment) => (
              <article className="payment-card" key={payment.paymentDate}>
                <div>
                  <strong>{new Date(payment.paymentDate).toLocaleString()}</strong>
                  <span>{payment.paymentMethod ? paymentLabels[payment.paymentMethod] : 'Metodo no registrado'}</span>
                </div>
                <ul>
                  {payment.items.map((item) => (
                    <li key={item.id}>
                      {item.product.name} x{item.quantity}
                    </li>
                  ))}
                </ul>
                <strong>{payment.total.toFixed(2)} EUR</strong>
              </article>
            ))}
          </div>
        ) : (
          <p className="muted">Todavia no hay pagos guardados.</p>
        )}
      </section>
    </div>
  );
}
