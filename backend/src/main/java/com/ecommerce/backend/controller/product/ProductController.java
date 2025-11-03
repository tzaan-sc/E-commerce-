//package com.ecommerce.backend.controller.product;
//
//import com.ecommerce.backend.dto.product.CreateProductRequest;
//import com.ecommerce.backend.dto.product.UpdateProductRequest;
//import com.ecommerce.backend.entity.product.Product;
//import com.ecommerce.backend.service.product.ProductService;
//
//import lombok.RequiredArgsConstructor;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//
//@RestController
//@RequestMapping("/api/products")
//@RequiredArgsConstructor
//public class ProductController {
//
//    private final ProductService productService;
//
//    @PostMapping
//    public Product createProduct(@RequestBody CreateProductRequest request) {
//        return productService.createProduct(request);
//    }
//
//    @PutMapping("/{id}")
//    public Product updateProduct(@PathVariable Long id, @RequestBody UpdateProductRequest request) {
//        return productService.updateProduct(id, request);
//    }
//
//    @DeleteMapping("/{id}")
//    public void deleteProduct(@PathVariable Long id) {
//        productService.deleteProduct(id);
//    }
//
//    @GetMapping
//    public List<Product> getAllProducts() {
//        return productService.getAllProducts();
//    }
//
//    @GetMapping("/{id}")
//    public Product getProductById(@PathVariable Long id) {
//        return productService.getProductById(id);
//    }
//}
