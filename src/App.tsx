import { Routes, Route, Navigate } from "react-router-dom";
import { ApplicationProvider } from "./contexts/ApplicationContext";
import { PublicLayout } from "./components/layout/PublicLayout";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { AdminLayout } from "./components/layout/AdminLayout";

import Home from "./pages/Home";
import Marketplace from "./pages/Marketplace";
import GrantDetails from "./pages/GrantDetails";
import Auth from "./pages/Auth";
import Support from "./pages/Support";
import SuccessStories from "./pages/SuccessStories";
import Resources from "./pages/resources/Resources";
import ArticleDetail from "./pages/resources/ArticleDetail";
import NotFound from "./pages/NotFound";

import Overview from "./pages/dashboard/Overview";
import Saved from "./pages/dashboard/Saved";
import Applications from "./pages/dashboard/Applications";
import Matches from "./pages/dashboard/Matches";
import Documents from "./pages/dashboard/Documents";
import Notifications from "./pages/dashboard/Notifications";
import Profile from "./pages/dashboard/Profile";

import AdminAnalytics from "./pages/admin/Analytics";
import AdminApplicants from "./pages/admin/Applicants";
import AdminGrants from "./pages/admin/Grants";
import AdminReviews from "./pages/admin/Reviews";
import AdminContent from "./pages/admin/Content";
import AdminDocuments from "./pages/admin/Documents";
import AdminAudit from "./pages/admin/Audit";
import AdminSettings from "./pages/admin/Settings";
import AdminSupport from "./pages/admin/Support";

import Terms from "./pages/legal/Terms";
import Privacy from "./pages/legal/Privacy";
import Cookies from "./pages/legal/Cookies";
import Accessibility from "./pages/legal/Accessibility";
import Disclaimer from "./pages/legal/Disclaimer";

export default function App() {
  return (
    <ApplicationProvider>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/grants" element={<Marketplace />} />
          <Route path="/grants/:id" element={<GrantDetails />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/resources/:slug" element={<ArticleDetail />} />
          <Route path="/success-stories" element={<SuccessStories />} />
          <Route path="/support" element={<Support />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/legal/terms" element={<Terms />} />
          <Route path="/legal/privacy" element={<Privacy />} />
          <Route path="/legal/cookies" element={<Cookies />} />
          <Route path="/legal/accessibility" element={<Accessibility />} />
          <Route path="/legal/disclaimer" element={<Disclaimer />} />
        </Route>

        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Overview />} />
          <Route path="saved" element={<Saved />} />
          <Route path="applications" element={<Applications />} />
          <Route path="matches" element={<Matches />} />
          <Route path="documents" element={<Documents />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminAnalytics />} />
          <Route path="applicants" element={<AdminApplicants />} />
          <Route path="grants" element={<AdminGrants />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="content" element={<AdminContent />} />
          <Route path="documents" element={<AdminDocuments />} />
          <Route path="audit" element={<AdminAudit />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="support" element={<AdminSupport />} />
        </Route>

        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </ApplicationProvider>
  );
}
