// src/pages/beneficiary/my-requests.tsx
import { useState } from "react";
import { useList, useDelete, useUpdate } from "@refinedev/core";
import { useGetIdentity } from "@refinedev/core";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FlexBox, GridBox } from "@/components/shared";
import { Lead } from "@/components/reader";
import { Badge, Button } from "@/components/ui";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  Eye, 
  MapPin,
  Calendar,
  Wrench,
  ClipboardCheck,
  Edit,
  Trash2,
  Star,
  MessageSquare,
  Users,
  Building
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export const MyRequests = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: "" });
  
  // Get authenticated user
  const { data: identity } = useGetIdentity();
  const userId = identity?.id;
  
  const { mutate: deleteRequest } = useDelete();
  const { mutate: updateRequest } = useUpdate();
  
  // Determine filter based on current path
  const currentPath = location.pathname;
  let requestType: 'all' | 'service' | 'audit' = 'all';
  
  if (currentPath.includes('service-requests')) {
    requestType = 'service';
  } else if (currentPath.includes('audit-requests')) {
    requestType = 'audit';
  }
  
  // Pobranie zleceń wykonawców
  const { data: serviceRequests, isLoading: loadingSR, refetch: refetchSR, error: errorSR } = useList({
    resource: "service_requests",
    filters: userId ? [
      {
        field: "beneficiary_id",
        operator: "eq",
        value: userId,
      },
    ] : [],
    sorters: [
      {
        field: "created_at",
        order: "desc",
      },
    ],
    pagination: { mode: "off" },
    queryOptions: {
      enabled: !!userId && (requestType === 'all' || requestType === 'service'),
      retry: 1, // Zmniejsz retry żeby szybciej zobaczyć błąd
      retryDelay: 500,
    },
  });

  // Pobranie zleceń audytorów
  const { data: auditRequests, isLoading: loadingAR, refetch: refetchAR, error: errorAR } = useList({
    resource: "audit_requests", 
    filters: userId ? [
      {
        field: "beneficiary_id",
        operator: "eq", 
        value: userId,
      },
    ] : [],
    sorters: [
      {
        field: "created_at",
        order: "desc",
      },
    ],
    pagination: { mode: "off" },
    queryOptions: {
      enabled: !!userId && (requestType === 'all' || requestType === 'audit'),
      retry: 1, // Zmniejsz retry żeby szybciej zobaczyć błąd
      retryDelay: 500,
    },
  });

  // TEMPORARILY DISABLED - Pobranie ofert dla zleceń (table doesn't exist)
  const { data: offers } = useList({
    resource: "offers",
    filters: userId ? [
      {
        field: "beneficiary_id",
        operator: "eq",
        value: userId,
      },
    ] : [],
    pagination: { mode: "off" },
    queryOptions: {
      enabled: false, // Disabled until offers table is created
    },
  });

  const serviceReqs = serviceRequests?.data || [];
  const auditReqs = auditRequests?.data || [];
  const offersList = offers?.data || []; // Will be empty array since query is disabled
  
  // Filter based on current view
  let filteredRequests = [];
  
  if (requestType === 'service') {
    filteredRequests = serviceReqs.map(r => ({ ...r, type: 'service' as const }));
  } else if (requestType === 'audit') {
    filteredRequests = auditReqs.map(r => ({ ...r, type: 'audit' as const }));
  } else {
    // All requests
    filteredRequests = [
      ...serviceReqs.map(r => ({ ...r, type: 'service' as const })),
      ...auditReqs.map(r => ({ ...r, type: 'audit' as const })),
    ];
  }
  
  // Sort by creation date
  const allRequests = filteredRequests.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const stats = {
    total: allRequests.length,
    pending: allRequests.filter(r => r.status === 'pending').length,
    verified: allRequests.filter(r => r.status === 'verified').length,
    completed: allRequests.filter(r => r.status === 'completed').length,
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="border-yellow-500 text-yellow-700">Oczekujące</Badge>;
      case 'verified':
        return <Badge variant="outline" className="border-green-500 text-green-700">Zweryfikowane</Badge>;
      case 'completed':
        return <Badge variant="outline" className="border-blue-500 text-blue-700">Ukończone</Badge>;
      default:
        return <Badge variant="outline" className="border-red-500 text-red-700">Odrzucone</Badge>;
    }
  };

  const getPageTitle = () => {
    switch (requestType) {
      case 'service':
        return 'Zlecenia Wykonawców';
      case 'audit':
        return 'Zlecenia Audytorów';
      default:
        return 'Wszystkie Zlecenia';
    }
  };

  const getPageDescription = () => {
    switch (requestType) {
      case 'service':
        return 'Zarządzaj swoimi zleceniami dla wykonawców termomodernizacji';
      case 'audit':
        return 'Zarządzaj swoimi zleceniami dla audytorów energetycznych';
      default:
        return 'Zarządzaj wszystkimi swoimi zleceniami termomodernizacyjnymi';
    }
  };

  const canEdit = (request: any) => {
    return request.status === 'pending';
  };

  const canDelete = (request: any) => {
    const requestOffers = getRequestOffers(request);
    return request.status === 'pending' && requestOffers.length === 0;
  };

  const getRequestOffers = (request: any) => {
    return offersList.filter(o => 
      o.request_id === request.id && o.request_type === request.type
    );
  };

  const handleDelete = (request: any) => {
    setSelectedRequest(request);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (selectedRequest) {
      deleteRequest({
        resource: selectedRequest.type === 'service' ? 'service_requests' : 'audit_requests',
        id: selectedRequest.id,
      }, {
        onSuccess: () => {
          setShowDeleteDialog(false);
          setSelectedRequest(null);
          if (selectedRequest.type === 'service') {
            refetchSR();
          } else {
            refetchAR();
          }
        }
      });
    }
  };

  const handleAddReview = (request: any) => {
    setSelectedRequest(request);
    setReviewData({ rating: 5, comment: "" });
    setShowReviewDialog(true);
  };

  const submitReview = () => {
    if (selectedRequest && reviewData.comment.trim()) {
      updateRequest({
        resource: selectedRequest.type === 'service' ? 'service_requests' : 'audit_requests',
        id: selectedRequest.id,
        values: {
          review_rating: reviewData.rating,
          review_comment: reviewData.comment,
          status: 'completed'
        }
      }, {
        onSuccess: () => {
          setShowReviewDialog(false);
          setSelectedRequest(null);
          setReviewData({ rating: 5, comment: "" });
          if (selectedRequest.type === 'service') {
            refetchSR();
          } else {
            refetchAR();
          }
        }
      });
    }
  };

  // Debug logging
  console.log('Debug info:', {
    userId,
    loadingSR,
    loadingAR,
    serviceRequests,
    auditRequests,
    serviceReqsData: serviceRequests?.data,
    auditReqsData: auditRequests?.data,
    errorSR,
    errorAR,
    requestType
  });

  // Show loading state if user identity is not loaded yet OR if queries are still loading
  // But allow rendering if at least one query completed successfully
  const shouldShowLoading = !userId;
  
  if (shouldShowLoading) {
    return (
      <div className="p-6 mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
        <div className="mt-4 text-sm text-gray-500">
          Debug: userId={userId}, loadingSR={loadingSR?.toString()}, loadingAR={loadingAR?.toString()}
          {errorSR && <div className="text-red-500">Service Request Error: {JSON.stringify(errorSR)}</div>}
          {errorAR && <div className="text-red-500">Audit Request Error: {JSON.stringify(errorAR)}</div>}
        </div>
      </div>
    );
  }

  return (
    <>
      <FlexBox>
        <Lead
          title={getPageTitle()}
          description={getPageDescription()}
        />
        <div className="flex gap-2">
          {/* Navigation buttons */}
          <Button 
            variant={requestType === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => navigate('/beneficiary/my-requests')}
          >
            Wszystkie
          </Button>
          <Button 
            variant={requestType === 'service' ? 'default' : 'outline'}
            size="sm"
            onClick={() => navigate('/beneficiary/service-requests')}
          >
            <Wrench className="w-4 h-4 mr-1" />
            Wykonawcy
          </Button>
          <Button 
            variant={requestType === 'audit' ? 'default' : 'outline'}
            size="sm"
            onClick={() => navigate('/beneficiary/audit-requests')}
          >
            <ClipboardCheck className="w-4 h-4 mr-1" />
            Audytorzy
          </Button>
        </div>
      </FlexBox>

     
      <FlexBox>
        <div></div>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={() => navigate('/beneficiary/service-request/create')}
          >
            <Wrench className="w-4 h-4 mr-2" />
            Nowe zlecenie wykonawcy
          </Button>
          <Button 
            onClick={() => navigate('/beneficiary/audit-request/create')}
          >
            <ClipboardCheck className="w-4 h-4 mr-2" />
            Nowe zlecenie audytora
          </Button>
        </div>
      </FlexBox>  

      {/* Statystyki */}
      <GridBox variant="1-2-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-blue-600" />
              <div>
                <div className="text-xl font-bold">{stats.total}</div>
                <div className="text-xs text-muted-foreground">Łącznie</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="w-6 h-6 text-yellow-600" />
              <div>
                <div className="text-xl font-bold">{stats.pending}</div>
                <div className="text-xs text-muted-foreground">Oczekujące</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <div>
                <div className="text-xl font-bold">{stats.verified}</div>
                <div className="text-xs text-muted-foreground">Zweryfikowane</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-blue-600" />
              <div>
                <div className="text-xl font-bold">{stats.completed}</div>
                <div className="text-xs text-muted-foreground">Ukończone</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </GridBox>

      {/* Lista zleceń */}
      <div>
        {allRequests.length > 0 ? (
          <div className="space-y-4">
            {allRequests.map((request: any) => {
              const requestOffers = getRequestOffers(request);
              
              return (
                <Card key={`${request.type}-${request.id}`}>
                  <CardHeader>
                    <FlexBox>
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant={request.type === 'service' ? 'default' : 'secondary'}>
                            {request.type === 'service' ? (
                              <>
                                <Wrench className="w-3 h-3 mr-1" />
                                Wykonawca
                              </>
                            ) : (
                              <>
                                <ClipboardCheck className="w-3 h-3 mr-1" />
                                Audytor
                              </>
                            )}
                          </Badge>
                          {getStatusBadge(request.status)}
                          {/* Temporarily hide offers count until offers table exists */}
                          {/* {requestOffers.length > 0 && (
                            <Badge variant="outline" className="border-blue-500 text-blue-700">
                              <Users className="w-3 h-3 mr-1" />
                              {requestOffers.length} ofert
                            </Badge>
                          )} */}
                        </div>
                        <h3 className="font-medium text-lg">{request.city}, {request.street_address}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {request.postal_code}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(request.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {/* Akcje */}
                        {canEdit(request) && (
                          <Button 
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/beneficiary/${request.type === 'service' ? 'service-request' : 'audit-request'}/edit/${request.id}`)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        )}
                        
                        {canDelete(request) && (
                          <Button 
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(request)}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        )}
                        
                        {/* Temporarily hide review button until offers functionality is implemented */}
                        {/* {request.status === 'verified' && requestOffers.length > 0 && !request.review_comment && (
                          <Button 
                            variant="outline"
                            size="sm"
                            onClick={() => handleAddReview(request)}
                          >
                            <Star className="w-4 h-4 text-yellow-500" />
                          </Button>
                        )} */}
                        
                        <Button 
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/beneficiary/requests/${request.id}`)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Szczegóły
                        </Button>
                      </div>
                    </FlexBox>
                  </CardHeader>
                  
                  <CardContent>
                    {/* Informacje o zleceniu */}
                    {request.type === 'service' && (
                      <div className="flex flex-wrap gap-2 text-xs mb-3">
                        {request.heat_source && (
                          <Badge variant="outline">
                            {request.heat_source === 'pompa_ciepla' ? 'Pompa ciepła' :
                             request.heat_source === 'piec_pellet' ? 'Piec na pellet' : 'Piec zgazowujący'}
                          </Badge>
                        )}
                        {request.windows_count > 0 && (
                          <Badge variant="outline">{request.windows_count} okien</Badge>
                        )}
                        {request.doors_count > 0 && (
                          <Badge variant="outline">{request.doors_count} drzwi</Badge>
                        )}
                        {request.wall_insulation_m2 > 0 && (
                          <Badge variant="outline">Izolacja ścian: {request.wall_insulation_m2}m²</Badge>
                        )}
                      </div>
                    )}
                    
                    {request.type === 'audit' && (
                      <div className="flex flex-wrap gap-2 text-xs mb-3">
                        {request.building_type && (
                          <Badge variant="outline">
                            <Building className="w-3 h-3 mr-1" />
                            {request.building_type}
                          </Badge>
                        )}
                        {request.building_year && (
                          <Badge variant="outline">Rok budowy: {request.building_year}</Badge>
                        )}
                        {request.living_area && (
                          <Badge variant="outline">Powierzchnia: {request.living_area}m²</Badge>
                        )}
                      </div>
                    )}
                    
                    {/* Status information */}
                    {request.status === 'verified' && (
                      <div className="mb-3 text-sm text-green-700 bg-green-50 p-2 rounded">
                        ✓ Zlecenie zweryfikowane - oczekuje na oferty
                      </div>
                    )}

                    {/* Temporarily hide offers section until offers table exists */}
                    {/* {requestOffers.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Otrzymane oferty:</h4>
                        <div className="space-y-2">
                          {requestOffers.slice(0, 3).map((offer: any) => (
                            <div key={offer.id} className="p-2 border rounded text-sm">
                              <div className="flex justify-between items-start">
                                <div>
                                  <div className="font-medium">{offer.company_name || offer.contractor_name}</div>
                                  <div className="text-muted-foreground">
                                    Cena: {offer.price?.toLocaleString()} zł
                                  </div>
                                </div>
                                <Badge variant="outline" className="text-xs">
                                  {offer.status === 'pending' ? 'Nowa' : 
                                   offer.status === 'accepted' ? 'Zaakceptowana' : 'Odrzucona'}
                                </Badge>
                              </div>
                            </div>
                          ))}
                          {requestOffers.length > 3 && (
                            <div className="text-xs text-muted-foreground">
                              +{requestOffers.length - 3} więcej ofert
                            </div>
                          )}
                        </div>
                      </div>
                    )} */}

                    {/* Opinia */}
                    {request.review_comment && (
                      <div className="mt-3 p-3 bg-blue-50 rounded border border-blue-200">
                        <div className="flex items-center gap-2 mb-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm font-medium">Twoja opinia</span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${
                                  i < request.review_rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-gray-700">{request.review_comment}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-medium mb-2">
                {requestType === 'service' ? 'Nie masz jeszcze żadnych zleceń wykonawców' :
                 requestType === 'audit' ? 'Nie masz jeszcze żadnych zleceń audytorów' :
                 'Nie masz jeszcze żadnych zleceń'}
              </h3>
              <p className="text-muted-foreground mb-4">
                Utwórz pierwsze zlecenie, aby rozpocząć proces termomodernizacji
              </p>
              <div className="flex gap-2 justify-center">
                <Button 
                  variant="outline"
                  onClick={() => navigate('/beneficiary/service-request/create')}
                >
                  <Wrench className="w-4 h-4 mr-2" />
                  Zlecenie wykonawcy
                </Button>
                <Button 
                  onClick={() => navigate('/beneficiary/audit-request/create')}
                >
                  <ClipboardCheck className="w-4 h-4 mr-2" />
                  Zlecenie audytora
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Dialog usuwania */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Usuń zlecenie</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Czy na pewno chcesz usunąć to zlecenie? Ta akcja jest nieodwracalna.</p>
            {selectedRequest && (
              <div className="p-3 bg-gray-50 rounded">
                <div className="font-medium">{selectedRequest.city}, {selectedRequest.street_address}</div>
                <div className="text-sm text-muted-foreground">
                  {selectedRequest.type === 'service' ? 'Zlecenie wykonawcy' : 'Zlecenie audytora'}
                </div>
              </div>
            )}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                Anuluj
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                <Trash2 className="w-4 h-4 mr-2" />
                Usuń
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog opinii */}
      <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dodaj opinię</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Ocena</Label>
              <Select
                value={reviewData.rating.toString()}
                onValueChange={(value) => setReviewData(prev => ({ ...prev, rating: parseInt(value) }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">⭐ (1/5)</SelectItem>
                  <SelectItem value="2">⭐⭐ (2/5)</SelectItem>
                  <SelectItem value="3">⭐⭐⭐ (3/5)</SelectItem>
                  <SelectItem value="4">⭐⭐⭐⭐ (4/5)</SelectItem>
                  <SelectItem value="5">⭐⭐⭐⭐⭐ (5/5)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="review-comment">Komentarz</Label>
              <Textarea
                id="review-comment"
                placeholder="Opisz swoją opinię o wykonawcy/audytorze..."
                value={reviewData.comment}
                onChange={(e) => setReviewData(prev => ({ ...prev, comment: e.target.value }))}
                rows={4}
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowReviewDialog(false)}>
                Anuluj
              </Button>
              <Button 
                onClick={submitReview}
                disabled={!reviewData.comment.trim()}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Dodaj opinię
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};