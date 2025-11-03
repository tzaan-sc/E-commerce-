//package com.ecommerce.backend.controller.product;
//
//
//import com.ecommerce.backend.entity.product.Product;
//import com.ecommerce.backend.service.product.ProductService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//
//@RestController
//@RequestMapping("/api/admin/products")
//@RequiredArgsConstructor
//@CrossOrigin(origins = "*")
//public class AdminProductController {
//
//    private final ProductService productService;
//
//    // 🧑‍💼 GET /api/admin/products -> Xem toàn bộ sản phẩm
//    @GetMapping
//    public ResponseEntity<List<Product>> getAllProducts() {
//        List<Product> products = productService.getAllProducts();
//        return ResponseEntity.ok(products);
//    }
//
//    // 🧑‍💼 POST /api/admin/products -> Thêm sản phẩm mới
//    @PostMapping
//    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
//        Product saved = productService.createProduct(product);
//        return ResponseEntity.ok(saved);
//    }
//}
