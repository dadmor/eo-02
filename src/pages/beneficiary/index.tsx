// src/pages/beneficiary/index.tsx
import React from "react";
import { Route } from "react-router-dom";
import { RoleGuard } from "@/components/RoleGuard";

// Import komponentów
import { AuditRequestCreate } from "./audit-request-create";
import { ServiceRequestCreate } from "./service-request-create";
import { MyRequests } from "./my-requests";
import { BeneficiaryDashboard } from "./dashboard";
import { ContactOperator } from "./contact-operator";
import { RequestDetails } from "./request-details";

// Export wszystkich komponentów
export { BeneficiaryDashboard } from "./dashboard";
export { ServiceRequestCreate } from "./service-request-create";
export { AuditRequestCreate } from "./audit-request-create";
export { MyRequests } from "./my-requests";
export { ContactOperator } from "./contact-operator";

// Komponenty do implementacji
export const ServiceRequestEdit = () => {
  return <div>Service Request Edit - do implementacji</div>;
};

export const AuditRequestEdit = () => {
  return <div>Audit Request Edit - do implementacji</div>;
};

// Helper function do tworzenia chronionej trasy
const createProtectedRoute = (
  key: string,
  path: string,
  element: React.ReactElement
) => (
  <Route
    key={key}
    path={path}
    element={<RoleGuard allowedRoles={["beneficiary"]}>{element}</RoleGuard>}
  />
);

// Resource definitions dla Refine
export const beneficiaryResources = [
  {
    name: "dashboard",
    list: "/beneficiary",
    meta: {
      label: "Dashboard (b)",
      icon: "📊",
    },
  },
  {
    name: "service_requests",
    list: "/beneficiary/service-requests",
    create: "/beneficiary/service-request/create",
    edit: "/beneficiary/service-request/edit/:id",
    show: "/beneficiary/service-request/show/:id",
    meta: {
      label: "Zlecenia serwisowe",
      icon: "🔧",
    },
  },
  
  {
    name: "contact_operator",
    list: "/beneficiary/contact-operator",
    create: "/beneficiary/contact-operator",
    meta: {
      label: "Kontakt z operatorem",
      icon: "📞",
    },
  },
];

// Routes dla beneficjenta z RoleGuard
export const beneficiaryRoutes = [
  createProtectedRoute(
    "beneficiary-dashboard",
    "/beneficiary",
    <BeneficiaryDashboard />
  ),
  createProtectedRoute(
    "beneficiary-contact-operator",
    "/beneficiary/contact-operator",
    <ContactOperator />
  ),
  createProtectedRoute(
    "beneficiary-my-requests",
    "/beneficiary/my-requests",
    <MyRequests />
  ),
  createProtectedRoute(
    "beneficiary-service-requests",
    "/beneficiary/service-requests",
    <MyRequests />
  ),
  createProtectedRoute(
    "beneficiary-audit-requests",
    "/beneficiary/audit-requests",
    <MyRequests />
  ),
  createProtectedRoute(
    "service-request-create",
    "/beneficiary/service-request/create",
    <ServiceRequestCreate />
  ),
  createProtectedRoute(
    "service-request-edit",
    "/beneficiary/service-request/edit/:id",
    <ServiceRequestEdit />
  ),
  createProtectedRoute(
    "service-request-show",
    "/beneficiary/service-request/show/:id",
    <RequestDetails />
  ),
  createProtectedRoute(
    "audit-request-create",
    "/beneficiary/audit-request/create",
    <AuditRequestCreate />
  ),
  createProtectedRoute(
    "audit-request-edit",
    "/beneficiary/audit-request/edit/:id",
    <AuditRequestEdit />
  ),
  createProtectedRoute(
    "audit-request-show",
    "/beneficiary/audit-request/show/:id",
    <RequestDetails />
  ),
  createProtectedRoute(
    "request-details",
    "/beneficiary/requests/:id",
    <RequestDetails />
  ),
];
