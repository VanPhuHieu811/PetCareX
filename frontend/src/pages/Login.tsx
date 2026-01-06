import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const success = await login(username, password);
    setLoading(false);

    if (success) {
      const currentUser = JSON.parse(localStorage.getItem('petcare_user') || '{}');
      
      // LOGIC ĐIỀU HƯỚNG MỚI
      switch (currentUser.role) {
        case 'Quản lý':
          navigate('/manager/dashboard');
          break;

        case 'Bác sĩ':
          // Bác sĩ vào thẳng danh sách thú cưng để khám
          navigate('/staff/pets'); 
          break;

        case 'Tiếp tân':
          // Tiếp tân vào thẳng danh sách khách hàng để check-in
          navigate('/staff/customers'); 
          break;

        case 'Bán hàng':
          // Bán vé/hàng vào thẳng kho hoặc trang bán hàng
          navigate('/staff/pos'); 
          break;

        case 'Khách hàng':
          navigate('/customer/home');
          break;

        default:
          navigate('/');
      }
    } else {
      setError('Sai thông tin đăng nhập! (Thử: bacsi/123, tieptan/123...)');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Cột Trái: Ảnh Banner */}
      <div className="hidden lg:flex w-1/2 bg-blue-600 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-800 opacity-90"></div>
        <div className="relative z-10 text-white p-10 text-center">
          <h1 className="text-5xl font-bold mb-4">PetCareX</h1>
          <p className="text-xl">Hệ thống quản lý thú y & chăm sóc thú cưng toàn diện.</p>
        </div>
      </div>

      {/* Cột Phải: Form Đăng nhập */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Đăng nhập</h2>
            <p className="mt-2 text-gray-600">Chào mừng bạn quay trở lại!</p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            {error && (
              <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm text-center">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Tên đăng nhập</label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="admin / staff / khach"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Mật khẩu</label>
                <input
                  type="password"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Đang xử lý...' : 'Đăng nhập'}
            </button>
          </form>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Chưa có tài khoản?{' '}
              <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;