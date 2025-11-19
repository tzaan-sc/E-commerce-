import React from 'react';
import ReactDOM from 'react-dom/client';
import RouterCustom from './router';
import { BrowserRouter } from "react-router-dom";
import './styles/style.scss'
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { CartProvider } from './context/index'; 

// 👇 2. IMPORT PROVIDER XÁC THỰC (Nếu có)
import { useAuth } from './hooks/useAuth';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render( 
  // <BrowserRouter>
  // <RouterCustom />
  
  // </BrowserRouter>
  <React.StrictMode>
    <BrowserRouter>
      {/* 3. BỌC PROVIDER VÀO ĐÂY */}
      {/* Đặt AuthProvider bên ngoài cùng, sau đó là CartProvider */}
      <useAuth> 
        <CartProvider> {/* <-- CHÍNH LÀ CHỖ CẦN BỌC */}
          <RouterCustom />
        </CartProvider>
      </useAuth>
    </BrowserRouter>
  </React.StrictMode>
);

