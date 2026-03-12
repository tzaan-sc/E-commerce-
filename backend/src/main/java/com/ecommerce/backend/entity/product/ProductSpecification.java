package com.ecommerce.backend.entity.product;

import jakarta.persistence.Embeddable;
import lombok.Data;

@Embeddable
@Data
public class ProductSpecification {
    // Độ phân giải (VD: 1920x1080)
    private String resolution;

    // Tần số quét (VD: 144Hz)
    private String refreshRate;

    // Loại tấm nền (VD: IPS, OLED)
    private String panelType;

    // Dung lượng pin (VD: 90Wh)
    private String battery;

    // Trọng lượng (VD: 2.3kg)
    private String weight;

    // Hệ điều hành (VD: Windows 11)
    private String os;

    // Các kết nối không dây
    private String wifi;
    private String bluetooth;

    // Cổng kết nối (Lưu chuỗi dài các cổng)
    private String ports;
}