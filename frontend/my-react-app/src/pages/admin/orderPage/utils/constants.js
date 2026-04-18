// src/pages/admin/ordersPage/utils/constants.js

export const STATUS_STEPS = [
  { value: "PENDING",     label: "Chờ xác nhận", step: 0 },
  { value: "PROCESSING",  label: "Đang xử lý",   step: 1 },
  { value: "SHIPPING",    label: "Đang giao",     step: 2 },
  { value: "DELIVERED",   label: "Đã giao",       step: 3 },
  { value: "COMPLETED",   label: "Hoàn thành",    step: 4 },
  { value: "CANCELLED",   label: "Đã hủy",        step: 5 },
];

// ─── Locked statuses: trạng thái cuối, admin không được chỉnh nữa ──────────
const LOCKED_STATUSES = ["COMPLETED", "CANCELLED", "DELIVERED"];

export const isOptionDisabled = (optionValue, currentStatus) => {
  // Bug 1 fix: đồng bộ với isLocked trong modal — DELIVERED cũng là trạng thái khóa
  if (LOCKED_STATUSES.includes(currentStatus)) {
    return true;
  }

  // Admin không được chọn COMPLETED — chỉ user xác nhận nhận hàng mới được
  if (optionValue === "COMPLETED") {
    return true;
  }

  const currentStepObj = STATUS_STEPS.find((s) => s.value === currentStatus);
  const optionStepObj  = STATUS_STEPS.find((s) => s.value === optionValue);

  if (!currentStepObj || !optionStepObj) return false;

  // Bug 2 fix: CANCELLED chỉ cho phép khi đơn chưa vào LOCKED_STATUSES (đã xử lý ở trên)
  // Không cần early-return vô điều kiện nữa — vẫn cho phép CANCELLED khi hợp lệ
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
    PROCESSING: "Đang xử lý",
    SHIPPING:   "Đang giao",
    DELIVERED:  "Đã giao",
    COMPLETED:  "Hoàn thành",
    CANCELLED:  "Đã hủy",
    CONFIRMED:  "Đã xác nhận",
  };
  return map[status.toUpperCase()] || status;
};

export const getStatusClass = (status) => {
  if (!status) return "secondary";
  const statusMap = {
    COMPLETED:  "success",
    DELIVERED:  "info",
    SHIPPING:   "info",
    PROCESSING: "primary",
    PENDING:    "warning",
    CANCELLED:  "danger",
  };
  return `badge--${statusMap[status.toUpperCase()] || "secondary"}`;
};

// Thêm vào constants.js

export const PAYMENT_STATUS_STEPS = [
  { value: "UNPAID",    label: "Chưa thanh toán" },
  { value: "PAID",      label: "Đã thanh toán"   },
  { value: "REFUNDED",  label: "Đã hoàn tiền"    },
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

// isPaymentOptionDisabled — PAID không được lùi về UNPAID
export const isPaymentOptionDisabled = (optionValue, currentPaymentStatus) => {
  if (currentPaymentStatus === "REFUNDED") return true; // khóa khi đã hoàn tiền
  if (currentPaymentStatus === "PAID" && optionValue === "UNPAID") return true;
  return false;
};

export const translatePaymentMethod = (method) => {
  if (!method) return "Không rõ";
  const map = {
    COD:          "COD",
    ONLINE:      "ONLINE",
  };
  return map[method.toUpperCase()] || method;
};