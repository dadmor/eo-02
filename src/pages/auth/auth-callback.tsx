// src/pages/auth/auth-callback.tsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const AuthCallbackPage: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = React.useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Pobierz parametry z URL
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const type = hashParams.get('type');
        const accessToken = hashParams.get('access_token');
        const errorDescription = hashParams.get('error_description');
        
        console.log('Auth callback type:', type);
        console.log('Has access token:', !!accessToken);

        // Obsłuż błędy z Supabase
        if (errorDescription) {
          setError(decodeURIComponent(errorDescription));
          setTimeout(() => {
            navigate('/login');
          }, 3000);
          return;
        }

        if (type === 'recovery' && accessToken) {
          // To jest reset hasła - przekieruj do update-password
          console.log('Redirecting to password update page...');
          navigate('/update-password');
        } else if (type === 'signup') {
          // To jest potwierdzenie emaila - przekieruj do logowania
          console.log('Email confirmed, redirecting to login...');
          navigate('/login?verified=true');
        } else if (type === 'magiclink') {
          // Magic link login
          console.log('Magic link login, redirecting to dashboard...');
          navigate('/');
        } else {
          // Domyślnie przekieruj do dashboardu
          console.log('Default redirect to dashboard...');
          navigate('/');
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        setError('Wystąpił błąd podczas przetwarzania linku.');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    };

    handleCallback();
  }, [navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <Alert variant="destructive">
              <AlertDescription>
                <strong>Błąd:</strong> {error}
              </AlertDescription>
            </Alert>
            <p className="text-center text-sm text-gray-600 mt-4">
              Przekierowanie do strony logowania...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
        <p className="text-gray-600">Przetwarzanie linku...</p>
        <p className="text-sm text-gray-500 mt-2">Proszę czekać</p>
      </div>
    </div>
  );
};