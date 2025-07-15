import { Authenticated, ErrorComponent, Refine } from "@refinedev/core";
import routerBindings, {
  CatchAllNavigate,
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router";
import { dataProvider, liveProvider } from "@refinedev/supabase";
import { BrowserRouter, Outlet, Route, Routes } from "react-router";
import { Layout } from "./components/layout";
import { authProvider, supabaseClient } from "./utility";

import { authRoutes, UpdatePasswordPage } from "./pages/auth";

// Import zorganizowanych beneficiary exports
import {
  beneficiaryResources,
  beneficiaryRoutes,
} from "./pages/beneficiary";

// Import zorganizowanych auditor exports
import {
  auditorResources,
  auditorRoutes,
} from "./pages/auditor";

// Import zorganizowanych contractor exports
import {
  contractorResources,
  contractorRoutes,
} from "./pages/contractor";

// Import zorganizowanych operator exports
import {
  operatorResources,
  operatorRoutes,
} from "./pages/operator";

// Import komponentu do obsługi reset hasła

import { ErrorHandler } from "./ErrorHandler";


function App() {
  return (
    <BrowserRouter>
      <ErrorHandler>
        <Refine
        dataProvider={dataProvider(supabaseClient)}
        liveProvider={liveProvider(supabaseClient)}
        authProvider={authProvider}
        routerProvider={routerBindings}
        resources={[
          ...beneficiaryResources,
          ...auditorResources,
          ...contractorResources,
          ...operatorResources
        ]}
        options={{
          syncWithLocation: true,
          warnWhenUnsavedChanges: true,
          useNewQueryKeys: true,
        }}
      >
        <Routes>
          {/* Public routes */}
          {...authRoutes}
          
       

          {/* Protected routes wrapper */}
          <Route
            element={
              <Authenticated
                key="protected-layout"
                fallback={<CatchAllNavigate to="/login" />}
              >
                <Layout>
                  <Outlet />
                </Layout>
              </Authenticated>
            }
          >
            {/* Default redirect */}
            <Route
              index
              element={<NavigateToResource resource="campaigns" />}
            />

            {...beneficiaryRoutes}
            {...auditorRoutes}
            {...contractorRoutes}
            {...operatorRoutes}

            {/* 404 */}
            <Route path="*" element={<ErrorComponent />} />
          </Route>
        </Routes>

        <UnsavedChangesNotifier />
        <DocumentTitleHandler />
      </Refine>
    </ErrorHandler>
  </BrowserRouter>
);
}

export default App;