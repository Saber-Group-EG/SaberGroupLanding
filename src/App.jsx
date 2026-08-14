import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';

// Pages
import Home from './pages/Home';
import JoinUs from './pages/JoinUs';
import JobApplicationForm from './pages/JobApplicationForm';
import CheckPreviousApplication from './pages/checkjob';
import ComingSoon from './pages/ComingSoon';
import ServicesPage from './pages/Services';
import AboutUs from './pages/AboutUs';
import AddressPage from './pages/Address';
import ContactPage from './pages/Contact';
import PoliciesPage from './pages/Policies';
import TermsAndConditions from './pages/TermsAndConditions';

import './index.css';
import Checkout from './pages/Checkout';

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/address" element={<AddressPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/policies" element={<PoliciesPage />} />
        <Route path="/terms" element={<TermsAndConditions />} />
        <Route path="/join-us" element={<JoinUs />} />
        <Route path="/join-us/:slug" element={<JobApplicationForm />} />
        <Route
          path="/join-us/check-application"
          element={<CheckPreviousApplication />}
        />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/coming-soon" element={<ComingSoon />} />
      </Route>
    </Routes>
  );
}

export default App;
