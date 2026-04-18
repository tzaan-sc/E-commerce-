// package com.ecommerce.backend.controller.AI;
//
// import com.ecommerce.backend.service.AI.AiDataService;
// import org.springframework.ai.chat.client.ChatClient;
// import org.springframework.ai.document.Document;
// import org.springframework.ai.vectorstore.SearchRequest;
// import org.springframework.ai.vectorstore.VectorStore;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.*;

// import java.util.List;
// import java.util.Map;
// import java.util.stream.Collectors;

// @RestController
// @RequestMapping("/api/ai")
// @CrossOrigin("*")
// public class AiChatController {

//     private final ChatClient chatClient;
//     private final VectorStore vectorStore;
//     private final AiDataService aiDataService;

//     // Sử dụng ChatClient.Builder theo chuẩn Spring AI 1.0.0
//     public AiChatController(ChatClient.Builder chatClientBuilder, VectorStore vectorStore, AiDataService aiDataService) {
//         this.chatClient = chatClientBuilder.build();
//         this.vectorStore = vectorStore;
//         this.aiDataService = aiDataService;
//     }

//     // API 1: Người dùng chat
//     @PostMapping("/chat")
//     public ResponseEntity<?> chat(@RequestBody Map<String, String> payload) {
//         String userMessage = payload.get("message");

//         // Tìm 3 sản phẩm sát với nhu cầu nhất
//         List<Document> similarDocs = vectorStore.similaritySearch(
//             SearchRequest.query(userMessage).withTopK(3)
//         );

//         String contextData = similarDocs.stream()
//                 .map(Document::getContent)
//                 .collect(Collectors.joining("\n---\n"));

//         String systemPrompt = "Bạn là tư vấn viên bán laptop chuyên nghiệp của cửa hàng. " +
//                 "Chỉ dựa vào thông tin sản phẩm dưới đây để tư vấn. Nếu khách hỏi ngoài lề hoặc hỏi máy không có trong danh sách, hãy từ chối khéo léo.\n" +
//                 "Danh sách máy phù hợp:\n" + contextData;

//         String aiReply = chatClient.prompt()
//                 .system(systemPrompt)
//                 .user(userMessage)
//                 .call()
//                 .content();

//         return ResponseEntity.ok(Map.of("reply", aiReply));
//     }

//     // API 2: Admin bấm đồng bộ dữ liệu bằng tay
//     @PostMapping("/sync")
//     public ResponseEntity<?> syncData() {
//         aiDataService.syncDataToVectorStore();
//         return ResponseEntity.ok("Đồng bộ dữ liệu thành công!");
//     }
// }