import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// 👇 Import icon ChevronRight (hình dấu >)
import { Home, ChevronRight } from "lucide-react"; 
import "./style.scss";

const Breadcrumb = ({ items }) => {
  const [homeLink, setHomeLink] = useState("/");

  useEffect(() => {
    const user = localStorage.getItem("user"); 
    const token = localStorage.getItem("token");
    if (user || token) {
        setHomeLink("/customer/home");
    } else {
        setHomeLink("/");
    }
  }, []);

  return (
    <nav className="breadcrumb-nav">
      <div className="container">
        <ol className="breadcrumb-list">
          {/* 1. Nút Trang chủ */}
          <li className="breadcrumb-item">
            <Link to={homeLink} className="home-link">
              <Home size={16} strokeWidth={2} /> Trang chủ
            </Link>
            {/* 👇 Dấu > ngăn cách */}
            <ChevronRight size={16} className="separator" />
          </li>

          {/* 2. Các mục tiếp theo */}
          {items?.map((item, index) => {
            const isLast = index === items.length - 1;

            return (
              <li key={index} className={`breadcrumb-item ${isLast ? "active" : ""}`}>
                {isLast ? (
                  // Trang hiện tại (Màu xám, không click)
                  <span className="current-text" title={item.label}>
                    {item.label}
                  </span>
                ) : (
                  // Trang cha (Có link + Dấu >)
                  <>
                    <Link to={item.link}>{item.label}</Link>
                    <ChevronRight size={16} className="separator" />
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
};

export default Breadcrumb;
