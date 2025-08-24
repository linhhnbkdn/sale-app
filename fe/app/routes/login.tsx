import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import type { Route } from "./+types/login";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Đăng nhập - Chéno" },
    { name: "description", content: "Đăng nhập vào tài khoản Chéno của bạn" },
  ];
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    console.log("Form submitted with:", { email });

    try {
      const success = await login(email, password);
      if (success) {
        navigate("/");
      } else {
        setError("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin đăng nhập.");
      }
    } catch (err) {
      console.error("Form submission error:", err);
      setError("Lỗi mạng. Vui lòng kiểm tra xem server backend có đang chạy tại http://localhost:8000");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-100">
      {/* Top Bar - Same as Home */}
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
            <Link to="/login" className="hover:text-stone-300">
              Đăng nhập
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header - Same as Home */}
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
                  className="w-64 px-4 py-2 border border-stone-300 rounded-full focus:outline-none focus:border-amber-600 bg-white"
                />
                <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <svg className="w-5 h-5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>

              {/* User Account */}
              <Link to="/login" className="p-2 rounded-full hover:bg-stone-200 transition-colors">
                <svg className="w-6 h-6 text-amber-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>

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

      {/* Login Form */}
      <main className="bg-stone-200 min-h-screen flex items-center justify-center py-12">
        <div className="max-w-md w-full space-y-8 bg-stone-50 p-10 rounded-2xl shadow-2xl border border-stone-200">
          {/* Header */}
          <div className="text-center">
            <div className="mb-8">
              {/* Hand with Coffee Package Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 text-amber-900">
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
              
              <h1 className="text-5xl font-bold text-amber-900 mb-3 tracking-wider">
                Chéno
              </h1>
              <p className="text-lg text-amber-800 italic font-medium mb-2">Mỗi gói là một bàn tay</p>
            </div>
            
            <h2 className="text-3xl font-bold text-amber-900 mb-3">
              Đăng nhập
            </h2>
            <p className="text-amber-700 mb-2">
              Chào mừng bạn trở lại Chéno
            </p>
          </div>

          {/* Form */}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-xl bg-red-50 p-4 border border-red-200">
                <div className="text-sm text-red-700 text-center font-medium">{error}</div>
              </div>
            )}

            <div className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-amber-900 mb-2">
                  Email hoặc tên đăng nhập
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-5 py-4 border-2 border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-amber-600 transition-all bg-white text-amber-900 placeholder-amber-400"
                  placeholder="Nhập email hoặc tên đăng nhập"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-amber-900 mb-2">
                  Mật khẩu
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-5 py-4 border-2 border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-amber-600 transition-all bg-white text-amber-900 placeholder-amber-400"
                  placeholder="Nhập mật khẩu"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-stone-400 rounded"
                />
                <label htmlFor="remember-me" className="ml-3 block text-sm text-amber-800 font-medium">
                  Ghi nhớ đăng nhập
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-semibold text-amber-900 hover:text-amber-700 transition-colors">
                  Quên mật khẩu?
                </a>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-4 px-6 border border-transparent rounded-xl text-stone-100 bg-amber-900 hover:bg-amber-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-600 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
              </button>
            </div>

            <div className="text-center pt-4">
              <span className="text-sm text-amber-700">
                Chưa có tài khoản?{" "}
                <Link to="/register" className="font-semibold text-amber-900 hover:text-amber-700 transition-colors">
                  Đăng ký ngay
                </Link>
              </span>
            </div>

            {/* Test Account Info */}
            <div className="mt-8 p-5 bg-amber-50 rounded-xl border-2 border-amber-200">
              <p className="text-sm text-amber-900 font-semibold mb-3 text-center">🧪 Tài khoản dùng thử:</p>
              <div className="text-center space-y-1">
                <p className="text-sm text-amber-800">📧 Email: <code className="bg-amber-100 px-2 py-1 rounded">testuser</code></p>
                <p className="text-sm text-amber-800">🔐 Mật khẩu: <code className="bg-amber-100 px-2 py-1 rounded">testpassword123</code></p>
              </div>
            </div>
          </form>
        </div>
      </main>

      {/* Footer - Same as Home */}
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