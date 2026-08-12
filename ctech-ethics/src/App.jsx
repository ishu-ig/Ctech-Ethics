import React from "react";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from "./Pages/HomePage";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import AboutPage from "./Pages/AboutPage";
import ServicePage from "./Pages/ServicePage";
import CareerPage from "./Pages/CareerPage";
import JobDetailPage from "./Pages/JobDetailPage";
import PlacementJobsPage from "./Pages/PlacementJobsPage";
import BlogPage from "./Pages/BlogPage";
import ContactUsPage from "./Pages/ContactUsPage";
import BlogDetailsPage from "./Pages/BlogDetailPage";
import ServiceDetailsPage from "./Pages/ServiceDetailPage";
import PortfolioPage from "./Pages/PortfolioPage";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/services" element={<ServicePage />} />
        <Route path="/serviceDetail" element={<ServiceDetailsPage />} />
        <Route path="/services/:slug" element={<ServiceDetailsPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:id" element={<BlogDetailsPage />} />
        <Route path="/blogdetail" element={<BlogDetailsPage />} />
        <Route path="/blogdetail/:id" element={<BlogDetailsPage />} />
        <Route path="/career" element={<CareerPage />} />
        <Route path="/placement" element={<PlacementJobsPage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/jobdetails" element={<JobDetailPage />} />
        <Route path="/jobdetails/:id" element={<JobDetailPage />} />
        <Route path="/contactus" element={<ContactUsPage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
