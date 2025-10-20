// src/router.js
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/user/homePage";
import ProfilePage from "./pages/user/profilePage";
import RegistrationPage from "./pages/user/registrationPage";
import MainLayout from "./pages/user/theme/mainLayout";
import { ROUTERS } from "./utils/router";
import LaptopPage from "./pages/user/laptopPage";
import LoginPage from "./pages/user/loginPage";

// Hàm kiểm tra đăng nhập
const isAuthenticated = () => {
  return !!localStorage.getItem("user"); // dùng 'user'
};


const renderUserRouter = () => {
  const userRouters = [
    { path: ROUTERS.USER.HOME, component: <HomePage /> },
    { path: ROUTERS.USER.PROFILE, component: <ProfilePage />, protected: true },
    { path: ROUTERS.USER.REGISTER, component: <RegistrationPage /> },
    { path: ROUTERS.USER.LAPTOP, component: <LaptopPage /> },
    { path: ROUTERS.USER.LOGIN, component: <LoginPage /> },
  ];

  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        {userRouters.map((item, key) => {
          // Nếu route có "protected" và chưa đăng nhập => chuyển hướng sang login
          if (item.protected && !isAuthenticated()) {
            return (
              <Route
                key={key}
                path={item.path}
                element={<Navigate to={ROUTERS.USER.LOGIN} replace />}
              />
            );
          }

          // Route cho trang chủ (index)
          if (item.path === ROUTERS.USER.HOME) {
            return <Route key={key} index element={item.component} />;
          }

          // Route bình thường
          return <Route key={key} path={item.path} element={item.component} />;
        })}
      </Route>
    </Routes>
  );
};

const RouterCustom = () => {
  return renderUserRouter();
};

export default RouterCustom;
