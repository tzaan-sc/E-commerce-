import { memo, useState } from "react";
import { Link } from "react-router-dom";
import "./style.scss"

const Brand = () => {

    const [brands] = useState([
    { id: 1, name: "Dell", logo: "🖥️" },
    { id: 2, name: "HP", logo: "💻" },
    { id: 3, name: "Asus", logo: "⚡" },
    { id: 4, name: "Lenovo", logo: "🔷" },
    { id: 5, name: "Acer", logo: "🎯" },
    { id: 6, name: "MSI", logo: "🎮" },
    { id: 7, name: "Apple", logo: "🍎" },
  ]);

const [categories] = useState([
    { id: 1, name: "Laptop Gaming", icon: "🎮", count: "150+" },
    { id: 2, name: "Laptop Văn Phòng", icon: "💼", count: "200+" },
    { id: 3, name: "Laptop Đồ Họa", icon: "🎨", count: "80+" },
    { id: 4, name: "Laptop Mỏng Nhẹ", icon: "⚡", count: "120+" },
    { id: 5, name: "Laptop Sinh Viên", icon: "📚", count: "180+" },
    { id: 6, name: "Workstation", icon: "🖥️", count: "50+" }
  ]);
  return (
  
      <section className="brands">
        <div className="container">
          <h2 className="section-title">Thương Hiệu</h2>
          <div className="brands__grid">
            {brands.map(brand => (
              <Link key={brand.id} to={`/brand/${brand.id}`} className="brand-item">
                <div className="brand-item__logo">{brand.logo}</div>
                <span>{brand.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
  );
  };
  


export default memo(Brand);
