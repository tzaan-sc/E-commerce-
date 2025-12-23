import { memo } from "react";
import "./style.scss";
// Import các icon cần thiết
import { FaFacebook, FaInstagram, FaYoutube, FaTiktok } from "react-icons/fa"; // Mạng xã hội
import { FaCcVisa, FaCcMastercard, FaCcJcb, FaMoneyBillWave } from "react-icons/fa"; // Thanh toán
import { BsTelephoneFill, BsShieldCheck, BsBoxSeam, BsArrowRepeat } from "react-icons/bs"; // Tiện ích
import { MdEmail, MdLocationOn } from "react-icons/md"; // Liên hệ

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        
        {/* 1. Tổng đài hỗ trợ */}
        <div className="footer-section about">
          <h3>Tổng đài hỗ trợ</h3>
          <p className="contact-item">
            <BsTelephoneFill className="icon-small" /> 
            <span>Mua hàng - Bảo hành: <strong>1900 3892</strong></span>
          </p>
          <p className="contact-item">
            <BsTelephoneFill className="icon-small" /> 
            <span>Khiếu nại: <strong>1900 3893</strong></span>
          </p>
          <p className="contact-item">
            <MdEmail className="icon-small" /> 
            <span>Email: cskh@ecommerce.com</span>
          </p>
          <p className="contact-item">
            <MdLocationOn className="icon-small" /> 
            <span>Địa chỉ: 123 Đường ABC, TP.HCM</span>
          </p>
        </div>

        {/* 2. Chính sách mua hàng */}
        <div className="footer-section links">
          <h3>Chính sách mua hàng</h3>
          <ul>
            <li><a href="/return-policy"><BsArrowRepeat /> Chính sách đổi trả</a></li>
            <li><a href="/shipping-policy"><BsBoxSeam /> Chính sách vận chuyển</a></li>
            <li><a href="/warranty-policy"><BsShieldCheck /> Chính sách bảo hành</a></li>
            <li><a href="/payment-policy"><FaMoneyBillWave /> Chính sách thanh toán</a></li>
          </ul>
        </div>

        {/* 3. Phương thức thanh toán */}
        <div className="footer-section payment-methods">
          <h3>Phương thức thanh toán</h3>
          <div className="payment-icons">
            <span title="Thanh toán khi nhận hàng"><FaMoneyBillWave size={40} color="#16a34a" /></span>
            <span title="Visa"><FaCcVisa size={40} color="#1A1F71" /></span>
            <span title="MasterCard"><FaCcMastercard size={40} color="#EB001B" /></span>
            <span title="JCB"><FaCcJcb size={40} color="#0f4c81" /></span>
          </div>
        </div>

        {/* 4. Đối tác & Social (Gộp lại cho gọn hoặc tách riêng tùy bạn) */}
        <div className="footer-section social-media">
          <h3>Kết nối với chúng tôi</h3>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="fb">
              <FaFacebook size={30} />
            </a>          
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="insta">
              <FaInstagram size={30} />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="yt">
              <FaYoutube size={30} />
            </a>
            <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="tt">
              <FaTiktok size={30} />
            </a>
          </div>

          <h3 style={{ marginTop: '20px' }}>Đối tác vận chuyển</h3>
          <ul className="partners-list">
            <li>Giao Hàng Nhanh</li>
            <li>Viettel Post</li>
            <li>Shopee Express</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2025 E-commerce Shop | Thiết kế bởi Bạn</p>
      </div>
    </footer>
  );
}

export default memo(Footer);