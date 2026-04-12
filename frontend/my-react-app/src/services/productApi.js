import axiosClient from './axiosClient';

const productApi = {
  getProductById: (id) => {
    const url = `/products/${id}`;
    return axiosClient.get(url);
  },
  // Các endpoint khác liên quan tới Product...
};

export default productApi;
