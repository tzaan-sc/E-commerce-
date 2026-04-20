import React, { useEffect, useState } from "react";
import apiClient from "../../../api/axiosConfig";
import "./style.scss";

function ReviewManagement() {

  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await apiClient.get("/reviews");
      setReviews(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const approveReview = async (id) => {
    try {
      await apiClient.put(`/reviews/${id}/approve`);
      fetchReviews();
    } catch (e) {
      console.error(e);
    }
  };

  const deleteReview = async (id) => {
    try {
      await apiClient.delete(`/reviews/${id}`);
      fetchReviews();
    } catch (e) {
      console.error(e);
    }
  };

  const replyReview = async (id) => {
  const reply = prompt("Nhập phản hồi:");
  if (!reply) return;

  try {
    await apiClient.put(`/reviews/${id}/reply`, reply, {
      headers: {
        "Content-Type": "text/plain",
      },
    });
    fetchReviews();
  } catch (e) {
    console.error(e);
  }
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