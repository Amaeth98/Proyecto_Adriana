export type JwtPayload = {
  sub: number;
  email: string;
  name: string;
  role: 'usuario' | 'admin';
};
