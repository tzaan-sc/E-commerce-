// package com.ecommerce.backend.config;

// import org.springframework.ai.embedding.EmbeddingModel;
// import org.springframework.ai.vectorstore.SimpleVectorStore;
// import org.springframework.ai.vectorstore.VectorStore;
// import org.springframework.beans.factory.annotation.Value;
// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;

// import java.io.File;

// @Configuration
// public class AiConfig {

//     @Value("${app.ai.vector-store-path}")
//     private String vectorStorePath;

//     @Bean
//     public VectorStore vectorStore(EmbeddingModel embeddingModel) {
//         SimpleVectorStore vectorStore = new SimpleVectorStore(embeddingModel);
//         File file = new File(vectorStorePath);
//         // Nếu file đã tồn tại (đã từng chạy đồng bộ), thì load lên RAM
//         if (file.exists()) {
//             vectorStore.load(file);
//         }
//         return vectorStore;
//     }
// }