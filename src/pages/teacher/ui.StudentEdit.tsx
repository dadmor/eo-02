// src/pages/teacher/ui.StudentEdit.tsx
import { useForm } from "@refinedev/react-hook-form";
import { useNavigation, useShow, useSelect, useGetIdentity } from "@refinedev/core";
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
import { ArrowLeft, Save, UserCheck } from "lucide-react";
import { useParams } from "react-router-dom";
import { useEffect } from "react";

type Identity = {
  id: string;
  email?: string;
  full_name?: string;
};

export const routeConfig = { path: "/teacher/students/edit/:id", title: "Edit Student" };

export default function StudentEdit() {
  const { id } = useParams();
  const { goBack, list, show } = useNavigation();
  const { data: identity } = useGetIdentity<Identity>();
  
  const { queryResult } = useShow({
    resource: "students",
    id: id!,
  });

  const { data: studentData, isLoading } = queryResult;

  // Pobierz klasy nauczyciela do wyboru
  const { options: classOptions } = useSelect({
    resource: "classes",
    optionLabel: "name",
    optionValue: "id",
    filters: identity?.id ? [
      {
        field: "teacher_id",
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
    reset,
  } = useForm();

  // Wypełnij formularz danymi ucznia
  useEffect(() => {
    if (studentData) {
      reset({
        name: studentData.name || "",
        email: studentData.email || "",
        phone: studentData.phone || "",
        parent_email: studentData.parent_email || "",
        class_id: studentData.class_id || "",
        grade: studentData.grade || "",
        status: studentData.status || "active",
        address: studentData.address || "",
        birth_date: studentData.birth_date ? studentData.birth_date.split('T')[0] : "",
        notes: studentData.notes || "",
        learning_preferences: studentData.learning_preferences || "",
        level: studentData.level || 1,
        xp: studentData.xp || 0,
        streak: studentData.streak || 0,
      });
    }
  }, [studentData, reset]);

  const onSubmit = (data: any) => {
    onFinish({
      ...data,
      updated_at: new Date().toISOString(),
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!studentData) {
    return (
      <Card>
        <CardContent className="text-center py-16">
          <h3 className="text-lg font-medium mb-2">Uczeń nie został znaleziony</h3>
          <p className="text-muted-foreground mb-4">
            Nie można znaleźć ucznia o podanym identyfikatorze.
          </p>
          <Button onClick={() => goBack()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Wstecz
          </Button>
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
              Edytuj ucznia
            </h1>
            <p className="text-muted-foreground">
              Modyfikuj dane ucznia {studentData.name}
            </p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="w-5 h-5" />
            Dane ucznia
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Imię i nazwisko *</Label>
                <Input
                  id="name"
                  {...register("name", { required: "Imię i nazwisko jest wymagane" })}
                  placeholder="np. Jan Kowalski"
                />
                {errors.name && (
                  <p className="text-sm text-red-500">
                    {errors.name.message as string}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email", { 
                    required: "Email jest wymagany",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Nieprawidłowy format email"
                    }
                  })}
                  placeholder="jan.kowalski@example.com"
                />
                {errors.email && (
                  <p className="text-sm text-red-500">
                    {errors.email.message as string}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="class_id">Klasa</Label>
                <Select 
                  onValueChange={(value) => setValue("class_id", value)}
                  defaultValue={studentData.class_id}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Wybierz klasę" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Brak klasy</SelectItem>
                    {classOptions?.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  onValueChange={(value) => setValue("status", value)}
                  defaultValue={studentData.status}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Wybierz status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Aktywny</SelectItem>
                    <SelectItem value="inactive">Nieaktywny</SelectItem>
                    <SelectItem value="suspended">Zawieszony</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefon</Label>
                <Input
                  id="phone"
                  {...register("phone")}
                  placeholder="np. +48 123 456 789"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="parent_email">Email rodzica/opiekuna</Label>
                <Input
                  id="parent_email"
                  type="email"
                  {...register("parent_email")}
                  placeholder="rodzic@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="grade">Poziom klasy</Label>
                <Select 
                  onValueChange={(value) => setValue("grade", value)}
                  defaultValue={studentData.grade}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Wybierz poziom" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Brak poziomu</SelectItem>
                    <SelectItem value="Klasa 1">Klasa 1</SelectItem>
                    <SelectItem value="Klasa 2">Klasa 2</SelectItem>
                    <SelectItem value="Klasa 3">Klasa 3</SelectItem>
                    <SelectItem value="Klasa 4">Klasa 4</SelectItem>
                    <SelectItem value="Klasa 5">Klasa 5</SelectItem>
                    <SelectItem value="Klasa 6">Klasa 6</SelectItem>
                    <SelectItem value="Klasa 7">Klasa 7</SelectItem>
                    <SelectItem value="Klasa 8">Klasa 8</SelectItem>
                    <SelectItem value="Liceum 1">Liceum 1</SelectItem>
                    <SelectItem value="Liceum 2">Liceum 2</SelectItem>
                    <SelectItem value="Liceum 3">Liceum 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="birth_date">Data urodzenia</Label>
                <Input
                  id="birth_date"
                  type="date"
                  {...register("birth_date")}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Adres</Label>
              <Input
                id="address"
                {...register("address")}
                placeholder="Ulica, numer, kod pocztowy, miasto"
              />
            </div>

            {/* Gamification Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="level">Poziom</Label>
                <Input
                  id="level"
                  type="number"
                  min="1"
                  {...register("level", { valueAsNumber: true })}
                  placeholder="1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="xp">Punkty XP</Label>
                <Input
                  id="xp"
                  type="number"
                  min="0"
                  {...register("xp", { valueAsNumber: true })}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="streak">Seria dni</Label>
                <Input
                  id="streak"
                  type="number"
                  min="0"
                  {...register("streak", { valueAsNumber: true })}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notatki o uczniu</Label>
              <Textarea
                id="notes"
                {...register("notes")}
                placeholder="Dodatkowe informacje o uczniu, specjalne potrzeby, uwagi..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="learning_preferences">Preferencje uczenia się</Label>
              <Textarea
                id="learning_preferences"
                {...register("learning_preferences")}
                placeholder="Styl uczenia się, mocne strony, obszary do poprawy..."
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => show("students", id!)}
              >
                Anuluj
              </Button>
              <Button type="submit">
                <Save className="w-4 h-4 mr-2" />
                Zapisz zmiany
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
}