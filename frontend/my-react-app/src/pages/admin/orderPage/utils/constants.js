// src/pages/admin/ordersPage/utils/constants.js

export const STATUS_STEPS = [
  { value: "PENDING", label: "Chờ xác nhận", step: 0 },
  { value: "PROCESSING", label: "Đang xử lý", step: 1 },
  { value: "SHIPPING", label: "Đang giao", step: 2 },
  { value: "COMPLETED", label: "Đã giao", step: 3 },
  { value: "CANCELLED", label: "Đã hủy", step: 4 },
];

export const formatOrderId = (id) => {
  if (!id) return "#N/A";
  return `#ORD${String(id).padStart(3, "0")}`;
};

export const translateStatus = (status) => {
  if (!status) return "Không rõ";
  const map = {
    PENDING: "Chờ xác nhận",
    PROCESSING: "Đang xử lý",
    SHIPPING: "Đang giao",
    COMPLETED: "Đã giao",
    CANCELLED: "Đã hủy",
    CONFIRMED: "Đã xác nhận",
  };
  return map[status.toUpperCase()] || status;
};

export const getStatusClass = (status) => {
  if (!status) return "secondary";
  const statusUpper = status.toUpperCase();
  const statusMap = {
    COMPLETED: "success",
    SHIPPING: "info",
    PROCESSING: "primary",
    PENDING: "warning",
    CANCELLED: "danger",
  };
  return `badge--${statusMap[statusUpper] || "secondary"}`;
};

export const isOptionDisabled = (optionValue, currentStatus) => {
  if (currentStatus === "COMPLETED" || currentStatus === "CANCELLED") {
    return true;
  }
  const currentStepObj = STATUS_STEPS.find((s) => s.value === currentStatus);
  const optionStepObj = STATUS_STEPS.find((s) => s.value === optionValue);

  if (!currentStepObj || !optionStepObj) return false;
  if (optionValue === "CANCELLED") return false;

  return optionStepObj.step < currentStepObj.step;
};
