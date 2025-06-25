// ========================================
// src/pages/auditor/index.tsx - Zaktualizowany
// ========================================
import React from "react";
import { Route } from "react-router-dom";

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

// Routes dla audytora
export const auditorRoutes = [
  <Route
    key="auditor-dashboard"
    path="/auditor"
    element={<AuditorDashboard />}
  />,
  <Route
    key="auditor-available-requests"
    path="/auditor/available-requests"
    element={<AvailableRequests />}
  />,
  <Route
    key="auditor-my-offers"
    path="/auditor/my-offers"
    element={<MyOffers />}
  />,
  <Route
    key="auditor-profile"
    path="/auditor/profile"
    element={<AuditorProfile />}
  />,
  <Route
    key="auditor-portfolio"
    path="/auditor/portfolio"
    element={<AuditorPortfolio />}
  />,
  <Route
    key="auditor-completed-audits"
    path="/auditor/completed-audits"
    element={<CompletedAudits />}
  />,
  <Route
    key="auditor-request-details"
    path="/auditor/request/:id"
    element={<RequestDetails />}
  />,
  <Route
    key="auditor-offer-create"
    path="/auditor/offer/create/:requestId"
    element={<OfferCreate />}
  />,
  <Route
    key="auditor-offer-edit"
    path="/auditor/offer/edit/:id"
    element={<OfferEdit />}
  />,
  <Route
    key="portfolio-item-create"
    path="/auditor/portfolio/create"
    element={<PortfolioItemCreate />}
  />,
  <Route
    key="portfolio-item-edit"
    path="/auditor/portfolio/edit/:id"
    element={<PortfolioItemEdit />}
  />,
];
