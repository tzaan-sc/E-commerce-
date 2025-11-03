package com.ecommerce.backend.service.product;

import com.ecommerce.backend.entity.product.UsagePurpose;
import com.ecommerce.backend.dto.product.UsagePurpose.CreateUsagePurposeRequest;
import com.ecommerce.backend.dto.product.UsagePurpose.UpdateUsagePurposeRequest;

import java.util.List;

public interface UsagePurposeService {

    UsagePurpose createUsagePurpose(CreateUsagePurposeRequest request);

    UsagePurpose updateUsagePurpose(Long id, UpdateUsagePurposeRequest request);

    void deleteUsagePurpose(Long id);

    List<UsagePurpose> getAllUsagePurposes();

    UsagePurpose getUsagePurposeById(Long id);
}
