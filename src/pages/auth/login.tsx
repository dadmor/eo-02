// src/pages/auth/login.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertTriangle, Info, Mail, Lock, CheckCircle } from "lucide-react";
import { NarrowCol } from "@/components/layout/NarrowCol";
import { Lead } from "@/components/reader";
import { useLoginForm } from "@/utility/useLoginForm";
import { Link, useSearchParams } from "react-router-dom";

export const LoginPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const {
    email,
    password,
    setEmail,
    setPassword,
    isLoading,
    error,
    handleSubmit,
  } = useLoginForm();

  // Sprawdź parametry URL dla komunikatów
  const verified = searchParams.get('verified') === 'true';
  const passwordChanged = searchParams.get('passwordChanged') === 'true';

  // Funkcja sprawdzająca czy formularz jest prawidłowy
  const isFormValid = email.trim().length > 0 && password.length > 0;

  // Sprawdzenie typu błędu dla lepszego UX
  const getErrorVariant = (error: string) => {
    if (error.includes("nie zostało potwierdzone")) {
      return "warning"; // Żółty dla błędów z potwierdzeniem
    }
    return "destructive"; // Czerwony dla innych błędów
  };

  const getErrorIcon = (error: string) => {
    if (error.includes("nie zostało potwierdzone")) {
      return Info;
    }
    return AlertTriangle;
  };

  return (
    <NarrowCol>
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Zaloguj się</CardTitle>
          <CardDescription className="text-center">
            Wprowadź swoje dane aby się zalogować
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* Komunikat o potwierdzeniu emaila */}
          {verified && (
            <Alert className="mb-4 border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                <strong>Email potwierdzony!</strong> Możesz się teraz zalogować.
              </AlertDescription>
            </Alert>
          )}

          {/* Komunikat o zmianie hasła */}
          {passwordChanged && (
            <Alert className="mb-4 border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                <strong>Hasło zmienione!</strong> Możesz się zalogować używając nowego hasła.
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center">
                <Mail className="mr-2 h-4 w-4" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="przykład@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
                className={
                  error && error.includes("email") ? "border-red-500" : ""
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center">
                <Lock className="mr-2 h-4 w-4" />
                Hasło
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Wprowadź hasło"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
                className={
                  error && error.includes("hasło") ? "border-red-500" : ""
                }
              />
            </div>

            {/* Wyświetlanie błędów */}
            {error && (
              <Alert variant={getErrorVariant(error) as any}>
                {React.createElement(getErrorIcon(error), {
                  className: "h-4 w-4",
                })}
                <AlertDescription>
                  <strong>Błąd logowania:</strong> {error}
                  {/* Dodatkowe wskazówki w zależności od typu błędu */}
                  {error.includes("nie zostało potwierdzone") && (
                    <div className="mt-2 text-sm">
                      <p>
                        💡 <strong>Co robić:</strong>
                      </p>
                      <ul className="list-disc list-inside mt-1 space-y-1">
                        <li>Sprawdź swoją skrzynkę email (także spam)</li>
                        <li>Kliknij link aktywacyjny w emailu</li>
                        <li>
                          Jeśli nie otrzymałeś emaila, możesz{" "}
                          <a href="/resend-confirmation" className="underline">
                            wysłać ponownie
                          </a>
                        </li>
                      </ul>
                    </div>
                  )}
                  {error.includes("Nieprawidłowe dane") && (
                    <div className="mt-2 text-sm">
                      <p>
                        💡 <strong>Sprawdź:</strong>
                      </p>
                      <ul className="list-disc list-inside mt-1 space-y-1">
                        <li>Czy email jest wpisany poprawnie</li>
                        <li>
                          Czy hasło jest poprawne (uwaga na wielkość liter)
                        </li>
                        <li>Czy masz już założone konto</li>
                      </ul>
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !isFormValid}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Logowanie..." : "Zaloguj się"}
            </Button>
          </form>

          {/* Linki pomocnicze */}
          <div className="mt-6 space-y-3">
            <div className="text-center text-sm">
              <Link
                to="/register/step1"
                className="text-blue-600 hover:text-blue-500"
              >
                Nie masz konta? Zarejestruj się
              </Link>
            </div>

            <div className="text-center text-sm">
              <Link
                to="/forgot-password"
                className="text-blue-600 hover:text-blue-500"
              >
                Zapomniałeś hasła?
              </Link>
            </div>

            {/* Dodatkowa pomoc */}
            <div className="border-t pt-4 mt-4">
              <div className="text-center text-xs text-gray-500">
                <p>Problemy z logowaniem?</p>
                <a
                  href="/contact"
                  className="text-blue-600 hover:text-blue-500"
                >
                  Skontaktuj się z pomocą techniczną
                </a>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </NarrowCol>
  );
};