// src/pages/operator/client-edit.tsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUpdate, useGetIdentity, useOne } from "@refinedev/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, Input, Label } from "@/components/ui";
import { toast } from "sonner";
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Save,
  Loader2
} from "lucide-react";
import { Identity } from "../../operatorTypes";

interface ClientFormData {
  name: string;
  email: string;
  phone_number: string;
  street_address: string;
  city: string;
  postal_code: string;
}

interface Client extends ClientFormData {
  id: string;
  created_at: string;
  operator_id: string;
  status?: string;
  role: string;
}

export const ClientEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data: identity } = useGetIdentity<Identity>();
  const operatorId = identity?.id;
  
  const { mutate: updateClient, isLoading: isUpdating } = useUpdate();

  // Fetch existing client data
  const { data: clientData, isLoading: isLoadingClient } = useOne<Client>({
    resource: "users",
    id: id!,
    queryOptions: {
      enabled: !!id,
    },
  });

  const [formData, setFormData] = useState<ClientFormData>({
    name: "",
    email: "",
    phone_number: "",
    street_address: "",
    city: "",
    postal_code: ""
  });

  const [errors, setErrors] = useState<Partial<ClientFormData>>({});

  // Populate form when client data is loaded
  useEffect(() => {
    if (clientData?.data) {
      const client = clientData.data;
      setFormData({
        name: client.name || "",
        email: client.email || "",
        phone_number: client.phone_number || "",
        street_address: client.street_address || "",
        city: client.city || "",
        postal_code: client.postal_code || ""
      });
    }
  }, [clientData]);

  const handleInputChange = (field: keyof ClientFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ClientFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Imię i nazwisko jest wymagane";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email jest wymagany";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Nieprawidłowy format email";
    }

    if (formData.phone_number && !/^[\d\s\-()+]+$/.test(formData.phone_number)) {
        newErrors.phone_number = "Nieprawidłowy format numeru telefonu";
      }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    updateClient(
      {
        resource: "users",
        id: id!,
        values: {
          ...formData,
          role: "beneficiary",
          operator_id: operatorId,
        },
      },
      {
        onSuccess: () => {
          toast.success("Dane klienta zostały zaktualizowane");
          navigate("/operator/clients");
        },
        onError: (error) => {
          toast.error("Błąd", {
            description: "Nie udało się zaktualizować danych klienta. Spróbuj ponownie.",
          });
          console.error("Error updating client:", error);
        },
      }
    );
  };

  const handleCancel = () => {
    navigate("/operator/clients");
  };

  if (isLoadingClient) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="animate-spin w-5 h-5" />
            <span>Ładowanie danych klienta...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!clientData?.data) {
    return (
      <div className="p-6">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-2xl font-bold mb-2">Klient nie został znaleziony</h2>
          <p className="text-muted-foreground mb-4">
            Nie można znaleźć klienta o podanym identyfikatorze.
          </p>
          <Button onClick={() => navigate("/operator/clients")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Powrót do listy klientów
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCancel}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Powrót do listy klientów
        </Button>
        
        <h1 className="text-3xl font-bold tracking-tight">
          Edytuj dane klienta
        </h1>
        <p className="text-muted-foreground mt-2">
          Zaktualizuj informacje o kliencie
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Dane osobowe
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">
                  Imię i nazwisko <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Jan Kowalski"
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className="text-sm text-red-500 mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <Label htmlFor="email">
                  Email <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="jan.kowalski@example.com"
                    className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <Label htmlFor="phone">Numer telefonu</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone_number}
                    onChange={(e) => handleInputChange("phone_number", e.target.value)}
                    placeholder="+48 123 456 789"
                    className={`pl-10 ${errors.phone_number ? "border-red-500" : ""}`}
                  />
                </div>
                {errors.phone_number && (
                  <p className="text-sm text-red-500 mt-1">{errors.phone_number}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Address Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Adres
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="street">Ulica i numer</Label>
                <Input
                  id="street"
                  value={formData.street_address}
                  onChange={(e) => handleInputChange("street_address", e.target.value)}
                  placeholder="ul. Przykładowa 123"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">Miasto</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    placeholder="Warszawa"
                  />
                </div>

                <div>
                  <Label htmlFor="postal">Kod pocztowy</Label>
                  <Input
                    id="postal"
                    value={formData.postal_code}
                    onChange={(e) => handleInputChange("postal_code", e.target.value)}
                    placeholder="00-000"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Info */}
          {clientData.data.created_at && (
            <Card>
              <CardHeader>
                <CardTitle>Informacje dodatkowe</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Data dodania:</span>
                    <span>{new Date(clientData.data.created_at).toLocaleDateString('pl-PL')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">ID klienta:</span>
                    <span className="font-mono text-xs">{clientData.data.id}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isUpdating}
            >
              Anuluj
            </Button>
            <Button
              type="submit"
              disabled={isUpdating}
            >
              {isUpdating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Zapisywanie...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Zapisz zmiany
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};