// src/pages/teacher/ui.ArticleCreate.tsx
import { useForm } from "@refinedev/react-hook-form";
import { useNavigation, useGetIdentity, useSelect } from "@refinedev/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Save, FileText } from "lucide-react";
import { useSearchParams } from "react-router-dom";

type Identity = {
  id: string;
  email?: string;
  username?: string;
  role: 'teacher' | 'student';
};

export default function ArticleCreate() {
  const { goBack, list } = useNavigation();
  const { data: identity } = useGetIdentity<Identity>();
  const [searchParams] = useSearchParams();
  const preselectedLessonId = searchParams.get('lesson_id');
  
  // Pobierz lekcje nauczyciela do wyboru
  const { options: lessonOptions } = useSelect({
    resource: "lessons",
    optionLabel: "title",
    optionValue: "id",
    filters: identity?.id ? [
      {
        field: "author_id",
        operator: "eq",
        value: identity.id,
      },
    ] : [],
  });

  const {
    refineCore: { onFinish },
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      lesson_id: preselectedLessonId || "",
      sort_order: 0,
    },
  });

  const onSubmit = (data: any) => {
    onFinish({
      ...data,
      sort_order: parseInt(data.sort_order) || 0,
      created_at: new Date().toISOString(),
    });
  };

  // Pokaż ostrzeżenie jeśli brak identity
  if (!identity) {
    return (
      <Card>
        <CardContent className="text-center py-16">
          <h3 className="text-lg font-medium mb-2">Ładowanie danych użytkownika...</h3>
          <p className="text-muted-foreground mb-4">
            Proszę czekać na załadowanie danych.
          </p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => goBack()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Wstecz
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Utwórz nowy artykuł
            </h1>
            <p className="text-muted-foreground">
              Dodaj treści edukacyjne do swojej lekcji
            </p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Szczegóły artykułu
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Tytuł artykułu *</Label>
                <Input
                  id="title"
                  {...register("title", { required: "Tytuł artykułu jest wymagany" })}
                  placeholder="np. Wprowadzenie do tematu"
                />
                {errors.title && (
                  <p className="text-sm text-red-500">
                    {errors.title.message as string}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lesson_id">Lekcja *</Label>
                <Select 
                  onValueChange={(value) => setValue("lesson_id", value)}
                  defaultValue={preselectedLessonId || ""}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Wybierz lekcję" />
                  </SelectTrigger>
                  <SelectContent>
                    {lessonOptions?.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.lesson_id && (
                  <p className="text-sm text-red-500">
                    Musisz wybrać lekcję
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="sort_order">Kolejność wyświetlania</Label>
                <Input
                  id="sort_order"
                  type="number"
                  min="0"
                  {...register("sort_order", { valueAsNumber: true })}
                  placeholder="0"
                />
                <p className="text-xs text-muted-foreground">
                  Określa kolejność wyświetlania artykułów w lekcji (0 = pierwszy)
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Treść artykułu *</Label>
              <Textarea
                id="content"
                {...register("content", { required: "Treść artykułu jest wymagana" })}
                placeholder="Wprowadź treść artykułu..."
                rows={12}
                className="min-h-[300px]"
              />
              {errors.content && (
                <p className="text-sm text-red-500">
                  {errors.content.message as string}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Możesz używać Markdown do formatowania tekstu
              </p>
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => list("articles")}
              >
                Anuluj
              </Button>
              <Button type="submit">
                <Save className="w-4 h-4 mr-2" />
                Utwórz artykuł
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Tips Card */}
      <Card>
        <CardHeader>
          <CardTitle>💡 Wskazówki</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p><strong>Formatowanie:</strong> Używaj Markdown do formatowania tekstu (# nagłówki, **pogrubienie**, *kursywa*)</p>
            <p><strong>Kolejność:</strong> Artykuły są wyświetlane w kolejności rosnącej według numeru kolejności</p>
            <p><strong>Długość:</strong> Optymalna długość artykułu to 500-2000 słów</p>
            <p><strong>Struktura:</strong> Podziel treść na sekcje z jasno określonymi nagłówkami</p>
          </div>
        </CardContent>
      </Card>
    </>
  );
}