package com.ecommerce.backend.repository.product;

import com.ecommerce.backend.entity.product.Brand;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


// Kế thừa JpaRepository để có sẵn các phương thức CRUD cơ bản
@Repository
public interface BrandRepository extends JpaRepository<Brand, Long> {
    // Phương thức tùy chỉnh để kiểm tra xem một brand có tên cụ thể đã tồn tại chưa
    boolean existsByName(String name);
}