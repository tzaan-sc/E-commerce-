package com.ecommerce.backend.exception;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // 1. CÁI CŨ CỦA BẠN: Bắt lỗi RuntimeException (là lỗi bạn tự ném ra bằng code)
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Object> handleRuntimeException(RuntimeException ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("status", HttpStatus.BAD_REQUEST.value());
        body.put("error", "Bad Request");
        body.put("message", ex.getMessage());

        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }

    // 2. MỚI: Bắt lỗi Database (thiếu cột, trùng lặp dữ liệu, data quá dài...)
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Object> handleDatabaseExceptions(DataIntegrityViolationException ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("status", HttpStatus.BAD_REQUEST.value());
        body.put("error", "Database Error");

        // Rút trích câu chửi gốc của MySQL để dễ đọc hơn
        String rootCause = ex.getMostSpecificCause() != null ? ex.getMostSpecificCause().getMessage() : ex.getMessage();
        body.put("message", "Lỗi Database: " + rootCause);

        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }

    // 3. MỚI: Bắt lỗi gửi sai định dạng JSON (VD: gửi ngày tháng bị thiếu giây...)
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<Object> handleJsonExceptions(HttpMessageNotReadableException ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("status", HttpStatus.BAD_REQUEST.value());
        body.put("error", "JSON Parse Error");

        String rootCause = ex.getMostSpecificCause() != null ? ex.getMostSpecificCause().getMessage() : "Dữ liệu gửi lên không đúng định dạng";
        body.put("message", "Lỗi dữ liệu gửi lên: " + rootCause);

        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }

    // 4. MỚI: Bắt tất cả các lỗi ngầm định khác (để không bị lỗi 500 sập server)
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> handleAllOtherExceptions(Exception ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value());
        body.put("error", "Internal Server Error");
        body.put("message", "Lỗi hệ thống: " + ex.getMessage());

        return new ResponseEntity<>(body, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}