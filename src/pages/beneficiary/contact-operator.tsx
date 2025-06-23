// src/pages/beneficiary/contact-operator.tsx
import { useState } from "react";
import { useForm } from "@refinedev/react-hook-form";
import { useNavigation } from "@refinedev/core";
import { useGetIdentity } from "@refinedev/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Calculator, Phone, MapPin, Users, Euro, AlertCircle } from "lucide-react";
import { Button, Input, Label } from "@/components/ui";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const ContactOperator = () => {
  const { list } = useNavigation();
  const { data: identity, isLoading: identityLoading } = useGetIdentity();
  const userId = identity?.id;

  // Calculator state
  const [householdMembers, setHouseholdMembers] = useState<number>(1);
  const [householdIncome, setHouseholdIncome] = useState<number>(0);
  const [allOwnersAlive, setAllOwnersAlive] = useState<string>("tak");
  const [calculatorResult, setCalculatorResult] = useState<any>(null);

  const {
    refineCore: { onFinish },
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resource: "operator_contacts",
  });

  // Kalkulator dotacji (uproszczona logika)
  const calculateSubsidy = () => {
    // Progi dochodowe na 2024 (przykładowe wartości)
    const incomeThresholds = {
      1: 2500,  // 1 osoba
      2: 3500,  // 2 osoby
      3: 4500,  // 3 osoby
      4: 5500,  // 4 osoby
      5: 6500,  // 5 osób
    };

    const threshold = incomeThresholds[Math.min(householdMembers, 5) as keyof typeof incomeThresholds] || 7000;
    const incomePercentage = (householdIncome / threshold) * 100;
    
    let subsidyLevel = "brak";
    let subsidyPercentage = 0;
    let maxAmount = 0;

    if (incomePercentage <= 100) {
      subsidyLevel = "podstawowy";
      subsidyPercentage = 30;
      maxAmount = 69000;
    }
    if (incomePercentage <= 80) {
      subsidyLevel = "podwyższony";
      subsidyPercentage = 50;
      maxAmount = 135000;
    }
    if (incomePercentage <= 60) {
      subsidyLevel = "maksymalny";
      subsidyPercentage = 70;
      maxAmount = 188000;
    }

    // Dodatkowe warunki
    if (allOwnersAlive === "nie") {
      subsidyPercentage += 10;
      maxAmount += 20000;
    }

    setCalculatorResult({
      subsidyLevel,
      subsidyPercentage,
      maxAmount,
      incomePercentage: Math.round(incomePercentage),
      threshold
    });
  };

  const handleContactSubmit = (data: any) => {
    console.log("Submitting form with data:", data);
    console.log("User ID:", userId);
    
    if (!userId) {
      console.error("User not authenticated");
      alert("Błąd: Użytkownik nie jest zalogowany");
      return;
    }
    
    const formData = {
      ...data,
      beneficiary_id: userId,
      calculator_result: calculatorResult,
      status: "pending",
    };
    
    console.log("Final form data:", formData);
    onFinish(formData);
  };

  // Show loading state while identity is loading
  if (identityLoading) {
    return (
      <div className="p-6 mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  // Show error if no user (but not during loading)
  if (!identityLoading && !userId) {
    return (
      <div className="p-6 mx-auto">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Błąd: Nie można załadować danych użytkownika. Spróbuj odświeżyć stronę.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              console.log("Navigating back to operator contacts list");
              try {
                list("operator_contacts");
              } catch (error) {
                console.error("Navigation error:", error);
                // Fallback navigation
                window.history.back();
              }
            }}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Powrót
          </Button>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">
          Kontakt z Operatorem
        </h1>
        <p className="text-muted-foreground">
          Sprawdź wysokość dotacji i umów się na kontakt z operatorem programu
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Kalkulator dotacji */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              Kalkulator dotacji
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="household_members">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Liczba członków gospodarstwa domowego
                </div>
              </Label>
              <Input
                id="household_members"
                type="number"
                min="1"
                max="10"
                value={householdMembers}
                onChange={(e) => setHouseholdMembers(parseInt(e.target.value) || 1)}
                placeholder="1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="household_income">
                <div className="flex items-center gap-2">
                  <Euro className="w-4 h-4" />
                  Łączny dochód gospodarstwa domowego (zł/miesiąc)
                </div>
              </Label>
              <Input
                id="household_income"
                type="number"
                min="0"
                value={householdIncome}
                onChange={(e) => setHouseholdIncome(parseFloat(e.target.value) || 0)}
                placeholder="0"
              />
            </div>

            <div className="space-y-3">
              <Label>Czy wszyscy współwłaściciele żyją?</Label>
              <RadioGroup
                value={allOwnersAlive}
                onValueChange={setAllOwnersAlive}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="tak" id="alive_yes" />
                  <Label htmlFor="alive_yes">Tak</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="nie" id="alive_no" />
                  <Label htmlFor="alive_no">Nie</Label>
                </div>
              </RadioGroup>
            </div>

            <Button 
              onClick={calculateSubsidy} 
              className="w-full"
              disabled={!householdIncome}
            >
              <Calculator className="w-4 h-4 mr-2" />
              Oblicz wysokość dotacji
            </Button>

            {calculatorResult && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-2">
                    <div className="font-medium">
                      Poziom dotacji: <span className="text-green-600">{calculatorResult.subsidyLevel}</span>
                    </div>
                    <div>
                      Wysokość dofinansowania: <strong>{calculatorResult.subsidyPercentage}%</strong>
                    </div>
                    <div>
                      Maksymalna kwota: <strong>{calculatorResult.maxAmount.toLocaleString()} zł</strong>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Twój dochód to {calculatorResult.incomePercentage}% progu dochodowego
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Formularz kontaktu */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              Zgłoszenie kontaktu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(handleContactSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="postal_code">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Kod pocztowy *
                  </div>
                </Label>
                <Input
                  id="postal_code"
                  placeholder="00-000"
                  {...register("postal_code", {
                    required: "Kod pocztowy jest wymagany",
                  })}
                />
                {errors.postal_code && (
                  <p className="text-sm text-red-500">
                    {errors.postal_code.message as string}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">Miejscowość *</Label>
                <Input
                  id="city"
                  placeholder="Warszawa"
                  {...register("city", {
                    required: "Miejscowość jest wymagana",
                  })}
                />
                {errors.city && (
                  <p className="text-sm text-red-500">
                    {errors.city.message as string}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone_number">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Numer telefonu *
                  </div>
                </Label>
                <Input
                  id="phone_number"
                  type="tel"
                  placeholder="+48 123 456 789"
                  {...register("phone_number", {
                    required: "Numer telefonu jest wymagany",
                  })}
                />
                {errors.phone_number && (
                  <p className="text-sm text-red-500">
                    {errors.phone_number.message as string}
                  </p>
                )}
              </div>

              {calculatorResult && (
                <div className="p-3 bg-green-50 rounded border border-green-200">
                  <div className="text-sm">
                    <div className="font-medium text-green-800">Obliczona dotacja:</div>
                    <div className="text-green-700">
                      {calculatorResult.subsidyPercentage}% do {calculatorResult.maxAmount.toLocaleString()} zł
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-4 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    console.log("Cancel button clicked");
                    try {
                      list("operator_contacts");
                    } catch (error) {
                      console.error("Navigation error:", error);
                      window.history.back();
                    }
                  }}
                >
                  Anuluj
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Wysyłanie..." : "Wyślij zgłoszenie"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};