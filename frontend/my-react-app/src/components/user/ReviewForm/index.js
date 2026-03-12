import React, { useState } from "react";
import { createReview } from "../../../api/reviewApi";

function ReviewForm({ productId, userId }) {
    console.log("productId nhận được:", productId);
    const [star, setStar] = useState(5);
    const [comment, setComment] = useState("");

    const submitReview = async () => {

        const data = {
            userId: userId,
            productId: productId,
            star: Number(star),
            comment: comment,
            image: ""
        };

        try{
            await createReview(data);
            alert("Đánh giá thành công");
        }catch(err){
            console.log(err.response?.data);
            alert("Gửi đánh giá thất bại");
        }
    };

    return (
        <div>

            <h5>Gửi đánh giá</h5>

            <select
            value={star}
            onChange={(e)=>setStar(Number(e.target.value))}
            >
                <option value="5">5⭐</option>
                <option value="4">4⭐</option>
                <option value="3">3⭐</option>
                <option value="2">2⭐</option>
                <option value="1">1⭐</option>
            </select>

            <br/><br/>

            <textarea
                placeholder="Nhập đánh giá..."
                value={comment}
                onChange={(e)=>setComment(e.target.value)}
                style={{width:"100%",height:"80px"}}
            />

            <br/><br/>

            <button
            className="btn btn-primary"
            onClick={submitReview}
            >
                Gửi đánh giá
            </button>

        </div>
    );
}

export default ReviewForm;