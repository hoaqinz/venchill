"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center px-4">
        <h1 className="text-6xl font-bold text-red-600 mb-4">Đã xảy ra lỗi</h1>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          Đã có lỗi xảy ra khi tải trang. Vui lòng thử lại sau.
        </p>
        <button
          onClick={() => reset()}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium"
        >
          Thử lại
        </button>
      </div>
    </div>
  );
}
