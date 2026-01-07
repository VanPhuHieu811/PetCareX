import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    displayName: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate cơ bản
    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp!');
      return;
    }

    setLoading(true);
    // Gọi hàm register từ context
    const success = await register(formData.username, formData.password, formData.displayName);
    setLoading(false);

    if (success) {
      alert('Đăng ký thành công! Vui lòng đăng nhập.');
      navigate('/login');
    } else {
      setError('Tên đăng nhập đã tồn tại, vui lòng chọn tên khác.');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Đăng ký thành viên</h2>
          <p className="mt-2 text-sm text-gray-600">
            Tạo tài khoản để đặt lịch và theo dõi thú cưng của bạn
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
          {error && (
            <div className="p-3 bg-red-100 text-red-700 rounded text-sm text-center">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Họ và tên</label>
              <input
                name="displayName"
                type="text"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nguyễn Văn A"
                value={formData.displayName}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Tên đăng nhập (SĐT)</label>
              <input
                name="username"
                type="text"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="0912345678"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Mật khẩu</label>
              <input
                name="password"
                type="password"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="••••••"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Xác nhận mật khẩu</label>
              <input
                name="confirmPassword"
                type="password"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            {loading ? 'Đang tạo tài khoản...' : 'Đăng ký Khách hàng'}
          </button>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Đã có tài khoản?{' '}
              <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                Đăng nhập ngay
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;