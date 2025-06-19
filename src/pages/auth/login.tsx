import React from 'react';
import { useLogin } from '@refinedev/core';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { NarrowCol } from '@/components/layout/NarrowCol';
import { Lead } from '@/components/reader';

export const LoginPage: React.FC = () => {
  const { mutate: login, isLoading, error } = useLogin();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ email, password });
  };

  return (
    <NarrowCol>
      <Lead title={`Logowanie`} description={`...`} />
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Zaloguj się</CardTitle>
            <CardDescription className="text-center">
              Wprowadź swoje dane aby się zalogować
            </CardDescription>
          </CardHeader>
          <CardContent>
            
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="przykład@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Hasło</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Wprowadź hasło"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>
                    {error.message || 'Błąd logowania'}
                  </AlertDescription>
                </Alert>
              )}

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Zaloguj się
              </Button>
            </form>

            <div className="mt-4 text-center text-sm">
              <a href="/register/step1" className="text-blue-600 hover:text-blue-500">
                Nie masz konta? Zarejestruj się
              </a>
            </div>
            
            <div className="mt-2 text-center text-sm">
              <a href="/forgot-password" className="text-blue-600 hover:text-blue-500">
                Zapomniałeś hasła?
              </a>
            </div>
          </CardContent>
        </Card>
     </NarrowCol>
  );
};