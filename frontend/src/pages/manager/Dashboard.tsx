import React, { useState, useEffect, useMemo } from 'react';
import { MOCK_DOCTOR_STATS } from '../../services/mockDataQL';
import { Calendar, DollarSign, Users, Stethoscope, Syringe, ShoppingBag, TrendingUp } from 'lucide-react';
import { formatVND } from '../../components/moneyFormat'
import { formatDate } from '../../components/dateFormat';

const BASEURL = "http://localhost:3000/api/v1"

// biến lưu tạm _______________
const branchID = 'CN001'
//_____________________________

type DoctorStat = {
	MaNV: string;
	HoTen: string;
	SoCaKhamBenh: number;
	SoCaTiemPhong: number;
	TongDoanhThu: number;
};

type VisitStat = {
	NgayDat: string;
	SoPhieuKham: number;
	SoPhieuTiem: number;
};

const Dashboard: React.FC = () => {
	const [timeRange, setTimeRange] = useState<'day' | 'month' | 'year'>('month');
	// Mặc định lấy ngày hiện tại
	const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

	const [totalRevenue, setTotalRevenue] = useState<number>(0);
	const [revenues, setRevenues] = useState<number[]>([0, 0, 0]);
	const [examRevenue, vaccineRevenue, productRevenue] = revenues;
	const [usages, setUsages] = useState<number[]>([0, 0, 0]);
	const [examUsage, vaccineUsage, productUsage] = usages;
	const [doctorStats, setDoctorStats] = useState<DoctorStat[]>([]);
	const [visitStats, setVisitStats] = useState<VisitStat[]>([]);

	useEffect(() => {
		async function fetchBranchRevenue() {
			try {
				const res = await fetch(`${BASEURL}/branches/revenue?id=${branchID}`);
				if (!res.ok) {
					throw new Error("Error: Can't get branch revenue");
				}
				const json = await res.json();

				const examData = json.find((item: any) => item.LoaiDichVu === "Khám bệnh");
				const vaccineData = json.find((item: any) => item.LoaiDichVu === "Tiêm phòng");
				const productData = json.find((item: any) => item.LoaiDichVu === "Mua hàng");

				const exam = Number(examData?.DoanhThu ?? 0);
				const vaccine = Number(vaccineData?.DoanhThu ?? 0);
				const product = Number(productData?.DoanhThu ?? 0);

				setRevenues([exam, vaccine, product]);

				setTotalRevenue(exam + vaccine + product);

			} catch (error) {
				console.error(error);
			}
		}
		fetchBranchRevenue();

		async function fetchBranchServiceUsage() {
			try {
				const res = await fetch(`${BASEURL}/branches/usage?id=${branchID}`);
				if (!res.ok) {
					throw new Error("Error: Can't get branch usages");
				}
				const json = await res.json();
				const examUsage = json.find((item: any) => item.LoaiDichVu === "Khám bệnh");
				const vaccineUsage = json.find((item: any) => item.LoaiDichVu === "Tiêm phòng");
				const productUsage = json.find((item: any) => item.LoaiDichVu === "Mua hàng");

				const exam = Number(examUsage?.SoLanDung ?? 0);
				const vaccine = Number(vaccineUsage?.SoLanDung ?? 0);
				const product = Number(productUsage?.SoLanDung ?? 0);

				setUsages([exam, vaccine, product]);
			}
			catch (error) {
				console.error(error);
			}

		}
		fetchBranchServiceUsage();

		async function fetchDoctorsStatistics() {
			try {
				const res = await fetch(`${BASEURL}/doctors/statistics?id=${branchID}`);
				if (!res.ok) {
					throw new Error("Error: Can't get doctors statistics");
				}
				const json = await res.json();
				const mapped: DoctorStat[] = json.map((row: any) => ({
					MaNV: row.MaNV,
					HoTen: row.HoTen,
					SoCaKhamBenh: Number(row.SoCaKhamBenh ?? 0),
					SoCaTiemPhong: Number(row.SoCaTiemPhong ?? 0),
					TongDoanhThu: Number(row.TongDoanhThu ?? 0),
				}));
				setDoctorStats(mapped);
			}
			catch (error) {
				console.error(error);
			}
		}
		fetchDoctorsStatistics();
	}, []);

	useEffect(() => {
		// Lấy year, month, day từ selectedDate
		if (!selectedDate) return; // chưa chọn ngày thì bỏ qua

		const dateObj = new Date(selectedDate);
		let year = dateObj.getFullYear();
		let month = 0;
		let day = 0;

		if (timeRange === 'month') {
			month = dateObj.getMonth() + 1;
		} else if (timeRange === 'day') {
			month = dateObj.getMonth() + 1;
			day = dateObj.getDate();
		}

		async function fetchDateStatistics() {
			try {
				const res = await fetch(
					`${BASEURL}/branches/daterevenue?id=${branchID}&year=${year}&month=${month}&day=${day}`
				);
				if (!res.ok) {
					throw new Error("Error: Can't get date statistics");
				}
				const json = await res.json();
				const mapped: VisitStat[] = json.map((row: any) => ({
					NgayDat: formatDate(row.NgayDat),
					SoPhieuKham: Number(row.SoPhieuKham ?? 0),
					SoPhieuTiem: Number(row.SoPhieuTiem ?? 0),
				}));
				setVisitStats(mapped);
			}
			catch (error) {
				console.error(error);
			}
		}
		fetchDateStatistics();
	}, [selectedDate]);

	const getLabel = () => {
		const dateObj = new Date(selectedDate);
		if (timeRange === 'year') return `Năm ${dateObj.getFullYear()}`;
		if (timeRange === 'month') return `Tháng ${dateObj.getMonth() + 1}/${dateObj.getFullYear()}`;
		return `Ngày ${dateObj.getDate()}/${dateObj.getMonth() + 1}/${dateObj.getFullYear()}`;
	}

	return (
		<div className="space-y-8">
			{/* Header & Filters */}
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold text-gray-800">Tổng quan Chi nhánh CN01</h1>
					<p className="text-gray-500">Báo cáo tài chính và hoạt động</p>
				</div>

				<div className="flex items-center space-x-3 bg-white p-2 rounded-lg border border-gray-200 shadow-sm">
					<div className="flex bg-gray-100 rounded-md p-1">
						<button
							onClick={() => setTimeRange('day')}
							className={`px-3 py-1.5 rounded text-sm font-medium transition-all ${timeRange === 'day' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-800'}`}
						>
							Ngày
						</button>
						<button
							onClick={() => setTimeRange('month')}
							className={`px-3 py-1.5 rounded text-sm font-medium transition-all ${timeRange === 'month' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-800'}`}
						>
							Tháng
						</button>
						<button
							onClick={() => setTimeRange('year')}
							className={`px-3 py-1.5 rounded text-sm font-medium transition-all ${timeRange === 'year' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-800'}`}
						>
							Năm
						</button>
					</div>
					<div className="h-6 w-px bg-gray-300"></div>
					<input
						type={timeRange === 'day' ? 'date' : timeRange === 'month' ? 'month' : 'number'}
						className="border-none focus:ring-0 text-sm text-gray-700 bg-transparent outline-none"
						value={selectedDate}
						onChange={(e) => setSelectedDate(e.target.value)}
						min="2000" max="2099" step="1"
					/>
				</div>
			</div>

			{/* Revenue Summary Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				{/* Total Revenue */}
				<div className="bg-gradient-to-br from-blue-600 to-blue-700 p-6 rounded-xl text-white shadow-lg">
					<div className="flex items-center justify-between mb-4">
						<div className="p-2 bg-blue-500 bg-opacity-30 rounded-lg">
							<DollarSign className="text-white" size={24} />
						</div>
						<span className="text-xs font-medium bg-blue-500 bg-opacity-30 px-2 py-1 rounded">Tổng cộng</span>
					</div>
					<p className="text-blue-100 text-sm font-medium mb-1">Tổng doanh thu</p>
					<p className="text-2xl font-bold">{formatVND(totalRevenue)}</p>
				</div>

				{/* Exam Revenue */}
				<div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
					<div className="flex items-center space-x-3 mb-2">
						<div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
							<Stethoscope size={20} />
						</div>
						<p className="text-gray-500 text-sm font-medium">Doanh thu Khám</p>
					</div>
					<p className="text-xl font-bold text-gray-800 mt-2">{formatVND(examRevenue)}</p>
					<p className="text-gray-800 mt-2">Số lượt khám: {examUsage}</p>
				</div>

				{/* Vaccine Revenue */}
				<div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
					<div className="flex items-center space-x-3 mb-2">
						<div className="p-2 bg-green-100 text-green-600 rounded-lg">
							<Syringe size={20} />
						</div>
						<p className="text-gray-500 text-sm font-medium">Doanh thu Tiêm</p>
					</div>
					<p className="text-xl font-bold text-gray-800 mt-2">{formatVND(vaccineRevenue)}</p>
					<p className='text-gray-800 mt-2'>Số lượt tiêm: {vaccineUsage}</p>
				</div>

				{/* Product Sales Revenue */}
				<div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
					<div className="flex items-center space-x-3 mb-2">
						<div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
							<ShoppingBag size={20} />
						</div>
						<p className="text-gray-500 text-sm font-medium">Sản phẩm bán ra</p>
					</div>
					<p className="text-xl font-bold text-gray-800 mt-2">{formatVND(productRevenue)}</p>
					<p className='text-gray-800 mt-2'>Số lượt mua hàng: {productUsage}</p>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				{/* Doctor Stats Table */}
				<div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
					<div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
						<h3 className="font-bold text-gray-800 flex items-center">
							<Users size={18} className="mr-2 text-blue-600" />
							Doanh thu theo Bác sĩ
						</h3>
					</div>
					<table className="w-full text-left">
						<thead className="bg-white border-b border-gray-100">
							<tr>
								<th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Bác sĩ</th>
								<th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase text-center">Số ca khám</th>
								<th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase text-center">Số ca tiêm</th>
								<th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase text-right">Doanh thu</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-100">
							{doctorStats.map((item: any) => (
								<tr key={item.MaNV} className="hover:bg-gray-50 transition-colors">
									<td className="px-6 py-4">
										<div className="flex flex-col">
											<span className="text-sm font-medium text-gray-900">{item.HoTen}</span>
											<span className="text-xs text-gray-500">{item.MaNV}</span>
										</div>
									</td>
									<td className="px-6 py-4 text-center">
										<span className="inline-block bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold">
											{item.SoCaKhamBenh}
										</span>
									</td>
									<td className="px-6 py-4 text-center">
										<span className="inline-block bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold">
											{item.SoCaTiemPhong}
										</span>
									</td>
									<td className="px-6 py-4 text-right text-sm font-semibold text-gray-800">
										{formatVND(item.TongDoanhThu)}
									</td>
								</tr>
							))}
							{/* Summary Row */}
							<tr className="bg-gray-50 font-bold text-gray-900">
								<td className="px-6 py-3 text-sm">Tổng cộng</td>
								<td className="px-6 py-3 text-center text-sm">{doctorStats.reduce((a, b) => a + b.SoCaKhamBenh, 0)}</td>
								<td className="px-6 py-3 text-center text-sm">{doctorStats.reduce((a, b) => a + b.SoCaTiemPhong, 0)}</td>
								<td className="px-6 py-3 text-right text-sm">{formatVND(doctorStats.reduce((a, b) => a + b.TongDoanhThu, 0))}</td>
							</tr>
						</tbody>
					</table>
				</div>

				{/* Visit Stats Table */}
				<div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-[500px]">
					<div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 shrink-0">
						<h3 className="font-bold text-gray-800 flex items-center">
							<TrendingUp size={18} className="mr-2 text-green-600" />
							Thống kê lượt Khám & Tiêm ({getLabel()})
						</h3>
					</div>
					<div className="overflow-y-auto flex-1">
						<table className="w-full text-left">
							<thead className="bg-white border-b border-gray-100 sticky top-0 shadow-sm">
								<tr>
									<th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Thời gian</th>
									<th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase text-center text-purple-600">Lượt Khám</th>
									<th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase text-center text-green-600">Lượt Tiêm</th>
									<th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase text-right">Tổng lượt</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-100">
								{visitStats.map((stat, index) => (
									<tr key={index} className="hover:bg-gray-50 transition-colors">
										<td className="px-6 py-4 text-sm font-medium text-gray-700">
											<div className="flex items-center space-x-2">
												<Calendar size={14} className="text-gray-400" />
												<span>{stat.NgayDat}</span>
											</div>
										</td>
										<td className="px-6 py-4 text-center text-sm text-gray-800">{stat.SoPhieuKham}</td>
										<td className="px-6 py-4 text-center text-sm text-gray-800">{stat.SoPhieuTiem}</td>
										<td className="px-6 py-4 text-right text-sm font-bold text-gray-900">{stat.SoPhieuKham + stat.SoPhieuTiem}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
					<div className="bg-gray-50 border-t border-gray-200 shrink-0">
						<table className="w-full text-left">
							<tbody>
								<tr className="font-bold text-gray-900">
									<td className="px-6 py-3 text-sm w-1/4">Tổng cộng</td>
									<td className="px-6 py-3 text-center text-sm w-1/4">{visitStats.reduce((a, b) => a + b.SoPhieuKham, 0)}</td>
									<td className="px-6 py-3 text-center text-sm w-1/4">{visitStats.reduce((a, b) => a + b.SoPhieuTiem, 0)}</td>
									<td className="px-6 py-3 text-right text-sm w-1/4">{visitStats.reduce((a, b) => a + b.SoPhieuKham + b.SoPhieuTiem, 0)}</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;