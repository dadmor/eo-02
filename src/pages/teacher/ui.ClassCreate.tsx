// src/pages/teacher/ui.ClassCreate.tsx
import { useForm } from "@refinedev/react-hook-form";
import { useNavigation, useGetIdentity } from "@refinedev/core";
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
import { ArrowLeft, Save } from "lucide-react";

type Identity = {
  id: string;
  email?: string;
  full_name?: string;
};


export default function ClassCreate() {
  const { goBack, list } = useNavigation();
  const { data: identity } = useGetIdentity<Identity>();
  
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
    },
  });

  const onSubmit = (data: any) => {
    onFinish({
      ...data,
      teacher_id: identity?.id,
      created_at: new Date().toISOString(),
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
              Utwórz nową klasę
            </h1>
            <p className="text-muted-foreground">
              Dodaj nową klasę do swojego systemu nauczania
            </p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Szczegóły klasy</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nazwa klasy *</Label>
                <Input
                  id="name"
                  {...register("name", { required: "Nazwa klasy jest wymagana" })}
                  placeholder="np. Klasa 3A, Matematyka podstawowa"
                />
                {errors.name && (
                  <p className="text-sm text-red-500">
                    {errors.name.message as string}
                  </p>
                )}
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
                    <SelectItem value="active">Aktywna</SelectItem>
                    <SelectItem value="inactive">Nieaktywna</SelectItem>
                    <SelectItem value="archived">Zarchiwizowana</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Przedmiot</Label>
                <Select onValueChange={(value) => setValue("subject", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Wybierz przedmiot" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Matematyka">Matematyka</SelectItem>
                    <SelectItem value="Polski">Język Polski</SelectItem>
                    <SelectItem value="Angielski">Język Angielski</SelectItem>
                    <SelectItem value="Historia">Historia</SelectItem>
                    <SelectItem value="Geografia">Geografia</SelectItem>
                    <SelectItem value="Biologia">Biologia</SelectItem>
                    <SelectItem value="Chemia">Chemia</SelectItem>
                    <SelectItem value="Fizyka">Fizyka</SelectItem>
                    <SelectItem value="Informatyka">Informatyka</SelectItem>
                    <SelectItem value="Plastyka">Plastyka</SelectItem>
                    <SelectItem value="Muzyka">Muzyka</SelectItem>
                    <SelectItem value="WF">Wychowanie Fizyczne</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="grade">Poziom/Klasa</Label>
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
                <Label htmlFor="school_year">Rok szkolny</Label>
                <Input
                  id="school_year"
                  {...register("school_year")}
                  placeholder="np. 2024/2025"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="room">Sala</Label>
                <Input
                  id="room"
                  {...register("room")}
                  placeholder="np. 101, Pracownia komputerowa"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Opis klasy</Label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="Opisz klasę, cele nauczania, wymagania..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notatki</Label>
              <Textarea
                id="notes"
                {...register("notes")}
                placeholder="Dodatkowe informacje, uwagi..."
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => list("classes")}
              >
                Anuluj
              </Button>
              <Button type="submit">
                <Save className="w-4 h-4 mr-2" />
                Utwórz klasę
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
}