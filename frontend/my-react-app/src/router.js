// src/router.js
import { Routes, Route } from "react-router-dom";

import MainLayout from "./pages/user/mainLayout";
import CustomerLayout from "pages/customer/customerLayout";
import HomePage from "./components/page/homePage";
import LaptopPage from "components/page/laptopPage";
import LoginPage from "./components/page/loginPage";
import RegistrationPage from "./components/page/registrationPage";
import ProductDetailPage from "./components/page/productDetailPage";
import ProfilePage from "./components/page/profilePage";
import CartPage from "./components/page/cartPage";
import MyOrdersPage from "components/page/myOrderPage";
// ====== Import các trang Admin ======

import { ROUTERS } from "./utils/router";
import AdminDashboard from "pages/admin/dashboardPage";
import SearchPage from "./components/page/searchPage";  
import ForgotPasswordPage from "./components/page/forgotPasswordPage";

// ROUTER CHÍNH
// ========================
const RouterCustom = () => {
  return (
    <Routes>
      {/* ====================== USER ROUTES ====================== */}
      <Route element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path={ROUTERS.USER.LAPTOP} element={<LaptopPage />} />
        <Route path={ROUTERS.USER.LOGIN} element={<LoginPage />} />
        <Route path={ROUTERS.USER.REGISTER} element={<RegistrationPage />} />
        <Route path={ROUTERS.USER.PRODUCTDETAIL} element={<ProductDetailPage />}/>
        <Route path={ROUTERS.USER.SEARCH} element={<SearchPage />}/>
        <Route path={ROUTERS.USER.FORGOTPASSWORD} element={<ForgotPasswordPage />}/>
        
      </Route>

      {/* ====================== ADMIN ROUTES ====================== */}

      {/* Các route admin cần layout */}
      <Route
        path={ROUTERS.ADMIN.DASHBOARD}
        element={<AdminDashboard />}
      ></Route>

      <Route path="/customer/home" element={<CustomerLayout />}>
        <Route index element={<HomePage />} />
        <Route path="thong-tin-ca-nhan" element={<ProfilePage />} />
        <Route path="don-mua" element={<MyOrdersPage />} />
        <Route path="gio-hang" element={<CartPage />} />
        <Route path="laptop" element={<LaptopPage />} /> 
        <Route path="product/:id" element={<ProductDetailPage />} />
        <Route path="tim-kiem" element={<SearchPage />} />
      </Route>
    </Routes>
  );
};

export default RouterCustom;
