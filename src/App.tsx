import {
  Authenticated,
  ErrorComponent,
  Refine,
} from "@refinedev/core";

import routerBindings, {
  CatchAllNavigate,
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router";
import { dataProvider, liveProvider } from "@refinedev/supabase";
import { BrowserRouter, Outlet, Route, Routes } from "react-router";
import authProvider from "./authProvider";
import { Layout } from "./components/layout";
import { supabaseClient } from "./utility";
import { websiteAnalysisResource, websiteAnalysisRoutes } from "./pages/website-analyses";
import { marketingStrategyResource, marketingStrategyRoutes } from "./pages/marketing-strategies";
import { googleAdsCampaignResource, googleAdsCampaignRoutes } from "./pages/google-ads-campaigns";
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
          profileResource
        ]}
        options={{
          syncWithLocation: true,
          warnWhenUnsavedChanges: true,
          useNewQueryKeys: true,
          projectId: "your-project-id",
        }}
      >
        <Routes>
          <Route
            element={
              <Authenticated
                key="authenticated-inner"
                fallback={<CatchAllNavigate to="/login" />}
              >
                <Layout>
                  <Outlet />
                </Layout>
              </Authenticated>
            }
          >
            <Route
              index
              element={<NavigateToResource resource="website_analyses" />}
            />

            {...websiteAnalysisRoutes}
            {...marketingStrategyRoutes}
            {...googleAdsCampaignRoutes}
            {...profileRoutes}
            <Route path="*" element={<ErrorComponent />} />
          </Route>

          <Route
            element={
              <Authenticated key="authenticated-outer" fallback={<Outlet />}>
                <NavigateToResource />
              </Authenticated>
            }
          >
            {...authRoutes}
          </Route>
        </Routes>

        <UnsavedChangesNotifier />
        <DocumentTitleHandler />
      </Refine>
    </BrowserRouter>
  );
}

export default App;