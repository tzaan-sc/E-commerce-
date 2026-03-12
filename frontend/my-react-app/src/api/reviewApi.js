import axios from "axios";

const API = "http://localhost:8080/api";

export const getReviews = (productId, star) => {
    if (star) {
        return axios.get(`${API}/reviews/product/${productId}?star=${star}`);
    }
    return axios.get(`${API}/reviews/product/${productId}`);
};

export const getAverageStar = (productId) => {
    return axios.get(`${API}/reviews/avg/${productId}`);
};

export const createReview = (data) => {
    return axios.post(`${API}/reviews`, data);
};