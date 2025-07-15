// src/pages/operator/client-details.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useOne, useList, useUpdate } from "@refinedev/core";
import { useGetIdentity } from "@refinedev/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  FileText,
  ClipboardList,
  CheckCircle2,
  Circle,
  Clock,
  AlertCircle,
  Edit,
  Home,
  Building,
  Wrench,
  Euro,
  Loader2,
  CheckCircle,
  XCircle,
  FileSignature,
  ShieldCheck,
  Hammer,
  Receipt
} from "lucide-react";
import { Identity } from "../../operatorTypes";

interface ChecklistItem {
  id: string;
  label: string;
  description?: string;
  icon: React.ReactNode;
  completed: boolean;
  completedAt?: string;
}

interface ClientChecklist {
  id: string;
  client_id: string;
  checklist_data: ChecklistItem[];
  updated_at: string;
}

export const ClientDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: identity } = useGetIdentity<Identity>();
  const operatorId = identity?.id;

  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    {
      id: "documents",
      label: "Kompletacja dokumentów",
      description: "Wszystkie wymagane dokumenty zostały zebrane",
      icon: <FileText className="w-4 h-4" />,
      completed: false,
    },
    {
      id: "eligibility",
      label: "Weryfikacja uprawnień do dotacji",
      description: "Klient spełnia kryteria programu",
      icon: <ShieldCheck className="w-4 h-4" />,
      completed: false,
    },
    {
      id: "audit_order",
      label: "Zlecenie audytu",
      description: "Audyt energetyczny został zlecony",
      icon: <ClipboardList className="w-4 h-4" />,
      completed: false,
    },
    {
      id: "audit_received",
      label: "Otrzymanie audytu",
      description: "Audyt energetyczny został dostarczony",
      icon: <FileSignature className="w-4 h-4" />,
      completed: false,
    },
    {
      id: "contractor_published",
      label: "Publikacja na giełdzie wykonawców",
      description: "Zlecenie opublikowane dla wykonawców",
      icon: <Wrench className="w-4 h-4" />,
      completed: false,
    },
    {
      id: "contractor_selected",
      label: "Wybór wykonawcy",
      description: "Wykonawca został wybrany",
      icon: <User className="w-4 h-4" />,
      completed: false,
    },
    {
      id: "contract_signed",
      label: "Podpisanie umowy",
      description: "Umowa z wykonawcą podpisana",
      icon: <FileText className="w-4 h-4" />,
      completed: false,
    },
    {
      id: "work_in_progress",
      label: "Realizacja prac",
      description: "Prace termomodernizacyjne w trakcie",
      icon: <Hammer className="w-4 h-4" />,
      completed: false,
    },
    {
      id: "technical_acceptance",
      label: "Odbiór techniczny",
      description: "Prace zostały odebrane technicznie",
      icon: <CheckCircle className="w-4 h-4" />,
      completed: false,
    },
    {
      id: "subsidy_settlement",
      label: "Rozliczenie dotacji",
      description: "Dotacja została rozliczona",
      icon: <Receipt className="w-4 h-4" />,
      completed: false,
    },
  ]);

  // Fetch client details
  const { data: clientData, isLoading: loadingClient, refetch: refetchClient } = useOne({
    resource: "users",
    id: id || "",
    queryOptions: {
      enabled: !!id,
    },
  });

  // Fetch client's service requests
  const { data: serviceRequests, isLoading: loadingServiceRequests } = useList({
    resource: "service_requests",
    filters: [
      {
        field: "beneficiary_id",
        operator: "eq",
        value: id,
      },
    ],
    pagination: { mode: "off" },
    queryOptions: {
      enabled: !!id,
    },
  });

  // Fetch client's audit requests
  const { data: auditRequests, isLoading: loadingAuditRequests } = useList({
    resource: "audit_requests",
    filters: [
      {
        field: "beneficiary_id",
        operator: "eq",
        value: id,
      },
    ],
    pagination: { mode: "off" },
    queryOptions: {
      enabled: !!id,
    },
  });

  // Fetch client's calculator results
  const { data: calculatorContacts } = useList({
    resource: "operator_contacts",
    filters: [
      {
        field: "beneficiary_id",
        operator: "eq",
        value: id,
      },
      {
        field: "contact_type",
        operator: "eq",
        value: "calculator",
      },
    ],
    pagination: { mode: "off" },
    queryOptions: {
      enabled: !!id,
    },
  });

  const { mutate: updateClient, isLoading: isUpdating } = useUpdate();

  const client = clientData?.data;
  const serviceReqs = serviceRequests?.data || [];
  const auditReqs = auditRequests?.data || [];
  const calculatorResults = calculatorContacts?.data || [];

  // Load checklist from database if exists
  useEffect(() => {
    if (client?.checklist_data) {
      try {
        const savedChecklist = JSON.parse(client.checklist_data);
        setChecklist(savedChecklist);
      } catch (e) {
        console.error("Error parsing checklist data:", e);
      }
    }
  }, [client]);

  const handleChecklistUpdate = (itemId: string) => {
    const updatedChecklist = checklist.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          completed: !item.completed,
          completedAt: !item.completed ? new Date().toISOString() : undefined,
        };
      }
      return item;
    });

    setChecklist(updatedChecklist);

    // Save to database
    updateClient({
      resource: "users",
      id: id!,
      values: {
        checklist_data: JSON.stringify(updatedChecklist),
      },
    }, {
      onSuccess: () => {
        toast.success("Checklist zaktualizowana");
      },
      onError: () => {
        toast.error("Błąd podczas aktualizacji checklisty");
      },
    });
  };

  const completedSteps = checklist.filter(item => item.completed).length;
  const progress = (completedSteps / checklist.length) * 100;

  // Get latest calculator result
  const latestCalculatorResult = calculatorResults
    .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];

  let subsidyInfo = null;
  if (latestCalculatorResult?.calculator_result) {
    try {
      subsidyInfo = typeof latestCalculatorResult.calculator_result === 'string' 
        ? JSON.parse(latestCalculatorResult.calculator_result)
        : latestCalculatorResult.calculator_result;
    } catch (e) {
      console.error("Error parsing calculator result:", e);
    }
  }

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
        <Card>
          <CardContent className="text-center py-12">
            <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500 opacity-50" />
            <h3 className="text-lg font-medium mb-2">Klient nie znaleziony</h3>
            <p className="text-muted-foreground mb-4">
              Nie znaleziono klienta o ID: <code>{id}</code>
            </p>
            <Button onClick={() => navigate('/operator/clients')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Powrót do listy
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          onClick={() => navigate('/operator/clients')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Powrót
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <User className="w-6 h-6" />
            {client.first_name} {client.last_name}
          </h1>
          <p className="text-muted-foreground">Szczegóły klienta i proces termomodernizacji</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Client Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Dane klienta</span>
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4 mr-2" />
                  Edytuj
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Imię i nazwisko</p>
                    <p className="font-medium">{client.first_name} {client.last_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Mail className="w-3 h-3" /> Email
                    </p>
                    <p className="font-medium">{client.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Phone className="w-3 h-3" /> Telefon
                    </p>
                    <p className="font-medium">{client.phone_number || "Brak danych"}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Home className="w-3 h-3" /> Adres
                    </p>
                    <p className="font-medium">
                      {client.street_address || "Brak danych"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> Miasto i kod
                    </p>
                    <p className="font-medium">
                      {client.city && client.postal_code ? 
                        `${client.city}, ${client.postal_code}` : 
                        "Brak danych"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> Data rejestracji
                    </p>
                    <p className="font-medium">
                      {new Date(client.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Process Checklist */}
          <Card>
            <CardHeader>
              <CardTitle>Checklist procesu termomodernizacji</CardTitle>
              <div className="mt-2">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">
                    Ukończono {completedSteps} z {checklist.length} kroków
                  </span>
                  <span className="font-medium">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {checklist.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-start gap-3 p-3 rounded-lg border ${
                      item.completed ? 'bg-green-50 border-green-200' : 'bg-gray-50'
                    }`}
                  >
                    <Checkbox
                      checked={item.completed}
                      onCheckedChange={() => handleChecklistUpdate(item.id)}
                      className="mt-0.5"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className={item.completed ? 'text-green-600' : 'text-gray-600'}>
                          {item.icon}
                        </div>
                        <p className={`font-medium ${item.completed ? 'text-green-900' : ''}`}>
                          {item.label}
                        </p>
                      </div>
                      {item.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {item.description}
                        </p>
                      )}
                      {item.completed && item.completedAt && (
                        <p className="text-xs text-green-600 mt-1">
                          Ukończono: {new Date(item.completedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tabs for requests */}
          <Tabs defaultValue="service" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="service">
                Zlecenia wykonawców ({serviceReqs.length})
              </TabsTrigger>
              <TabsTrigger value="audit">
                Zlecenia audytorów ({auditReqs.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="service">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Zlecenia wykonawców</span>
                    <Button 
                      size="sm"
                      onClick={() => navigate('/operator/service-request/create-for-client/' + id)}
                    >
                      <Wrench className="w-4 h-4 mr-2" />
                      Nowe zlecenie
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {serviceReqs.length > 0 ? (
                    <div className="space-y-3">
                      {serviceReqs.map((request: any) => (
                        <div key={request.id} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-medium">
                                {request.city}, {request.street_address}
                              </h4>
                              <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                                <span>{request.postal_code}</span>
                                <span>•</span>
                                <span>{new Date(request.created_at).toLocaleDateString()}</span>
                              </div>
                            </div>
                            <Badge variant={
                              request.status === 'pending' ? 'secondary' :
                              request.status === 'verified' ? 'default' :
                              request.status === 'completed' ? 'outline' :
                              'destructive'
                            }>
                              {request.status}
                            </Badge>
                          </div>
                          {(request.heat_source || request.windows_count > 0) && (
                            <div className="flex gap-2 mt-3">
                              {request.heat_source && (
                                <Badge variant="outline">
                                  <Wrench className="w-3 h-3 mr-1" />
                                  {request.heat_source}
                                </Badge>
                              )}
                              {request.windows_count > 0 && (
                                <Badge variant="outline">
                                  <Building className="w-3 h-3 mr-1" />
                                  {request.windows_count} okien
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Wrench className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                      <p className="text-muted-foreground">Brak zleceń wykonawców</p>
                      <Button 
                        className="mt-4"
                        onClick={() => navigate('/operator/service-request/create-for-client/' + id)}
                      >
                        <Wrench className="w-4 h-4 mr-2" />
                        Utwórz pierwsze zlecenie
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="audit">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Zlecenia audytorów</span>
                    <Button 
                      size="sm"
                      onClick={() => navigate('/operator/audit-request/create-for-client/' + id)}
                    >
                      <ClipboardList className="w-4 h-4 mr-2" />
                      Nowe zlecenie
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {auditReqs.length > 0 ? (
                    <div className="space-y-3">
                      {auditReqs.map((request: any) => (
                        <div key={request.id} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-medium">
                                {request.city}, {request.street_address}
                              </h4>
                              <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                                <span>{request.postal_code}</span>
                                <span>•</span>
                                <span>{new Date(request.created_at).toLocaleDateString()}</span>
                              </div>
                            </div>
                            <Badge variant={
                              request.status === 'pending' ? 'secondary' :
                              request.status === 'verified' ? 'default' :
                              request.status === 'completed' ? 'outline' :
                              'destructive'
                            }>
                              {request.status}
                            </Badge>
                          </div>
                          {request.building_type && (
                            <div className="mt-3">
                              <Badge variant="outline">
                                <Building className="w-3 h-3 mr-1" />
                                {request.building_type}
                              </Badge>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <ClipboardList className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                      <p className="text-muted-foreground">Brak zleceń audytorów</p>
                      <Button 
                        className="mt-4"
                        onClick={() => navigate('/operator/audit-request/create-for-client/' + id)}
                      >
                        <ClipboardList className="w-4 h-4 mr-2" />
                        Utwórz pierwsze zlecenie
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Szybkie akcje</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate('/operator/service-request/create-for-client/' + id)}
              >
                <Wrench className="w-4 h-4 mr-2" />
                Nowe zlecenie wykonawcy
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate('/operator/audit-request/create-for-client/' + id)}
              >
                <ClipboardList className="w-4 h-4 mr-2" />
                Nowe zlecenie audytora
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => window.location.href = `tel:${client.phone_number}`}
                disabled={!client.phone_number}
              >
                <Phone className="w-4 h-4 mr-2" />
                Zadzwoń do klienta
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => window.location.href = `mailto:${client.email}`}
              >
                <Mail className="w-4 h-4 mr-2" />
                Wyślij email
              </Button>
            </CardContent>
          </Card>

          {/* Subsidy Info */}
          {subsidyInfo && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Euro className="w-4 h-4" />
                  Dotacja
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Poziom dotacji</p>
                    <p className="font-medium capitalize">{subsidyInfo.subsidyLevel}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Wysokość dofinansowania</p>
                    <p className="text-lg font-bold text-green-600">
                      {subsidyInfo.subsidyPercentage}%
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Maksymalna kwota</p>
                    <p className="font-medium">
                      {subsidyInfo.maxAmount?.toLocaleString()} zł
                    </p>
                  </div>
                  <div className="text-xs text-muted-foreground pt-2 border-t">
                    Obliczono: {new Date(latestCalculatorResult.created_at).toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Process Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Status procesu</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Postęp</span>
                  <span className="font-medium">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
                
                <div className="space-y-2 pt-2">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span>{completedSteps} ukończonych</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Circle className="w-4 h-4 text-gray-400" />
                    <span>{checklist.length - completedSteps} pozostało</span>
                  </div>
                </div>

                {completedSteps === checklist.length && (
                  <div className="mt-3 p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2 text-green-800">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">Proces ukończony!</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Dane kontaktowe</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">Telefon</p>
                <p className="font-medium">{client.phone_number || "Brak"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="font-medium text-sm break-all">{client.email}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Adres</p>
                <p className="font-medium text-sm">
                  {client.street_address && <>{client.street_address}<br /></>}
                  {client.city && client.postal_code ? 
                    `${client.city}, ${client.postal_code}` : 
                    client.city || client.postal_code || "Brak danych"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};