package com.ecommerce.backend.service.product;

import com.ecommerce.backend.dto.product.screensize.CreateScreenSizeRequest;
import com.ecommerce.backend.entity.product.ScreenSize;
import com.ecommerce.backend.dto.product.screensize.UpdateScreenSizeRequest;
import java.util.List;

public interface ScreenSizeService {
    ScreenSize createScreenSize(CreateScreenSizeRequest request);
    ScreenSize updateScreenSize(UpdateScreenSizeRequest request);
    void deleteScreenSize(Long sizeId);
    List<ScreenSize> getAllScreenSizes();
    ScreenSize getScreenSizeById(Long sizeId);
}