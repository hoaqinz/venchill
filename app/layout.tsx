import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VenChill - Trang web xem phim trực tuyến chất lượng cao",
  description: "Trang web xem phim trực tuyến với kho phim đồ sộ và chất lượng cao. Cập nhật nhanh chóng các bộ phim mới nhất.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white min-h-screen flex flex-col`}
      >
        <header className="bg-black/90 backdrop-blur-md sticky top-0 z-50 border-b border-gray-800 py-3 px-4">
          <div className="container mx-auto flex flex-wrap justify-between items-center gap-4">
            {/* Logo */}
            <a href="/" className="flex items-center">
              <div className="relative w-8 h-8 mr-2">
                <div className="absolute inset-0 bg-red-600 rounded-full"></div>
                <div className="absolute inset-[2px] bg-black rounded-full flex items-center justify-center">
                  <span className="text-red-600 font-bold text-xs">VC</span>
                </div>
              </div>
              <span className="text-2xl font-bold">
                <span className="text-red-600">Ven</span>
                <span className="text-white">Chill</span>
              </span>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-6">
              <a href="/" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">Trang chủ</a>
              <a href="/danh-sach/phim-moi-cap-nhat" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">Mới nhất</a>
              <a href="/danh-sach/phim-bo" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">Phim bộ</a>
              <a href="/danh-sach/phim-le" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">Phim lẻ</a>
              <a href="/danh-sach/hoat-hinh" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">Hoạt hình</a>
              <a href="/the-loai" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">Thể loại</a>
              <a href="/quoc-gia" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">Quốc gia</a>
            </nav>



            {/* Mobile Menu Button */}
            <button className="md:hidden text-gray-300 hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </header>
        <main className="flex-grow">{children}</main>
        <footer className="bg-black/90 border-t border-gray-800 py-8">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Logo and Description */}
              <div>
                <a href="/" className="flex items-center mb-4">
                  <div className="relative w-8 h-8 mr-2">
                    <div className="absolute inset-0 bg-red-600 rounded-full"></div>
                    <div className="absolute inset-[2px] bg-black rounded-full flex items-center justify-center">
                      <span className="text-red-600 font-bold text-xs">VC</span>
                    </div>
                  </div>
                  <span className="text-2xl font-bold">
                    <span className="text-red-600">Ven</span>
                    <span className="text-white">Chill</span>
                  </span>
                </a>
                <p className="text-gray-400 text-sm">
                  Trang web xem phim trực tuyến với kho phim đồ sộ và chất lượng cao.
                  Cập nhật nhanh chóng các bộ phim mới nhất.
                </p>
              </div>

              {/* Categories */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Danh mục</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="/danh-sach/phim-moi-cap-nhat" className="text-gray-400 hover:text-red-500 text-sm transition-colors">
                      Phim mới cập nhật
                    </a>
                  </li>
                  <li>
                    <a href="/danh-sach/phim-bo" className="text-gray-400 hover:text-red-500 text-sm transition-colors">
                      Phim bộ
                    </a>
                  </li>
                  <li>
                    <a href="/danh-sach/phim-le" className="text-gray-400 hover:text-red-500 text-sm transition-colors">
                      Phim lẻ
                    </a>
                  </li>
                  <li>
                    <a href="/danh-sach/hoat-hinh" className="text-gray-400 hover:text-red-500 text-sm transition-colors">
                      Phim hoạt hình
                    </a>
                  </li>
                  <li>
                    <a href="/danh-sach/tv-shows" className="text-gray-400 hover:text-red-500 text-sm transition-colors">
                      TV Shows
                    </a>
                  </li>
                </ul>
              </div>

              {/* Genres */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Thể loại</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="/the-loai/hanh-dong" className="text-gray-400 hover:text-red-500 text-sm transition-colors">
                      Hành động
                    </a>
                  </li>
                  <li>
                    <a href="/the-loai/tinh-cam" className="text-gray-400 hover:text-red-500 text-sm transition-colors">
                      Tình cảm
                    </a>
                  </li>
                  <li>
                    <a href="/the-loai/hai-huoc" className="text-gray-400 hover:text-red-500 text-sm transition-colors">
                      Hài hước
                    </a>
                  </li>
                  <li>
                    <a href="/the-loai/co-trang" className="text-gray-400 hover:text-red-500 text-sm transition-colors">
                      Cổ trang
                    </a>
                  </li>
                  <li>
                    <a href="/the-loai/tam-ly" className="text-gray-400 hover:text-red-500 text-sm transition-colors">
                      Tâm lý
                    </a>
                  </li>
                </ul>
              </div>

              {/* Countries */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Quốc gia</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="/quoc-gia/viet-nam" className="text-gray-400 hover:text-red-500 text-sm transition-colors">
                      Việt Nam
                    </a>
                  </li>
                  <li>
                    <a href="/quoc-gia/han-quoc" className="text-gray-400 hover:text-red-500 text-sm transition-colors">
                      Hàn Quốc
                    </a>
                  </li>
                  <li>
                    <a href="/quoc-gia/trung-quoc" className="text-gray-400 hover:text-red-500 text-sm transition-colors">
                      Trung Quốc
                    </a>
                  </li>
                  <li>
                    <a href="/quoc-gia/thai-lan" className="text-gray-400 hover:text-red-500 text-sm transition-colors">
                      Thái Lan
                    </a>
                  </li>
                  <li>
                    <a href="/quoc-gia/au-my" className="text-gray-400 hover:text-red-500 text-sm transition-colors">
                      Âu Mỹ
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Copyright */}
            <div className="border-t border-gray-800 mt-8 pt-8 text-center">
              <p className="text-gray-400 text-sm">
                &copy; {new Date().getFullYear()} VenChill. Tất cả quyền được bảo lưu.
              </p>
              <p className="text-gray-600 text-xs mt-2">
                VenChill không lưu trữ bất kỳ nội dung phim nào trên máy chủ. Tất cả nội dung được lấy từ các nguồn chia sẻ hợp pháp trên Internet.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
