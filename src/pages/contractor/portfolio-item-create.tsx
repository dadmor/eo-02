// ========================================
// src/pages/contractor/portfolio-item-create.tsx
// ========================================

import { useForm, SubmitHandler } from 'react-hook-form';
import { useCreate } from "@refinedev/core";
import { useGetIdentity } from "@refinedev/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button, Input, Label } from "@/components/ui";
import { Lead } from "@/components/reader";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Hammer, 
  Save,
  ArrowLeft,
  MapPin,
  Calendar,
  Euro,
  Image,
  Clock,
  X,
  Plus,
  TrendingUp,
  Zap,
  Building,
  Thermometer
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Identity } from "../../operatorTypes";

// Define the form data type
interface ContractorPortfolioFormData {
  title: string;
  location: string;
  project_type: string;
  project_value: string;
  duration_days: string;
  completion_date: string;
  description: string;
  technologies_used: string[];
  main_image_url: string;
  additional_images: string[];
  results_achieved: string;
  client_satisfaction: string;
  challenges_solved: string;
  is_featured: boolean;
}

export const ContractorPortfolioItemCreate = () => {
  const navigate = useNavigate();
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [mainImageUrl, setMainImageUrl] = useState("");
  
  // Get authenticated user
  const { data: identity } = useGetIdentity<Identity>();
  const userId = identity?.id;

  const { mutate: createPortfolioItem } = useCreate();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ContractorPortfolioFormData>({
    defaultValues: {
      title: "",
      location: "",
      project_type: "",
      project_value: "",
      duration_days: "",
      completion_date: "",
      description: "",
      technologies_used: [],
      main_image_url: "",
      additional_images: [],
      results_achieved: "",
      client_satisfaction: "",
      challenges_solved: "",
      is_featured: false,
    },
  });

  const projectTypes = [
    { value: "izolacja_termiczna", label: "Izolacja termiczna" },
    { value: "wymiana_okien", label: "Wymiana okien i drzwi" },
    { value: "system_ogrzewania", label: "System ogrzewania" },
    { value: "fotowoltaika", label: "Instalacja fotowoltaiczna" },
    { value: "pompa_ciepla", label: "Pompa ciepła" },
    { value: "rekuperacja", label: "System rekuperacji" },
    { value: "termomodernizacja", label: "Kompleksowa termomodernizacja" },
    { value: "smart_home", label: "System smart home" },
    { value: "dach_elewacja", label: "Dach i elewacja" },
    { value: "wentylacja", label: "Wentylacja mechaniczna" },
    { value: "kolektory_sloneczne", label: "Kolektory słoneczne" },
    { value: "biomasa", label: "Kocioł na biomasę" },
    { value: "inny", label: "Inny" },
  ];

  const technologiesOptions = [
    "Styropian grafitowy",
    "Wełna mineralna",
    "Poliuretan",
    "Fibra drzewna", 
    "Okna PVC",
    "Okna aluminiowe",
    "Okna drewniane",
    "Pompa ciepła powietrze-woda",
    "Pompa ciepła grunta-woda",
    "Kocioł kondensacyjny",
    "Kocioł na pellet",
    "Panele fotowoltaiczne",
    "Inwerter sieciowy",
    "Magazyn energii",
    "Rekuperator",
    "Klimatyzacja VRV",
    "Kolektory słoneczne",
    "System sterowania KNX",
    "Termostat inteligentny",
    "Membrana paroizolacyjna",
    "Folia wiatroizolacyjna",
    "Systemy dociepleń ETICS"
  ];

  const [selectedTechnologies, setSelectedTechnologies] = useState<string[]>([]);

  const handleTechnologyToggle = (tech: string) => {
    const newTechs = selectedTechnologies.includes(tech)
      ? selectedTechnologies.filter(t => t !== tech)
      : [...selectedTechnologies, tech];
    setSelectedTechnologies(newTechs);
    setValue("technologies_used", newTechs);
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

  const handleFormSubmit: SubmitHandler<ContractorPortfolioFormData> = (data) => {
    if (!userId) {
      console.error("User not authenticated");
      return;
    }

    const formData = {
      ...data,
      contractor_id: userId,
      project_value: data.project_value ? parseFloat(data.project_value) : null,
      duration_days: data.duration_days ? parseInt(data.duration_days) : null,
      technologies_used: selectedTechnologies,
      additional_images: selectedImages,
      is_featured: data.is_featured || false,
    };

    createPortfolioItem({
      resource: "contractor_portfolio_items",
      values: formData,
    }, {
      onSuccess: () => {
        navigate('/contractor/portfolio');
      }
    });
  };

  // Show loading state if user identity is not loaded yet
  if (!userId) {
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
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="outline" 
          onClick={() => navigate('/contractor/portfolio')}
          size="sm"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Powrót
        </Button>
        <Lead
          title="Dodaj Projekt do Portfolio"
          description="Stwórz nowy przykład zrealizowanego projektu termomodernizacyjnego"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Formularz */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hammer className="w-5 h-5" />
                Szczegóły projektu
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
                      placeholder="np. Kompleksowa termomodernizacja domu 150m²"
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

                {/* Szczegóły projektu */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium mb-4">Szczegóły projektu</h3>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="project_type">Typ projektu *</Label>
                      <Select onValueChange={(value) => setValue("project_type", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Wybierz typ projektu" />
                        </SelectTrigger>
                        <SelectContent>
                          {projectTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.project_type && (
                        <p className="text-sm text-red-500">Typ projektu jest wymagany</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="project_value">
                        <div className="flex items-center gap-2">
                          <Euro className="w-4 h-4" />
                          Wartość projektu (zł)
                        </div>
                      </Label>
                      <Input
                        id="project_value"
                        type="number"
                        min="1"
                        step="1"
                        placeholder="50000"
                        {...register("project_value")}
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="duration_days">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          Czas realizacji (dni)
                        </div>
                      </Label>
                      <Input
                        id="duration_days"
                        type="number"
                        min="1"
                        max="365"
                        placeholder="30"
                        {...register("duration_days")}
                      />
                    </div>
                  </div>
                </div>

                {/* Technologie i materiały */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium mb-4">Zastosowane technologie</h3>
                  
                  <div className="space-y-2">
                    <Label>Wybierz technologie i materiały</Label>
                    <div className="grid gap-2 md:grid-cols-2">
                      {technologiesOptions.map((tech) => (
                        <div key={tech} className="flex items-center space-x-2">
                          <Checkbox
                            id={tech}
                            checked={selectedTechnologies.includes(tech)}
                            onCheckedChange={() => handleTechnologyToggle(tech)}
                          />
                          <Label htmlFor={tech} className="text-sm font-normal cursor-pointer">
                            {tech}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Opis projektu */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium mb-4">Opis projektu</h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="description">
                        Szczegółowy opis realizacji *
                      </Label>
                      <Textarea
                        id="description"
                        placeholder="Opisz szczegóły projektu, zastosowane rozwiązania, etapy realizacji..."
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

                    <div className="space-y-2">
                      <Label htmlFor="results_achieved">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4" />
                          Osiągnięte rezultaty
                        </div>
                      </Label>
                      <Textarea
                        id="results_achieved"
                        placeholder="np. Redukcja zużycia energii o 60%, poprawa komfortu cieplnego..."
                        rows={3}
                        {...register("results_achieved")}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="challenges_solved">
                        Rozwiązane wyzwania
                      </Label>
                      <Textarea
                        id="challenges_solved"
                        placeholder="Opisz napotkane wyzwania i sposoby ich rozwiązania..."
                        rows={3}
                        {...register("challenges_solved")}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="client_satisfaction">
                        Opinia klienta
                      </Label>
                      <Textarea
                        id="client_satisfaction"
                        placeholder="Opinia klienta o realizacji projektu..."
                        rows={3}
                        {...register("client_satisfaction")}
                      />
                    </div>
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
                      <Label>Dodatkowe zdjęcia (przed/po, etapy prac)</Label>
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
                      {...register("is_featured")}
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
                    onClick={() => navigate('/contractor/portfolio')}
                  >
                    Anuluj
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    <Save className="w-4 h-4 mr-2" />
                    {isSubmitting ? "Zapisywanie..." : "Dodaj projekt"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Podgląd i wskazówki */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Wskazówki</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm text-muted-foreground">
                <div>
                  <div className="font-medium text-foreground mb-1">🏗️ Tytuł projektu</div>
                  <div>Użyj opisowego tytułu, który jasno określa zakres prac</div>
                </div>

                <div>
                  <div className="font-medium text-foreground mb-1">📍 Lokalizacja</div>
                  <div>Podaj miasto i region (bez dokładnego adresu ze względu na prywatność)</div>
                </div>

                <div>
                  <div className="font-medium text-foreground mb-1">⚙️ Technologie</div>
                  <div>Wybierz wszystkie zastosowane materiały i technologie</div>
                </div>

                <div>
                  <div className="font-medium text-foreground mb-1">📝 Opis projektu</div>
                  <div>Opisz etapy realizacji, wyzwania i rozwiązania</div>
                </div>

                <div>
                  <div className="font-medium text-foreground mb-1">📈 Rezultaty</div>
                  <div>Podaj konkretne efekty (oszczędność energii, poprawa komfortu)</div>
                </div>

                <div>
                  <div className="font-medium text-foreground mb-1">📸 Zdjęcia</div>
                  <div>Dodaj zdjęcia przed i po realizacji, etapów prac</div>
                </div>

                <div>
                  <div className="font-medium text-foreground mb-1">💰 Wartość</div>
                  <div>Podanie wartości projektu buduje zaufanie</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Podgląd wybranych technologii */}
          {selectedTechnologies.length > 0 && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-base">Wybrane technologie</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1">
                  {selectedTechnologies.map((tech) => (
                    <Badge key={tech} variant="outline" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
};