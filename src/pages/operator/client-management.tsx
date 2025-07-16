// src/pages/operator/client-management.tsx
import { useState } from "react";
import { useList, useUpdate } from "@refinedev/core";
import { useGetIdentity } from "@refinedev/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, Input } from "@/components/ui";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  UserPlus, 
  Users, 
  Search, 
  Phone, 
  Mail, 
  MapPin,
  Calendar,
  Edit,
  Trash2,
  Eye,
  ClipboardList,
  CheckCircle2,
  AlertCircle,
  Loader2,
  User
} from "lucide-react";
import { Identity } from "../../operatorTypes";
import { useNavigate } from "react-router-dom";

interface Client {
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

export const ClientManagement = () => {
  const navigate = useNavigate();
  const { data: identity } = useGetIdentity<Identity>();
  const operatorId = identity?.id;

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Fetch clients assigned to this operator
  const { data: clientsData, isLoading, refetch } = useList<Client>({
    resource: "users",
    filters: [
      {
        field: "role",
        operator: "eq",
        value: "beneficiary",
      },
      {
        field: "operator_id",
        operator: "eq",
        value: operatorId,
      },
    ],
    pagination: { mode: "off" },
    queryOptions: {
      enabled: !!operatorId,
    },
  });

  const { mutate: updateClient, isLoading: isDeleting } = useUpdate();

  const clients = clientsData?.data || [];
  
  // Filter clients based on search
  const filteredClients = clients.filter(client => 
    client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone_number?.includes(searchTerm) ||
    client.city?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteClient = () => {
    if (!selectedClient) return;

    // Zamiast usuwać, odpinamy klienta od operatora
    updateClient({
      resource: "users",
      id: selectedClient.id,
      values: {
        operator_id: null,
      },
    }, {
      onSuccess: () => {
        toast.success("Klient został odpięty", {
          description: "Klient nie jest już przypisany do Ciebie.",
        });
        setShowDeleteDialog(false);
        setSelectedClient(null);
        refetch();
      },
      onError: () => {
        toast.error("Błąd", {
          description: "Nie udało się odpiąć klienta.",
        });
      },
    });
  };

  const handleAddClient = () => {
    navigate("/operator/client/new");
  };

  const handleEditClient = (client: Client) => {
    navigate(`/operator/client/${client.id}/edit`);
  };

  const openDeleteDialog = (client: Client) => {
    setSelectedClient(client);
    setShowDeleteDialog(true);
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="animate-spin w-4 h-4" />
          Ładowanie listy klientów...
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Users className="w-8 h-8" />
            Zarządzanie klientami
          </h1>
          <p className="text-muted-foreground">
            Zarządzaj klientami przypisanymi do Ciebie
          </p>
        </div>
        <Button onClick={handleAddClient}>
          <UserPlus className="w-4 h-4 mr-2" />
          Dodaj klienta
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Wyszukiwanie</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Szukaj po nazwie, email, telefonie lub mieście..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">{clients.length}</div>
                <div className="text-sm text-muted-foreground">Wszyscy klienci</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold">
                  {clients.filter(c => c.status === 'active').length}
                </div>
                <div className="text-sm text-muted-foreground">Aktywni</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8 text-purple-600" />
              <div>
                <div className="text-2xl font-bold">
                  {clients.filter(c => {
                    const date = new Date(c.created_at);
                    const today = new Date();
                    return date.getMonth() === today.getMonth() && 
                           date.getFullYear() === today.getFullYear();
                  }).length}
                </div>
                <div className="text-sm text-muted-foreground">W tym miesiącu</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <ClipboardList className="w-8 h-8 text-orange-600" />
              <div>
                <div className="text-2xl font-bold">0</div>
                <div className="text-sm text-muted-foreground">W procesie</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Clients Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista klientów ({filteredClients.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredClients.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Imię i nazwisko</TableHead>
                    <TableHead>Kontakt</TableHead>
                    <TableHead>Adres</TableHead>
                    <TableHead>Data dodania</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Akcje</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-muted-foreground" />
                          {client.name || "Brak danych"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="w-3 h-3 text-muted-foreground" />
                            {client.email}
                          </div>
                          {client.phone_number && (
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="w-3 h-3 text-muted-foreground" />
                              {client.phone_number}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {client.city || client.postal_code ? (
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="w-3 h-3 text-muted-foreground" />
                            {client.city && client.postal_code ? 
                              `${client.city}, ${client.postal_code}` :
                              client.city || client.postal_code
                            }
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-3 h-3 text-muted-foreground" />
                          {new Date(client.created_at).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={client.status === 'active' ? 'default' : 'secondary'}>
                          {client.status || 'Nowy'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/operator/client/${client.id}`)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditClient(client)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openDeleteDialog(client)}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-medium mb-2">Brak klientów</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm ? "Nie znaleziono klientów spełniających kryteria wyszukiwania" : 
                             "Dodaj pierwszego klienta, aby rozpocząć"}
              </p>
              {!searchTerm && (
                <Button onClick={handleAddClient}>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Dodaj pierwszego klienta
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              Potwierdź odpięcie klienta
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <p>Czy na pewno chcesz odpiąć tego klienta od swojego konta?</p>
            
            {selectedClient && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="font-medium">{selectedClient.name}</p>
                <p className="text-sm text-muted-foreground">{selectedClient.email}</p>
              </div>
            )}
            
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-blue-900">Informacja</p>
                  <p className="text-blue-700">
                    Klient nie zostanie usunięty z systemu. Zostanie tylko odpięty 
                    od Twojego konta operatora. Dane klienta zostaną zachowane, 
                    a klient nadal będzie mógł korzystać z systemu.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteDialog(false);
                setSelectedClient(null);
              }}
            >
              Anuluj
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteClient}
              disabled={isDeleting}
            >
              {isDeleting && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              Odepnij klienta
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};