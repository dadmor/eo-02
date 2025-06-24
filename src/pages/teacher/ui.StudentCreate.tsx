// src/pages/teacher/ui.StudentCreate.tsx
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
import { ArrowLeft, Save, UserPlus } from "lucide-react";

type Identity = {
  id: string;
  email?: string;
  full_name?: string;
};

export default function StudentCreate() {
  const { goBack, list } = useNavigation();
  const { data: identity } = useGetIdentity<Identity>();
  
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
  } = useForm({
    defaultValues: {
      teacher_id: identity?.id,
      status: "active",
      level: 1,
      xp: 0,
      streak: 0,
    },
  });

  const onSubmit = (data: any) => {
    onFinish({
      ...data,
      teacher_id: identity?.id,
      created_at: new Date().toISOString(),
      role: "student", // Upewnij się, że rola jest ustawiona
    });
  };

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
              Dodaj nowego ucznia
            </h1>
            <p className="text-muted-foreground">
              Dodaj ucznia do swojego systemu nauczania
            </p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
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
                <Select onValueChange={(value) => setValue("class_id", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Wybierz klasę" />
                  </SelectTrigger>
                  <SelectContent>
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
                  defaultValue="active"
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
                <Select onValueChange={(value) => setValue("grade", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Wybierz poziom" />
                  </SelectTrigger>
                  <SelectContent>
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
                onClick={() => list("students")}
              >
                Anuluj
              </Button>
              <Button type="submit">
                <Save className="w-4 h-4 mr-2" />
                Dodaj ucznia
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
}