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
import OrderDetailPage from "components/page/OrderDetailPage";
import BrandProductsPage from "./components/page/brandProducts"
import UsagePurposeProductsPage from "./components/page/usagePurposeProducts"
import CheckoutPage from "./components/user/checkoutPage";
// ====== Import các trang Admin ======

import { ROUTERS } from "./utils/router";
import AdminDashboard from "pages/admin/dashboardPage";
import SearchPage from "./components/page/searchPage";  
import ForgotPasswordPage from "./components/page/forgotPasswordPage";
import ResetPasswordPage from "./components/page/forgotPasswordPage"; 
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
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        {/* <Route path={ROUTERS.USER.BRAND} element={<BrandProductsPage />} />
        <Route path={ROUTERS.USER.USAGE_PURPOSE} element={<UsagePurposeProductsPage />} /> */}
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
        <Route path="don-mua/:id" element={<OrderDetailPage />} />
        <Route path="gio-hang" element={<CartPage />} />
        <Route path="thanh-toan" element={<CheckoutPage />} />
        <Route path="laptop" element={<LaptopPage />} /> 
        <Route path="product/:id" element={<ProductDetailPage />} />
        <Route path="tim-kiem" element={<SearchPage />} />
        {/* <Route path="brand/:id" element={<BrandProductsPage />} />
        <Route path="usage-purpose/:id" element={<UsagePurposeProductsPage />} /> */}
      </Route>
    </Routes>
  );
};

export default RouterCustom;
