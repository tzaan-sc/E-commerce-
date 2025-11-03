package com.ecommerce.backend.service.product.impl;

import com.ecommerce.backend.entity.product.UsagePurpose;
import com.ecommerce.backend.dto.product.UsagePurpose.CreateUsagePurposeRequest;
import com.ecommerce.backend.dto.product.UsagePurpose.UpdateUsagePurposeRequest;
import com.ecommerce.backend.repository.product.UsagePurposeRepository;
import com.ecommerce.backend.service.product.UsagePurposeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UsagePurposeServiceImpl implements UsagePurposeService {

    private final UsagePurposeRepository usagePurposeRepository;

    @Override
    public UsagePurpose createUsagePurpose(CreateUsagePurposeRequest request) {
        UsagePurpose up = new UsagePurpose();
        up.setName(request.getName());
        return usagePurposeRepository.save(up);
    }

    @Override
    public UsagePurpose updateUsagePurpose(Long id, UpdateUsagePurposeRequest request) {
        UsagePurpose up = usagePurposeRepository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "Nhu cầu sử dụng không tồn tại")
                );

        up.setName(request.getName());
        return usagePurposeRepository.save(up);
    }

    @Override
    public void deleteUsagePurpose(Long id) {
        if (!usagePurposeRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "ID không tồn tại, không thể xoá");
        }
        usagePurposeRepository.deleteById(id);
    }

    @Override
    public List<UsagePurpose> getAllUsagePurposes() {
        return usagePurposeRepository.findAll();
    }

    @Override
    public UsagePurpose getUsagePurposeById(Long id) {
        return usagePurposeRepository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "Nhu cầu sử dụng không tồn tại")
                );
    }
}
