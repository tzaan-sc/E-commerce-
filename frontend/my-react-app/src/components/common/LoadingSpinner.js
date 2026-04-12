import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ text = "Đang tải dữ liệu..." }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
      <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      <span className="text-gray-500 font-medium">{text}</span>
    </div>
  );
};

export default LoadingSpinner;
