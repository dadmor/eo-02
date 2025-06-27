import React from 'react';
import { useGetIdentity } from '@refinedev/core';

interface RoleGuardProps {
  allowedRoles: string[];
  children: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  allowedRoles,
  children,
}) => {
  const { data: identity, isLoading } = useGetIdentity();

  if (isLoading) {
    return <div>Sprawdzanie uprawnień...</div>;
  }

  const userRole = identity?.user_metadata?.role;

  if (!userRole || !allowedRoles.includes(userRole)) {
    return (
      <div>
        <h3>Brak uprawnień</h3>
        <p>Nie masz uprawnień do wyświetlania tej zawartości.</p>
      </div>
    );
  }

  // Zwracamy tylko children bez dodatkowego tekstu
  return <>{children}</>;
};