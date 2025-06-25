// ========================================
// src/pages/contractor/index.tsx - Kompletny plik
// ========================================
import React from "react";
import { Route } from "react-router-dom";

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

// Resource definitions dla Refine
export const contractorResources = [
  {
    name: "dashboard_operator",
    list: "/contractor",
    meta: {
      label: "Dashboard (o)",
      icon: "📊",
    },
  },
  {
    name: "service_requests",
    list: "/contractor/available-requests",
    show: "/contractor/request/:id",
    meta: {
      label: "Dostępne zlecenia",
      icon: "🔨",
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
      icon: "💰",
    },
  },
  {
    name: "contractor_profiles",
    list: "/contractor/profile",
    edit: "/contractor/profile/edit",
    meta: {
      label: "Profil",
      icon: "👤",
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
      icon: "📁",
    },
  },
];

// Routes dla wykonawców
export const contractorRoutes = [
  <Route
    key="contractor-dashboard"
    path="/contractor"
    element={<ContractorDashboard />}
  />,
  <Route
    key="contractor-available-requests"
    path="/contractor/available-requests"
    element={<ContractorAvailableRequests />}
  />,
  <Route
    key="contractor-my-offers"
    path="/contractor/my-offers"
    element={<ContractorMyOffers />}
  />,
  <Route
    key="contractor-profile"
    path="/contractor/profile"
    element={<ContractorProfile />}
  />,
  <Route
    key="contractor-portfolio"
    path="/contractor/portfolio"
    element={<ContractorPortfolio />}
  />,
  <Route
    key="contractor-completed-projects"
    path="/contractor/completed-projects"
    element={<ContractorCompletedProjects />}
  />,
  <Route
    key="contractor-request-details"
    path="/contractor/request/:id"
    element={<ContractorRequestDetails />}
  />,
  <Route
    key="contractor-offer-create"
    path="/contractor/offer/create/:requestId"
    element={<ContractorOfferCreate />}
  />,
  <Route
    key="contractor-offer-edit"
    path="/contractor/offer/edit/:id"
    element={<ContractorOfferEdit />}
  />,
  <Route
    key="contractor-portfolio-item-create"
    path="/contractor/portfolio/create"
    element={<ContractorPortfolioItemCreate />}
  />,
  <Route
    key="contractor-portfolio-item-edit"
    path="/contractor/portfolio/edit/:id"
    element={<ContractorPortfolioItemEdit />}
  />,
];
