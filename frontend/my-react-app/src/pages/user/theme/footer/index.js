// src/components/Footer.js
import React from 'react';
import './Footer.scss';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* 1. Tổng đài hỗ trợ */}
        <div className="footer-section about">
          <h3>Tổng đài hỗ trợ</h3>
          <p>Mua hàng - Bảo hành: 19003892</p>
          <p>Khiếu nại: 19003893</p>
        </div>

        {/* 2. Chính sách mua hàng */}
        <div className="footer-section links">
          <h3>Chính sách mua hàng</h3>
          <ul>
            <li><a href="/return-policy">Chính sách đổi trả</a></li>
            <li><a href="/shipping-policy">Chính sách vận chuyển</a></li>
            <li><a href="/warranty-policy">Chính sách bảo hành</a></li>
            <li><a href="/payment-policy">Chính sách thanh toán</a></li>
          </ul>
        </div>

        {/* 3. Phương thức thanh toán */}
        <div className="footer-section payment-methods">
          <h3>Phương thức thanh toán</h3>
          <div className="payment-icons">
            <img src="/images/visa.png" alt="Visa" />
            <img src="/images/mastercard.png" alt="MasterCard" />
            <img src="/images/jcb.png" alt="JCB" />
            <img src="/images/cash.png" alt="Cash on Delivery" />
          </div>
        </div>

        {/* 4. Đối tác */}
        <div className="footer-section partners">
          <h3>Đối tác</h3>
          <ul>
            <li>ABC Logistics</li>
            <li>XYZ Payment Gateway</li>
            <li>Điện Máy Xanh</li>
            <li>SafetyPro</li>
          </ul>
        </div>

        {/* 5. Social media */}
        <div className="footer-section social-media">
          <h3>Kết nối với chúng tôi</h3>
          <div className="social-icons">
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
              <img src="/images/facebook.png" alt="Facebook" />
            </a>           
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
              <img src="/images/instagram.png" alt="Instagram" />
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2025 E-commerce Shop | Thiết kế bởi ...</p>
      </div>
    </footer>
  );
}

export default Footer;
