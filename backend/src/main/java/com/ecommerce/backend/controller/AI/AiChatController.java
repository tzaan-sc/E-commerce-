package com.ecommerce.backend.controller.AI;

import com.ecommerce.backend.service.AI.AiDataService;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.chat.prompt.SystemPromptTemplate;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin("*")
public class AiChatController {

    private final ChatModel chatModel;
    private final VectorStore vectorStore;
    private final AiDataService aiDataService;

    public AiChatController(ChatModel chatModel, VectorStore vectorStore, AiDataService aiDataService) {
        this.chatModel = chatModel;
        this.vectorStore = vectorStore;
        this.aiDataService = aiDataService;
    }

    @PostMapping("/chat")
    public ResponseEntity<?> chat(@RequestBody Map<String, String> payload) {
        String userMessage = payload.get("message");

        // Tìm 3 sản phẩm sát với nhu cầu nhất
        List<Document> similarDocs = vectorStore.similaritySearch(
            SearchRequest.query(userMessage).withTopK(3)
        );

        String contextData = similarDocs.stream()
                .map(Document::getContent)
                .collect(Collectors.joining("\n---\n"));

        String finalPrompt = "Bạn là tư vấn viên bán laptop chuyên nghiệp của cửa hàng. " +
                "Chỉ dựa vào thông tin sản phẩm dưới đây để tư vấn. Nếu khách hỏi ngoài lề hoặc hỏi máy không có trong danh sách, hãy trả lời một cách lịch sự rằng bạn chỉ có thể tư vấn các sản phẩm trong cửa hàng.\n" +
                "Danh sách máy phù hợp:\n" + contextData + "\n\nNgười dùng hỏi: " + userMessage;

        String aiReply = chatModel.call(finalPrompt);

        return ResponseEntity.ok(Map.of("reply", aiReply));
    }

    @PostMapping("/sync")
    public ResponseEntity<?> syncData() {
        aiDataService.syncDataToVectorStore();
        return ResponseEntity.ok("Đồng bộ dữ liệu thành công!");
    }
}