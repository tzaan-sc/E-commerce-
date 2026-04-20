import React from 'react';
import ReactDOM from 'react-dom/client';
import RouterCustom from './router';
import { BrowserRouter } from "react-router-dom";
import './styles/style.scss'
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { CartProvider } from './context/index'; 
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// 👇 2. IMPORT PROVIDER XÁC THỰC (Nếu có)
import { useAuth } from './hooks/useAuth';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render( 
  // <BrowserRouter>
  // <RouterCustom />
  
  // </BrowserRouter>
  <React.StrictMode>
    <GoogleOAuthProvider clientId="733137263298-rd2c4so8vnreuua7dvtgrmgg90cnu72i.apps.googleusercontent.com">
      <BrowserRouter>
      {/* 3. BỌC PROVIDER VÀO ĐÂY */}
      {/* Đặt AuthProvider bên ngoài cùng, sau đó là CartProvider */}
      
        <CartProvider> {/* <-- CHÍNH LÀ CHỖ CẦN BỌC */}
          <RouterCustom />
          {/* Toast container: hiện thông báo lỗi API toàn app */}
          <ToastContainer
            position="top-right"
            autoClose={4000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            pauseOnHover
            draggable
            theme="colored"
          />
        </CartProvider>
      
    </BrowserRouter>
    </GoogleOAuthProvider>
    
  </React.StrictMode>
);

