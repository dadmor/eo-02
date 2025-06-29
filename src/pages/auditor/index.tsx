// src/pages/auditor/index.tsx
import React from "react";
import { Route } from "react-router-dom";
import { RoleGuard } from "@/components/RoleGuard";

// Import komponentów
import { AuditorDashboard } from "./dashboard";
import { AuditorProfile } from "./profile";
import { AuditorPortfolio } from "./portfolio";
import { AvailableRequests } from "./available-requests";
import { MyOffers } from "./my-offers";
import { CompletedAudits } from "./completed-audits";

// Export wszystkich komponentów
export { AuditorDashboard } from "./dashboard";
export { AuditorProfile } from "./profile";
export { AuditorPortfolio } from "./portfolio";
export { AvailableRequests } from "./available-requests";
export { MyOffers } from "./my-offers";
export { CompletedAudits } from "./completed-audits";

// Komponenty do implementacji
export const OfferCreate = () => {
  return <div>Offer Create - do implementacji</div>;
};

export const OfferEdit = () => {
  return <div>Offer Edit - do implementacji</div>;
};

export const RequestDetails = () => {
  return <div>Request Details - do implementacji</div>;
};

export const PortfolioItemCreate = () => {
  return <div>Portfolio Item Create - do implementacji</div>;
};

export const PortfolioItemEdit = () => {
  return <div>Portfolio Item Edit - do implementacji</div>;
};

// Helper function do tworzenia chronionej trasy
const createProtectedRoute = (key: string, path: string, element: React.ReactElement) => (
  <Route
    key={key}
    path={path}
    element={
      <RoleGuard allowedRoles={["auditor"]}>
        {element}
      </RoleGuard>
    }
  />
);

// Resource definitions dla Refine
export const auditorResources = [
  {
    name: "dashboard_auditor",
    list: "/auditor",
    meta: {
      label: "Dashboard (a)",
      icon: "📊",
    },
  },
  {
    name: "audit_requests",
    list: "/auditor/available-requests",
    show: "/auditor/request/:id",
    meta: {
      label: "Dostępne zlecenia",
      icon: "📋",
    },
  },
  {
    name: "auditor_offers",
    list: "/auditor/my-offers",
    create: "/auditor/offer/create/:requestId",
    edit: "/auditor/offer/edit/:id",
    show: "/auditor/offer/:id",
    meta: {
      label: "Moje oferty",
      icon: "💰",
    },
  },
  {
    name: "auditor_profiles",
    list: "/auditor/profile",
    edit: "/auditor/profile/edit",
    meta: {
      label: "Profil",
      icon: "👤",
    },
  },
  {
    name: "auditor_portfolio_items",
    list: "/auditor/portfolio",
    create: "/auditor/portfolio/create",
    edit: "/auditor/portfolio/edit/:id",
    show: "/auditor/portfolio/:id",
    meta: {
      label: "Portfolio",
      icon: "📁",
    },
  },
];

// Routes dla audytora z RoleGuard
export const auditorRoutes = [
  createProtectedRoute("auditor-dashboard", "/auditor", <AuditorDashboard />),
  createProtectedRoute("auditor-available-requests", "/auditor/available-requests", <AvailableRequests />),
  createProtectedRoute("auditor-my-offers", "/auditor/my-offers", <MyOffers />),
  createProtectedRoute("auditor-profile", "/auditor/profile", <AuditorProfile />),
  createProtectedRoute("auditor-portfolio", "/auditor/portfolio", <AuditorPortfolio />),
  createProtectedRoute("auditor-completed-audits", "/auditor/completed-audits", <CompletedAudits />),
  createProtectedRoute("auditor-request-details", "/auditor/request/:id", <RequestDetails />),
  createProtectedRoute("auditor-offer-create", "/auditor/offer/create/:requestId", <OfferCreate />),
  createProtectedRoute("auditor-offer-edit", "/auditor/offer/edit/:id", <OfferEdit />),
  createProtectedRoute("portfolio-item-create", "/auditor/portfolio/create", <PortfolioItemCreate />),
  createProtectedRoute("portfolio-item-edit", "/auditor/portfolio/edit/:id", <PortfolioItemEdit />),
];