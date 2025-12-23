package com.ecommerce.backend.controller.navigation;

import com.ecommerce.backend.dto.navigation.NavMenuDto;
import com.ecommerce.backend.service.navigation.NavigationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/navigation")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "http://localhost:3000") // ⭐ Cho phép React gọi API
public class NavigationController {

    private final NavigationService navigationService;

    /**
     * GET: /api/navigation/main
     * Lấy cấu trúc menu chính cho trang public (chưa đăng nhập)
     */
    @GetMapping("/main")
    public ResponseEntity<List<NavMenuDto>> getMainMenu() {
        log.info("📡 Received request to /api/navigation/main");
        List<NavMenuDto> menu = navigationService.buildMainMenu();
        log.info("✅ Returning {} menu items", menu.size());
        return ResponseEntity.ok(menu);
    }

    /**
     * GET: /api/navigation/customer
     * Lấy cấu trúc menu cho customer đã đăng nhập
     */
    @GetMapping("/customer")
    public ResponseEntity<List<NavMenuDto>> getCustomerMenu() {
        log.info("📡 Received request to /api/navigation/customer");
        List<NavMenuDto> menu = navigationService.buildCustomerMenu();
        log.info("✅ Returning {} customer menu items", menu.size());
        return ResponseEntity.ok(menu);
    }
}