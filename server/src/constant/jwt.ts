import { SignOptions } from 'jsonwebtoken';

export const JWT_SECRET = 'very secret secret';

export const JWT_OPTIONS: SignOptions = {
  issuer: 'Planet T6 Server',
  expiresIn: '1 day'
};
