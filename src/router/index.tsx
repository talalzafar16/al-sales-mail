import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import SidebarLayout from "../commons/SideBarLayout";
import LoginPage from "../pages/auth/Login/index";
import DashboardPage from "../pages/Home/index";
import EmailCampaignsPage from "../pages/EmailComapignPage/index";
// import AnalyticsPage from "./pages/AnalyticsPage";
// import SettingsPage from "./pages/SettingsPage";
import ProtectedRoute from "./protectedRoute";
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/auth/login" element={<LoginPage />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <SidebarLayout>
                <Routes>
                  <Route path="/" element={<Navigate to="/dashboard" />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route
                    path="/email-campaigns"
                    element={<EmailCampaignsPage />}
                  />
                  {/* <Route path="/analytics" element={<AnalyticsPage />} />
                <Route path="/settings" element={<SettingsPage />} /> */}
                </Routes>
              </SidebarLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}
