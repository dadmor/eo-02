// ========================================
// src/pages/auditor/available-requests.tsx
// ========================================

import { useState } from "react";
import { useList } from "@refinedev/core";
import { useGetIdentity } from "@refinedev/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FlexBox, GridBox } from "@/components/shared";
import { Lead } from "@/components/reader";
import { Badge, Button } from "@/components/ui";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  FileText, 
  MapPin,
  Calendar,
  Filter,
  Search,
  Building,
  Thermometer,
  Square,
  Phone
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Identity } from "../../operatorTypes";

export const AvailableRequests = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [cityFilter, setCityFilter] = useState("all");
  
  // Get authenticated user
  const { data: identity } = useGetIdentity<Identity>();
  const userId = identity?.id;
  
  // Pobranie dostępnych zleceń
  const { data: requests, isLoading } = useList({
    resource: "audit_requests",
    filters: [
      {
        field: "status",
        operator: "eq",
        value: "verified",
      },
    ],
    sorters: [
      {
        field: "created_at",
        order: "desc",
      },
    ],
    pagination: { mode: "off" },
    queryOptions: {
      enabled: !!userId,
    },
  });

  // Check if user has portfolio
  const { data: portfolio } = useList({
    resource: "auditor_portfolio_items",
    filters: userId ? [
      {
        field: "auditor_id",
        operator: "eq",
        value: userId,
      },
    ] : [],
    pagination: { mode: "off" },
    queryOptions: {
      enabled: !!userId,
    },
  });

  const allRequests = requests?.data || [];
  const hasPortfolio = portfolio?.data && portfolio.data.length > 0;

  // Filtrowanie
  const filteredRequests = allRequests.filter(request => {
    const matchesSearch = !searchTerm || 
      request.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.street_address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.postal_code.includes(searchTerm);
    
    const matchesCity = cityFilter === "all" || request.city === cityFilter;
    
    return matchesSearch && matchesCity;
  });

  // Unikalne miasta do filtra
  const uniqueCities = [...new Set(allRequests.map(r => r.city))].sort();

  // Show loading state
  if (!userId || isLoading) {
    return (
      <div className="p-6 mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Lead
        title="Dostępne Zlecenia"
        description="Przeglądaj i składaj oferty na zlecenia audytowe"
      />

      {/* Alert jeśli brak portfolio */}
      {!hasPortfolio && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Building className="w-6 h-6 text-orange-600" />
              <div>
                <div className="font-medium text-orange-900">
                  Musisz uzupełnić portfolio aby składać oferty
                </div>
                <div className="text-sm text-orange-800">
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-orange-700"
                    onClick={() => navigate('/auditor/portfolio')}
                  >
                    Przejdź do portfolio →
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filtry */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtry
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Szukaj po mieście, adresie lub kodzie pocztowym..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={cityFilter} onValueChange={setCityFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Wszystkie miasta" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Wszystkie miasta</SelectItem>
                {uniqueCities.map(city => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm("");
                setCityFilter("all");
              }}
            >
              Wyczyść
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista zleceń */}
      <div>
        {filteredRequests.length > 0 ? (
          <div className="space-y-4">
            {filteredRequests.map((request: any) => (
              <Card key={request.id}>
                <CardContent className="p-6">
                  <FlexBox className="mb-4">
                    <div>
                      <h3 className="font-medium text-lg mb-2">
                        {request.city}, {request.street_address}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {request.postal_code}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(request.created_at).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {request.phone_number}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline"
                        onClick={() => navigate(`/auditor/request/${request.id}`)}
                      >
                        Szczegóły
                      </Button>
                      <Button
                        onClick={() => navigate(`/auditor/offer/create/${request.id}`)}
                        disabled={!hasPortfolio}
                      >
                        Złóż ofertę
                      </Button>
                    </div>
                  </FlexBox>

                  {/* Dodatkowe informacje o budynku */}
                  <div className="space-y-3">
                    {request.building_type && (
                      <div className="flex items-center gap-2 text-sm">
                        <Building className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">Typ budynku:</span>
                        <Badge variant="outline">{request.building_type}</Badge>
                      </div>
                    )}
                    
                    <div className="flex flex-wrap gap-2 text-sm">
                      {request.building_year && (
                        <Badge variant="outline">
                          <Calendar className="w-3 h-3 mr-1" />
                          {request.building_year}
                        </Badge>
                      )}
                      {request.living_area && (
                        <Badge variant="outline">
                          <Square className="w-3 h-3 mr-1" />
                          {request.living_area}m²
                        </Badge>
                      )}
                      {request.heating_system && (
                        <Badge variant="outline">
                          <Thermometer className="w-3 h-3 mr-1" />
                          {request.heating_system}
                        </Badge>
                      )}
                    </div>

                    {request.audit_purpose && (
                      <div className="text-sm">
                        <span className="font-medium">Cel audytu:</span> {request.audit_purpose}
                      </div>
                    )}

                    {request.notes && (
                      <div className="text-sm bg-gray-50 p-3 rounded">
                        <span className="font-medium">Uwagi:</span> {request.notes}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-medium mb-2">
                {searchTerm || cityFilter !== "all" ? "Brak wyników" : "Brak dostępnych zleceń"}
              </h3>
              <p className="text-muted-foreground">
                {searchTerm || cityFilter !== "all"
                  ? "Spróbuj zmienić kryteria wyszukiwania"
                  : "Sprawdź ponownie później, aby zobaczyć nowe zlecenia"
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
};