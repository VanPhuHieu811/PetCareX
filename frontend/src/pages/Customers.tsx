import React from 'react';
import { MOCK_CUSTOMERS } from '../services/mockData';
import { Users, UserMinus, Crown } from 'lucide-react';

const Customers: React.FC = () => {
	// Logic to find inactive customers (e.g., haven't visited in 6 months)
	// Mock logic: year < 2024
	const inactiveCustomers = MOCK_CUSTOMERS.filter(c => c.LanCuoiToi.startsWith('2023'));

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-bold text-gray-800">Thống kê Khách hàng</h1>
				<p className="text-gray-500">Phân tích dữ liệu khách hàng tại chi nhánh</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-4">
					<div className="p-4 bg-blue-100 text-blue-600 rounded-full">
						<Users size={28} />
					</div>
					<div>
						<p className="text-gray-500 text-sm">Tổng khách hàng</p>
						<p className="text-3xl font-bold text-gray-800">{MOCK_CUSTOMERS.length * 124}</p> {/* Mock multiplier */}
					</div>
				</div>

				<div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-4">
					<div className="p-4 bg-red-100 text-red-600 rounded-full">
						<UserMinus size={28} />
					</div>
					<div>
						<p className="text-gray-500 text-sm">Khách lâu chưa quay lại</p>
						<p className="text-3xl font-bold text-gray-800">{inactiveCustomers.length * 42}</p>
						<p className="text-xs text-red-500">Cần gửi SMS Marketing</p>
					</div>
				</div>

				<div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-4">
					<div className="p-4 bg-yellow-100 text-yellow-600 rounded-full">
						<Crown size={28} />
					</div>
					<div>
						<p className="text-gray-500 text-sm">Thành viên VIP</p>
						<p className="text-3xl font-bold text-gray-800">15</p>
					</div>
				</div>
			</div>

			<div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
				<div className="px-6 py-4 border-b border-gray-100">
					<h3 className="font-bold text-gray-800">Danh sách khách hàng cần quan tâm (Inactive)</h3>
				</div>
				<table className="w-full text-left">
					<thead className="bg-gray-50">
						<tr>
							<th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Mã KH</th>
							<th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Họ Tên</th>
							<th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Hạng</th>
							<th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Lần cuối tới</th>
							<th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase text-right">Tổng chi tiêu</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-200">
						{inactiveCustomers.map(c => (
							<tr key={c.MaKH} className="hover:bg-gray-50">
								<td className="px-6 py-4 text-sm text-gray-900">{c.MaKH}</td>
								<td className="px-6 py-4 text-sm text-gray-800">{c.HoTen}</td>
								<td className="px-6 py-4 text-sm">
									<span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">{c.LoaiTV}</span>
								</td>
								<td className="px-6 py-4 text-sm text-red-500 font-medium">{c.LanCuoiToi}</td>
								<td className="px-6 py-4 text-sm text-right">
									{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(c.TongChiTieu)}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default Customers;