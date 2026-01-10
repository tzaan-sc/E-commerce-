package com.ecommerce.backend.service.inventory.impl;

import com.ecommerce.backend.dto.inventory.ImportPreviewDTO;
import com.ecommerce.backend.dto.inventory.ImportRequestDTO;
import com.ecommerce.backend.entity.inventory.ImportReceipt;
import com.ecommerce.backend.entity.inventory.ImportReceiptDetail;
import com.ecommerce.backend.entity.inventory.InventoryTransaction;
import com.ecommerce.backend.entity.product.Product;
import com.ecommerce.backend.entity.product.ProductSpecification;
import com.ecommerce.backend.entity.product.ProductVariant;
import com.ecommerce.backend.enums.TransactionType;
import com.ecommerce.backend.repository.inventory.ImportReceiptDetailRepository;
import com.ecommerce.backend.repository.inventory.ImportReceiptRepository;
import com.ecommerce.backend.repository.inventory.InventoryTransactionRepository;
import com.ecommerce.backend.repository.product.ProductVariantRepository;
import com.ecommerce.backend.service.inventory.InventoryService;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InventoryServiceImpl implements InventoryService {

    private final ImportReceiptRepository receiptRepo;
    private final ImportReceiptDetailRepository detailRepo;
    private final ProductVariantRepository variantRepo;
    private final InventoryTransactionRepository transactionRepo;

    @Override
    @Transactional
    public void importGoods(ImportRequestDTO request) {
        // 1. Tạo và lưu phiếu nhập (ImportReceipt)
        ImportReceipt receipt = new ImportReceipt();
        receipt.setSupplierName(request.getSupplierName() != null ? request.getSupplierName() : "N/A");

        // Đảm bảo ghi chú của phiếu nhập không null
        String requestNote = (request.getNote() != null && !request.getNote().trim().isEmpty())
                ? request.getNote().trim()
                : "Nhập hàng thủ công";
        receipt.setNote(requestNote);
        receipt.setTotalAmount(0.0);

        // Lưu trước để lấy ID dùng cho reference
        receipt = receiptRepo.save(receipt);

        double totalAmount = 0;

        // 2. Duyệt danh sách mặt hàng nhập
        for (ImportRequestDTO.ImportItemDTO item : request.getItems()) {
            if (item.getVariantId() == null || item.getQuantity() == null || item.getImportPrice() == null) {
                throw new RuntimeException("Dữ liệu mặt hàng nhập không hợp lệ (Thiếu ID, SL hoặc Giá).");
            }

            ProductVariant variant = variantRepo.findById(item.getVariantId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy SKU ID: " + item.getVariantId()));

            // --- ĐỒNG BỘ GIÁ NHẬP VÀO VARIANT ---
            variant.setImportPrice(item.getImportPrice());
            variantRepo.save(variant);

            // 3. Lưu chi tiết phiếu nhập (ImportReceiptDetail)
            ImportReceiptDetail detail = new ImportReceiptDetail();
            detail.setReceipt(receipt);
            detail.setVariant(variant);
            detail.setQuantity(item.getQuantity());
            detail.setImportPrice(item.getImportPrice());
            detailRepo.save(detail);

            // 4. Cập nhật kho và ghi log vào InventoryTransaction
            // Tạo ghi chú chi tiết để hiển thị trong "Thẻ kho"
            String transactionNote = String.format("%s (Phiếu #%d)", requestNote, receipt.getId());

            updateStock(
                    variant,
                    item.getQuantity(),
                    TransactionType.IMPORT,
                    receipt.getId(),
                    transactionNote // Truyền ghi chú đã xử lý vào đây
            );

            totalAmount += (item.getQuantity() * item.getImportPrice());
        }

        // 5. Cập nhật lại tổng tiền cho phiếu nhập
        receipt.setTotalAmount(totalAmount);
        receiptRepo.save(receipt);
    }

    @Override
    @Transactional
    public void adjustStock(Long variantId, int actualQuantity, String reason) {
        ProductVariant variant = variantRepo.findById(variantId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy biến thể ID: " + variantId));

        int currentStock = variant.getStockQuantity() == null ? 0 : variant.getStockQuantity();
        int diff = actualQuantity - currentStock;

        if (diff == 0) return;

        TransactionType type = diff > 0 ? TransactionType.ADJUSTMENT_UP : TransactionType.ADJUSTMENT_DOWN;

        updateStock(
                variant,
                diff,
                type,
                null,
                "Kiểm kê: " + reason + " (Hệ thống: " + currentStock + ", Thực tế: " + actualQuantity + ")"
        );
    }

    @Override
    public List<InventoryTransaction> getHistory(Long variantId) {
        return transactionRepo.findByVariantIdOrderByCreatedAtDesc(variantId);
    }

    @Override
    public List<ImportPreviewDTO> validateImportFile(MultipartFile file) {
        List<ImportPreviewDTO> results = new ArrayList<>();
        try (InputStream is = file.getInputStream()) {
            Workbook workbook = new XSSFWorkbook(is);
            Sheet sheet = workbook.getSheetAt(0);

            for (Row row : sheet) {
                if (row.getRowNum() == 0) continue;

                Cell skuCell = row.getCell(0);
                Cell qtyCell = row.getCell(1);

                String sku = (skuCell != null) ? skuCell.getStringCellValue().trim() : "";
                int qty = (qtyCell != null && qtyCell.getCellType() == CellType.NUMERIC)
                        ? (int) qtyCell.getNumericCellValue() : 0;

                Optional<ProductVariant> variantOpt = variantRepo.findBySku(sku);

                boolean isValid = variantOpt.isPresent() && qty > 0;
                String error = !variantOpt.isPresent() ? "SKU không tồn tại" : (qty <= 0 ? "SL phải > 0" : "");

                results.add(ImportPreviewDTO.builder()
                        .sku(sku)
                        .productName(variantOpt.map(v -> v.getProduct().getName()).orElse("N/A"))
                        .quantity(qty)
                        .isValid(isValid)
                        .error(error)
                        .build());
            }
        } catch (Exception e) {
            throw new RuntimeException("Lỗi định dạng file Excel: " + e.getMessage());
        }
        return results;
    }

    @Override
    public byte[] exportInventorySummary() {
        return this.exportInventoryReport();
    }

    @Override
    public byte[] exportStockCard(Long variantId) {
        return generateStockCardWorkbook(List.of(variantId));
    }

    @Override
    public byte[] exportAllStockCards() {
        List<Long> allIds = variantRepo.findAll().stream()
                .map(ProductVariant::getId)
                .collect(Collectors.toList());
        return generateStockCardWorkbook(allIds);
    }

    @Override
    public byte[] exportInventoryReport() {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Báo Cáo Tồn Kho Laptop");

            createCommonHeader(sheet, workbook, "Báo cáo: Tồn kho laptop chi tiết");

            String[] columns = {
                    "Mã Laptop", "Tên Laptop", "Thương hiệu", "CPU", "VGA", "Màn hình",
                    "Mã Biến thể", "RAM", "Ổ cứng", "Màu sắc",
                    "Tồn đầu", "Nhập", "Xuất", "Tồn hiện tại", "Trạng thái",
                    "Giá nhập", "Giá bán", "Giá trị tồn",
                    "Vị trí kho", "Bảo hành", "Ghi chú"
            };

            Row headerRow = sheet.createRow(5);
            CellStyle headerStyle = createHeaderStyle(workbook);
            for (int i = 0; i < columns.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(columns[i]);
                cell.setCellStyle(headerStyle);
            }

            DataFormat format = workbook.createDataFormat();
            CellStyle currencyStyle = workbook.createCellStyle();
            currencyStyle.setDataFormat(format.getFormat("#,##0"));

            List<ProductVariant> variants = variantRepo.findAll();
            int rowIdx = 6;
            int totalQty = 0;
            double totalValue = 0;

            for (ProductVariant v : variants) {
                Row row = sheet.createRow(rowIdx++);
                Product p = v.getProduct();
                ProductSpecification spec = (p != null) ? p.getSpecification() : null;

                int nhap = transactionRepo.sumQtyByType(v.getId(), TransactionType.IMPORT);
                int xuat = transactionRepo.sumQtyByType(v.getId(), TransactionType.SALE);
                int tonHienTai = v.getStockQuantity() != null ? v.getStockQuantity() : 0;
                int tonDau = tonHienTai - nhap + xuat;

                row.createCell(0).setCellValue(p != null ? p.getId() : 0);
                row.createCell(1).setCellValue(p != null ? p.getName() : "N/A");
                row.createCell(2).setCellValue((p != null && p.getBrand() != null) ? p.getBrand().getName() : "N/A");
                row.createCell(3).setCellValue(spec != null ? spec.getCpu() : "N/A");
                row.createCell(4).setCellValue(spec != null ? spec.getVga() : "N/A");
                row.createCell(5).setCellValue(spec != null ? spec.getScreenDetail() : "N/A");
                row.createCell(6).setCellValue(v.getSku());
                row.createCell(7).setCellValue(v.getRamCapacity());
                row.createCell(8).setCellValue(v.getStorageCapacity());
                row.createCell(9).setCellValue(v.getColor());

                row.createCell(10).setCellValue(tonDau);
                row.createCell(11).setCellValue(nhap);
                row.createCell(12).setCellValue(xuat);
                row.createCell(13).setCellValue(tonHienTai);

                Cell statusCell = row.createCell(14);
                statusCell.setCellValue(determineStatus(tonHienTai));
                statusCell.setCellStyle(getStatusStyle(workbook, tonHienTai));

                double importPrice = (v.getImportPrice() != null) ? v.getImportPrice() : 0;
                double sellPrice = (v.getPrice() != null) ? v.getPrice() : 0;
                double invValue = tonHienTai * importPrice;

                Cell cellImportPrice = row.createCell(15);
                cellImportPrice.setCellValue(importPrice);
                cellImportPrice.setCellStyle(currencyStyle);

                Cell cellSellPrice = row.createCell(16);
                cellSellPrice.setCellValue(sellPrice);
                cellSellPrice.setCellStyle(currencyStyle);

                Cell cellInvValue = row.createCell(17);
                cellInvValue.setCellValue(invValue);
                cellInvValue.setCellStyle(currencyStyle);

                row.createCell(18).setCellValue("Kho chính");
                row.createCell(19).setCellValue("12 Tháng");

                // --- PHẦN SỬA LỖI GHI CHÚ ---
                // Tìm lịch sử giao dịch gần nhất để lấy ghi chú thực tế khi nhập hàng
                List<InventoryTransaction> history = transactionRepo.findByVariantIdOrderByCreatedAtDesc(v.getId());
                String latestNote = "-";
                if (history != null && !history.isEmpty()) {
                    // Lấy ghi chú của lần giao dịch gần nhất (như "ok1", "thu" bạn nhập)
                    latestNote = history.get(0).getNote();
                }
                // Nếu giao dịch không có ghi chú, lấy tạm note của variant, nếu vẫn null thì để "-"
                row.createCell(20).setCellValue((latestNote != null && !latestNote.isEmpty()) ? latestNote : (v.getNote() != null ? v.getNote() : "-"));
                // ----------------------------

                totalQty += tonHienTai;
                totalValue += invValue;
            }

            int summaryRowIdx = rowIdx + 1;
            Row sumRow = sheet.createRow(summaryRowIdx);
            sumRow.createCell(0).setCellValue("TỔNG CỘNG:");

            Cell cellTotalQty = sumRow.createCell(13);
            cellTotalQty.setCellValue(totalQty);

            Cell cellTotalValue = sumRow.createCell(17);
            cellTotalValue.setCellValue(totalValue);
            cellTotalValue.setCellStyle(currencyStyle);

            for (int i = 0; i < columns.length; i++) sheet.autoSizeColumn(i);
            workbook.write(out);
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Lỗi xuất file báo cáo: " + e.getMessage());
        }
    }

    private byte[] generateStockCardWorkbook(List<Long> variantIds) {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            for (Long id : variantIds) {
                ProductVariant v = variantRepo.findById(id).orElse(null);
                if (v == null) continue;

                String safeName = v.getSku().replaceAll("[^a-zA-Z0-9]", "");
                if (safeName.length() > 25) safeName = safeName.substring(0, 25) + id;

                Sheet sheet = workbook.createSheet(safeName);

                Row header = sheet.createRow(0);
                header.createCell(0).setCellValue("THẺ KHO CHI TIẾT SKU: " + v.getSku());

                String[] cols = {"Ngày", "Loại giao dịch", "Diễn giải", "Nhập (+)", "Xuất (-)", "Tồn cuối"};
                Row hRow = sheet.createRow(2);
                CellStyle style = createHeaderStyle(workbook);
                for(int i=0; i<cols.length; i++) {
                    Cell cell = hRow.createCell(i);
                    cell.setCellValue(cols[i]);
                    cell.setCellStyle(style);
                }

                List<InventoryTransaction> logs = transactionRepo.findByVariantIdOrderByCreatedAtAsc(v.getId());
                int rIdx = 3;
                for (InventoryTransaction log : logs) {
                    Row r = sheet.createRow(rIdx++);
                    r.createCell(0).setCellValue(log.getCreatedAt().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")));
                    r.createCell(1).setCellValue(log.getType().name());
                    r.createCell(2).setCellValue(log.getNote());
                    if(log.getQuantityChange() > 0) {
                        r.createCell(3).setCellValue(log.getQuantityChange());
                        r.createCell(4).setCellValue(0);
                    } else {
                        r.createCell(3).setCellValue(0);
                        r.createCell(4).setCellValue(Math.abs(log.getQuantityChange()));
                    }
                    r.createCell(5).setCellValue(log.getBalanceAfter());
                }
                for (int i = 0; i < cols.length; i++) sheet.autoSizeColumn(i);
            }
            workbook.write(out);
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Lỗi xuất thẻ kho: " + e.getMessage());
        }
    }

    private void createCommonHeader(Sheet sheet, Workbook wb, String title) {
        Row row0 = sheet.createRow(0);
        row0.createCell(0).setCellValue("HỆ THỐNG QUẢN LÝ KHO");
        Row row1 = sheet.createRow(1);
        row1.createCell(0).setCellValue(title);
        Row row2 = sheet.createRow(2);
        row2.createCell(0).setCellValue("Ngày xuất: " + LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")));
    }

    private CellStyle createHeaderStyle(Workbook wb) {
        CellStyle style = wb.createCellStyle();
        Font font = wb.createFont();
        font.setBold(true);
        style.setFont(font);
        style.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
        style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        style.setBorderBottom(BorderStyle.THIN);
        return style;
    }

    private String determineStatus(int stock) {
        if (stock <= 0) return "HẾT HÀNG";
        if (stock < 5) return "SẮP HẾT";
        return "CÒN HÀNG";
    }

    private CellStyle getStatusStyle(Workbook wb, int stock) {
        CellStyle style = wb.createCellStyle();
        Font font = wb.createFont();
        font.setBold(true);
        if (stock <= 0) font.setColor(IndexedColors.RED.getIndex());
        else if (stock < 5) font.setColor(IndexedColors.ORANGE.getIndex());
        else font.setColor(IndexedColors.GREEN.getIndex());
        style.setFont(font);
        return style;
    }

    private void updateStock(ProductVariant variant, int qtyChange, TransactionType type, Long refId, String note) {
        try {
            // 1. VÌ qtyChange là kiểu 'int', nó KHÔNG THỂ null.
            // Không cần (và không được) check 'qtyChange == null'.
            int change = qtyChange;

            // 2. variant.getStockQuantity() trả về Integer (Object), có thể null nếu DB trống
            // Ép về 0 nếu null để tính toán an toàn
            int oldStock = (variant.getStockQuantity() == null) ? 0 : variant.getStockQuantity();

            // 3. Tính toán tồn kho mới
            int newStock = oldStock + change;

            // 4. Kiểm tra tồn kho âm
            if (newStock < 0) {
                throw new RuntimeException("Lỗi kho: SKU [" + variant.getSku() + "] không đủ tồn kho (Hiện có: " + oldStock + ").");
            }

            // 5. Cập nhật vào đối tượng Variant
            variant.setStockQuantity(newStock);
            variantRepo.saveAndFlush(variant);

            // 6. Ghi log giao dịch kho
            InventoryTransaction trans = new InventoryTransaction();
            trans.setVariant(variant);
            trans.setType(type);
            trans.setQuantityChange(change); // Ghi nhận biến động (âm hoặc dương)
            trans.setBalanceAfter(newStock); // Ghi nhận số dư sau giao dịch
            trans.setReferenceId(refId);
            trans.setNote(note);
            trans.setCreatedBy("Admin System");

            transactionRepo.saveAndFlush(trans);

        } catch (Exception e) {
            System.err.println("LỖI GIAO DỊCH KHO: " + e.getMessage());
            throw new RuntimeException("Không thể cập nhật kho: " + e.getMessage());
        }
    }
    }