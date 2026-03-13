import React, { useState } from "react";
import { createReview } from "../../../api/reviewApi";
import "./style.scss";

function ReviewForm({ productId, userId }) {

  const [star, setStar] = useState(0);
  const [hoverStar, setHoverStar] = useState(0);
  const [comment, setComment] = useState("");

const submitReview = async () => {
  const data = {
    userId: userId,
    productId: productId,
    star: star,
    comment: comment,
    image: ""
  };

  try {
    await createReview(data);
    alert("Đánh giá thành công");

    setStar(0);
    setHoverStar(0);
    setComment("");

  } catch (err) {
    console.log(err.response?.data);
    alert(err.response?.data?.message || "Gửi đánh giá thất bại");
  }
};

  return (

    <div className="review-form">

      <h4>Gửi đánh giá</h4>

      {/* STAR */}
      <div className="star-select">

        {[1,2,3,4,5].map((s)=>(
          <span
            key={s}
            className={`star ${(hoverStar || star) >= s ? "active" : ""}`}
            onClick={()=>setStar(s)}
            onMouseEnter={()=>setHoverStar(s)}
            onMouseLeave={()=>setHoverStar(0)}
          >
            ★
          </span>
        ))}

      </div>

      {/* COMMENT */}
      <textarea
        placeholder="Chia sẻ cảm nhận của bạn về sản phẩm..."
        value={comment}
        onChange={(e)=>setComment(e.target.value)}
      />

      {/* BUTTON */}
      <button onClick={submitReview}>
        Gửi đánh giá
      </button>

    </div>

  );
}

export default ReviewForm;