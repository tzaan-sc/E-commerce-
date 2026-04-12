import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:8080/api";

function ReviewManagement() {

  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    const res = await axios.get(`${API}/reviews/unapproved`);
    setReviews(res.data);
  };

  const approveReview = async (id) => {
    await axios.put(`${API}/reviews/${id}/approve`);
    fetchReviews();
  };

  const deleteReview = async (id) => {
    await axios.delete(`${API}/reviews/${id}`);
    fetchReviews();
  };

  const replyReview = async (id) => {
    const reply = prompt("Nhập phản hồi:");
    if (!reply) return;

    await axios.put(`${API}/reviews/${id}/reply`, reply, {
      headers: { "Content-Type": "text/plain" }
    });

    fetchReviews();
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Quản lý đánh giá</h2>

      {reviews.map((r) => (
        <div key={r.id} style={{ border: "1px solid #ccc", margin: 10, padding: 10 }}>
          <p><b>User:</b> {r.userName}</p>
          <p><b>Sao:</b> {"⭐".repeat(r.star)}</p>
          <p><b>Comment:</b> {r.comment}</p>

          <button onClick={() => approveReview(r.id)}>Duyệt</button>
          <button onClick={() => deleteReview(r.id)}>Xóa</button>
          <button onClick={() => replyReview(r.id)}>Trả lời</button>
        </div>
      ))}
    </div>
  );
}

export default ReviewManagement;