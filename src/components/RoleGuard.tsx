import React from 'react';
import { useGetIdentity } from '@refinedev/core';
import { User } from '@/utility/auth/authProvider';

interface RoleGuardProps {
  allowedRoles: string[];
  children: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  allowedRoles,
  children,
}) => {
  const { data: user, isLoading, error } = useGetIdentity<User>();

  if (isLoading) {
    return <div>Sprawdzanie uprawnień...</div>;
  }

  if (error) {
    return (
      <div>
        <h3>Błąd</h3>
        <p>Nie udało się sprawdzić uprawnień.</p>
      </div>
    );
  }

  // Rola jest bezpośrednio w obiekcie user z tabeli public.users
  const role = user?.role;

  if (!role || !allowedRoles.includes(role)) {
    return (
      <div>
        <h3>Brak uprawnień</h3>
        <p>Nie masz uprawnień do wyświetlania tej zawartości.</p>
      </div>
    );
  }

  return <>{children}</>;
};