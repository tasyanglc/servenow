import 'server-only';
import { createHmac, timingSafeEqual } from 'crypto';

const secret = () => process.env.AUTH_SECRET || process.env.DATABASE_URL || 'servenow-demo-only-secret';
const signature = (value) => createHmac('sha256', secret()).update(value).digest('base64url');

export function encodeSession(user) {
  const value = Buffer.from(JSON.stringify({ id: user.id, email: user.email, role: user.role, expiresAt: Date.now() + 1000 * 60 * 60 * 12 })).toString('base64url');
  return `${value}.${signature(value)}`;
}

export function decodeSession(token) {
  if (!token?.includes('.')) return null;
  const [value, received] = token.split('.');
  const expected = signature(value);
  if (received.length !== expected.length || !timingSafeEqual(Buffer.from(received), Buffer.from(expected))) return null;
  try { const data = JSON.parse(Buffer.from(value, 'base64url').toString()); return data.expiresAt > Date.now() ? data : null; } catch { return null; }
}
