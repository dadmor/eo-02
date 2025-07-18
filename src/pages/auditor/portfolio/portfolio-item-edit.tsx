// ========================================
// src/pages/auditor/portfolio-item-edit.tsx
// ========================================

import { useForm, SubmitHandler } from 'react-hook-form';
import { useOne, useUpdate } from "@refinedev/core";
import { useGetIdentity } from "@refinedev/core";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button, Input, Label } from "@/components/ui";
import { Lead } from "@/components/reader";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Building, 
  Save,
  ArrowLeft,
  MapPin,
  Calendar,
  Square,
  Image,
  Award,
  X,
  Plus,
  AlertCircle
} from "lucide-react";
import { useState, useEffect } from "react";
import { Identity } from "../../../operatorTypes";

// Define the form data type
interface PortfolioFormData {
  title: string;
  location: string;
  building_type: string;
  building_area: string;
  completion_date: string;
  description: string;
  energy_class_before: string;
  energy_class_after: string;
  main_image_url: string;
  additional_images: string[];
  key_features: string[];
  is_featured: boolean;
}

export const PortfolioItemEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [mainImageUrl, setMainImageUrl] = useState("");
  
  // Get authenticated user
  const { data: identity } = useGetIdentity<Identity>();
  const userId = identity?.id;

  const { mutate: updatePortfolioItem } = useUpdate();

  // Pobranie szczegółów projektu
  const { data: portfolioData, isLoading } = useOne({
    resource: "auditor_portfolio_items",
    id: id!,
    queryOptions: {
      enabled: !!id,
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PortfolioFormData>();

  const portfolioItem = portfolioData?.data;

  const buildingTypes = [
    { value: "dom_jednorodzinny", label: "Dom jednorodzinny" },
    { value: "dom_wielorodzinny", label: "Dom wielorodzinny" },
    { value: "apartament", label: "Apartament" },
    { value: "budynek_komercyjny", label: "Budynek komercyjny" },
    { value: "budynek_przemyslowy", label: "Budynek przemysłowy" },
    { value: "budynek_uslugowy", label: "Budynek usługowy" },
    { value: "budynek_zabytkowy", label: "Budynek zabytkowy" },
    { value: "inny", label: "Inny" },
  ];

  const energyClasses = [
    { value: "A++", label: "A++" },
    { value: "A+", label: "A+" },
    { value: "A", label: "A" },
    { value: "B", label: "B" },
    { value: "C", label: "C" },
    { value: "D", label: "D" },
    { value: "E", label: "E" },
    { value: "F", label: "F" },
    { value: "G", label: "G" },
  ];

  const keyFeaturesOptions = [
    "Termomodernizacja",
    "Wymiana okien",
    "Modernizacja systemu grzewczego",
    "Instalacja fotowoltaiki",
    "Pompa ciepła",
    "Wentylacja mechaniczna",
    "Izolacja poddasza",
    "Izolacja ścian",
    "Inteligentny system zarządzania",
    "Audyt termowizyjny",
    "Certyfikat BREEAM/LEED",
    "Odnawialne źródła energii",
  ];

  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

  // Initialize form with existing data
  useEffect(() => {
    if (portfolioItem) {
      const formatDate = (dateString: string) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
      };

      reset({
        title: portfolioItem.title || "",
        location: portfolioItem.location || "",
        building_type: portfolioItem.building_type || "",
        building_area: portfolioItem.building_area?.toString() || "",
        completion_date: formatDate(portfolioItem.completion_date),
        description: portfolioItem.description || "",
        energy_class_before: portfolioItem.energy_class_before || "",
        energy_class_after: portfolioItem.energy_class_after || "",
        main_image_url: portfolioItem.main_image_url || "",
        additional_images: portfolioItem.additional_images || [],
        key_features: portfolioItem.key_features || [],
        is_featured: portfolioItem.is_featured || false,
      });

      setSelectedFeatures(portfolioItem.key_features || []);
      setSelectedImages(portfolioItem.additional_images || []);
    }
  }, [portfolioItem, reset]);

  // Show loading state
  if (!userId || isLoading || !portfolioItem) {
    return (
      <div className="p-6 mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  // Check if user owns this portfolio item
  if (portfolioItem.auditor_id !== userId) {
    return (
      <div className="p-6 mx-auto text-center">
        <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
        <h2 className="text-xl font-semibold mb-2">Brak dostępu</h2>
        <p className="text-muted-foreground mb-4">Nie masz uprawnień do edycji tego projektu.</p>
        <Button onClick={() => navigate('/auditor/portfolio')}>
          Powrót do portfolio
        </Button>
      </div>
    );
  }

  const handleFeatureToggle = (feature: string) => {
    const newFeatures = selectedFeatures.includes(feature)
      ? selectedFeatures.filter(f => f !== feature)
      : [...selectedFeatures, feature];
    setSelectedFeatures(newFeatures);
    setValue("key_features", newFeatures);
  };

  const handleImageAdd = () => {
    if (mainImageUrl.trim() && !selectedImages.includes(mainImageUrl.trim())) {
      const newImages = [...selectedImages, mainImageUrl.trim()];
      setSelectedImages(newImages);
      setValue("additional_images", newImages);
      setMainImageUrl("");
    }
  };

  const handleImageRemove = (imageUrl: string) => {
    const newImages = selectedImages.filter(img => img !== imageUrl);
    setSelectedImages(newImages);
    setValue("additional_images", newImages);
  };

  const handleFormSubmit: SubmitHandler<PortfolioFormData> = (data: PortfolioFormData) => {
    if (!userId || !id) {
      console.error("Missing required data");
      return;
    }

    const formData = {
      ...data,
      auditor_id: userId,
      building_area: data.building_area ? parseFloat(data.building_area) : null,
      key_features: selectedFeatures,
      additional_images: selectedImages,
      is_featured: data.is_featured || false,
    };

    updatePortfolioItem({
      resource: "auditor_portfolio_items",
      id: id,
      values: formData,
    }, {
      onSuccess: () => {
        navigate('/auditor/portfolio');
      },
      onError: (error) => {
        console.error("Error updating portfolio item:", error);
      }
    });
  };

  return (
    <>
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="outline" 
          onClick={() => navigate('/auditor/portfolio')}
          size="sm"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Powrót do portfolio
        </Button>
        <Lead
          title="Edytuj Projekt"
          description="Aktualizuj szczegóły projektu w portfolio"
        />
      </div>

      {/* Informacja o edycji */}
      <Card className="border-blue-200 bg-blue-50 mb-6">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Building className="w-6 h-6 text-blue-600" />
            <div>
              <div className="font-medium text-blue-900">
                Edytujesz projekt: {portfolioItem.title}
              </div>
              <div className="text-sm text-blue-800">
                Aktualizuj informacje o projekcie, dodaj nowe zdjęcia lub zmień jego status.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Formularz */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5" />
                Aktualizuj projekt
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
                {/* Podstawowe informacje */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Podstawowe informacje</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="title">
                      Tytuł projektu *
                    </Label>
                    <Input
                      id="title"
                      placeholder="np. Kompleksowy audyt energetyczny domu jednorodzinnego"
                      {...register("title", {
                        required: "Tytuł jest wymagany",
                        minLength: {
                          value: 10,
                          message: "Tytuł musi mieć co najmniej 10 znaków"
                        }
                      })}
                    />
                    {errors.title && (
                      <p className="text-sm text-red-500">
                        {errors.title.message as string}
                      </p>
                    )}
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="location">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          Lokalizacja *
                        </div>
                      </Label>
                      <Input
                        id="location"
                        placeholder="Warszawa, Mazowieckie"
                        {...register("location", {
                          required: "Lokalizacja jest wymagana",
                        })}
                      />
                      {errors.location && (
                        <p className="text-sm text-red-500">
                          {errors.location.message as string}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="completion_date">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Data ukończenia *
                        </div>
                      </Label>
                      <Input
                        id="completion_date"
                        type="date"
                        max={new Date().toISOString().split('T')[0]}
                        {...register("completion_date", {
                          required: "Data ukończenia jest wymagana",
                        })}
                      />
                      {errors.completion_date && (
                        <p className="text-sm text-red-500">
                          {errors.completion_date.message as string}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Szczegóły budynku */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium mb-4">Szczegóły budynku</h3>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="building_type">Typ budynku *</Label>
                      <Select 
                        value={watch("building_type")} 
                        onValueChange={(value) => setValue("building_type", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Wybierz typ budynku" />
                        </SelectTrigger>
                        <SelectContent>
                          {buildingTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.building_type && (
                        <p className="text-sm text-red-500">Typ budynku jest wymagany</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="building_area">
                        <div className="flex items-center gap-2">
                          <Square className="w-4 h-4" />
                          Powierzchnia użytkowa (m²)
                        </div>
                      </Label>
                      <Input
                        id="building_area"
                        type="number"
                        min="1"
                        step="0.1"
                        placeholder="150.5"
                        {...register("building_area")}
                      />
                    </div>
                  </div>

                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="energy_class_before">
                        <div className="flex items-center gap-2">
                          <Award className="w-4 h-4" />
                          Klasa energetyczna przed audytem
                        </div>
                      </Label>
                      <Select 
                        value={watch("energy_class_before")} 
                        onValueChange={(value) => setValue("energy_class_before", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Wybierz klasę" />
                        </SelectTrigger>
                        <SelectContent>
                          {energyClasses.map((energyClass) => (
                            <SelectItem key={energyClass.value} value={energyClass.value}>
                              {energyClass.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="energy_class_after">
                        <div className="flex items-center gap-2">
                          <Award className="w-4 h-4" />
                          Klasa energetyczna po modernizacji
                        </div>
                      </Label>
                      <Select 
                        value={watch("energy_class_after")} 
                        onValueChange={(value) => setValue("energy_class_after", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Wybierz klasę" />
                        </SelectTrigger>
                        <SelectContent>
                          {energyClasses.map((energyClass) => (
                            <SelectItem key={energyClass.value} value={energyClass.value}>
                              {energyClass.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Kluczowe cechy */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium mb-4">Kluczowe cechy projektu</h3>
                  
                  <div className="space-y-2">
                    <Label>Wybierz zastosowane rozwiązania</Label>
                    <div className="grid gap-2 md:grid-cols-2">
                      {keyFeaturesOptions.map((feature) => (
                        <div key={feature} className="flex items-center space-x-2">
                          <Checkbox
                            id={feature}
                            checked={selectedFeatures.includes(feature)}
                            onCheckedChange={() => handleFeatureToggle(feature)}
                          />
                          <Label htmlFor={feature} className="text-sm font-normal cursor-pointer">
                            {feature}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Opis projektu */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium mb-4">Opis projektu</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">
                      Szczegółowy opis audytu i przeprowadzonych prac *
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Opisz szczegóły projektu, zastosowane rozwiązania, osiągnięte rezultaty..."
                      rows={6}
                      {...register("description", {
                        required: "Opis jest wymagany",
                        minLength: {
                          value: 50,
                          message: "Opis musi mieć co najmniej 50 znaków"
                        }
                      })}
                    />
                    {errors.description && (
                      <p className="text-sm text-red-500">
                        {errors.description.message as string}
                      </p>
                    )}
                  </div>
                </div>

                {/* Zdjęcia */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium mb-4">Zdjęcia projektu</h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="main_image_url">
                        <div className="flex items-center gap-2">
                          <Image className="w-4 h-4" />
                          Główne zdjęcie projektu
                        </div>
                      </Label>
                      <Input
                        id="main_image_url"
                        placeholder="https://example.com/image.jpg"
                        {...register("main_image_url")}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Dodatkowe zdjęcia</Label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="URL zdjęcia"
                          value={mainImageUrl}
                          onChange={(e) => setMainImageUrl(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleImageAdd();
                            }
                          }}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleImageAdd}
                          disabled={!mainImageUrl.trim()}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      {selectedImages.length > 0 && (
                        <div className="space-y-2">
                          <Label className="text-sm">Dodane zdjęcia:</Label>
                          <div className="space-y-1">
                            {selectedImages.map((imageUrl, index) => (
                              <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                                <span className="text-sm truncate flex-1">{imageUrl}</span>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleImageRemove(imageUrl)}
                                >
                                  <X className="w-3 h-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Opcje dodatkowe */}
                <div className="border-t pt-6">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="is_featured"
                      checked={watch("is_featured")}
                      onCheckedChange={(checked) => setValue("is_featured", !!checked)}
                    />
                    <Label htmlFor="is_featured" className="cursor-pointer">
                      Wyróżnij ten projekt w portfolio
                    </Label>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Wyróżnione projekty będą wyświetlane na górze listy
                  </p>
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => navigate('/auditor/portfolio')}
                  >
                    Anuluj
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    <Save className="w-4 h-4 mr-2" />
                    {isSubmitting ? "Zapisywanie..." : "Zapisz zmiany"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Podgląd i informacje */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Informacje o projekcie</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm">
                <div>
                  <div className="font-medium text-foreground mb-1">📅 Utworzony</div>
                  <div className="text-muted-foreground">
                    {new Date(portfolioItem.created_at).toLocaleDateString()}
                  </div>
                </div>

                <div>
                  <div className="font-medium text-foreground mb-1">🔄 Ostatnia aktualizacja</div>
                  <div className="text-muted-foreground">
                    {new Date(portfolioItem.updated_at).toLocaleDateString()}
                  </div>
                </div>

                {portfolioItem.is_featured && (
                  <div>
                    <Badge className="bg-yellow-100 text-yellow-800">
                      ⭐ Projekt wyróżniony
                    </Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Podgląd wybranych cech */}
          {selectedFeatures.length > 0 && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-base">Wybrane rozwiązania</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1">
                  {selectedFeatures.map((feature) => (
                    <Badge key={feature} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Wskazówki */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-base">Wskazówki do edycji</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-xs text-muted-foreground">
                <div>• Aktualizuj opis jeśli zmieniły się szczegóły</div>
                <div>• Dodaj nowe zdjęcia z lepszą jakością</div>
                <div>• Zaktualizuj klasy energetyczne po weryfikacji</div>
                <div>• Wyróżnij swoje najlepsze projekty</div>
                <div>• Usuń nieaktualne informacje</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};