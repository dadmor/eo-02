// src/pages/beneficiary/index.tsx
import React from "react";
import { Route } from "react-router-dom";

// Import komponentów
import { AuditRequestCreate } from "./audit-request-create";
import { ServiceRequestCreate } from "./service-request-create";
import { MyRequests } from "./my-requests";
import { BeneficiaryDashboard } from "./dashboard";
import { ContactOperator } from "./contact-operator";

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

export const RequestDetails = () => {
  return <div>Request Details - do implementacji</div>;
};

// Resource definitions dla Refine
export const beneficiaryResources = [
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
    name: "audit_requests", 
    list: "/beneficiary/audit-requests",
    create: "/beneficiary/audit-request/create",
    edit: "/beneficiary/audit-request/edit/:id", 
    show: "/beneficiary/audit-request/show/:id",
    meta: {
      label: "Zlecenia audytowe",
      icon: "📋",
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

// Routes dla beneficjenta
export const beneficiaryRoutes = [
  <Route
    key="beneficiary-dashboard"
    path="/beneficiary"
    element={<BeneficiaryDashboard />}
  />,
  <Route
    key="beneficiary-contact-operator"
    path="/beneficiary/contact-operator"
    element={<ContactOperator />}
  />,
  <Route
    key="beneficiary-my-requests"
    path="/beneficiary/my-requests"
    element={<MyRequests />}
  />,
  <Route
    key="beneficiary-service-requests"
    path="/beneficiary/service-requests"
    element={<MyRequests />}
  />,
  <Route
    key="beneficiary-audit-requests"
    path="/beneficiary/audit-requests"
    element={<MyRequests />}
  />,
  <Route
    key="service-request-create"
    path="/beneficiary/service-request/create"
    element={<ServiceRequestCreate />}
  />,
  <Route
    key="service-request-edit"
    path="/beneficiary/service-request/edit/:id"
    element={<ServiceRequestEdit />}
  />,
  <Route
    key="service-request-show"
    path="/beneficiary/service-request/show/:id"
    element={<RequestDetails />}
  />,
  <Route
    key="audit-request-create"
    path="/beneficiary/audit-request/create" 
    element={<AuditRequestCreate />}
  />,
  <Route
    key="audit-request-edit"
    path="/beneficiary/audit-request/edit/:id"
    element={<AuditRequestEdit />}
  />,
  <Route
    key="audit-request-show"
    path="/beneficiary/audit-request/show/:id"
    element={<RequestDetails />}
  />,
];