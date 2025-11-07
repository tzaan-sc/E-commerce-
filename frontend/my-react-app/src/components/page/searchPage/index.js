import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import ProductCard from "components/user/productCard";
import "./style.scss";

const SearchPage = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q") || "";
  const [results, setResults] = useState([]);

  useEffect(() => {
    // Giả lập API gọi sản phẩm
    const allProducts = [
      { id: 1, name: "Laptop Dell Inspiron", price: 15000000 },
      { id: 2, name: "Laptop HP Pavilion", price: 14000000 },
      { id: 3, name: "Laptop Asus TUF", price: 18000000 },
    ];

    const filtered = allProducts.filter((p) =>
      p.name.toLowerCase().includes(query.toLowerCase())
    );
    setResults(filtered);
  }, [query]);

  return (
    <div className="search-page container">
      <h2>Kết quả tìm kiếm cho: “{query}”</h2>
      {results.length > 0 ? (
        <div className="product-grid">
          {results.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="no-results">Không tìm thấy sản phẩm phù hợp 😢</p>
      )}
    </div>
  );
};

export default SearchPage;