import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  AlertCircle, 
  Loader2, 
  CheckCircle2, 
  Sparkles 
} from 'lucide-react';
import { authApi, parseFirebaseError, trackEvent } from '../services/firebase';

export function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email || !password) {
      setErrorMsg('Please fill in both email and password.');
      return;
    }

    if (mode === 'signup' && password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);

    try {
      if (mode === 'signin') {
        const cred = await authApi.signInEmail(email.trim(), password);
        trackEvent('auth_sign_in', { method: 'email' });
        setSuccessMsg('Signed in successfully! Syncing your progress...');
        setTimeout(() => {
          handleClose();
          if (onAuthSuccess) onAuthSuccess(cred.user, false);
        }, 800);
      } else {
        const cred = await authApi.signUpEmail(email.trim(), password, name.trim());
        trackEvent('auth_sign_up', { method: 'email' });
        setSuccessMsg('Account created! Progress is now saved to cloud.');
        setTimeout(() => {
          handleClose();
          if (onAuthSuccess) onAuthSuccess(cred.user, true);
        }, 800);
      }
    } catch (err) {
      setErrorMsg(parseFirebaseError(err));
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div
      id="auth-modal-backdrop"
      onClick={handleClose}
      className="fixed inset-0 z-[10001] bg-black/60 backdrop-blur-[6px] transition-opacity duration-300 flex items-center justify-center p-3 sm:p-4"
    >
      <div
        id="auth-modal"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[430px] p-5 sm:p-7 rounded-3xl bento shadow-2xl transition-all duration-300 transform scale-100"
        style={{
          background: 'var(--paper-raised)',
          border: '2px solid var(--index)',
        }}
      >
        {/* Header */}
        <div
          className="relative mb-4 pb-3 border-b text-center"
          style={{ borderColor: 'var(--card-line)' }}
        >
          <div>
            <h2
              className="font-serif-instrument text-2xl sm:text-3xl font-bold tracking-wide leading-tight"
              style={{ color: 'var(--ink)' }}
            >
              Account Access
            </h2>
            <p className="text-[11px] font-medium mt-0.5" style={{ color: 'var(--ink-soft)' }}>
              Cloud sync across devices with Firestore
            </p>
          </div>
          <button
            id="auth-btn-close"
            onClick={handleClose}
            className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl flex items-center justify-center transition cursor-pointer hover:bg-black/5"
            style={{ color: 'var(--ink-soft)' }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div
          className="flex p-1 rounded-2xl mb-4"
          style={{ background: 'var(--paper)', border: '1px solid var(--card-line)' }}
        >
          <button
            type="button"
            onClick={() => { setMode('signin'); setErrorMsg(''); setSuccessMsg(''); }}
            className={`flex-1 py-2 text-xs sm:text-sm rounded-xl font-semibold transition-all duration-200 cursor-pointer ${
              mode === 'signin'
                ? 'shadow-xs font-bold'
                : 'text-[var(--ink-soft)] hover:text-[var(--ink)]'
            }`}
            style={{
              background: mode === 'signin' ? 'var(--paper-raised)' : 'transparent',
              color: mode === 'signin' ? 'var(--index)' : 'var(--ink-soft)',
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('signup'); setErrorMsg(''); setSuccessMsg(''); }}
            className={`flex-1 py-2 text-xs sm:text-sm rounded-xl font-semibold transition-all duration-200 cursor-pointer ${
              mode === 'signup'
                ? 'shadow-xs font-bold'
                : 'text-[var(--ink-soft)] hover:text-[var(--ink)]'
            }`}
            style={{
              background: mode === 'signup' ? 'var(--paper-raised)' : 'transparent',
              color: mode === 'signup' ? 'var(--index)' : 'var(--ink-soft)',
            }}
          >
            Create Account
          </button>
        </div>

        {/* Status / Error / Success Alert */}
        {errorMsg && (
          <div
            className="mb-4 p-3 rounded-xl flex items-start gap-2 text-xs font-medium"
            style={{ background: 'var(--wrong-soft)', color: 'var(--wrong)', border: '1px solid #e8cec3' }}
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div
            className="mb-4 p-3 rounded-xl flex items-start gap-2 text-xs font-medium"
            style={{ background: 'var(--correct-soft)', color: 'var(--correct)', border: '1px solid #c7ddd2' }}
          >
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === 'signup' && (
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--ink-soft)' }}>
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--ink-soft)' }} />
                <input
                  type="text"
                  placeholder="Your Name (e.g. John Doe)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl outline-none transition"
                  style={{
                    background: 'var(--paper)',
                    border: '1.5px solid var(--card-line)',
                    color: 'var(--ink)',
                  }}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--ink-soft)' }}>
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--ink-soft)' }} />
              <input
                type="email"
                required
                placeholder="student@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl outline-none transition"
                style={{
                  background: 'var(--paper)',
                  border: '1.5px solid var(--card-line)',
                  color: 'var(--ink)',
                }}
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--ink-soft)' }}>
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--ink-soft)' }} />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl outline-none transition"
                style={{
                  background: 'var(--paper)',
                  border: '1.5px solid var(--card-line)',
                  color: 'var(--ink)',
                }}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-2.5 px-4 rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-md hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ background: 'var(--index)', color: '#fff' }}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <span>{mode === 'signin' ? 'Sign In' : 'Create Account'}</span>
            )}
          </button>
        </form>



        {/* Feature note */}
        <p className="text-[10px] text-center mt-3" style={{ color: 'var(--ink-soft)' }}>
          <Sparkles className="w-3 h-3 inline mr-1 text-[var(--index)]" />
          Signing in automatically saves your quiz scores, answers, and chapter progress in Cloud Firestore.
        </p>
      </div>
    </div>
  );
}
