import React from 'react';
import ReactDOM from 'react-dom/client';
import RouterCustom from './router';
import { BrowserRouter } from "react-router-dom";
import './styles/style.scss'
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render( 
  <BrowserRouter>
  <RouterCustom />
  
  </BrowserRouter>
);

