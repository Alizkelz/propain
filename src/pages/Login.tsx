import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate, Navigate } from 'react-router-dom';
import { PaintBucket, Lock, ArrowRight } from 'lucide-react';

const ADMIN_EMAIL = 'owner@propaint.local';

export default function Login() {
  const [passcode, setPasscode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  if (auth.currentUser?.email === ADMIN_EMAIL) {
    return <Navigate to="/admin" replace />;
  }

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Try to sign in first
      await signInWithEmailAndPassword(auth, ADMIN_EMAIL, passcode);
      navigate('/admin');
    } catch (err: any) {
      if (err.code === 'auth/operation-not-allowed') {
         setLoading(false);
         setError('Action Required: You must manually enable "Email/Password" in your Firebase Project Console under Authentication > Sign-in method.');
         return;
      }
      // If sign in fails, it might be the first time. Try creating the account.
      try {
        await createUserWithEmailAndPassword(auth, ADMIN_EMAIL, passcode);
        navigate('/admin');
      } catch (createErr: any) {
        console.error(createErr);
        if (createErr.code === 'auth/operation-not-allowed') {
          setError('Email/Password authentication is not enabled in your Firebase Console. You MUST manually enable it inside Firebase > Authentication > Sign-in method before you can log in.');
        } else {
          setError('Invalid access code or account creation failed.');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans relative overflow-hidden">
      {/* Premium Background Elements */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-amber-500/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center font-black text-4xl tracking-tight text-white items-center space-x-3 mb-8 font-serif">
          <PaintBucket className="w-12 h-12 text-amber-500 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]" />
          <span>ProPaint<span className="text-amber-500 text-sm font-sans uppercase tracking-[0.2em] ml-2 block sm:inline mt-2 sm:mt-0 font-bold opacity-80 border border-amber-500/30 px-2 py-0.5 rounded backdrop-blur-sm">Admin</span></span>
        </div>
      </div>

      <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-slate-900/80 backdrop-blur-2xl py-12 px-8 shadow-2xl border border-slate-800 rounded-[2rem] sm:px-12 relative overflow-hidden">
            {/* Subtle glow inside card */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent"></div>

          <form onSubmit={handleLogin} className="space-y-8 relative z-10">
             <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Secure Access</h2>
                <p className="text-slate-400 text-sm font-medium">Restricted to authorized personnel</p>
             </div>
            <div>
              <label htmlFor="passcode" className="block text-sm font-bold text-slate-300 mb-2 uppercase tracking-wider">
                Passcode
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-6 w-6 text-slate-500" />
                </div>
                <input
                  id="passcode"
                  type="password"
                  required
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="appearance-none block w-full pl-14 pr-4 py-4 bg-slate-950/50 border border-slate-700/50 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent sm:text-xl font-mono tracking-widest transition-all shadow-inner focus:shadow-[0_0_20px_rgba(245,158,11,0.15)]"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="text-red-400 text-sm font-bold p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-center flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-red-500 mr-2 animate-pulse"></div>
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading || !passcode}
                className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-2xl shadow-lg text-lg font-black text-slate-950 bg-amber-500 hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950 focus:ring-amber-500 disabled:opacity-50 transition-all shadow-amber-500/20 active:scale-95 group relative overflow-hidden"
              >
                 <span className="relative z-10 flex items-center">
                    {loading ? 'Verifying...' : 'Unlock Dashboard'}
                    {!loading && <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                 </span>
                 {/* Shine effect */}
                 <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]"></div>
              </button>
            </div>
            
            <div className="mt-8 text-center border-t border-slate-800 pt-6">
                <a href="/" className="text-sm font-bold text-slate-500 hover:text-amber-500 transition-colors uppercase tracking-widest flex items-center justify-center">
                    Return to Store
                </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
