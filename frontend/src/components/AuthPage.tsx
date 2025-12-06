import { useState } from 'react';
import { Sparkles } from 'lucide-react';

interface AuthPageProps {
  onLogin: (email: string, password: string) => { success: boolean; error?: string };
  onRegister: (name: string, email: string, password: string, confirmPassword: string) => { success: boolean; error?: string };
  onMessage: (type: 'success' | 'error', text: string) => void;
}

export function AuthPage({ onLogin, onRegister, onMessage }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      const result = onLogin(formData.email, formData.password);
      if (!result.success) {
        setError(result.error || 'Login failed');
      }
    } else {
      const result = onRegister(formData.name, formData.email, formData.password, formData.confirmPassword);
      if (result.success) {
        onMessage('success', 'Account created successfully. Please log in.');
        setIsLogin(true);
        setFormData({ name: '', email: '', password: '', confirmPassword: '' });
      } else {
        setError(result.error || 'Registration failed');
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 w-full max-w-md p-8">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <img 
            src="figma:asset/64d1e97b45e7411d6bb204a4488bf8da50f4bdc2.png" 
            alt="LinkedInk AI" 
            className="w-16 h-16 rounded-2xl mb-3"
          />
          <h1 className="text-gray-900 text-center">LinkedInk AI</h1>
          <p className="text-gray-600 text-sm text-center mt-1">
            Generate LinkedIn posts in your voice
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => {
              setIsLogin(true);
              setError('');
            }}
            className={`flex-1 py-2 rounded-md transition-all ${
              isLogin
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Log in
          </button>
          <button
            onClick={() => {
              setIsLogin(false);
              setError('');
            }}
            className={`flex-1 py-2 rounded-md transition-all ${
              !isLogin
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Create account
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-gray-900 mb-4">
            {isLogin ? 'Log in to LinkedInk AI' : 'Create your LinkedInk AI account'}
          </h2>

          {!isLogin && (
            <div>
              <label htmlFor="name" className="block text-gray-700 mb-2">
                Full name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required={!isLogin}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="John Doe"
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>

          {!isLogin && (
            <div>
              <label htmlFor="confirmPassword" className="block text-gray-700 mb-2">
                Confirm password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required={!isLogin}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-500/30"
          >
            {isLogin ? 'Log in' : 'Sign up'}
          </button>

          <p className="text-center text-sm text-gray-600 mt-4">
            {isLogin ? (
              <>
                New here?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(false);
                    setError('');
                  }}
                  className="text-blue-600 hover:underline"
                >
                  Create an account
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(true);
                    setError('');
                  }}
                  className="text-blue-600 hover:underline"
                >
                  Log in
                </button>
              </>
            )}
          </p>
        </form>
      </div>
    </div>
  );
}