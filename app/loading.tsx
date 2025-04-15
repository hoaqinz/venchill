export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center px-4">
        <div className="w-24 h-24 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-8"></div>
        <h2 className="text-2xl font-bold text-white mb-4">Đang tải...</h2>
        <p className="text-gray-400 max-w-md mx-auto">
          Vui lòng chờ trong giây lát.
        </p>
      </div>
    </div>
  );
}
