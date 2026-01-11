import React, { useState, useEffect } from 'react';
// import { MOCK_CUSTOMERS } from '../../services/mockDataQL';
import { Users, UserMinus, Crown } from 'lucide-react';
import PageNumber from '../../components/PageNumber';

const BASEURL = "http://localhost:3000/api/v1";

export default function Customers() {
	const [branchID, setBranchID] = useState(""); // Chi nhánh của NVQL
	useEffect(() => {
		async function fetchStaffBranch() {
			try {
				const token = localStorage.getItem('petcare_token');
				const res = await fetch(`${BASEURL}/branches/staff-branch`, {
					headers: {
						'Authorization': `Bearer ${token}`
					}
				});
				if (!res.ok)
					throw new Error(`Failed to fetch staff branch: ${res.status} ${res.statusText}`);
				const data = await res.json();
				if (data.length > 0) {
					setBranchID(data[0].MaCN);
				} else {
					console.error('No branch found for the staff member.');
				}
			} catch (error) {
				console.error('Error fetching staff branch:', error);
			}
		}
		fetchStaffBranch();
	}, []);

	const [customerList, setCustomerList] = useState([]);
	const [totalCustomers, setTotalCustomers] = useState(0);
	const [totalVIPCustomers, setTotalVIPCustomers] = useState(0);
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 20;
	useEffect(() => {
		async function fetchCustomers() {
			try {
				if (!branchID) return;
					const result = await fetch(`${BASEURL}/branches/customer-list?branchID=${branchID}&limit=${itemsPerPage}&offset=${(currentPage - 1) * 20}`);
					const data = await result.json();
				setCustomerList(data);
			} catch (error) {
				console.error('Error fetching customer list:', error);
			}
		}
		fetchCustomers();

		async function fetchCustomerCount() {
			try {
				if (!branchID) return;
				const result = await fetch(`${BASEURL}/branches/customer-count?branchID=${branchID}`);
				const data = await result.json();
				setTotalCustomers(data.count);
			}
			catch (error) {
				console.error('Error fetching customer count:', error);
			}
		}
		fetchCustomerCount();

		async function fetchVIPCustomerCount() {
			try {
				if (!branchID) return;
				const result = await fetch(`${BASEURL}/branches/vip-customer-count?branchID=${branchID}`);
				const data = await result.json();
				setTotalVIPCustomers(data.count);
			}
			catch (error) {
				console.error('Error fetching VIP customer count:', error);
			}
		}
		fetchVIPCustomerCount();

	}, [branchID, currentPage]);

	const totalPages = Math.ceil(totalCustomers / itemsPerPage);

	const handlePageChanging = (newPage) => {
		setCurrentPage(newPage);
	};

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
						<p className="text-3xl font-bold text-gray-800">{totalCustomers}</p>
					</div>
				</div>

				<div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-4">
					<div className="p-4 bg-yellow-100 text-yellow-600 rounded-full">
						<Crown size={28} />
					</div>
					<div>
						<p className="text-gray-500 text-sm">Thành viên VIP</p>
						<p className="text-3xl font-bold text-gray-800">{totalVIPCustomers}</p>
					</div>
				</div>
			</div>

			<div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
				<div className="px-6 py-4 border-b border-gray-100">
					<h3 className="font-bold text-gray-800">Danh sách khách hàng</h3>
				</div>
				<table className="w-full text-left">
					<thead className="bg-gray-50">
						<tr>
							<th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Mã KH</th>
							<th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Họ Tên</th>
							<th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Điểm Loyalty</th>
							<th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Hạng</th>
							<th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase text-center">Tổng lần đặt dịch vụ</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-200">
						{customerList.length > 0 ? customerList.map(c => (
							<tr key={c.MaKH} className="hover:bg-gray-50">
								<td className="px-6 py-4 text-sm text-gray-900">{c.MaKH}</td>
								<td className="px-6 py-4 text-sm text-gray-800">{c.HoTen}</td>
								<td className="px-6 py-4 text-sm">{c.DiemLoyalty}</td>
								<td className="px-6 py-4 text-sm text-red-500 font-medium">{c.TenLoaiTV}</td>
								<td className="px-6 py-4 text-sm text-center">
									{c.SoLanDatDV}
								</td>
							</tr>
						)) : <tr><td colSpan="5" className="text-center py-4">Đang tìm kiếm danh sách khách hàng ...</td></tr>
						}
					</tbody>
				</table>
				<PageNumber currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChanging} />
			</div>
		</div>
	);
};