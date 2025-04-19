import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Apple, Mail, Eye, EyeOff, LogIn, UserPlus, ChevronLeft, AlertCircle } from 'lucide-react';
import { useTurf } from '@/contexts/TurfContext';

type AuthMode = 'signin' | 'signup';

const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState<AuthMode>((searchParams.get('mode') as AuthMode) || 'signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { currentUser } = useTurf();
  
  useEffect(() => {
    if (currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);
  
  const handleEmailAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    if (mode === 'signup' && password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    
    setTimeout(() => {
      navigate('/');
    }, 1000);
  };
  
  const toggleMode = () => {
    setMode(prev => prev === 'signin' ? 'signup' : 'signin');
    setError('');
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <div className="flex-grow flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-card rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 sm:p-8">
            <Button
              variant="ghost"
              size="sm"
              className="mb-4 -ml-2 text-muted-foreground"
              onClick={() => navigate('/onboarding')}
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back
            </Button>
            
            <h1 className="text-2xl font-bold mb-6">
              {mode === 'signin' ? 'Welcome Back!' : 'Create Your Account'}
            </h1>
            
            {error && (
              <div className="mb-4 p-3 bg-destructive/20 text-destructive flex items-center gap-2 rounded-md">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}
            
            <div className="space-y-4 mb-6">
              <Button 
                variant="outline" 
                className="w-full justify-start py-5"
                onClick={() => setError("Google sign in would connect to Supabase Auth")}
              >
                <svg viewBox="0 0 48 48" className="mr-2 h-5 w-5">
                  <path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"/>
                  <path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.32-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"/>
                  <path fill="#FBBC05" d="M11.68 28.18c-.89-2.64-.89-5.52 0-8.16V14.32H4.34A23.934 23.934 0 0 0 0 24c0 3.84.93 7.46 2.56 10.68l7.12-5.5z"/>
                  <path fill="#EA4335" d="M24 9.5c3.25 0 6.18 1.18 8.48 3.48L38.4 6.6A24 24 0 0 0 4.34 14.32l7.34 5.7C16.42 13.37 21.27 9.5 24 9.5z"/>
                </svg>
                Continue with Google
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start py-5"
                onClick={() => setError("Apple sign in would connect to Supabase Auth")}
              >
                <Apple className="mr-2 h-5 w-5" />
                Continue with Apple
              </Button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-muted"></span>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or</span>
                </div>
              </div>
            </div>
            
            <form onSubmit={handleEmailAuth} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-secondary/30 py-5"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder={mode === 'signup' ? 'Min. 8 characters' : 'Your password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-secondary/30 py-5"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </Button>
                </div>
              </div>
              
              {mode === 'signin' && (
                <div className="text-right">
                  <Button 
                    variant="link"
                    className="p-0 text-sm text-muted-foreground"
                    onClick={() => setError("Forgot password would trigger Supabase reset flow")}
                  >
                    Forgot password?
                  </Button>
                </div>
              )}
              
              <Button 
                type="submit"
                className="w-full bg-gold hover:bg-gold/90 text-black font-semibold py-5 transition-transform hover:scale-[1.02]"
              >
                {mode === 'signin' ? (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Sign Up
                  </>
                )}
              </Button>
              
              <div className="text-center text-sm text-muted-foreground">
                {mode === 'signin' ? "Don't have an account? " : "Already have an account? "}
                <Button variant="link" className="p-0" onClick={toggleMode}>
                  {mode === 'signin' ? 'Sign Up' : 'Sign In'}
                </Button>
              </div>
              
              <div className="text-center">
                <Button
                  variant="ghost"
                  className="text-sm text-gray-400 hover:text-white"
                  onClick={() => navigate('/')}
                >
                  Continue as guest
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
