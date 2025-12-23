package com.ecommerce.backend.service.navigation;

import com.ecommerce.backend.dto.navigation.NavColumnDto;
import com.ecommerce.backend.dto.navigation.NavItemDto;
import com.ecommerce.backend.dto.navigation.NavMenuDto;
import com.ecommerce.backend.entity.product.Brand;
import com.ecommerce.backend.entity.product.ScreenSize;
import com.ecommerce.backend.entity.product.UsagePurpose;
import com.ecommerce.backend.service.product.BrandService;
import com.ecommerce.backend.service.product.ScreenSizeService;
import com.ecommerce.backend.service.product.UsagePurposeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class NavigationService {

    private final BrandService brandService;
    private final UsagePurposeService usagePurposeService;
    private final ScreenSizeService screenSizeService;

    /**
     * Format kích thước màn hình từ số -> tên hiển thị
     */
    private String formatScreenSizeName(Double value) {
        if (value == null) {
            return "Không xác định";
        }

        if (value < 14.0) {
            return "13-14 inch";
        } else if (value >= 14.0 && value < 16.0) {
            return "15-16 inch";
        } else if (value >= 16.0) {
            return "17 inch trở lên";
        } else {
            return value + " inch";
        }
    }

    /**
     * Mega menu Laptop
     */
    private NavMenuDto buildLaptopMenu() {
        log.info("🔧 Building Laptop Mega Menu...");

        List<Brand> brands = brandService.getAllBrands();
        List<UsagePurpose> usagePurposes = usagePurposeService.getAllUsagePurposes();
        List<ScreenSize> screenSizes = screenSizeService.getAllScreenSizes();

        List<NavItemDto> brandItems = brands.stream()
                .map(b -> new NavItemDto(b.getName(), "/laptop?brand=" + b.getId()))
                .collect(Collectors.toList());

        List<NavItemDto> usageItems = usagePurposes.stream()
                .map(u -> new NavItemDto(u.getName(), "/laptop?usage=" + u.getId()))
                .collect(Collectors.toList());

        List<NavItemDto> sizeItems = screenSizes.stream()
                .map(s -> new NavItemDto(formatScreenSizeName(s.getValue()), "/laptop?size=" + s.getId()))
                .distinct()
                .collect(Collectors.toList());

        NavColumnDto brandColumn = new NavColumnDto("Thương hiệu", brandItems);
        NavColumnDto usageColumn = new NavColumnDto("Nhu cầu sử dụng", usageItems);
        NavColumnDto sizeColumn = new NavColumnDto("Kích thước màn hình", sizeItems);

        return new NavMenuDto(
                "Laptop",
                "/laptop",
                Arrays.asList(brandColumn, usageColumn, sizeColumn)
        );
    }

    /**
     * Menu tài khoản public
     */
    private NavMenuDto buildAccountMenu() {
        List<NavItemDto> items = Arrays.asList(
                new NavItemDto("Đăng nhập", "/dang-nhap"),
                new NavItemDto("Đăng ký", "/dang-ky")
        );
        return new NavMenuDto("Tài khoản", null, items);
    }

    /**
     * Menu tài khoản customer đã đăng nhập
     */
    private NavMenuDto buildCustomerAccountMenu() {
        List<NavItemDto> items = Arrays.asList(
                new NavItemDto("Thông tin tài khoản", "/customer/thong-tin-ca-nhan"),
                new NavItemDto("Đơn mua", "/customer/don-mua"),
                new NavItemDto("Đăng xuất", "/")
        );
        return new NavMenuDto("Tài khoản", null, items);
    }

    /**
     * Menu cho khách chưa đăng nhập (public)
     */
    public List<NavMenuDto> buildMainMenu() {
        log.info("🚀 Building PUBLIC main navigation menu...");

        NavMenuDto homeMenu = new NavMenuDto("Trang chủ", "/", null);
        NavMenuDto laptopMenu = buildLaptopMenu();
        NavMenuDto accountMenu = buildAccountMenu();

        List<NavMenuDto> result = Arrays.asList(homeMenu, laptopMenu, accountMenu);

        log.info("✅ PUBLIC menu built successfully with {} items", result.size());
        return result;
    }

    /**
     * Menu cho customer đã đăng nhập
     */
    public List<NavMenuDto> buildCustomerMenu() {
        log.info("🚀 Building CUSTOMER navigation menu...");

        NavMenuDto homeMenu = new NavMenuDto("Trang chủ", "/customer/home", null);
        NavMenuDto laptopMenu = buildLaptopMenu();
        NavMenuDto accountMenu = buildCustomerAccountMenu();

        List<NavMenuDto> result = Arrays.asList(homeMenu, laptopMenu, accountMenu);

        log.info("✅ CUSTOMER menu built successfully with {} items", result.size());
        return result;
    }
}
