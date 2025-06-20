import { Authenticated, ErrorComponent, Refine } from "@refinedev/core";
import routerBindings, {
  CatchAllNavigate,
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router";
import { dataProvider, liveProvider } from "@refinedev/supabase";
import { BrowserRouter, Outlet, Route, Routes } from "react-router";
import authProvider from "./lib/authProvider";
import { Layout } from "./components/layout";
import { supabaseClient } from "./utility";
import {
  websiteAnalysisResource,
  websiteAnalysisRoutes,
} from "./pages/website-analyses";
import {
  marketingStrategyResource,
  marketingStrategyRoutes,
} from "./pages/marketing-strategies";
import {
  googleAdsCampaignResource,
  googleAdsCampaignRoutes,
} from "./pages/google-ads-campaigns";
import { profileResource, profileRoutes } from "./pages/profiles";
import { authRoutes } from "./pages/auth";

function App() {
  return (
    <BrowserRouter>
      <Refine
        dataProvider={dataProvider(supabaseClient)}
        liveProvider={liveProvider(supabaseClient)}
        authProvider={authProvider}
        routerProvider={routerBindings}
        resources={[
          websiteAnalysisResource,
          marketingStrategyResource,
          googleAdsCampaignResource,
          profileResource,
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
              <Authenticated key="protected-layout" fallback={<CatchAllNavigate to="/login" />}>
                <Layout>
                  <Outlet />
                </Layout>
              </Authenticated>
            }
          >
            {/* Default redirect */}
            <Route index element={<NavigateToResource resource="website_analyses" />} />
            
            {/* All protected routes with absolute paths */}
            {...websiteAnalysisRoutes}
            {...marketingStrategyRoutes}
            {...googleAdsCampaignRoutes}
            {...profileRoutes}
            
            {/* 404 */}
            <Route path="*" element={<ErrorComponent />} />
          </Route>
        </Routes>

        <UnsavedChangesNotifier />
        <DocumentTitleHandler />
      </Refine>
    </BrowserRouter>
  );
}

export default App;