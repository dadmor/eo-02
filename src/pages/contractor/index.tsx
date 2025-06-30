// ========================================
// src/pages/contractor/index.tsx - Kompletny plik
// ========================================
import React from "react";
import { Route } from "react-router-dom";
import { RoleGuard } from "@/components/RoleGuard";
import { BarChart3, Hammer, DollarSign, User, Folder } from "lucide-react";

// Import komponentów
import { ContractorDashboard } from "./dashboard";
import { ContractorProfile } from "./profile";
import { ContractorPortfolio } from "./portfolio";
import { ContractorAvailableRequests } from "./available-requests";
import { ContractorMyOffers } from "./my-offers";

// Export wszystkich komponentów
export { ContractorDashboard } from "./dashboard";
export { ContractorProfile } from "./profile";
export { ContractorPortfolio } from "./portfolio";
export { ContractorAvailableRequests } from "./available-requests";
export { ContractorMyOffers } from "./my-offers";

// Komponenty do implementacji
export const ContractorCompletedProjects = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Ukończone Projekty</h1>
      <p>Komponent do implementacji - historia ukończonych projektów</p>
    </div>
  );
};

export const ContractorOfferCreate = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Utwórz Ofertę</h1>
      <p>Komponent do implementacji - formularz tworzenia oferty</p>
    </div>
  );
};

export const ContractorOfferEdit = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Edytuj Ofertę</h1>
      <p>Komponente do implementacji - formularz edycji oferty</p>
    </div>
  );
};

export const ContractorRequestDetails = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Szczegóły Zlecenia</h1>
      <p>Komponente do implementacji - szczegóły zlecenia</p>
    </div>
  );
};

export const ContractorPortfolioItemCreate = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dodaj Projekt do Portfolio</h1>
      <p>Komponente do implementacji - formularz dodawania projektu</p>
    </div>
  );
};

export const ContractorPortfolioItemEdit = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Edytuj Projekt Portfolio</h1>
      <p>Komponente do implementacji - formularz edycji projektu</p>
    </div>
  );
};

// Helper function do tworzenia chronionej trasy
const createProtectedRoute = (key: string, path: string, element: React.ReactElement) => (
  <Route
    key={key}
    path={path}
    element={
      <RoleGuard allowedRoles={["contractor"]}>
        {element}
      </RoleGuard>
    }
  />
);

// Resource definitions dla Refine
export const contractorResources = [
  {
    name: "dashboard_contractor",
    list: "/contractor",
    meta: {
      label: "Dashboard (c)",
      icon: <BarChart3 className="h-4 w-4" />,
      roles: ["contractor"],
    },
  },
  {
    name: "service_requests",
    list: "/contractor/available-requests",
    show: "/contractor/request/:id",
    meta: {
      label: "Dostępne zlecenia",
      icon: <Hammer className="h-4 w-4" />,
      roles: ["contractor"],
    },
  },
  {
    name: "contractor_offers",
    list: "/contractor/my-offers",
    create: "/contractor/offer/create/:requestId",
    edit: "/contractor/offer/edit/:id",
    show: "/contractor/offer/:id",
    meta: {
      label: "Moje oferty",
      icon: <DollarSign className="h-4 w-4" />,
      roles: ["contractor"],
    },
  },
  {
    name: "contractor_profiles",
    list: "/contractor/profile",
    edit: "/contractor/profile/edit",
    meta: {
      label: "Profil",
      icon: <User className="h-4 w-4" />,
      roles: ["contractor"],
    },
  },
  {
    name: "contractor_portfolio_items",
    list: "/contractor/portfolio",
    create: "/contractor/portfolio/create",
    edit: "/contractor/portfolio/edit/:id",
    show: "/contractor/portfolio/:id",
    meta: {
      label: "Portfolio",
      icon: <Folder className="h-4 w-4" />,
      roles: ["contractor"],
    },
  },
];

// Routes dla wykonawców z RoleGuard
export const contractorRoutes = [
  createProtectedRoute("contractor-dashboard", "/contractor", <ContractorDashboard />),
  createProtectedRoute("contractor-available-requests", "/contractor/available-requests", <ContractorAvailableRequests />),
  createProtectedRoute("contractor-my-offers", "/contractor/my-offers", <ContractorMyOffers />),
  createProtectedRoute("contractor-profile", "/contractor/profile", <ContractorProfile />),
  createProtectedRoute("contractor-portfolio", "/contractor/portfolio", <ContractorPortfolio />),
  createProtectedRoute("contractor-completed-projects", "/contractor/completed-projects", <ContractorCompletedProjects />),
  createProtectedRoute("contractor-request-details", "/contractor/request/:id", <ContractorRequestDetails />),
  createProtectedRoute("contractor-offer-create", "/contractor/offer/create/:requestId", <ContractorOfferCreate />),
  createProtectedRoute("contractor-offer-edit", "/contractor/offer/edit/:id", <ContractorOfferEdit />),
  createProtectedRoute("contractor-portfolio-item-create", "/contractor/portfolio/create", <ContractorPortfolioItemCreate />),
  createProtectedRoute("contractor-portfolio-item-edit", "/contractor/portfolio/edit/:id", <ContractorPortfolioItemEdit />),
];