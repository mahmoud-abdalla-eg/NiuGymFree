import React, { useState } from 'react';
import { X, Lock, Mail, User, ShieldCheck, Sparkles, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { AuthUser } from '../../types';
import { supabase, isSupabaseConfigured } from '../../services/supabaseClient';

interface AuthModalProps {
  onClose: () => void;
  onAuthSuccess: (user: AuthUser) => void;
  onShowToast: (msg: string) => void;
  currentUser: AuthUser | null;
  onSignOut: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  onClose,
  onAuthSuccess,
  onShowToast,
  currentUser,
  onSignOut,
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please fill in both email and password.');
      return;
    }

    if (mode === 'signup' && password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    if (mode === 'signup' && password.length < 6) {
      setErrorMsg('Password should be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      // If Supabase is configured with active credentials
      if (isSupabaseConfigured && supabase) {
        if (mode === 'signup') {
          const { data, error } = await supabase.auth.signUp({
            email: email.trim(),
            password: password.trim(),
            options: {
              data: { full_name: name.trim() || 'Athlete' }
            }
          });
          if (error) throw error;
          const user: AuthUser = {
            id: data.user?.id || `user_${Date.now()}`,
            email: data.user?.email || email.trim(),
            name: name.trim() || 'Athlete',
            isGuest: false,
            provider: 'supabase',
          };
          onAuthSuccess(user);
          onShowToast('🎉 Account created & signed in via Supabase Cloud!');
          onClose();
        } else {
          const { data, error } = await supabase.auth.signInWithPassword({
            email: email.trim(),
            password: password.trim(),
          });
          if (error) throw error;
          const user: AuthUser = {
            id: data.user?.id || `user_${Date.now()}`,
            email: data.user?.email || email.trim(),
            name: data.user?.user_metadata?.full_name || 'Athlete',
            isGuest: false,
            provider: 'supabase',
          };
          onAuthSuccess(user);
          onShowToast('⚡ Signed in to Supabase Cloud account!');
          onClose();
        }
      } else {
        // Local-First Offline Auth
        const localId = `local_${email.replace(/[^a-zA-Z0-9]/g, '_')}`;
        const user: AuthUser = {
          id: localId,
          email: email.trim(),
          name: name.trim() || email.split('@')[0] || 'Athlete',
          isGuest: false,
          provider: 'local',
        };
        onAuthSuccess(user);
        onShowToast(`⚡ Signed in as ${user.name} (Local-First Offline Profile)!`);
        onClose();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = () => {
    const guestUser: AuthUser = {
      id: `guest_${Date.now()}`,
      email: 'guest@niugymfree.local',
      name: 'Guest Athlete',
      isGuest: true,
      provider: 'local',
    };
    onAuthSuccess(guestUser);
    onShowToast('🚀 Continuing as Guest Athlete (100% Offline Mode)');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-6 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">NiuGymFree Athlete Account</h3>
              <p className="text-[11px] text-slate-400">
                {isSupabaseConfigured ? 'Supabase Cloud Sync Enabled' : 'Local-First $0 Free Architecture'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* If already logged in */}
        {currentUser && !currentUser.isGuest ? (
          <div className="space-y-4 text-center py-2">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-extrabold text-xl">
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="text-sm font-extrabold text-white">{currentUser.name}</div>
              <div className="text-xs text-slate-400 font-mono mt-0.5">{currentUser.email}</div>
              <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] uppercase font-bold">
                Provider: {currentUser.provider}
              </span>
            </div>
            <button
              onClick={() => {
                onSignOut();
                onClose();
              }}
              className="w-full py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold text-xs transition"
            >
              Sign Out of Account
            </button>
          </div>
        ) : (
          <>
            {/* Mode Toggle */}
            <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setErrorMsg('');
                }}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${
                  mode === 'signin'
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setErrorMsg('');
                }}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${
                  mode === 'signup'
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Create Account
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Auth Form */}
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              {mode === 'signup' && (
                <div>
                  <label className="text-slate-400 block mb-1">Athlete Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="e.g. Alex"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-slate-400 block mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    placeholder="athlete@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {mode === 'signup' && (
                <div>
                  <label className="text-slate-400 block mb-1">Confirm Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 mt-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs transition shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-1.5"
              >
                <span>{loading ? 'Authenticating...' : mode === 'signin' ? 'Sign In to Platform' : 'Create Athlete Profile'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Offline Guest Option / Skip for Later */}
            <div className="pt-3 border-t border-slate-800 space-y-2">
              <button
                type="button"
                onClick={handleGuestLogin}
                className="w-full py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200 hover:text-white transition flex items-center justify-center gap-2 shadow-sm"
              >
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Continue as Guest (Skip for Later)</span>
              </button>
              <p className="text-[10px] text-slate-500 text-center">
                $0 free, 100% offline & local-first. You can sign in anytime later from the top-right corner.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
