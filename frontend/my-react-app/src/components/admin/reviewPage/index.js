import React, { useEffect, useState } from "react";
import apiClient from "../../../api/axiosConfig";
import "./style.scss";

function ReviewManagement() {
  const [reviews, setReviews] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");

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

  // Logic lọc danh sách dựa trên filterStatus
  const filteredReviews = reviews.filter((r) => {
    if (filterStatus === "approved") return r.approved === 1 || r.approved === true;
    if (filterStatus === "pending") return r.approved === 0 || r.approved === false;
    return true;
  });

  const approveReview = async (id) => {
    try {
      await apiClient.put(`/reviews/${id}/approve`);
      fetchReviews(); // Load lại để nút Duyệt tự mất đi vì approved đã thành true
    } catch (e) {
      console.error(e);
    }
  };

  const deleteReview = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa?")) return;
    try {
      await apiClient.delete(`/reviews/${id}`);
      fetchReviews();
    } catch (e) {
      console.error(e);
    }
  };

  const replyReview = async (id, currentReply) => {
    const replyText = prompt("Nhập phản hồi:", currentReply || "");
    if (replyText === null) return;

    try {
      await apiClient.put(`/reviews/${id}/reply`, replyText, {
        headers: { "Content-Type": "text/plain" },
      });
      fetchReviews();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="review-page">
      <div className="review-card">
        <div className="review-header">
          <h3>Quản lý Đánh giá</h3>
          
          <div className="filter-bar">
            <span>Lọc: </span>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">Tất cả</option>
              <option value="pending">Chờ duyệt</option>
              <option value="approved">Đã duyệt</option>
            </select>
          </div>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Sản phẩm</th>
                <th>Sao</th>
                <th>Nội dung</th>
                <th>Phản hồi Admin</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredReviews.map((r) => (
                <tr key={r.id}>
                  <td>{r.userName || r.user_id}</td>
                  <td>{r.product?.name || "N/A"}</td>
                  <td className="stars">{"⭐".repeat(r.star)}</td>
                  <td className="comment-cell">{r.comment}</td>
                  
                  <td className="reply-cell">
                    {r.reply ? (
                      <span className="text-reply">{r.reply}</span>
                    ) : (
                      <span className="no-reply">Chưa có phản hồi</span>
                    )}
                  </td>

                  <td>
                    <span className={`badge ${r.approved ? "success" : "warning"}`}>
                      {r.approved ? "Đã duyệt" : "Chờ duyệt"}
                    </span>
                  </td>

                  <td className="actions">
                    {/* CHỨC NĂNG BẠN HỎI: Chỉ hiện nút Duyệt nếu chưa duyệt */}
                    {!r.approved && (
                      <button 
                        className="btn approve" 
                        onClick={() => approveReview(r.id)}
                        title="Duyệt ngay"
                      >
                        ✔
                      </button>
                    )}

                    <button 
                      className="btn reply" 
                      onClick={() => replyReview(r.id, r.reply)}
                      title="Phản hồi"
                    >
                      {r.reply ? "📝" : "💬"}
                    </button>

                    <button 
                      className="btn delete" 
                      onClick={() => deleteReview(r.id)}
                      title="Xóa"
                    >
                      ✖
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ReviewManagement;