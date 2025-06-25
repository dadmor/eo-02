// ========================================
// src/pages/operator/index.tsx - Kompletny plik
// ========================================

import { Route } from "react-router-dom";

// Import komponentów
import { OperatorDashboard } from "./dashboard";


// Export wszystkich komponentów
export { OperatorDashboard } from "./dashboard";




// Resource definitions dla Refine
export const operatorResources = [
  {
    name: "dashboard_operator",
    list: "/operator",
    meta: {
      label: "Dashboard (o)",
      icon: "📊",
    },
  },
  
];

// Routes dla wykonawców
export const operatorRoutes = [
  <Route
    key="operator-dashboard"
    path="/operator"
    element={<OperatorDashboard />}
  />,
 
];
