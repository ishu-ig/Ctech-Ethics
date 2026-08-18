import React, { useEffect, useCallback } from "react";
import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
  Navigate,
} from "react-router-dom";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import Sidebar from "./Components/Sidebar";

// Auth Pages
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgetPasswordPage from "./pages/ForgetPassword";

// Main Pages
import Home from './pages/Home';
import ProfilePage from './pages/ProfilePage';
import UpdateProfilePage from './pages/UpdateProfilePage';
import AdminCareer from "./pages/jobs/career/AdminCareer";
import AdminCreateCareer from "./pages/jobs/career/AdminCreateCareer";
import AdminUpdateCareer from "./pages/jobs/career/AdminUpdateCareer";
import AdminAbout from "./pages/aboutCompany/about/AdminAbout";
import AdminCreateAbout from "./pages/aboutCompany/about/AdminCreateAbout";
import AdminUpdateAbout from "./pages/aboutCompany/about/AdminUpdateAbout";
import AdminPlacement from "./pages/jobs/placements/AdminPlacement";
import AdminCreatePlacement from "./pages/jobs/placements/AdminPlacementCreate";
import AdminUpdatePlacement from "./pages/jobs/placements/AdminPlacementUpdate";
import AdminCreateTeam from "./pages/teams/AdminCreateTeam";
import AdminTeam from "./pages/teams/AdminTeam";
import AdminUpdateTeam from "./pages/teams/AdminUpdateTeam";
import AdminBanner from "./pages/banner/AdminBanner";
import AdminCreateBanner from "./pages/banner/AdminCreateBanner";
import AdminUpdateBanner from "./pages/banner/AdminUpdateBanner";
import AdminWhyChooseUs from "./pages/aboutCompany/whyChooseUs/AdminWhyChooseUs";
import AdminCreateWhyChooseUs from "./pages/aboutCompany/whyChooseUs/AdminCreateWhyChooseUs";
import AdminUpdateWhyChooseUs from "./pages/aboutCompany/whyChooseUs/AdminUpdateWhyChooseUs";
import AdminTechStack from "./pages/teckStack/AdminTechStack";
import AdminCreateTechStack from "./pages/teckStack/AdminCreateTechStack";
import AdminUpdateTechStack from "./pages/teckStack/AdminUpdateTechStack";
import AdminAchievement from "./pages/achievement/AdminAchievement";
import AdminCreateAchievement from "./pages/achievement/AdminCreateAchievement";
import AdminUpdateAchievement from "./pages/achievement/AdminUpdateAchievement";
import AdminTestimonial from "./pages/testimonial/AdminTestiminial";
import AdminCreateTestimonial from "./pages/testimonial/AdminCreateTestimonial";
import AdminUpdateTestimonial from "./pages/testimonial/AdminUpdateTestimonial";
import AdminNewsletter from "./pages/newsletter/AdminNewsletter";
import AdminUser from "./pages/user/AdminUser";
import AdminCreateUser from "./pages/user/AdminCreateUser";
import AdminUpdateUser from "./pages/user/AdminUpdateUser";
import AdminContactUs from "./pages/contactus/AdminContactUs";
import AdminShowQuery from "./pages/contactus/AdminShowQuery";
import AdminPortfolio from "./pages/portfolio/AdminPortfolio";
import AdminCreatePortfolio from "./pages/portfolio/AdminCreatePortfolio";
import AdminUpdatePortfolio from "./pages/portfolio/AdminUpdatePortfolio";
import AdminBlog from "./pages/blog/AdminBlog";
import AdminCreateBlog from "./pages/blog/AdminCreateBlog";
import AdminUpdateBlog from "./pages/blog/AdminUpdateBlog";
import AdminService from "./pages/service/service/AdminService";
import AdminCreateService from "./pages/service/service/AdminCreateService";
import AdminUpdateService from "./pages/service/service/AdminUpdateService";
import AdminSubService from "./pages/service/subService/AdminSubService";
import AdminCreateSubService from "./pages/service/subService/AdminCreateSubService";
import AdminUpdateSubService from "./pages/service/subService/AdminUpdateSubService";
import AdminPlacedStudent from "./pages/placedStudent/AdminPlacedStudent";
import AdminCreatePlacedStudent from "./pages/placedStudent/AdminCreatePlacedStudent";
import AdminUpdatePlacedStudent from "./pages/placedStudent/AdminUpdatePlacedStudent";
import AdminApplications from "./pages/application/AdminApplication";
import AdminShowApplication from "./pages/application/AdminShowApplication";
import AdminPlacementApplications from "./pages/placementApplication/AdminPlacementApplication";
import AdminShowPlacementApplication from "./pages/placementApplication/AdminShowPlacementApplication";
import AdminConsultancy from "./pages/consultancy/AdminConsultancy";
import AdminShowConsultancy from "./pages/consultancy/AdminShowConsultancy";


