// src/components/operator/ClientFormDialog.tsx
import { useEffect } from "react";
import { useForm } from "@refinedev/react-hook-form";
import { useRegister, useUpdate } from "@refinedev/core";
import { Button, Input, Label } from "@/components/ui";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { UserPlus, Edit, AlertCircle, Loader2 } from "lucide-react";

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

export const ClientFormDialog = ({
  open,
  onOpenChange,
  client,
  operatorId,
  onSuccess
}: ClientFormDialogProps) => {
  const isEditMode = !!client;
  const { mutate: registerUser } = useRegister();
  const { mutate: updateClient, isLoading: isUpdating } = useUpdate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Reset form when dialog opens/closes or client changes
  useEffect(() => {
    if (open) {
      if (client) {
        // Rozdziel imię i nazwisko dla trybu edycji
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

  const handleAddClient = async (data: any) => {
    try {
      // Generuj tymczasowe hasło
      const tempPassword = `Welcome${Math.random().toString(36).slice(-6)}!@`;
      
      // Przygotuj dane do rejestracji
      const registerData = {
        email: data.email,
        password: tempPassword,
        role: 'beneficiary',
        // Dodatkowe dane
        first_name: data.first_name,
        last_name: data.last_name,
        name: `${data.first_name} ${data.last_name}`,
        phone_number: data.phone_number,
        street_address: data.street_address,
        city: data.city,
        postal_code: data.postal_code,
        operator_id: operatorId,
      };

      // Użyj useRegister z Refine
      registerUser(registerData, {
        onSuccess: () => {
          // Pokaż hasło w toaście i skopiuj do schowka
          toast.success("Klient został dodany!", {
            description: (
              <div>
                <p>Email: {data.email}</p>
                <p>Hasło: <code>{tempPassword}</code></p>
                <p className="text-xs mt-2">Hasło skopiowane do schowka!</p>
              </div>
            ),
            duration: 15000 // 15 sekund
          });
          
          // Skopiuj hasło do schowka
          navigator.clipboard.writeText(tempPassword);
          
          onOpenChange(false);
          reset();
          onSuccess?.();
        },
        onError: (error: any) => {
          console.error("Error in handleAddClient:", error);
          toast.error("Błąd", {
            description: error?.message || "Nie udało się dodać klienta.",
          });
        }
      });
      
    } catch (error: any) {
      console.error("Error in handleAddClient:", error);
      toast.error("Błąd", {
        description: error?.message || "Nie udało się dodać klienta.",
      });
    }
  };

  const handleEditClient = (data: any) => {
    if (!client) return;

    updateClient({
      resource: "users",
      id: client.id,
      values: {
        ...data,
        name: `${data.first_name} ${data.last_name}`,
      },
    }, {
      onSuccess: () => {
        toast.success("Dane klienta zaktualizowane");
        onOpenChange(false);
        reset();
        onSuccess?.();
      },
      onError: () => {
        toast.error("Błąd", {
          description: "Nie udało się zaktualizować danych klienta.",
        });
      },
    });
  };

  const onSubmit = isEditMode ? handleEditClient : handleAddClient;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
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
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message as string}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone_number">Telefon *</Label>
            <Input
              id="phone_number"
              type="tel"
              {...register("phone_number", {
                required: "Telefon jest wymagany",
              })}
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
                    Po dodaniu klienta, system wygeneruje tymczasowe hasło, 
                    które zostanie wyświetlone. Przekaż je klientowi, aby mógł 
                    zalogować się do systemu.
                  </p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => {
              onOpenChange(false);
              reset();
            }}>
              Anuluj
            </Button>
            <Button type="submit" disabled={isEditMode && isUpdating}>
              {isEditMode && isUpdating && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              {isEditMode ? "Zapisz zmiany" : "Dodaj klienta"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};