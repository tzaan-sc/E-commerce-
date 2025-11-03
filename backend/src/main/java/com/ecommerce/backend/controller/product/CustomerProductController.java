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
//@RequestMapping("/api/customer/products")
//@RequiredArgsConstructor
//@CrossOrigin(origins = "*")
//public class CustomerProductController {
//
//    private final ProductService productService;
//
//    // 👤 GET /api/customer/products -> Xem danh sách sản phẩm
//    @GetMapping
//    public ResponseEntity<List<Product>> getAllProducts() {
//        List<Product> products = productService.getAllProducts();
//        return ResponseEntity.ok(products);
//    }
//
//    // 👤 GET /api/customer/products/{id} -> Xem chi tiết sản phẩm
//    @GetMapping("/{id}")
//    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
//        return productService.getProductById(id)
//                .map(ResponseEntity::ok)
//                .orElse(ResponseEntity.notFound().build());
//    }
//}
