import { memo } from "react";
import { Link } from "react-router-dom";
import "./style.scss"

const BrandSection = () => {
  const brands = [
    {
      id: 1,
      name: "Dell",
      logo: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=200&h=100&fit=crop",
      path: "/laptop/dell",
      description: "Laptop Dell cao cấp"
    },
    {
      id: 2,
      name: "HP",
      logo: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200&h=100&fit=crop",
      path: "/laptop/hp",
      description: "Laptop HP chính hãng"
    },
    {
      id: 3,
      name: "Asus",
      logo: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=200&h=100&fit=crop",
      path: "/laptop/asus",
      description: "Laptop Asus gaming"
    },
    {
      id: 4,
      name: "Lenovo",
      logo: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=200&h=100&fit=crop",
      path: "/laptop/lenovo",
      description: "Laptop Lenovo ThinkPad"
    },
    {
      id: 5,
      name: "Acer",
      logo: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200&h=100&fit=crop",
      path: "/laptop/acer",
      description: "Laptop Acer giá rẻ"
    },
    {
      id: 6,
      name: "MSI",
      logo: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=200&h=100&fit=crop",
      path: "/laptop/msi",
      description: "Laptop MSI gaming"
    }
  ];

  return (
    <section className="brand-section">
      <div className="container">
        <div className="brand-section__header">
          <h2>Thương Hiệu Nổi Bật</h2>
          <p>Khám phá các thương hiệu laptop hàng đầu thế giới</p>
        </div>

        <div className="brand-section__grid">
          {brands.map((brand) => (
            <Link 
              key={brand.id} 
              to={brand.path} 
              className="brand-card"
            >
              <div className="brand-card__image">
                <img src={brand.logo} alt={brand.name} />
              </div>
              <div className="brand-card__content">
                <h3>{brand.name}</h3>
                <p>{brand.description}</p>
                <span className="brand-card__cta">Xem ngay →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default memo(BrandSection);