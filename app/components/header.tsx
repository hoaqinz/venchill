"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { FiMenu, FiX } from "react-icons/fi";

const MENU_ITEMS = [
  { name: "Trang chủ", href: "/" },
  { name: "Phim Lẻ", href: "/danh-sach/phim-le" },
  { name: "Phim Bộ", href: "/danh-sach/phim-bo" },
  { name: "Phim Hoạt Hình", href: "/danh-sach/hoat-hinh" },
  { name: "TV Shows", href: "/danh-sach/tv-shows" },
  { name: "Phim Vietsub", href: "/danh-sach/phim-vietsub" },
  { name: "Phim Thuyết Minh", href: "/danh-sach/phim-thuyet-minh" },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-black/90 backdrop-blur-md sticky top-0 z-50 border-b border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-red-600">VenChill</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            {MENU_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-red-500 ${
                  pathname === item.href ? "text-red-500" : "text-gray-300"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>



          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-gray-300 hover:text-white"
          >
            {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-800">

            <nav className="flex flex-col space-y-4">
              {MENU_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium transition-colors hover:text-red-500 ${
                    pathname === item.href ? "text-red-500" : "text-gray-300"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
