// src/components/operator/ClientFormDialog.tsx
import { useEffect, useState } from "react";
import { useForm } from "@refinedev/react-hook-form";
import { useRegister, useUpdate } from "@refinedev/core";
import { Button, Input, Label } from "@/components/ui";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { 
  UserPlus, 
  Edit, 
  AlertCircle, 
  Loader2, 
  CheckCircle2,
  Copy,
  X,
  ArrowLeft
} from "lucide-react";

export interface Client {
  id: string;
  name: string;
  email: string;
  phone_number: string;
  street_address?: string;
  city?: string;
  postal_code?: string;
  created_at: string;
  operator_id: string;
  status?: string;
}

interface ClientFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client?: Client | null;
  operatorId?: string;
  onSuccess?: () => void;
}

type DialogStep = 'form' | 'success' | 'error';

export const ClientFormDialog = ({
  open,
  onOpenChange,
  client,
  operatorId,
  onSuccess
}: ClientFormDialogProps) => {
  const isEditMode = !!client;
  const { mutate: registerUser, isLoading: isRegistering } = useRegister();
  const { mutate: updateClient, isLoading: isUpdating } = useUpdate();
  
  // Stan dla kroków dialogu
  const [currentStep, setCurrentStep] = useState<DialogStep>('form');
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [passwordCopied, setPasswordCopied] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (open) {
      setCurrentStep('form');
      setGeneratedPassword("");
      setClientEmail("");
      setErrorMessage("");
      setPasswordCopied(false);
      
      if (client) {
        const nameParts = client.name?.split(' ') || ['', ''];
        reset({
          first_name: nameParts[0] || '',
          last_name: nameParts.slice(1).join(' ') || '',
          email: client.email,
          phone_number: client.phone_number,
          street_address: client.street_address,
          city: client.city,
          postal_code: client.postal_code,
        });
      } else {
        reset();
      }
    }
  }, [open, client, reset]);

  // Funkcja parsująca błędy - podobna jak w useRegistration
  const parseErrorMessage = (error: any): string => {
    console.log("🔍 Parsing error:", error);
    
    // Jeśli error to string
    if (typeof error === 'string') {
      return error;
    }

    // Sprawdź format z authProvider: {success: false, error: {...}}
    if (error?.success === false && error?.error) {
      const authError = error.error;
      const message = authError.message || '';
      const code = authError.details?.code || authError.code || '';
      
      // Mapuj kody błędów na czytelne komunikaty
      if (code === "user_already_exists" || message.includes("już istnieje")) {
        return "Użytkownik z tym adresem email już istnieje.";
      }
      
      if (code === "password_too_short" || message.includes("Password should be")) {
        return "Błąd generowania hasła. Spróbuj ponownie.";
      }
      
      if (code === "invalid_email" || message.includes("Invalid email")) {
        return "Nieprawidłowy format adresu email.";
      }
      
      if (code === "over_email_send_rate_limit") {
        return "Za dużo prób. Poczekaj 2 sekundy przed kolejną próbą.";
      }
      
      return message || "Wystąpił błąd podczas rejestracji.";
    }

    // Sprawdź standardowe formaty błędów
    if (error?.message) {
      const message = error.message;
      
      // Specyficzne komunikaty Supabase
      if (message.includes("User already registered") || 
          message.includes("already been registered") ||
          message.includes("already exists") ||
          message.includes("już istnieje")) {
        return "Użytkownik z tym adresem email już istnieje.";
      }
      
      if (message.includes("Invalid email")) {
        return "Nieprawidłowy format adresu email.";
      }
      
      if (message.includes("network") || message.includes("fetch")) {
        return "Błąd połączenia z serwerem. Sprawdź swoje połączenie internetowe.";
      }
      
      return message;
    }

    // Błędy z response
    if (error?.response?.data) {
      const data = error.response.data;
      return data.message || data.error || "Błąd serwera.";
    }

    // Fallback
    return "Wystąpił nieoczekiwany błąd. Spróbuj ponownie.";
  };

  const handleAddClient = async (data: any) => {
    try {
      // Generuj bezpieczne hasło
      const tempPassword = `Welcome${Math.random().toString(36).slice(-6)}!@`;
      
      const registerData = {
        email: data.email,
        password: tempPassword,
        role: 'beneficiary',
        operator_id: operatorId, // Ważne - przekaż operator_id
        // Dodatkowe dane do metadata
        first_name: data.first_name,
        last_name: data.last_name,
        name: `${data.first_name} ${data.last_name}`,
        phone_number: data.phone_number,
        street_address: data.street_address,
        city: data.city,
        postal_code: data.postal_code,
      };

      console.log("📤 Registering user with data:", registerData);

      registerUser(registerData, {
        onSuccess: (response: any) => {
          console.log("✅ Registration success response:", response);
          
          // Sprawdź czy rzeczywiście sukces
          if (response?.success === false) {
            // To tak naprawdę błąd!
            const errorMsg = parseErrorMessage(response);
            setErrorMessage(errorMsg);
            setCurrentStep('error');
            return;
          }
          
          // Prawdziwy sukces
          setGeneratedPassword(tempPassword);
          setClientEmail(data.email);
          setCurrentStep('success');
        },
        onError: (error: any) => {
          console.error("❌ Registration error:", error);
          const errorMsg = parseErrorMessage(error);
          setErrorMessage(errorMsg);
          setCurrentStep('error');
        }
      });
      
    } catch (error: any) {
      console.error("💥 Unexpected error:", error);
      setErrorMessage("Wystąpił nieoczekiwany błąd. Spróbuj ponownie.");
      setCurrentStep('error');
    }
  };

  const handleEditClient = (data: any) => {
    if (!client) return;

    const updateData = {
      ...data,
      name: `${data.first_name} ${data.last_name}`,
    };

    updateClient({
      resource: "users",
      id: client.id,
      values: updateData,
    }, {
      onSuccess: () => {
        setCurrentStep('success');
      },
      onError: (error: any) => {
        console.error("Update error:", error);
        const errorMsg = parseErrorMessage(error);
        setErrorMessage(errorMsg);
        setCurrentStep('error');
      },
    });
  };

  const onSubmit = isEditMode ? handleEditClient : handleAddClient;

  const copyPassword = () => {
    navigator.clipboard.writeText(generatedPassword).then(() => {
      setPasswordCopied(true);
      setTimeout(() => setPasswordCopied(false), 2000);
    });
  };

  const handleClose = () => {
    // Tylko wywołaj onSuccess jeśli zamykamy po sukcesie
    if (currentStep === 'success' && onSuccess) {
      onSuccess();
    }
    // Resetuj stan
    setCurrentStep('form');
    setGeneratedPassword("");
    setClientEmail("");
    setErrorMessage("");
    setPasswordCopied(false);
    reset();
    // Zamknij dialog
    onOpenChange(false);
  };

  const handleBackToForm = () => {
    setCurrentStep('form');
    setErrorMessage("");
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        {/* KROK 1: FORMULARZ */}
        {currentStep === 'form' && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {isEditMode ? (
                  <>
                    <Edit className="w-5 h-5" />
                    Edytuj dane klienta
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5" />
                    Dodaj nowego klienta
                  </>
                )}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="first_name">Imię *</Label>
                  <Input
                    id="first_name"
                    {...register("first_name", {
                      required: "Imię jest wymagane",
                    })}
                  />
                  {errors.first_name && (
                    <p className="text-sm text-red-500">{errors.first_name.message as string}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="last_name">Nazwisko *</Label>
                  <Input
                    id="last_name"
                    {...register("last_name", {
                      required: "Nazwisko jest wymagane",
                    })}
                  />
                  {errors.last_name && (
                    <p className="text-sm text-red-500">{errors.last_name.message as string}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email", {
                    required: "Email jest wymagany",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Nieprawidłowy format email",
                    },
                  })}
                  disabled={isEditMode}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message as string}</p>
                )}
                {!isEditMode && (
                  <p className="text-xs text-gray-500 mt-1">
                    Email będzie używany do logowania
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone_number">Telefon *</Label>
                <Input
                  id="phone_number"
                  type="tel"
                  {...register("phone_number", {
                    required: "Telefon jest wymagany",
                    pattern: {
                      value: /^[0-9+\s()-]+$/,
                      message: "Nieprawidłowy format telefonu",
                    },
                  })}
                  placeholder="+48 123 456 789"
                />
                {errors.phone_number && (
                  <p className="text-sm text-red-500">{errors.phone_number.message as string}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="street_address">Adres</Label>
                <Input
                  id="street_address"
                  {...register("street_address")}
                  placeholder="ul. Przykładowa 123"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="city">Miasto</Label>
                  <Input
                    id="city"
                    {...register("city")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="postal_code">Kod pocztowy</Label>
                  <Input
                    id="postal_code"
                    {...register("postal_code", {
                      pattern: {
                        value: /^\d{2}-\d{3}$/,
                        message: "Format: XX-XXX",
                      },
                    })}
                    placeholder="00-000"
                  />
                  {errors.postal_code && (
                    <p className="text-sm text-red-500">{errors.postal_code.message as string}</p>
                  )}
                </div>
              </div>

              {!isEditMode && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-blue-900">Informacja</p>
                      <p className="text-blue-700">
                        Po dodaniu klienta, system wygeneruje tymczasowe hasło które należy przekazać klientowi.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleClose}>
                  Anuluj
                </Button>
                <Button type="submit" disabled={isRegistering || isUpdating}>
                  {(isRegistering || isUpdating) && (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  {isEditMode ? "Zapisz zmiany" : "Dodaj klienta"}
                </Button>
              </DialogFooter>
            </form>
          </>
        )}

        {/* KROK 2: SUKCES */}
        {currentStep === 'success' && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-green-600">
                <CheckCircle2 className="w-6 h-6" />
                {isEditMode ? "Dane zaktualizowane!" : "Klient został dodany!"}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              {!isEditMode && (
                <>
                  <div className="bg-green-50 p-4 rounded-lg space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Email:</p>
                      <p className="font-mono text-sm bg-white px-3 py-2 rounded border mt-1">
                        {clientEmail}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-700">Hasło tymczasowe:</p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="font-mono text-sm bg-white px-3 py-2 rounded border flex-1">
                          {generatedPassword}
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={copyPassword}
                          className="flex items-center gap-2"
                        >
                          <Copy className="w-4 h-4" />
                          {passwordCopied ? "Skopiowano!" : "Kopiuj"}
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-amber-50 p-3 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium text-amber-900">Ważne!</p>
                        <p className="text-amber-700">
                          Zapisz to hasło - nie będzie możliwości jego odzyskania. 
                          Przekaż je klientowi bezpiecznym kanałem komunikacji.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    <p className="font-medium mb-1">Następne kroki:</p>
                    <ul className="list-disc ml-5 space-y-1">
                      <li>Klient otrzyma email z potwierdzeniem rejestracji</li>
                      <li>Po potwierdzeniu emaila będzie mógł się zalogować</li>
                      <li>Przy pierwszym logowaniu zalecana jest zmiana hasła</li>
                    </ul>
                  </div>
                </>
              )}
              
              {isEditMode && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-800">
                    Dane klienta zostały pomyślnie zaktualizowane.
                  </p>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button onClick={handleClose} className="w-full">
                Zamknij
              </Button>
            </DialogFooter>
          </>
        )}

        {/* KROK 3: BŁĄD */}
        {currentStep === 'error' && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-red-600">
                <X className="w-6 h-6" />
                Wystąpił błąd
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-sm text-red-800 font-medium">{errorMessage}</p>
              </div>
              
              {/* Specyficzne wskazówki w zależności od błędu */}
              {errorMessage.includes("już istnieje") && (
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Wskazówka:</strong> Jeśli chcesz dodać istniejącego użytkownika jako swojego klienta, 
                    poproś go o zalogowanie się i dołączenie do Twojej organizacji.
                  </p>
                </div>
              )}
              
              {errorMessage.includes("email") && !errorMessage.includes("istnieje") && (
                <div className="bg-amber-50 p-3 rounded-lg">
                  <p className="text-sm text-amber-800">
                    <strong>Wskazówka:</strong> Sprawdź czy adres email jest poprawnie wpisany 
                    i nie zawiera literówek.
                  </p>
                </div>
              )}
              
              <div className="text-sm text-gray-600">
                <p className="font-medium mb-2">Co możesz zrobić:</p>
                <ul className="list-disc ml-5 space-y-1">
                  <li>Sprawdź poprawność wprowadzonych danych</li>
                  <li>Upewnij się, że email nie jest już zarejestrowany</li>
                  <li>Spróbuj ponownie za chwilę</li>
                  <li>W razie dalszych problemów skontaktuj się z pomocą techniczną</li>
                </ul>
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button 
                variant="outline" 
                onClick={handleBackToForm}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Wróć do formularza
              </Button>
              <Button 
                variant="outline" 
                onClick={handleClose}
              >
                Zamknij
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};