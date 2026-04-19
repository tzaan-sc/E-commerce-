// src/pages/admin/ordersPage/utils/constants.js

export const STATUS_STEPS = [
  { value: "PENDING",    label: "Chờ xác nhận", step: 0 },
  { value: "CONFIRMED",  label: "Đã xác nhận", step: 1 },
  { value: "PROCESSING", label: "Đang xử lý",   step: 2 },
  { value: "SHIPPING",   label: "Đang giao",    step: 3 },
  { value: "DELIVERED",  label: "Đã giao",      step: 4 },
  { value: "COMPLETED",  label: "Hoàn thành",   step: 5 },
  { value: "CANCELLED",  label: "Đã hủy",       step: 6 },
];

// ─── Locked statuses: trạng thái cuối, admin không được chỉnh nữa ──────────
const LOCKED_STATUSES = ["COMPLETED", "CANCELLED", "DELIVERED"];

export const isOptionDisabled = (optionValue, currentStatus) => {
  if (LOCKED_STATUSES.includes(currentStatus)) {
    return true;
  }

  // Admin không được chọn COMPLETED — chỉ user xác nhận nhận hàng mới được
  if (optionValue === "COMPLETED") {
    return true;
  }
   if (optionValue === "DELIVERED") {
    return true;
  }

  const currentStepObj = STATUS_STEPS.find((s) => s.value === currentStatus);
  const optionStepObj  = STATUS_STEPS.find((s) => s.value === optionValue);

  if (!currentStepObj || !optionStepObj) return false;

  // Cho phép CANCELLED khi đơn chưa vào LOCKED_STATUSES 
  if (optionValue === "CANCELLED") return false;

  // Không cho phép lùi trạng thái
  return optionStepObj.step < currentStepObj.step;
};

// ─── Các helper không thay đổi ───────────────────────────────────────────────
export const formatOrderId = (id) => {
  if (!id) return "#N/A";
  return `#ORD${String(id).padStart(3, "0")}`;
};

export const translateStatus = (status) => {
  if (!status) return "Không rõ";
  const map = {
    PENDING:    "Chờ xác nhận",
    CONFIRMED:  "Đã xác nhận",
    PROCESSING: "Đang xử lý",
    SHIPPING:   "Đang giao",
    DELIVERED:  "Đã giao",
    COMPLETED:  "Hoàn thành",
    CANCELLED:  "Đã hủy",
  };
  return map[status.toUpperCase()] || status;
};

export const getStatusClass = (status) => {
  if (!status) return "secondary";
  const statusMap = {
    COMPLETED:  "success",
    CONFIRMED:  "primary",
    DELIVERED:  "info",
    SHIPPING:   "info",
    PROCESSING: "primary",
    PENDING:    "warning",
    CANCELLED:  "danger",
  };
  return `badge--${statusMap[status.toUpperCase()] || "secondary"}`;
};

export const PAYMENT_STATUS_STEPS = [
  { value: "UNPAID",   label: "Chưa thanh toán" },
  { value: "PAID",     label: "Đã thanh toán"   },
  { value: "REFUNDED", label: "Đã hoàn tiền"    },
];

export const translatePaymentStatus = (status) => {
  if (!status) return "Không rõ";
  const map = {
    UNPAID:   "Chưa thanh toán",
    PAID:     "Đã thanh toán",
    REFUNDED: "Đã hoàn tiền",
  };
  return map[status.toUpperCase()] || status;
};

export const getPaymentStatusClass = (status) => {
  if (!status) return "badge--secondary";
  const map = {
    UNPAID:   "badge--warning",
    PAID:     "badge--success",
    REFUNDED: "badge--info",
  };
  return map[status.toUpperCase()] || "badge--secondary";
};

// Khóa hoàn toàn: Admin không được thao tác cập nhật thanh toán
export const isPaymentOptionDisabled = () => {
  return true; 
};

export const translatePaymentMethod = (method) => {
  if (!method) return "Không rõ";
  const map = {
    COD:      "COD",
    ONLINE:   "ONLINE",
  };
  return map[method.toUpperCase()] || method;
};