"use client";

import Link from "next/link";
import { FiGithub, FiMail, FiTwitter } from "react-icons/fi";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black/90 border-t border-gray-800 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">VenChill</h3>
            <p className="text-gray-400 text-sm">
              Trang web xem phim trực tuyến với kho phim đồ sộ và chất lượng cao.
              Cập nhật nhanh chóng các bộ phim mới nhất.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Thể Loại</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/the-loai/hanh-dong" className="text-gray-400 hover:text-red-500 text-sm">
                  Phim Hành Động
                </Link>
              </li>
              <li>
                <Link href="/the-loai/tinh-cam" className="text-gray-400 hover:text-red-500 text-sm">
                  Phim Tình Cảm
                </Link>
              </li>
              <li>
                <Link href="/the-loai/hai-huoc" className="text-gray-400 hover:text-red-500 text-sm">
                  Phim Hài Hước
                </Link>
              </li>
              <li>
                <Link href="/the-loai/co-trang" className="text-gray-400 hover:text-red-500 text-sm">
                  Phim Cổ Trang
                </Link>
              </li>
              <li>
                <Link href="/the-loai/tam-ly" className="text-gray-400 hover:text-red-500 text-sm">
                  Phim Tâm Lý
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quốc Gia</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/quoc-gia/viet-nam" className="text-gray-400 hover:text-red-500 text-sm">
                  Phim Việt Nam
                </Link>
              </li>
              <li>
                <Link href="/quoc-gia/han-quoc" className="text-gray-400 hover:text-red-500 text-sm">
                  Phim Hàn Quốc
                </Link>
              </li>
              <li>
                <Link href="/quoc-gia/trung-quoc" className="text-gray-400 hover:text-red-500 text-sm">
                  Phim Trung Quốc
                </Link>
              </li>
              <li>
                <Link href="/quoc-gia/thai-lan" className="text-gray-400 hover:text-red-500 text-sm">
                  Phim Thái Lan
                </Link>
              </li>
              <li>
                <Link href="/quoc-gia/au-my" className="text-gray-400 hover:text-red-500 text-sm">
                  Phim Âu Mỹ
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Liên Hệ</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-red-500 text-sm flex items-center gap-2">
                  <FiMail /> contact@venchill.com
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-red-500 text-sm flex items-center gap-2">
                  <FiTwitter /> @venchill
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-red-500 text-sm flex items-center gap-2">
                  <FiGithub /> github.com/venchill
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} VenChill. Tất cả quyền được bảo lưu.
          </p>
        </div>
      </div>
    </footer>
  );
}
