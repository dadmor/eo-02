// src/pages/beneficiary/request-details.tsx
import { useParams } from "react-router-dom";
import { useGetIdentity, useOne } from "@refinedev/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, MapPin, Calendar, Loader2 } from "lucide-react";

export const RequestDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { data: identity } = useGetIdentity();
  const userId = identity?.id;

  // Spróbuj najpierw pobrać jako zlecenie wykonawcy
  const {
    data: serviceData,
    isLoading: loadingService,
    error: errorService,
  } = useOne({
    resource: "service_requests",
    id: id || "",
    queryOptions: { enabled: !!id },
  });

  // Równolegle spróbuj jako zlecenie audytora
  const {
    data: auditData,
    isLoading: loadingAudit,
    error: errorAudit,
  } = useOne({
    resource: "audit_requests",
    id: id || "",
    queryOptions: { enabled: !!id },
  });

  const request = serviceData?.data || auditData?.data;
  const loading = loadingService && loadingAudit;

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="animate-spin w-4 h-4" />
          Ładowanie szczegółów zlecenia...
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="p-6 text-red-500">
        Nie znaleziono zlecenia o ID: <code>{id}</code>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Szczegóły zlecenia
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div>
            <strong>Typ zlecenia:</strong> {serviceData?.data ? "Wykonawca" : "Audytor"}
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>{request.postal_code} {request.city}, {request.street_address}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>Utworzone: {new Date(request.created_at).toLocaleDateString()}</span>
          </div>
          <div>
            <strong>Status:</strong> {request.status}
          </div>
          {/* Można dodać więcej pól warunkowo */}
        </CardContent>
      </Card>
    </div>
  );
};
