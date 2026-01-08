// src/pages/Register.tsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type FormData = {
  name: string;
  email: string;
  cccd: string;
  password: string;
  confirmPassword: string;
};

export default function Register() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    cccd: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState<string>("");
  const [successMsg, setSuccessMsg] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    setSuccessMsg("");

    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = (): string => {
    const name = formData.name.trim();
    const email = formData.email.trim();
    const cccd = formData.cccd.trim();
    const password = formData.password;

    if (!name) return "Vui lòng nhập họ và tên.";
    if (!email) return "Vui lòng nhập email.";
    if (!/^\S+@\S+\.\S+$/.test(email)) return "Email không hợp lệ.";

    if (!cccd) return "Vui lòng nhập CCCD.";
    if (!/^\d+$/.test(cccd)) return "CCCD chỉ được chứa chữ số.";
    // ✅ CCCD Việt Nam thường 12 số (bạn đang làm theo phương án 2)
    if (cccd.length !== 12) return "CCCD không hợp lệ (CCCD phải đúng 12 chữ số).";

    if (!password) return "Vui lòng nhập mật khẩu.";
    if (password.length < 3) return "Mật khẩu tối thiểu 3 ký tự.";
    if (password !== formData.confirmPassword) return "Mật khẩu xác nhận không khớp!";

    return "";
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    const v = validate();
    if (v) {
      setError(v);
      return;
    }

    setLoading(true);
    try {
      // ✅ register(email, password, name, cccd)
      const ok = await register(
        formData.email.trim(),
        formData.password,
        formData.name.trim(),
        formData.cccd.trim()
      );

      if (!ok) {
        // NOTE: AuthContext hiện đang catch và return false khi backend lỗi,
        // nên ở đây chỉ biết "fail" chứ chưa biết lý do cụ thể.
        setError("Đăng ký thất bại. Vui lòng kiểm tra lại Email/CCCD hoặc thử lại sau.");
        setLoading(false);
        return;
      }

      setSuccessMsg("Đăng ký thành công! Đang chuyển về trang đăng nhập...");
      setLoading(false);

      setTimeout(() => navigate("/login"), 700);
    } catch (err: unknown) {
      setLoading(false);
      const msg = err instanceof Error ? err.message : "Đăng ký thất bại. Vui lòng thử lại.";
      setError(msg);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
          <div className="px-8 pt-8 pb-6 text-center">
            <h2 className="text-3xl font-bold text-gray-900">Đăng ký thành viên</h2>
            <p className="mt-2 text-sm text-gray-600">
              Tạo tài khoản để đặt lịch và theo dõi thú cưng của bạn
            </p>
          </div>

          <form className="px-8 pb-8 space-y-5" onSubmit={handleRegister}>
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm text-center">
                {error}
              </div>
            )}

            {successMsg && (
              <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm text-center">
                {successMsg}
              </div>
            )}

            <div className="space-y-4">
              {/* Họ tên */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Họ và tên</label>
                <input
                  name="name"
                  type="text"
                  required
                  className="mt-1 block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nguyễn Văn A"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  name="email"
                  type="email"
                  required
                  className="mt-1 block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="abc@gmail.com"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                />
              </div>

              {/* CCCD */}
              <div>
                <label className="block text-sm font-medium text-gray-700">CCCD</label>
                <input
                  name="cccd"
                  type="text"
                  inputMode="numeric"
                  required
                  className="mt-1 block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="012345678901"
                  value={formData.cccd}
                  onChange={handleChange}
                />
                <p className="mt-1 text-xs text-gray-500">Chỉ nhập chữ số (đúng 12 số).</p>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Mật khẩu</label>
                <input
                  name="password"
                  type="password"
                  required
                  className="mt-1 block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="••••••"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                />
              </div>

              {/* Confirm */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Xác nhận mật khẩu</label>
                <input
                  name="confirmPassword"
                  type="password"
                  required
                  className="mt-1 block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-2.5 px-4 rounded-lg shadow-sm text-sm font-semibold text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
                loading ? "opacity-70 cursor-not-allowed" : "cursor-pointer"
              }`}
            >
              {loading ? "Đang tạo tài khoản..." : "Đăng ký Khách hàng"}
            </button>

            <div className="text-center pt-2">
              <p className="text-sm text-gray-600">
                Đã có tài khoản?{" "}
                <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-500">
                  Đăng nhập ngay
                </Link>
              </p>
            </div>
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          PetCareX • Quản lý thú y & chăm sóc thú cưng
        </p>
      </div>
    </div>
  );
}
