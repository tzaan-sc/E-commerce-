import { Navigate } from "react-router-dom";

// Component này phải nhận vào children và roles
export default function ProtectedRoute({ children, roles }) {
  // 1. Lấy user từ localStorage
  const userString = localStorage.getItem("user");
  
  // Debug: In ra để xem nó đang lấy được gì
  console.log("Check Auth - User:", userString); 
  console.log("Check Auth - Required Roles:", roles);

  // 2. Nếu không có user -> Đá về login
  if (!userString) {
    return <Navigate to="/dang-nhap" replace />;
  }

  const user = JSON.parse(userString);

  // 3. Nếu có user nhưng Role không khớp -> Đá về unauthorized
  // Lưu ý: So sánh chính xác chuỗi (ví dụ "ADMIN" khác "admin")
  if (roles && !roles.includes(user.role)) {
    console.warn(`Role không khớp! User: ${user.role}, Yêu cầu: ${roles}`);
    return <Navigate to="/dang-nhap" replace />;
  }

  // 4. Nếu thỏa mãn tất cả -> Cho hiển thị nội dung bên trong (AdminDashboard/CustomerLayout)
  return children;
}