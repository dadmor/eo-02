// pages/RegisterStep3.tsx
import React from "react";
import { useRegister } from "@refinedev/core";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Loader2, Check, Mail, Shield, User } from "lucide-react";
import { NarrowCol } from "@/components/layout/NarrowCol";
import { Lead } from "@/components/reader";
import { useFormSchemaStore } from "@/utility/formSchemaStore";

export const RegisterStep3: React.FC = () => {
  const navigate = useNavigate();
  const { mutate: register, isLoading, error } = useRegister();
  const { getData, get, unregister } = useFormSchemaStore();

  const processData = getData("registration");
  const schema = get("registration");

  React.useEffect(() => {
    return () => {
      unregister("registration", "data");
    };
  }, [unregister]);

  const handleBack = () => {
    navigate("/register/step2");
  };

  const handleRegister = () => {
    register({
      email: processData.email,
      password: processData.password,
      role: processData.role,
    });
  };

  const getRoleIcon = (role: string) => {
    return role === "auditor" ? Shield : User;
  };

  const getRoleLabel = (role: string) => {
    return role === "auditor" ? "Auditor" : "Beneficiary";
  };

  return (
    <NarrowCol>
      <Lead title={`Rejestracja`} description={`3 z 3 Potwierdzenie danych`} />
      

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Check className="mr-2 h-5 w-5 text-green-600" />
              Podsumowanie
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Mail className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-gray-600">{processData.email}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                {React.createElement(getRoleIcon(processData.role as string), {
                  className: "h-5 w-5 text-gray-400",
                })}
                <div>
                  <p className="text-sm font-medium">Rola</p>
                  <p className="text-sm text-gray-600">
                    {getRoleLabel(processData.role as string)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800 font-medium">
                Co się stanie po rejestracji:
              </p>
              <ul className="text-sm text-blue-700 mt-2 space-y-1">
                <li>• Otrzymasz email z potwierdzeniem</li>
                <li>• Konto zostanie aktywowane automatycznie</li>
                <li>• Będziesz mógł się zalogować</li>
              </ul>
            </div>

            {/* Debug: Schema info */}
            <details className="text-xs">
              <summary className="cursor-pointer text-gray-500">
                Debug: Schema info
              </summary>
              <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
                {JSON.stringify(
                  { schema: schema?.schema, data: processData },
                  null,
                  2
                )}
              </pre>
            </details>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>
                  {error?.message || "Błąd rejestracji"}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <div className="mt-4 flex justify-between">
          <Button variant="outline" onClick={handleBack} disabled={isLoading}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Wstecz
          </Button>

          <Button onClick={handleRegister} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Zarejestruj się
          </Button>
        </div>

        <div className="mt-4 text-center">
          <a
            href="/login"
            className="text-blue-600 hover:text-blue-500 text-sm"
          >
            Masz już konto? Zaloguj się
          </a>
        </div>
     </NarrowCol>
  );
};
