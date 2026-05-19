export type Role = 'usuario' | 'admin';

export type AuthUser = {
  sub: number;
  email: string;
  name: string;
  role: Role;
};

export type Product = {
  id: number;
  name: string;
  description: string;
  price: string;
  stock: number;
  imageUrl?: string;
};

export type User = {
  id: number;
  name: string;
  email: string;
  role: Role;
};

export type CartItem = {
  id: number;
  productId?: number | null;
  productName?: string | null;
  productPrice?: string | null;
  quantity: number;
  paymentDate?: string | null;
  paymentMethod?: PaymentMethod | null;
  product: Product;
  subtotal: number;
};

export type Cart = {
  items: CartItem[];
  total: number;
};

export type PaymentMethod = 'card' | 'paypal' | 'transfer';

export type Payment = {
  paymentDate: string;
  paymentMethod: PaymentMethod | null;
  items: CartItem[];
  total: number;
};
