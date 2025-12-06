import { useState, useEffect } from 'react';
import { AuthPage } from './components/AuthPage';
import { Dashboard } from './components/Dashboard';
import { UploadPosts } from './components/UploadPosts';
import { AnalyzeStyle } from './components/AnalyzeStyle';
import { GeneratedPost } from './components/GeneratedPost';
import { useAuth } from './hooks/useAuth';

type Page = 'auth' | 'dashboard' | 'upload' | 'analyze' | 'generated';

export default function App() {
  const { user, login, logout, register } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>('auth');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (user) {
      setCurrentPage('dashboard');
    } else {
      setCurrentPage('auth');
    }
  }, [user]);

  const navigateTo = (page: Page) => {
    setCurrentPage(page);
    setMessage(null);
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {user && (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <button
              onClick={() => navigateTo('dashboard')}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <img 
                src="figma:asset/64d1e97b45e7411d6bb204a4488bf8da50f4bdc2.png" 
                alt="LinkedInk AI" 
                className="w-8 h-8 rounded-lg"
              />
              <span className="text-gray-900">LinkedInk AI</span>
            </button>
            <button
              onClick={logout}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Logout
            </button>
          </div>
        </nav>
      )}

      {message && (
        <div className="max-w-6xl mx-auto px-4 pt-4">
          <div
            className={`p-4 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {message.text}
          </div>
        </div>
      )}

      <main>
        {!user && currentPage === 'auth' && (
          <AuthPage
            onLogin={login}
            onRegister={register}
            onMessage={showMessage}
          />
        )}

        {user && currentPage === 'dashboard' && (
          <Dashboard
            user={user}
            onNavigate={navigateTo}
            onMessage={showMessage}
          />
        )}

        {user && currentPage === 'upload' && (
          <UploadPosts
            onNavigate={navigateTo}
            onMessage={showMessage}
          />
        )}

        {user && currentPage === 'analyze' && (
          <AnalyzeStyle
            onNavigate={navigateTo}
            onMessage={showMessage}
          />
        )}

        {user && currentPage === 'generated' && (
          <GeneratedPost onNavigate={navigateTo} />
        )}
      </main>
    </div>
  );
}