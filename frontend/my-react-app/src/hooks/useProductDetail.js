import { useState, useEffect } from 'react';
import productApi from '../services/productApi';
import variantApi from '../services/variantApi';
import { IMAGE_BASE_URL } from '../constants/config';

export const useProductDetail = (id) => {
  const [product, setProduct] = useState(null);
  const [images, setImages] = useState([]);
  const [variants, setVariants] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    let isMounted = true;

    const fetchProductData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch product and variants concurrently
        const [productData, variantsData] = await Promise.all([
          productApi.getProductById(id),
          variantApi.getVariantsByProductId(id)
        ]);

        if (isMounted) {
          setProduct(productData);
          setVariants(variantsData || []);

          // Process images
          let productImages = [];
          if (productData?.images && productData.images.length > 0) {
            productImages = productData.images.map(img => `${IMAGE_BASE_URL}/products/${img.urlImage}`);
          } else {
            productImages = ['https://via.placeholder.com/600x600?text=No+Image'];
          }
          setImages(productImages);

          // Auto select first variant
          if (variantsData && variantsData.length > 0) {
            setSelectedVariant(variantsData[0]);
          }
        }
      } catch (err) {
        if (isMounted) {
          console.error("Lỗi lấy thông tin sản phẩm:", err);
          setError("Không thể tải thông tin sản phẩm. Vui lòng thử lại sau.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProductData();

    return () => {
      isMounted = false;
    };
  }, [id]);

  return {
    product,
    images,
    variants,
    selectedVariant,
    setSelectedVariant,
    loading,
    error
  };
};
