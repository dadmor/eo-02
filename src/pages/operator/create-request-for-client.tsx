// src/pages/operator/create-request-for-client.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useOne, useCreate } from "@refinedev/core";
import { useGetIdentity } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, Input, Label } from "@/components/ui";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import {
  ArrowLeft,
  User,
  MapPin,
  Phone,
  Home,
  Wrench,
  ClipboardList,
  AlertCircle,
  Loader2,
  FileText,
  Thermometer,
  Square,
  Building,
  Calendar,
  Upload,
  CheckCircle
} from "lucide-react";
import { Identity } from "../../operatorTypes";

interface CreateRequestFormData {
  postal_code: string;
  city: string;
  street_address: string;
  phone_number: string;
  needs_audit: boolean;
  
  // Service request fields
  heat_source?: string;
  windows_count?: number;
  doors_count?: number;
  wall_insulation_m2?: number;
  attic_insulation_m2?: number;
  audit_file_url?: string;
  
  // Audit request fields
  building_type?: string;
  building_year?: number;
  living_area?: number;
  heated_area?: number;
  heating_system?: string;
  insulation_status?: string;
  audit_purpose?: string;
  preferred_date?: string;
  notes?: string;
  contact_preferences?: string;
}

export const CreateRequestForClient = () => {
  const { clientId, type } = useParams<{ clientId: string; type: "service" | "audit" }>();
  const navigate = useNavigate();
  const { data: identity } = useGetIdentity<Identity>();
  const operatorId = identity?.id;

  const [needsAudit, setNeedsAudit] = useState(false);
  const [creatingRequests, setCreatingRequests] = useState(false);

  // Fetch client details
  const { data: clientData, isLoading: loadingClient } = useOne({
    resource: "users",
    id: clientId || "",
    queryOptions: {
      enabled: !!clientId,
    },
  });

  const { mutate: createServiceRequest } = useCreate();
  const { mutate: createAuditRequest } = useCreate();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CreateRequestFormData>();

  const client = clientData?.data;
  const isServiceRequest = type === "service";

  // Update form values when client data is loaded
  useEffect(() => {
    if (client) {
      setValue("postal_code", client.postal_code || "");
      setValue("city", client.city || "");
      setValue("street_address", client.street_address || "");
      setValue("phone_number", client.phone_number || "");
    }
  }, [client, setValue]);

  const handleFormSubmit = async (data: CreateRequestFormData) => {
    if (!client) return;

    setCreatingRequests(true);

    try {
      // If it's a service request and needs audit is checked, create audit request first
      if (isServiceRequest && needsAudit) {
        // Create audit request
        const auditData = {
          beneficiary_id: client.id,
          postal_code: data.postal_code,
          city: data.city,
          street_address: data.street_address,
          phone_number: data.phone_number,
          status: "pending",
          created_by_operator: operatorId,
          notes: "Zlecenie utworzone przez operatora w ramach procesu termomodernizacji",
        };

        await new Promise((resolve, reject) => {
          createAuditRequest({
            resource: "audit_requests",
            values: auditData,
          }, {
            onSuccess: resolve,
            onError: reject,
          });
        });

        toast.success("Zlecenie audytu utworzone", {
          description: "Zlecenie audytu zostało utworzone i czeka na weryfikację.",
        });
      }

      // Create the main request
      if (isServiceRequest) {
        const serviceData = {
          beneficiary_id: client.id,
          postal_code: data.postal_code,
          city: data.city,
          street_address: data.street_address,
          phone_number: data.phone_number,
          heat_source: data.heat_source,
          windows_count: data.windows_count || 0,
          doors_count: data.doors_count || 0,
          wall_insulation_m2: data.wall_insulation_m2 || 0,
          attic_insulation_m2: data.attic_insulation_m2 || 0,
          audit_file_url: data.audit_file_url,
          status: "pending",
          created_by_operator: operatorId,
        };

        createServiceRequest({
          resource: "service_requests",
          values: serviceData,
        }, {
          onSuccess: () => {
            toast.success("Zlecenie wykonawcy utworzone", {
              description: needsAudit 
                ? "Zlecenia zostały utworzone pomyślnie. Najpierw zostanie zrealizowany audyt."
                : "Zlecenie wykonawcy zostało utworzone i czeka na weryfikację.",
            });
            navigate(`/operator/client/${clientId}`);
          },
          onError: () => {
            toast.error("Błąd", {
              description: "Nie udało się utworzyć zlecenia wykonawcy.",
            });
          },
        });
      } else {
        // Create audit request
        const auditData = {
          beneficiary_id: client.id,
          postal_code: data.postal_code,
          city: data.city,
          street_address: data.street_address,
          phone_number: data.phone_number,
          building_type: data.building_type,
          building_year: data.building_year,
          living_area: data.living_area,
          heated_area: data.heated_area,
          heating_system: data.heating_system,
          insulation_status: data.insulation_status,
          audit_purpose: data.audit_purpose,
          preferred_date: data.preferred_date,
          notes: data.notes,
          contact_preferences: data.contact_preferences,
          status: "pending",
          created_by_operator: operatorId,
        };

        createAuditRequest({
          resource: "audit_requests",
          values: auditData,
        }, {
          onSuccess: () => {
            toast.success("Zlecenie audytu utworzone", {
              description: "Zlecenie audytu zostało utworzone i czeka na weryfikację.",
            });
            navigate(`/operator/client/${clientId}`);
          },
          onError: () => {
            toast.error("Błąd", {
              description: "Nie udało się utworzyć zlecenia audytu.",
            });
          },
        });
      }
    } catch (error) {
      console.error("Error creating requests:", error);
    } finally {
      setCreatingRequests(false);
    }
  };

  if (loadingClient) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="animate-spin w-4 h-4" />
          Ładowanie danych klienta...
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="p-6">
        <Alert>
          <AlertCircle className="w-4 h-4" />
          <AlertDescription>
            Nie znaleziono klienta. Sprawdź czy link jest poprawny.
          </AlertDescription>
        </Alert>
        <Button 
          className="mt-4"
          onClick={() => navigate('/operator/clients')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Powrót do listy klientów
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/operator/client/${clientId}`)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Powrót
          </Button>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">
          {isServiceRequest ? "Nowe zlecenie wykonawcy" : "Nowe zlecenie audytora"}
        </h1>
        <div className="flex items-center gap-2 text-muted-foreground mt-2">
          <User className="w-4 h-4" />
          <span>Dla: {client.first_name} {client.last_name} ({client.email})</span>
        </div>
      </div>

              <form onSubmit={handleSubmit((data) => handleFormSubmit(data as CreateRequestFormData))} className="space-y-6">
        {/* Address Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="w-5 h-5" />
              Dane adresowe nieruchomości
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="postal_code">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Kod pocztowy *
                  </div>
                </Label>
                <Input
                  id="postal_code"
                  placeholder="00-000"
                  defaultValue={client.postal_code}
                  {...register("postal_code", {
                    required: "Kod pocztowy jest wymagany",
                    pattern: {
                      value: /^\d{2}-\d{3}$/,
                      message: "Kod pocztowy musi być w formacie XX-XXX"
                    }
                  })}
                />
                {errors.postal_code && (
                  <p className="text-sm text-red-500">
                    {typeof errors.postal_code.message === 'string' ? errors.postal_code.message : 'Błąd walidacji'}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">Miejscowość *</Label>
                <Input
                  id="city"
                  placeholder="Warszawa"
                  defaultValue={client.city}
                  {...register("city", {
                    required: "Miejscowość jest wymagana",
                  })}
                />
                {errors.city && (
                  <p className="text-sm text-red-500">
                    {typeof errors.city.message === 'string' ? errors.city.message : 'Błąd walidacji'}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="street_address">
                <div className="flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  Ulica i numer domu *
                </div>
              </Label>
              <Input
                id="street_address"
                placeholder="ul. Przykładowa 123"
                defaultValue={client.street_address}
                {...register("street_address", {
                  required: "Adres jest wymagany",
                })}
              />
              {errors.street_address && (
                <p className="text-sm text-red-500">
                  {typeof errors.street_address.message === 'string' ? errors.street_address.message : 'Błąd walidacji'}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone_number">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Numer telefonu *
                </div>
              </Label>
              <Input
                id="phone_number"
                type="tel"
                placeholder="+48 123 456 789"
                defaultValue={client.phone_number}
                {...register("phone_number", {
                  required: "Telefon jest wymagany",
                })}
              />
              {errors.phone_number && (
                <p className="text-sm text-red-500">
                  {typeof errors.phone_number.message === 'string' ? errors.phone_number.message : 'Błąd walidacji'}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Service Request Specific Fields */}
        {isServiceRequest && (
          <>
            {/* Audit Checkbox */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="needs_audit"
                    checked={needsAudit}
                    onCheckedChange={(checked) => setNeedsAudit(checked as boolean)}
                  />
                  <div className="space-y-1">
                    <Label htmlFor="needs_audit" className="font-medium cursor-pointer">
                      Potrzebny audyt energetyczny
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Zaznacz, jeśli przed realizacją prac potrzebny jest audyt energetyczny. 
                      System automatycznie utworzy zlecenie audytu.
                    </p>
                  </div>
                </div>

                {needsAudit && (
                  <Alert className="mt-4">
                    <CheckCircle className="w-4 h-4" />
                    <AlertDescription>
                      Po zatwierdzeniu zostaną utworzone dwa zlecenia:
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>Zlecenie audytu energetycznego (do realizacji w pierwszej kolejności)</li>
                        <li>Zlecenie wykonawcy (będzie czekać na ukończenie audytu)</li>
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Work Scope */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wrench className="w-5 h-5" />
                  Zakres prac
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Heat Source */}
                <div className="space-y-4">
                  <h4 className="font-medium text-base">Źródło ciepła</h4>
                  <div className="space-y-2">
                    <Label htmlFor="heat_source">
                      <div className="flex items-center gap-2">
                        <Thermometer className="w-4 h-4" />
                        Typ źródła ciepła
                      </div>
                    </Label>
                    <Select onValueChange={(value) => setValue("heat_source", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Wybierz źródło ciepła" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pompa_ciepla">Pompa ciepła</SelectItem>
                        <SelectItem value="piec_pellet">Piec na pellet</SelectItem>
                        <SelectItem value="piec_zgazowujacy">Piec zgazowujący drewno</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Thermomodernization */}
                <div className="space-y-4">
                  <h4 className="font-medium text-base">Termomodernizacja</h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="windows_count">
                        <div className="flex items-center gap-2">
                          <Square className="w-4 h-4" />
                          Okna (ilość)
                        </div>
                      </Label>
                      <Input
                        id="windows_count"
                        type="number"
                        min="0"
                        placeholder="0"
                        {...register("windows_count", {
                          valueAsNumber: true,
                        })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="doors_count">
                        <div className="flex items-center gap-2">
                          <Square className="w-4 h-4" />
                          Drzwi (ilość)
                        </div>
                      </Label>
                      <Input
                        id="doors_count"
                        type="number"
                        min="0"
                        placeholder="0"
                        {...register("doors_count", {
                          valueAsNumber: true,
                        })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="wall_insulation_m2">
                        <div className="flex items-center gap-2">
                          <Square className="w-4 h-4" />
                          Docieplenie ścian (m²)
                        </div>
                      </Label>
                      <Input
                        id="wall_insulation_m2"
                        type="number"
                        min="0"
                        placeholder="0"
                        {...register("wall_insulation_m2", {
                          valueAsNumber: true,
                        })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="attic_insulation_m2">
                        <div className="flex items-center gap-2">
                          <Square className="w-4 h-4" />
                          Docieplenie poddasza (m²)
                        </div>
                      </Label>
                      <Input
                        id="attic_insulation_m2"
                        type="number"
                        min="0"
                        placeholder="0"
                        {...register("attic_insulation_m2", {
                          valueAsNumber: true,
                        })}
                      />
                    </div>
                  </div>
                </div>

                {/* Audit file */}
                <div className="space-y-2">
                  <Label htmlFor="audit_file_url">
                    <div className="flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      URL pliku audytu (opcjonalne)
                    </div>
                  </Label>
                  <Input
                    id="audit_file_url"
                    placeholder="https://example.com/audit.pdf"
                    {...register("audit_file_url")}
                  />
                  <p className="text-xs text-muted-foreground">
                    Jeśli audyt już istnieje, podaj link do pliku
                  </p>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Audit Request Specific Fields */}
        {!isServiceRequest && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5" />
                Informacje o budynku
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="building_type">Typ budynku</Label>
                  <Select onValueChange={(value) => setValue("building_type", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Wybierz typ budynku" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dom_jednorodzinny">Dom jednorodzinny</SelectItem>
                      <SelectItem value="dom_wielorodzinny">Dom wielorodzinny</SelectItem>
                      <SelectItem value="mieszkanie_blok">Mieszkanie w bloku</SelectItem>
                      <SelectItem value="mieszkanie_kamienica">Mieszkanie w kamienicy</SelectItem>
                      <SelectItem value="szeregowiec">Szeregowiec</SelectItem>
                      <SelectItem value="blizniak">Bliźniak</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="building_year">Rok budowy</Label>
                  <Input
                    id="building_year"
                    type="number"
                    min="1800"
                    max="2025"
                    placeholder="np. 1995"
                    {...register("building_year", {
                      valueAsNumber: true,
                    })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="living_area">Powierzchnia mieszkalna (m²)</Label>
                  <Input
                    id="living_area"
                    type="number"
                    min="0"
                    placeholder="np. 120"
                    {...register("living_area", {
                      valueAsNumber: true,
                    })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="heated_area">Powierzchnia ogrzewana (m²)</Label>
                  <Input
                    id="heated_area"
                    type="number"
                    min="0"
                    placeholder="np. 100"
                    {...register("heated_area", {
                      valueAsNumber: true,
                    })}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="heating_system">Obecny system ogrzewania</Label>
                  <Select onValueChange={(value) => setValue("heating_system", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Wybierz system ogrzewania" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="piec_wegiel">Piec na węgiel</SelectItem>
                      <SelectItem value="piec_drewno">Piec na drewno</SelectItem>
                      <SelectItem value="piec_gaz">Piec gazowy</SelectItem>
                      <SelectItem value="kotlownia_gazowa">Kotłownia gazowa</SelectItem>
                      <SelectItem value="centralne">Centralne ogrzewanie</SelectItem>
                      <SelectItem value="elektryczne">Ogrzewanie elektryczne</SelectItem>
                      <SelectItem value="pompa_ciepla">Pompa ciepła</SelectItem>
                      <SelectItem value="inne">Inne</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="audit_purpose">Cel audytu</Label>
                  <Select onValueChange={(value) => setValue("audit_purpose", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Wybierz cel audytu" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dotacja_termomodernizacja">
                        Dotacja na termomodernizację
                      </SelectItem>
                      <SelectItem value="ocena_energetyczna">
                        Ocena energetyczna budynku
                      </SelectItem>
                      <SelectItem value="planowanie_remontu">
                        Planowanie remontu
                      </SelectItem>
                      <SelectItem value="inne">Inne</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Uwagi dla audytora</Label>
                <Textarea
                  id="notes"
                  placeholder="Dodatkowe informacje..."
                  rows={4}
                  {...register("notes")}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Info about operator creating request */}
        <Alert>
          <AlertCircle className="w-4 h-4" />
          <AlertDescription>
            To zlecenie jest tworzone przez operatora w imieniu klienta. 
            Po utworzeniu będzie wymagało weryfikacji przed publikacją na giełdzie.
          </AlertDescription>
        </Alert>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(`/operator/client/${clientId}`)}
          >
            Anuluj
          </Button>
          <Button type="submit" disabled={creatingRequests}>
            {creatingRequests && (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            )}
            {creatingRequests 
              ? "Tworzenie..." 
              : needsAudit && isServiceRequest 
                ? "Utwórz zlecenia" 
                : "Utwórz zlecenie"}
          </Button>
        </div>
      </form>
    </div>
  );
};