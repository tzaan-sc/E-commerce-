package com.ecommerce.backend.service.AI;

import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.SimpleVectorStore;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import com.ecommerce.backend.repository.product.ProductRepository;
import com.ecommerce.backend.entity.product.Product;

import java.io.File;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AiDataService {

    private final ProductRepository productRepository;
    private final VectorStore vectorStore;
    
    @Value("${app.ai.vector-store-path}")
    private String vectorStorePath;

    public AiDataService(ProductRepository productRepository, VectorStore vectorStore) {
        this.productRepository = productRepository;
        this.vectorStore = vectorStore;
    }

    public void syncDataToVectorStore() {
        List<Product> products = productRepository.findAll();
        
        List<Document> documents = products.stream().map(p -> {
            String content = String.format(
                "Laptop: %s. Hãng: %s. Giá: %.0f VNĐ. Nhu cầu: %s. " +
                "Mô tả: %s. " +
                "Màn hình: %s, %s. Pin: %s. Nặng: %s.",
                p.getName(), 
                p.getBrand() != null ? p.getBrand().getName() : "N/A", 
                p.getPrice(),
                p.getUsagePurpose() != null ? p.getUsagePurpose().getName() : "Đa dụng",
                p.getDescription(),
                p.getSpecification() != null ? p.getSpecification().getResolution() : "",
                p.getSpecification() != null ? p.getSpecification().getPanelType() : "",
                p.getSpecification() != null ? p.getSpecification().getBattery() : "",
                p.getSpecification() != null ? p.getSpecification().getWeight() : ""
            );

            // Lưu kèm ID và Ảnh để sau này FE có thể dùng
            Map<String, Object> metadata = Map.of(
                "productId", p.getId() != null ? p.getId() : 0L,
                "imageUrl", p.getImages() != null && !p.getImages().isEmpty() ? p.getImages().get(0).getUrlImage() : ""
            );

            return new Document(content, metadata);
        }).collect(Collectors.toList());

        // Đưa vào RAM và lưu ra file cục bộ
        vectorStore.add(documents);
        if (vectorStore instanceof SimpleVectorStore simpleStore) {
            simpleStore.save(new File(vectorStorePath));
        }
        System.out.println("✅ Đã đồng bộ " + documents.size() + " sản phẩm vào Vector Store.");
    }
}