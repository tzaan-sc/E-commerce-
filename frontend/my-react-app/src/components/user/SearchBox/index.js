import React, { useState, useEffect } from "react";
import { suggestSearch } from "../../../api/searchApi";
import { useNavigate } from "react-router-dom";
import "./style.scss";

function SearchBox() {
  const [keyword, setKeyword] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!keyword.trim()) {
      setSuggestions([]);
      setShow(false);
      return;
    }

    const delayDebounce = setTimeout(() => {
      fetchSuggest();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [keyword]);

  const fetchSuggest = async () => {
    try {
      setLoading(true);

      const res = await suggestSearch(keyword);

      // ✅ FIX quan trọng
      const data = res?.data || [];

      setSuggestions(Array.isArray(data) ? data : []);
      setShow(true);
    } catch (error) {
      console.error("Search error:", error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = (slug) => {
    navigate(`/product/${slug}`);
    setShow(false);
    setKeyword("");
  };

  return (
    <div className="search-box">
      <input
        type="text"
        placeholder="Bạn tìm gì..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onFocus={() => keyword && setShow(true)}
        onBlur={() => setTimeout(() => setShow(false), 200)}
      />

      {show && (
        <div className="suggest-box">
          {loading && <div className="loading">Đang tìm...</div>}

          {!loading && suggestions.length === 0 && (
            <div className="no-result">Không tìm thấy</div>
          )}

          {!loading &&
            suggestions.map((item) => (
              <div
                key={item.id}
                className="suggest-item"
                onClick={() => handleClick(item.slug)}
              >
                <img
                  src={item.image || "/no-image.png"}
                  alt={item.name}
                />

                <div className="info">
                  <div className="name">{item.name}</div>
                  <div className="price">
                    {item.price?.toLocaleString()}₫
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

export default SearchBox;