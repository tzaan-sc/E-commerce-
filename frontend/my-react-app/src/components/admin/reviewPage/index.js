import React, { useEffect, useState } from "react";
import axios from "axios";
import "./style.scss";

const API = "http://localhost:8080/api";

function ReviewManagement() {

  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    const res = await axios.get(`${API}/reviews`);
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

  const token = localStorage.getItem("token"); // 🔥 lấy token

  await axios.put(`${API}/reviews/${id}/reply`, reply, {
    headers: {
      "Content-Type": "text/plain",
      Authorization: `Bearer ${token}`, // 🔥 thêm dòng này
    },
  });

  fetchReviews();
};

  return (
  <div className="review-admin">
    <h2>Quản lý đánh giá</h2>

    {reviews.length === 0 ? (
      <p className="empty">Không có đánh giá nào chờ duyệt</p>
    ) : (
      <table className="review-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Sản phẩm</th>
            <th>Sao</th>
            <th>Bình luận</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>

        <tbody>
          {reviews.map((r) => (
            <tr key={r.id}>
              <td>{r.userName}</td>

              <td>{r.product?.name || "N/A"}</td>

              <td>{"⭐".repeat(r.star)}</td>

              <td>{r.comment}</td>

              <td>
                {r.approved ? (
                  <span className="approved">Đã duyệt</span>
                ) : (
                  <span className="pending">Chờ duyệt</span>
                )}
              </td>

              <td>
                <button
                  className="approve"
                  onClick={() => approveReview(r.id)}
                >
                  ✔
                </button>

                <button
                  className="delete"
                  onClick={() => deleteReview(r.id)}
                >
                  ✖
                </button>

                <button
                  className="reply"
                  onClick={() => replyReview(r.id)}
                >
                  💬
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
);
}

export default ReviewManagement;