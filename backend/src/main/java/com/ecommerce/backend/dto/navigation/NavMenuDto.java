    package com.ecommerce.backend.dto.navigation;

    import com.fasterxml.jackson.annotation.JsonInclude;
    import lombok.AllArgsConstructor;
    import lombok.Data;
    import lombok.NoArgsConstructor;
    import java.util.List;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonInclude(JsonInclude.Include.NON_NULL) // Bỏ qua field 'child' nếu nó là null
    public class NavMenuDto {
        private String name;
        private String path;
        private List<?> child; // Có thể là List<NavColumnDto> hoặc List<NavItemDto>
    }