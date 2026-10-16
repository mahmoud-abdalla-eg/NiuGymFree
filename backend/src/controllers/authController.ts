import { Request, Response } from 'express';
import { getSupabase, isSupabaseConfigured } from '../services/supabaseClient';

export async function signUp(req: Request, res: Response): Promise<void> {
  const { email, password, name } = req.body;

  if (!email || !password) {
    res.status(400).json({ success: false, error: 'Email and password are required' });
    return;
  }

  if (isSupabaseConfigured) {
    const supabase = getSupabase();
    if (supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name: name || 'Athlete' },
        },
      });

      if (error) {
        res.status(400).json({ success: false, error: error.message });
        return;
      }

      res.status(201).json({
        success: true,
        user: data.user,
        session: data.session,
      });
      return;
    }
  }

  // Fallback dev response
  const mockId = `usr_${Date.now()}`;
  res.status(201).json({
    success: true,
    user: { id: mockId, email, name: name || 'Athlete' },
    token: `dev_token_${mockId}`,
    message: 'Registered in local development mode.',
  });
}

export async function signIn(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ success: false, error: 'Email and password are required' });
    return;
  }

  if (isSupabaseConfigured) {
    const supabase = getSupabase();
    if (supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        res.status(401).json({ success: false, error: error.message });
        return;
      }

      res.status(200).json({
        success: true,
        user: data.user,
        session: data.session,
      });
      return;
    }
  }

  // Fallback dev response
  res.status(200).json({
    success: true,
    user: { id: `usr_demo`, email, name: 'Athlete Demo' },
    token: `dev_token_usr_demo`,
    message: 'Signed in via local development mode.',
  });
}

export async function createGuestSession(req: Request, res: Response): Promise<void> {
  const guestId = `guest_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  res.status(200).json({
    success: true,
    user: {
      id: guestId,
      name: 'Guest Athlete',
      isGuest: true,
      onboardingCompleted: false,
    },
    token: guestId,
  });
}

export async function getCurrentUser(req: Request, res: Response): Promise<void> {
  res.status(200).json({
    success: true,
    user: req.user,
  });
}
