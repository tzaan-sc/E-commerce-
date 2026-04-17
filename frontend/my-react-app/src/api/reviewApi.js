import axios from "axios";

const API = "http://localhost:8080/api";

// ⭐ GET REVIEWS
export const getReviews = (productId, star) => {
    if (star) {
        return axios.get(`${API}/reviews/product/${productId}?star=${star}`);
    }
    return axios.get(`${API}/reviews/product/${productId}`);
};

// ⭐ AVG STAR
export const getAverageStar = (productId) => {
    return axios.get(`${API}/reviews/avg/${productId}`);
};

// 🔥 LẤY TOKEN CHUNG
const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return {
        Authorization: `Bearer ${token}`
    };
};

// ⭐ CREATE REVIEW
export const createReview = (data) => {
    return axios.post(`${API}/reviews`, data, {
        headers: getAuthHeader()
    });
};

// 🔥🔥🔥 QUAN TRỌNG: REPLY REVIEW (FIX 403)
export const replyReview = (id, content) => {

    const token = localStorage.getItem("token");

    return axios.put(
        `${API}/reviews/${id}/reply`,
        content,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "text/plain"
            }
        }
    );
};

// ⭐ APPROVE REVIEW
export const approveReview = (id) => {
    return axios.put(
        `${API}/reviews/${id}/approve`,
        {},
        {
            headers: getAuthHeader()
        }
    );
};

// ⭐ DELETE REVIEW
export const deleteReview = (id) => {
    return axios.delete(`${API}/reviews/${id}`, {
        headers: getAuthHeader()
    });
};