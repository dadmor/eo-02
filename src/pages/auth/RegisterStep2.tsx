// pages/RegisterStep2.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { SchemaForm } from "@/components/SchemaForm";
import { NarrowCol } from "@/components/layout/NarrowCol";
import { Lead } from "@/components/reader";

export const RegisterStep2: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = (data: any) => {
    navigate("/register/step3");
  };

  const handleBack = () => {
    navigate("/register/step1");
  };

  return (
    <NarrowCol>
      <Lead title={`Rejestracja`} description={`2 z 3 Ustaw hasło do konta`} />

      <SchemaForm
        schemaPath="registration.step2"
        onSubmit={handleSubmit}
        submitLabel="Dalej"
      />

      <div className="mt-4 flex justify-between items-center">
        <Button
          variant="outline"
          onClick={handleBack}
          className="flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Wstecz
        </Button>
        <a href="/login" className="text-blue-600 hover:text-blue-500 text-sm">
          Masz już konto? Zaloguj się
        </a>
      </div>
    </NarrowCol>
  );
};
