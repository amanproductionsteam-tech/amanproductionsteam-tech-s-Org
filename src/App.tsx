/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './utils/supabase';
import Home from './pages/Home';
import PortfolioPage from './pages/PortfolioPage';
import AdminPage from './pages/AdminPage';
import DrivePage from './pages/DrivePage';
import ServiceGalleryPage from './pages/ServiceGalleryPage';
import ClientPortalPage from './pages/ClientPortalPage';
import ClientGalleryDetailPage from './pages/ClientGalleryDetailPage';
import GearPage from './pages/GearPage';
import ReviewsPage from './pages/ReviewsPage';
import PricingPage from './pages/PricingPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsPage from './pages/TermsPage';
import RefundPolicyPage from './pages/RefundPolicyPage';
import TestPaymentPage from './pages/TestPaymentPage';
import TodosPage from './pages/TodosPage';
import SeoMetadata from './components/SeoMetadata';

export default function App() {
  return (
    <BrowserRouter>
      <SeoMetadata />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/todos" element={<TodosPage />} />
        <Route path="/supabase" element={<TodosPage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/quotation" element={<PricingPage />} />
        <Route path="/rates" element={<Navigate to="/pricing" replace />} />
        <Route path="/pay-test" element={<TestPaymentPage />} />
        <Route path="/pay-100" element={<Navigate to="/pay-test" replace />} />
        <Route path="/pay" element={<Navigate to="/pay-test" replace />} />
        <Route path="/gear" element={<GearPage />} />
        <Route path="/equipment" element={<Navigate to="/gear" replace />} />
        <Route path="/services" element={<Navigate to="/services/event-photo" replace />} />
        <Route path="/services/:serviceId" element={<ServiceGalleryPage />} />
        <Route path="/client-galleries" element={<ClientPortalPage />} />
        <Route path="/client-gallery/:slug" element={<ClientGalleryDetailPage />} />
        <Route path="/clients" element={<Navigate to="/client-galleries" replace />} />
        <Route path="/reviews" element={<ReviewsPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/privacy" element={<Navigate to="/privacy-policy" replace />} />
        <Route path="/terms-and-conditions" element={<TermsPage />} />
        <Route path="/terms" element={<Navigate to="/terms-and-conditions" replace />} />
        <Route path="/refund-policy" element={<RefundPolicyPage />} />
        <Route path="/refunds" element={<Navigate to="/refund-policy" replace />} />
        <Route path="/cancellation-policy" element={<Navigate to="/refund-policy" replace />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/drive" element={<DrivePage />} />
      </Routes>
    </BrowserRouter>
  );
}
