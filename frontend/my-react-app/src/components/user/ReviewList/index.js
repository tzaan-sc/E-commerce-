import React, { useEffect, useState } from "react";
import { getReviews } from "../../../api/reviewApi";

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

    return (
        <div>
            <h3>Đánh giá sản phẩm</h3>

            <button onClick={() => setStarFilter(5)}>5⭐</button>
            <button onClick={() => setStarFilter(4)}>4⭐</button>
            <button onClick={() => setStarFilter(3)}>3⭐</button>
            <button onClick={() => setStarFilter(null)}>Tất cả</button>

            {reviews.length === 0 && <p>Chưa có đánh giá</p>}

            {reviews.map((r) => (
                <div key={r.id} style={{border:"1px solid #ddd",margin:"10px",padding:"10px"}}>
                    <p>⭐ {r.star}</p>
                    <p>{r.comment}</p>
                    {r.image && <img src={r.image} width="100" alt="review"/>}
                </div>
            ))}
        </div>
    );
}

export default ReviewList;