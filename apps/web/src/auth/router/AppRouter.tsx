import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "../pages/Login";
import PrivateRoute from "./PrivateRoute";
import AppLayout from "../../components/AppLayout";
import Dashboard from "../../features/dashboard/pages/Dashboard";
import PropertiesList from "../../features/properties/pages/PropertiesList";
import CreatePropertyPage from "../../features/properties/pages/CreatePropertyPage";
import ContactsList from "../../features/contacts/pages/ContactsList";
import PublicLayout from "../../public/layout/PublicLayout";
import HomePage from "../../public/pages/HomePage";
import PropertiesSearchPage from "../../public/pages/PropertiesSearchPage";
import PropertyDetailPage from "../../public/pages/PropertyDetailPage";
import AgentsPage from "../../public/pages/AgentsPage";
import AgentListingsPage from "../../public/pages/AgentListingsPage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Standalone public page (no layout) */}
        <Route path="/login" element={<Login />} />

        {/* Public site — wrapped in PublicLayout */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/properties" element={<PropertiesSearchPage />} />
          <Route path="/properties/:id" element={<PropertyDetailPage />} />
          <Route path="/agents" element={<AgentsPage />} />
          <Route path="/agents/:id" element={<AgentListingsPage />} />
        </Route>

        {/* Admin — protected */}
        <Route element={<PrivateRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/properties" element={<PropertiesList />} />
            <Route path="/admin/properties/new" element={<CreatePropertyPage />} />
            <Route path="/admin/contacts" element={<ContactsList />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
