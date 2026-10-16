import { Request, Response, NextFunction } from 'express';
import { getSupabase, isSupabaseConfigured } from '../services/supabaseClient';

export interface AuthenticatedUser {
  id: string;
  email?: string;
  isGuest: boolean;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export async function authMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // If no token, allow as anonymous guest by default for zero-friction experience
    req.user = {
      id: 'guest_default',
      isGuest: true,
    };
    return next();
  }

  const token = authHeader.split(' ')[1];

  // Guest Token handling
  if (token.startsWith('guest_')) {
    req.user = {
      id: token,
      isGuest: true,
    };
    return next();
  }

  // Supabase Auth Token verification
  if (isSupabaseConfigured) {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data: { user }, error } = await supabase.auth.getUser(token);
        if (error || !user) {
          res.status(401).json({ success: false, error: 'Invalid or expired authorization token' });
          return;
        }

        req.user = {
          id: user.id,
          email: user.email,
          isGuest: false,
        };
        return next();
      } catch (err) {
        res.status(401).json({ success: false, error: 'Authentication verification failure' });
        return;
      }
    }
  }

  // Fallback for custom dev tokens
  req.user = {
    id: `user_${token.slice(0, 8)}`,
    isGuest: false,
  };
  next();
}
