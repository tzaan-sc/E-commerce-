import React, { useEffect, useState } from "react";
import { getReviews } from "../../../api/reviewApi";
import "./style.scss";

function ReviewList({ productId }) {

  const [reviews, setReviews] = useState([]);
  const [starFilter, setStarFilter] = useState(null);

  useEffect(() => {
    fetchReviews();
  }, [productId, starFilter]);

  const fetchReviews = async () => {
    try {
      const res = await getReviews(productId, starFilter);
      setReviews(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const total = reviews.length;

  const countStar = (star) =>
    reviews.filter((r) => r.star === star).length;

  const percent = (star) =>
    total === 0 ? 0 : Math.round((countStar(star) / total) * 100);

  return (
    <div className="review-container">

      <h3 className="review-title">Đánh giá sản phẩm</h3>

      {/* STATISTIC */}
      <div className="review-statistic">

        {[5,4,3,2,1].map((star)=>(
          <div key={star} className="stat-row">

            <span className="stat-label">{star}⭐</span>

            <div className="stat-bar">
              <div
                className="stat-fill"
                style={{ width: `${percent(star)}%` }}
              />
            </div>

            <span className="stat-percent">
              {percent(star)}%
            </span>

          </div>
        ))}

      </div>

      {/* FILTER */}
      <div className="review-filter">

        <button onClick={() => setStarFilter(null)}>
          Tất cả
        </button>

        {[5,4,3,2,1].map((star)=>(
          <button key={star} onClick={()=>setStarFilter(star)}>
            {star}⭐
          </button>
        ))}

      </div>

      {reviews.length === 0 && (
        <p className="no-review">Chưa có đánh giá</p>
      )}

      {/* LIST */}
      {reviews.map((r) => (

        <div key={r.id} className="review-card">

          <div className="review-header">

            <div className="review-user">

              <div className="avatar">
                {r.userName?.charAt(0) || "U"}
              </div>

              <span className="username">
                {r.userName || "User"}
              </span>

            </div>

            <div className="review-star">
              {"⭐".repeat(r.star)}
            </div>

          </div>

          <div className="review-body">
  <div className="review-comment">
    {r.comment}
  </div>

  {r.image && (
    <img
      src={r.image}
      className="review-image"
      alt="review"
    />
  )}
</div>


        </div>

      ))}

    </div>
  );
}

export default ReviewList;