// FIX: All public routes listed here must match route paths exactly
const publicRoutes = ["/login", "/register", "/forgot-password"];

export default function App() {
  return (
    <BrowserRouter>
      <Shell />
    </BrowserRouter>
  );
}

function Shell() {
  const location = useLocation();
  const isPublic = publicRoutes.includes(location.pathname);
  const isLoggedIn = localStorage.getItem("login") === "true";

  useEffect(() => {
    const isDesktop = window.matchMedia("(min-width: 992px)").matches;
    const savedMini = localStorage.getItem("adminHMD.sidebarMini") === "true";
    if (isDesktop && savedMini && !isPublic) {
      document.body.classList.add("sidebar-mini");
    }
    return () => {
      if (isPublic)
        document.body.classList.remove("sidebar-mini", "sidebar-open");
    };
  }, [isPublic]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 992px)");
    function handleBreakpoint(e) {
      if (e.matches) {
        document.body.classList.remove("sidebar-open");
        const savedMini =
          localStorage.getItem("adminHMD.sidebarMini") === "true";
        document.body.classList.toggle("sidebar-mini", savedMini);
      } else {
        document.body.classList.remove("sidebar-mini");
      }
    }
    if (mq.addEventListener) {
      mq.addEventListener("change", handleBreakpoint);
    } else {
      mq.addListener(handleBreakpoint);
    }
    return () => {
      if (mq.removeEventListener) {
        mq.removeEventListener("change", handleBreakpoint);
      } else {
        mq.removeListener(handleBreakpoint);
      }
    };
  }, []);

  // FIX: Moved toggleSidebar & closeMobileSidebar outside render using useCallback
  const toggleSidebar = useCallback(() => {
    const isDesktop = window.matchMedia("(min-width: 992px)").matches;
    if (isDesktop) {
      document.body.classList.toggle("sidebar-mini");
      localStorage.setItem(
        "adminHMD.sidebarMini",
        String(document.body.classList.contains("sidebar-mini"))
      );
    } else {
      document.body.classList.toggle("sidebar-open");
    }
  }, []);

  const closeMobileSidebar = useCallback(() => {
    document.body.classList.remove("sidebar-open");
  }, []);

  // Redirect unauthenticated users away from protected pages
  if (!isLoggedIn && !isPublic) {
    return <Navigate to="/login" replace />;
  }

  // ── Public pages ──────────────────────────────────────────────────────────
  if (isPublic) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgetPasswordPage />} />
      </Routes>
    );
  }

  // ── Protected pages ───────────────────────────────────────────────────────
  return (
    <div className="admin-shell">
      <div className="sidebar-backdrop" onClick={closeMobileSidebar} />
      <Sidebar onLinkClick={closeMobileSidebar} />

      <div className="admin-main">
        <Navbar toggleSidebar={toggleSidebar} />

        <Routes>
          {/* Dashboard */}
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/update-profile" element={<UpdateProfilePage />} />

          {/* About */}
          <Route path="/about" element={<AdminAbout />} />
          <Route path="/about/create" element={<AdminCreateAbout />} />
          <Route path="/about/update/:_id" element={<AdminUpdateAbout />} />


          {/* Career */}
          <Route path="/companyjob" element={<AdminCareer />} />
          <Route path="/companyjob/create" element={<AdminCreateCareer />} />
          <Route path="/companyjob/update/:_id" element={<AdminUpdateCareer />} />

          {/* Placement */}
          <Route path="/placement" element={<AdminPlacement />} />
          <Route path="/placement/create" element={<AdminCreatePlacement />} />
          <Route path="/placement/update/:_id" element={<AdminUpdatePlacement />} />

          {/* Team */}
          <Route path="/team" element={<AdminTeam />} />
          <Route path="/team/create" element={<AdminCreateTeam />} />
          <Route path="/team/update/:_id" element={<AdminUpdateTeam />} />

          <Route path="/banner" element={<AdminBanner />} />
          <Route path="/banner/create" element={<AdminCreateBanner />} />
          <Route path="/banner/update/:_id" element={<AdminUpdateBanner />} />

          <Route path="/whychooseus" element={<AdminWhyChooseUs />} />
          <Route path="/whychooseus/create" element={<AdminCreateWhyChooseUs />} />
          <Route path="/whychooseus/update/:_id" element={<AdminUpdateWhyChooseUs />} />

          <Route path="/techstack" element={<AdminTechStack />} />
          <Route path="/techstack/create" element={<AdminCreateTechStack />} />
          <Route path="/techstack/update/:_id" element={<AdminUpdateTechStack />} />

          <Route path="/achievement" element={<AdminAchievement />} />
          <Route path="/achievement/create" element={<AdminCreateAchievement />} />
          <Route path="/achievement/update/:_id" element={<AdminUpdateAchievement />} />

          <Route path="/testimonial" element={<AdminTestimonial />} />
          <Route path="/testimonial/create" element={<AdminCreateTestimonial />} />
          <Route path="/testimonial/update/:_id" element={<AdminUpdateTestimonial />} />

          <Route path="/user" element={<AdminUser />} />
          <Route path="/user/create" element={<AdminCreateUser />} />
          <Route path="/user/update/:_id" element={<AdminUpdateUser />} />

          <Route path="/portfolio" element={<AdminPortfolio />} />
          <Route path="/portfolio/create" element={<AdminCreatePortfolio />} />
          <Route path="/portfolio/update/:_id" element={<AdminUpdatePortfolio />} />

          <Route path="/blog" element={<AdminBlog />} />
          <Route path="/blog/create" element={<AdminCreateBlog />} />
          <Route path="/blog/update/:_id" element={<AdminUpdateBlog />} />

          <Route path="/service" element={<AdminService />} />
          <Route path="/service/create" element={<AdminCreateService />} />
          <Route path="/service/update/:_id" element={<AdminUpdateService />} />

          {/* CONTACT */}


          <Route path="/subService" element={<AdminSubService />} />
          <Route path="/subService/create" element={<AdminCreateSubService />} />
          <Route path="/subService/update/:_id" element={<AdminUpdateSubService />} />

          <Route path="/placedstudent" element={<AdminPlacedStudent />} />
          <Route path="/placedstudent/create" element={<AdminCreatePlacedStudent />} />
          <Route path="/placedstudent/update/:_id" element={<AdminUpdatePlacedStudent />} />

          {/* CONTACT */}
          <Route path="/contactus" element={<AdminContactUs />} />
          <Route path="/contactus/view/:_id" element={<AdminShowQuery />} />

          <Route path="/application" element={<AdminApplications />} />
          <Route path="/application/view/:_id" element={<AdminShowApplication />} />

          <Route path="/placementApplication" element={<AdminPlacementApplications />} />
          <Route path="/placementApplication/view/:_id" element={<AdminShowPlacementApplication />} />

          <Route path="/newsletter" element={<AdminNewsletter />} />

          {/* CONSULTANCY */}
          <Route path="/consultancy" element={<AdminConsultancy />} />
          <Route path="/consultancy/view/:_id" element={<AdminShowConsultancy />} />

        </Routes>
        <Footer />
      </div>
    </div>
  );
}