// src/router.js
import { Routes, Route } from "react-router-dom";

import MainLayout from "./components/layout/MainLayout";
import CustomerLayout from "./components/layout/CustomerLayout";
import HomePage from "./pages/Home";
import LaptopPage from "./pages/Laptop";
import LoginPage from "./pages/Auth/Login";
import RegistrationPage from "./pages/Auth/Register";
import ProductDetailPage from "./pages/ProductDetail";
import ProfilePage from "./pages/customer/Profile";
import CartPage from "./pages/Cart";
import MyOrdersPage from "./pages/customer/MyOrder";
import OrderDetailPage from "./pages/customer/OrderDetail";
import BrandProductsPage from "./pages/Search/BrandProducts";
import UsagePurposeProductsPage from "./pages/Search/UsagePurposeProducts";
import CheckoutPage from "./pages/Checkout";

// ====== Import các trang Admin ======
import { ROUTERS } from "./utils/router";
import AdminDashboard from "./pages/admin/dashboardPage";
import SearchPage from "./pages/Search/SearchPage";  
import ForgotPasswordPage from "./pages/Auth/ForgotPassword";
import ResetPasswordPage from "./pages/Auth/ForgotPassword"; 
import ProtectedRoute from "./components/ProtectedRoute"; // 1. Import cái này vào
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
      {/* <Route
        path={ROUTERS.ADMIN.DASHBOARD}
        element={<AdminDashboard />}
      ></Route> */}
      <Route
        path={ROUTERS.ADMIN.DASHBOARD}
        element={
          <ProtectedRoute roles={["ADMIN"]}> {/* 2. Bọc lại và quy định Role là ADMIN */}
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
       

      {/* <Route path="/customer/home" element={<CustomerLayout />}> */}
      <Route 
        path="/customer/home" 
        element={
          <ProtectedRoute roles={["CUSTOMER"]}> {/* Quy định Role là CUSTOMER */}
            <CustomerLayout />
          </ProtectedRoute>
        }
      >
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
