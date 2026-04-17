package com.ecommerce.backend.service.payment;

import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.services.sheets.v4.Sheets;
import com.google.api.services.sheets.v4.SheetsScopes;
import com.google.api.services.sheets.v4.model.ValueRange;
import com.google.auth.http.HttpCredentialsAdapter;
import com.google.auth.oauth2.GoogleCredentials;
import com.ecommerce.backend.entity.product.Order;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

/**
 * Service đọc/ghi Google Sheets để xác minh trạng thái thanh toán.
 *
 * Sheet format (row 1 = header):
 *   orderId | userId | amount | status | bankContent | createdAt
 */
@Service
@Slf4j
public class GoogleSheetService {

    private static final String APPLICATION_NAME = "EcommercePayment";
    private static final GsonFactory JSON_FACTORY = GsonFactory.getDefaultInstance();

    @Value("${google.sheets.spreadsheet-id}")
    private String spreadsheetId;

    @Value("${google.sheets.sheet-name}")
    private String sheetName;

    @Value("${google.sheets.credentials-file}")
    private String credentialsFile;

    private Sheets sheetsService;

    @PostConstruct
    public void init() {
        try (InputStream credStream =
                     getClass().getClassLoader().getResourceAsStream(credentialsFile)) {

            if (credStream == null) {
                log.error("[GoogleSheet] Credentials file NOT FOUND in classpath: '{}'", credentialsFile);
                log.error("[GoogleSheet] Make sure '{}' is inside src/main/resources/", credentialsFile);
                // Log warning instead of throw so app still starts
                return;
            }

            GoogleCredentials credentials = GoogleCredentials
                    .fromStream(credStream)
                    .createScoped(Collections.singleton(SheetsScopes.SPREADSHEETS));

            sheetsService = new Sheets.Builder(
                    GoogleNetHttpTransport.newTrustedTransport(),
                    JSON_FACTORY,
                    new HttpCredentialsAdapter(credentials)
            ).setApplicationName(APPLICATION_NAME).build();

            log.info("[GoogleSheet] Initialized successfully. spreadsheetId={}, sheet={}", spreadsheetId, sheetName);

        } catch (Exception e) {
            log.error("[GoogleSheet] Init FAILED: {}", e.getMessage(), e);
            // Don't throw – let app start; writing will fail gracefully
        }
    }

    // ================= CREATE ORDER =================
    public void appendOrder(Order order) throws IOException {
        log.info("[GoogleSheet] appendOrder called for orderId={}", order.getId());
        ensureReady();

        if (orderExists(order.getId())) {
            log.info("[GoogleSheet] orderId={} already exists in sheet – skip", order.getId());
            return;
        }

        List<Object> row = List.of(
                String.valueOf(order.getId()),
                String.valueOf(order.getUser().getId()),
                String.valueOf(order.getTotalAmount()),
                "PENDING",
                "ORDER_" + order.getId(),
                LocalDateTime.now().toString()
        );

        log.info("[GoogleSheet] Writing row to sheet: {}", row);
        sheetsService.spreadsheets().values()
                .append(spreadsheetId, sheetName + "!A:F",
                        new ValueRange().setValues(List.of(row)))
                .setValueInputOption("RAW")
                .execute();
        log.info("[GoogleSheet] Row written successfully for orderId={}", order.getId());
    }

    // ================= CHECK PAID =================
    public boolean isOrderPaid(Long orderId, Double amount) throws IOException {
        ensureReady();

        List<List<Object>> rows = fetchRows();
        for (List<Object> row : rows) {

            if (row.size() < 4) continue;

            Long id = parseLong(row.get(0));
            Double amt = parseDouble(row.get(2));
            String status = row.get(3).toString();

            if (id != null
                    && id.equals(orderId)
                    && Math.abs(amt - amount) < 0.01
                    && "PAID".equalsIgnoreCase(status)) {
                return true;
            }
        }
        return false;
    }

    // ================= MARK PAID =================
    public void markOrderAsPaid(Long orderId) throws IOException {
        ensureReady();

        List<List<Object>> rows = fetchRows();

        for (int i = 0; i < rows.size(); i++) {

            List<Object> row = rows.get(i);
            if (row.size() < 4) continue;

            Long id = parseLong(row.get(0));
            String status = row.get(3).toString();

            if (id != null && id.equals(orderId) && "PENDING".equalsIgnoreCase(status)) {

                String range = sheetName + "!D" + (i + 2); // +2 vì header

                sheetsService.spreadsheets().values()
                        .update(spreadsheetId, range,
                                new ValueRange().setValues(List.of(List.of("PAID"))))
                        .setValueInputOption("RAW")
                        .execute();

                return;
            }
        }
    }

    // ================= HELPERS =================

    private boolean orderExists(Long orderId) throws IOException {
        List<List<Object>> rows = fetchRows();
        for (List<Object> row : rows) {
            if (!row.isEmpty() && orderId.equals(parseLong(row.get(0)))) {
                return true;
            }
        }
        return false;
    }

    private List<List<Object>> fetchRows() throws IOException {
        ValueRange res = sheetsService.spreadsheets().values()
                .get(spreadsheetId, sheetName + "!A2:F")
                .execute();
        return res.getValues() != null ? res.getValues() : List.of();
    }

    private void ensureReady() {
        if (sheetsService == null) {
            log.error("[GoogleSheet] sheetsService is NULL – service was not initialized properly!");
            throw new IllegalStateException("GoogleSheetService not initialized. Check startup logs for errors.");
        }
    }

    private Long parseLong(Object o) {
        try { return Long.parseLong(o.toString()); }
        catch (Exception e) { return null; }
    }

    private Double parseDouble(Object o) {
        try { return Double.parseDouble(o.toString()); }
        catch (Exception e) { return 0.0; }
    }
}