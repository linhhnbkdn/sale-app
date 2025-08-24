import type { Route } from "./+types/home";
import { Link } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Chéno - Mỗi gói là một bàn tay" },
    { name: "description", content: "Shop the latest fashion trends with quality and style!" },
  ];
}

export default function Home() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-stone-100">
      {/* Top Bar */}
      <div className="bg-amber-900 text-stone-100 text-xs py-2">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <span>VỀ CHÉNO</span>
            <span>CXP</span>
          </div>
          <div className="flex items-center space-x-4">
            <span>⭐ Chéno Club</span>
            <span>Blog</span>
            <span>CSKH</span>
            {user ? (
              <Link to="/dashboard" className="hover:text-stone-300">
                {user.first_name || user.username}
              </Link>
            ) : (
              <Link to="/login" className="hover:text-stone-300">
                Đăng nhập
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-stone-50 shadow-sm border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <Link to="/" className="flex items-center space-x-2">
                {/* Coffee Hand Icon */}
                <div className="w-8 h-8 text-amber-900">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                    <path d="M8 2C8 1.45 8.45 1 9 1S10 1.45 10 2 9.55 3 9 3 8 2.55 8 2M6 6C6 5.45 6.45 5 7 5S8 5.45 8 6 7.55 7 7 7 6 6.55 6 6M4 10C4 9.45 4.45 9 5 9S6 9.45 6 10 5.55 11 5 11 4 10.55 4 10M15 7H13C12.45 7 12 7.45 12 8V12H8V14H12V18C12 18.55 12.45 19 13 19H15C15.55 19 16 18.55 16 18V8C16 7.45 15.55 7 15 7Z"/>
                  </svg>
                </div>
                <span className="text-3xl font-bold text-amber-900">Chéno</span>
              </Link>
            </div>

            {/* Navigation Menu */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/new" className="text-amber-900 hover:text-amber-700 font-medium transition-colors">
                NEW
              </Link>
              <Link to="/coffee" className="text-amber-900 hover:text-amber-700 font-medium transition-colors">
                CÀ PHÊ
              </Link>
              <Link to="/tea" className="text-amber-900 hover:text-amber-700 font-medium transition-colors">
                TRÀ
              </Link>
              <Link to="/accessories" className="text-amber-900 hover:text-amber-700 font-medium transition-colors">
                PHỤ KIỆN
              </Link>
              <Link to="/sale" className="text-red-600 hover:text-red-700 font-medium transition-colors">
                SALE <span className="bg-red-500 text-white text-xs px-1 rounded">-20%</span>
              </Link>
              <Link to="/about" className="text-amber-900 hover:text-amber-700 font-medium transition-colors">
                VỀ CHÚNG TÔI
              </Link>
            </nav>

            {/* Search and Actions */}
            <div className="flex items-center space-x-4">
              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 px-4 py-2 border border-stone-300 rounded-full focus:outline-none focus:border-amber-600 bg-white"
                />
                <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <svg className="w-5 h-5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>

              {/* User Account */}
              {user ? (
                <div className="flex items-center space-x-2">
                  <Link to="/dashboard" className="p-2 rounded-full hover:bg-stone-200 transition-colors">
                    <svg className="w-6 h-6 text-amber-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </Link>
                </div>
              ) : (
                <Link to="/login" className="p-2 rounded-full hover:bg-stone-200 transition-colors">
                  <svg className="w-6 h-6 text-amber-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </Link>
              )}

              {/* Shopping Cart */}
              <button className="relative p-2 rounded-full hover:bg-stone-200 transition-colors">
                <svg className="w-6 h-6 text-amber-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h8m-8 0a1.5 1.5 0 003 0m-3 0a1.5 1.5 0 013 0" />
                </svg>
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  0
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="bg-stone-200">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="text-center">
            <div className="mb-12">
              {/* Large Hand with Coffee Package Icon */}
              <div className="flex justify-center mb-8">
                <div className="w-32 h-32 text-amber-900">
                  <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full">
                    {/* Hand outline */}
                    <path d="M20 60 Q15 55 15 50 Q15 45 20 40 Q25 35 30 40 L30 30 Q30 25 35 25 Q40 25 40 30 L40 25 Q40 20 45 20 Q50 20 50 25 L50 20 Q50 15 55 15 Q60 15 60 20 L60 30 Q65 35 65 40 L65 70 Q65 75 60 80 L40 80 Q25 80 20 75 Z" 
                          stroke="currentColor" strokeWidth="2" fill="rgba(180, 83, 9, 0.1)"/>
                    {/* Coffee package */}
                    <rect x="45" y="35" width="15" height="20" rx="2" fill="currentColor"/>
                    <rect x="47" y="33" width="11" height="4" rx="1" fill="currentColor"/>
                    {/* Coffee bean on package */}
                    <ellipse cx="52.5" cy="45" rx="2" ry="3" fill="rgba(245, 245, 220, 0.8)"/>
                    <path d="M52.5 42 Q52.5 45 52.5 48" stroke="rgba(180, 83, 9, 1)" strokeWidth="0.5"/>
                  </svg>
                </div>
              </div>
              
              <h1 className="text-8xl font-bold text-amber-900 mb-6 tracking-wider">
                Chéno
              </h1>
              <p className="text-3xl text-amber-800 italic font-medium mb-4">
                Mỗi gói là một bàn tay
              </p>
            </div>
            
            <div className="mb-8">
              <h2 className="text-4xl font-bold text-amber-900 mb-6">
                Cà phê thủ công, tình yêu trong từng hạt
              </h2>
              <p className="text-xl text-amber-700 mb-8 max-w-2xl mx-auto leading-relaxed">
                Khám phá hương vị cà phê đặc biệt được chọn lọc kỹ càng, mang đến trải nghiệm thư giãn hoàn hảo trong từng ngụm.
              </p>
            </div>
            
            {!user ? (
              <div className="space-y-6">
                <div className="flex justify-center space-x-4">
                  <Link
                    to="/login"
                    className="bg-amber-900 text-stone-100 px-10 py-4 rounded-full font-semibold hover:bg-amber-800 transition-colors text-lg shadow-lg"
                  >
                    Đăng nhập để mua sắm
                  </Link>
                  <Link
                    to="/coffee"
                    className="border-2 border-amber-900 text-amber-900 px-10 py-4 rounded-full font-semibold hover:bg-amber-900 hover:text-stone-100 transition-colors text-lg"
                  >
                    Khám phá cà phê
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <p className="text-xl text-amber-800">Chào mừng trở lại, {user.first_name || user.username}!</p>
                <div className="flex justify-center space-x-4">
                  <Link
                    to="/dashboard"
                    className="bg-amber-900 text-stone-100 px-10 py-4 rounded-full font-semibold hover:bg-amber-800 transition-colors text-lg shadow-lg"
                  >
                    Quản lý tài khoản
                  </Link>
                  <Link
                    to="/coffee"
                    className="border-2 border-amber-900 text-amber-900 px-10 py-4 rounded-full font-semibold hover:bg-amber-900 hover:text-stone-100 transition-colors text-lg"
                  >
                    Mua sắm ngay
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Featured Categories */}
        <div className="max-w-7xl mx-auto px-4 pb-16">
          <h2 className="text-4xl font-bold text-center mb-12 text-amber-900">Sản phẩm nổi bật</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="group cursor-pointer">
              <div className="bg-stone-50 rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all hover:transform hover:scale-105 border border-stone-200">
                <div className="w-20 h-20 mx-auto mb-6 bg-amber-100 rounded-full flex items-center justify-center">
                  <span className="text-3xl">☕</span>
                </div>
                <h3 className="font-bold mb-3 text-amber-900 text-lg">Cà phê rang</h3>
                <p className="text-sm text-amber-700">Hương vị đậm đà, thơm ngon</p>
              </div>
            </div>
            
            <div className="group cursor-pointer">
              <div className="bg-stone-50 rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all hover:transform hover:scale-105 border border-stone-200">
                <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-3xl">🫖</span>
                </div>
                <h3 className="font-bold mb-3 text-amber-900 text-lg">Trà cao cấp</h3>
                <p className="text-sm text-amber-700">Thanh mát & thư giãn</p>
              </div>
            </div>
            
            <div className="group cursor-pointer">
              <div className="bg-stone-50 rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all hover:transform hover:scale-105 border border-stone-200">
                <div className="w-20 h-20 mx-auto mb-6 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-3xl">🥤</span>
                </div>
                <h3 className="font-bold mb-3 text-amber-900 text-lg">Phụ kiện pha chế</h3>
                <p className="text-sm text-amber-700">Dụng cụ chuyên nghiệp</p>
              </div>
            </div>
            
            <div className="group cursor-pointer">
              <div className="bg-stone-50 rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all hover:transform hover:scale-105 border border-stone-200 relative">
                <div className="absolute top-3 right-3">
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold">SALE</span>
                </div>
                <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-3xl">🔥</span>
                </div>
                <h3 className="font-bold mb-3 text-amber-900 text-lg">Ưu đãi đặc biệt</h3>
                <p className="text-sm text-amber-700">Giảm giá lên đến 30%</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-amber-950 text-stone-200 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 text-stone-200">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                    <path d="M8 2C8 1.45 8.45 1 9 1S10 1.45 10 2 9.55 3 9 3 8 2.55 8 2M6 6C6 5.45 6.45 5 7 5S8 5.45 8 6 7.55 7 7 7 6 6.55 6 6M4 10C4 9.45 4.45 9 5 9S6 9.45 6 10 5.55 11 5 11 4 10.55 4 10M15 7H13C12.45 7 12 7.45 12 8V12H8V14H12V18C12 18.55 12.45 19 13 19H15C15.55 19 16 18.55 16 18V8C16 7.45 15.55 7 15 7Z"/>
                  </svg>
                </div>
                <span className="text-2xl font-bold">Chéno</span>
              </div>
              <p className="text-stone-300 italic">
                Mỗi gói là một bàn tay
              </p>
              <p className="text-stone-400 mt-2 text-sm">
                Cà phê chất lượng cao từ những người thợ tâm huyết
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-6 text-stone-100 text-lg">Sản phẩm</h3>
              <ul className="space-y-3 text-stone-300">
                <li className="hover:text-stone-100 cursor-pointer transition-colors">Cà phê rang xay</li>
                <li className="hover:text-stone-100 cursor-pointer transition-colors">Trà cao cấp</li>
                <li className="hover:text-stone-100 cursor-pointer transition-colors">Phụ kiện pha chế</li>
                <li className="hover:text-stone-100 cursor-pointer transition-colors">Quà tặng</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-6 text-stone-100 text-lg">Hỗ trợ</h3>
              <ul className="space-y-3 text-stone-300">
                <li className="hover:text-stone-100 cursor-pointer transition-colors">Liên hệ</li>
                <li className="hover:text-stone-100 cursor-pointer transition-colors">Chính sách đổi trả</li>
                <li className="hover:text-stone-100 cursor-pointer transition-colors">Hướng dẫn pha chế</li>
                <li className="hover:text-stone-100 cursor-pointer transition-colors">Câu hỏi thường gặp</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-6 text-stone-100 text-lg">Kết nối với chúng tôi</h3>
              <div className="flex space-x-4 mb-4">
                <button className="w-12 h-12 bg-amber-800 rounded-full flex items-center justify-center hover:bg-amber-700 transition-colors">
                  <span className="text-stone-100 font-semibold">f</span>
                </button>
                <button className="w-12 h-12 bg-amber-800 rounded-full flex items-center justify-center hover:bg-amber-700 transition-colors">
                  <span className="text-stone-100 font-semibold">ig</span>
                </button>
                <button className="w-12 h-12 bg-amber-800 rounded-full flex items-center justify-center hover:bg-amber-700 transition-colors">
                  <span className="text-stone-100 font-semibold">yt</span>
                </button>
              </div>
              <p className="text-stone-400 text-sm">
                Theo dõi để cập nhật những sản phẩm mới nhất
              </p>
            </div>
          </div>
          
          <div className="border-t border-amber-800 mt-12 pt-8 text-center text-stone-400">
            <p>&copy; 2024 Chéno. Được làm với ❤️ và cà phê.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
