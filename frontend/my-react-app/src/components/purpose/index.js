import { memo, useState } from "react";
import { Link } from "react-router-dom";
import "./style.scss"

const Purpose = () => {

const [categories] = useState([
    { id: 1, name: "Laptop Gaming", icon: "🎮", count: "150+" },
    { id: 2, name: "Laptop Văn Phòng", icon: "💼", count: "200+" },
    { id: 3, name: "Laptop Đồ Họa", icon: "🎨", count: "80+" },
    { id: 4, name: "Laptop Sinh Viên", icon: "📚", count: "180+" },
    { id: 5, name: "Workstation", icon: "🖥️", count: "50+" }
  ]);
  return (
  
      <section className="categories">
        <div className="container">
          <h2 className="section-title">Danh Mục Nổi Bật</h2>
          <div className="categories__grid">
            {categories.map(cat => (
              <Link key={cat.id} to={`/category/${cat.id}`} className="category-card">
                <div className="category-card__icon">{cat.icon}</div>
                <h3>{cat.name}</h3>
                <span>{cat.count} sản phẩm</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
  );
  };
  


export default memo(Purpose);
