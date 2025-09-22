// src/components/Header.js
import { ShoppingCart } from "lucide-react";

export default function Header() {
  return (
    <header className="flex items-center justify-between p-4 shadow-md bg-white">
      {/* Logo */}
      <div className="text-blue-600 font-bold text-2xl cursor-pointer">
        HTV
      </div>

      {/* Search */}
      <div className="flex flex-1 mx-6">
        <input
          type="text"
          placeholder="Bạn muốn tìm gì hôm nay?"
          className="flex-1 border rounded-l px-4 py-2"
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded-r">
          Tìm kiếm
        </button>
      </div>

      {/* Cart */}
      <div className="flex items-center gap-2 cursor-pointer">
        <ShoppingCart size={24} />
        <span>Giỏ hàng</span>
      </div>
    </header>
  );
}
