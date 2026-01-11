import React, { useState, useEffect } from 'react';
import { Search, UserPlus, ArrowRightLeft, Trash2, CalendarSearch, X } from 'lucide-react';
import PageNumber from '../../components/PageNumber';
import { formatDate, formatVND } from '../../components/formatter';
import '../../styles/Employees.css';

const BASEURL = "http://localhost:3000/api/v1"

function deploymentForm(deployments, index) {
	return (
		<button className="deployment-details" key={index}>
			<CalendarSearch size={40} className="text-gray-400 mx-auto" />
			<div className="product-info-details">
				<h3 className="text-lg font-medium text-gray-800">{formatDate(deployments.NgayBD)} -{'>'} {formatDate(deployments.NgayKT)}</h3>
				<p className="text-sm text-gray-600">Điều qua chi nhánh: {deployments.TenCN}</p>
				<p className="text-sm text-gray-600">Người điều động: {deployments.TenNguoiDieuDong}</p>
			</div>
		</button>
	)
}

export default function Employees() {
	const [currentEmployeesPage, setCurrentEmployeesPage] = useState(1);

	const [branchID, setBranchID] = useState(); // Chi nhánh của NVQL
	const [branches, setBranches] = useState(); // Danh sách chi nhánh
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

		async function fetchBranches() {
			try {
				const res = await fetch(`${BASEURL}/branches`);
				if (!res.ok)
					throw new Error(`Failed to fetch branches: ${res.status} ${res.statusText}`);
				const data = await res.json();
				setBranches(data);
			} catch (error) {
				console.error('Error fetching branches:', error);
			}
		}
		fetchBranches();
	}, []);

	const [totalBranchEmployees, setTotalBranchEmployees] = useState(1);
	const [employees, setEmployees] = useState([]); // Danh sách nhân viên của chi nhánh
	useEffect(() => {
		async function fetchEmployees() { // Mỗi trang = 10 p.tử
			if (!branchID) return;
			try {
				const token = localStorage.getItem('petcare_token');
				const res = await fetch(`${BASEURL}/staff?branchId=${branchID}&page=${currentEmployeesPage}&limit=6`, {
					headers: {
						'Authorization': `Bearer ${token}`
					}
				});
				if (!res.ok)
					throw new Error(`Failed to fetch employees: ${res.status} ${res.statusText}`);
				const data = await res.json();
				setEmployees(data.data);
			}
			catch (error) {
				console.error('Error fetching employees:', error);
			}
		}
		fetchEmployees();

		async function fetchTotalEmployees() {
			if (!branchID) return;
			try {
				const res = await fetch(`${BASEURL}/staff/count?branchId=${branchID}`);
				if (!res.ok)
					throw new Error(`Failed to fetch total employees: ${res.status} ${res.statusText}`);
				const total = await res.json();
				const totalPages = Math.ceil(total / 6);
				setTotalBranchEmployees(totalPages); // Mỗi trang 6 nhân viên
			}
			catch (error) {
				console.error('Error fetching total employees:', error);
			}
		}
		fetchTotalEmployees();
	}, [branchID, currentEmployeesPage]);

	const [searchTerm, setSearchTerm] = useState('');

	// Transfer Modal State
	const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
	const [selectedEmployee, setSelectedEmployee] = useState(null);
	const [targetBranch, setTargetBranch] = useState(''); // Chi nhánh điều động nhân viên đến
	const [transferDate, setTransferDate] = useState(''); // Ngày bắt đầu làm việc tại chi nhánh mới
	const [transferEndDate, setTransferEndDate] = useState(''); // Ngày kết thúc làm việc tại chi nhánh mới
	const [deploymentDetails, setDeploymentDetails] = useState(); // Chi tiết lịch sử điều động
	const [isdeploymentDetailsOpen, setIsDeploymentDetailsOpen] = useState(false);

	const handleTransferClick = (emp) => {
		setSelectedEmployee(emp);
		setIsTransferModalOpen(true);
	};

	const executeTransfer = async () => { // Xử lý thêm điều động
		if (!selectedEmployee) {
			alert('Không có nhân viên được chọn để điều động.');
			return;
		}
		if (!targetBranch) {
			alert('Vui lòng chọn chi nhánh điều động đến.');
			return;
		}
		if (!transferDate) {
			alert('Vui lòng chọn ngày bắt đầu điều động.');
			return;
		}
		if (!transferEndDate) {
			alert('Vui lòng chọn ngày kết thúc điều động.');
			return;
		}
		if (new Date(transferEndDate) <= new Date(transferDate)) {
			alert('Ngày kết thúc phải sau ngày bắt đầu.');
			return;
		}
		if (new Date(transferDate) < new Date()) {
			alert('Ngày bắt đầu không được trước ngày hiện tại.');
			return;
		}
		if(selectedEmployee.TrangThai !== 'Nghỉ việc') {
			alert('Nhân viên này đã nghỉ việc')
		}

		// Kiểm tra ngày bắt đầu và kết thúc có bị dính lịch điều động hiện tại không
		const token = localStorage.getItem('petcare_token');
		const resCheck = await fetch(`${BASEURL}/staff/deployment/${selectedEmployee.MaNV}`, {
			headers: {
				'Authorization': `Bearer ${token}`
			}
		});
		if (!resCheck.ok) {
			alert('Đã xảy ra lỗi khi kiểm tra lịch sử điều động nhân viên.');
			return;
		}
		const deployments = await resCheck.json();
		for (let dep of deployments) {
			const existingStart = new Date(dep.NgayBD);
			const existingEnd = dep.NgayKT ? new Date(dep.NgayKT) : null;
			const newStart = new Date(transferDate);
			const newEnd = new Date(transferEndDate);
			if ((newStart <= existingEnd && newEnd >= existingEnd)
				|| (newStart <= existingStart && newEnd >= existingStart)
				|| (newStart <= existingStart && newEnd >= existingEnd)) {
				alert('Lịch điều động mới bị trùng với lịch sử điều động hiện tại của nhân viên.');
				return;
			}
		}

		// Call API to execute transfer
		await fetch(`${BASEURL}/staff/deployment`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`
			},
			body: JSON.stringify({
				employeeID: selectedEmployee.MaNV,
				branchId: targetBranch,
				startDate: transferDate,
				endDate: transferEndDate
			})
		})
			.then(res => {
				if (!res.ok)
					throw new Error(`Failed to transfer staff: ${res.status} ${res.statusText}`);
				return res.json();
			})
			.then(data => {
				alert('Điều động nhân viên thành công.');
			})
			.catch(error => {
				console.error('Error transferring staff:', error);
				alert('Nhân viên không thể được điều động.');
			});

		setIsTransferModalOpen(false);
	};

	const handleDeploymentDetail = async (staffId) => {
		try {
			const token = localStorage.getItem('petcare_token');
			const res = await fetch(`${BASEURL}/staff/deployment/${staffId}`, {
				headers: {
					'Authorization': `Bearer ${token}`
				}
			});
			if (!res.ok)
				throw new Error(`Failed to fetch deployment details: ${res.status} ${res.statusText}`);
			const data = await res.json();
			setDeploymentDetails(data);
			setIsDeploymentDetailsOpen(true);
		}
		catch (error) {
			console.error('Error fetching deployment details:', error);
			alert('Đã xảy ra lỗi khi lấy chi tiết điều động.');
		}
	};

	const handlePageChanging = (page) => { // 6
		if (page < 1 || page > totalBranchEmployees) return;
		setCurrentEmployeesPage(page);
	};

	const handleRemoveStaff = async (staffId) => {
		const confirmDelete = window.confirm('Bạn có chắc chắn muốn xóa nhân viên này không?');
		if (!confirmDelete) return;
		const token = localStorage.getItem('petcare_token');
		const res = await fetch(`${BASEURL}/staff/remove?staffId=${staffId}`, {
			method: 'PATCH',
			headers: {
				'Authorization': `Bearer ${token}`
			}
		})
		if (!res.ok) {
			alert('Xóa nhân viên thất bại.');
			return;
		}
		alert('Xóa nhân viên thành công.');
		// Đổi trạng thái nhân viên qua "Nghỉ việc" trong giao diện
		setEmployees(prevEmployees => prevEmployees.map(emp => emp.MaNV === staffId ? { ...emp, TrangThai: 'Nghỉ việc' } : emp));
	}

	if (employees.length === 0) {
		return (
			<div className="p-6">
				<p className="text-medium text-gray-500">Đang tải các nhân viên của chi nhánh...</p>
			</div>
		)
	}
	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-2xl font-bold text-gray-800">Quản lý Nhân sự</h1>
					<p className="text-gray-500">Danh sách nhân viên, hiệu suất và điều động</p>
				</div>
				{/* <button
					className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
					// onClick={() => ()}
				>
					<UserPlus size={18} />
					<span>Thêm nhân viên</span>
				</button> */}
			</div>

			<div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
				<div className="relative">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
					<input
						type="text"
						placeholder="Tìm nhân viên theo tên, mã hoặc chức vụ..."
						className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{employees.filter(e => e.HoTen.toLowerCase().includes(searchTerm.toLowerCase())).map(emp => (
					<div key={emp.MaNV} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col justify-between">
						<div>
							<div className="flex justify-between items-start mb-4">
								<div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-lg">
									{emp.HoTen.charAt(0)}
								</div>
								<span className={`px-2 py-1 rounded-full text-xs font-medium ${emp.TrangThai === 'Đang làm' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
									}`}>
									{emp.TrangThai}
								</span>
							</div>
							<h3 className="text-lg font-bold text-gray-800">{emp.HoTen}</h3>
							<p className="text-sm text-gray-500 mb-1">{emp.TenChucVu} • {emp.MaNV}</p>
							<p
								className="cursor-pointer hover:text-blue-600 text-sm text-gray-500"
								onClick={() => handleDeploymentDetail(emp.MaNV)}
							>Xem lịch sử điều động</p>

							<div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
								<div className="flex justify-between text-sm">
									<span className="text-gray-500">Lương cơ bản:</span>
									<span className="font-medium text-gray-800">{formatVND(emp.LuongCoBan)}</span>
								</div>
								<div className="flex justify-between text-sm">
									<span className="text-gray-500">Ngày sinh:</span>
									<span className="font-medium text-gray-800">{formatDate(emp.NgaySinh)}</span>
								</div>
								<div className="flex justify-between text-sm">
									<span className="text-gray-500">Giới tính:</span>
									<span className="font-medium text-gray-800">{emp.GioiTinh}</span>
								</div>
								<div className="flex justify-between text-sm">
									<span className="text-gray-500">Số điện thoại:</span>
									<span className="font-medium text-gray-800">{emp.SDT}</span>
								</div>
								<div className="flex justify-between text-sm">
									<span className="text-gray-500">Ngày vào làm:</span>
									<span className="font-medium text-gray-800">{formatDate(emp.NgayVaoLam)}</span>
								</div>
							</div>
						</div>

						<div className="mt-6 flex space-x-2">
							<button
								onClick={() => handleTransferClick(emp)}
								className="cursor-pointer flex-1 bg-white border border-gray-300 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center justify-center space-x-1"
							>
								<ArrowRightLeft size={16} />
								<span>Điều động</span>
							</button>
							<button
								className="cursor-pointer flex-1 bg-white border border-red-200 text-red-600 py-2 rounded-lg text-sm font-medium hover:bg-red-50 flex items-center justify-center space-x-1"
								onClick={() => handleRemoveStaff(emp.MaNV)}
							>
								<Trash2 size={16} />
								<span>Xóa</span>
							</button>
						</div>
					</div>
				))}
			</div>
			<PageNumber currentPage={currentEmployeesPage} totalPages={totalBranchEmployees} onPageChange={handlePageChanging} />

			{/* Transfer ( Điều động ) */}
			{isTransferModalOpen && selectedEmployee && (
				<div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
					<div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
						<h2 className="text-xl font-bold text-gray-800 mb-4">Điều động nhân viên</h2>
						<p className="text-sm text-gray-600 mb-6">
							Bạn đang thực hiện điều động <span className="font-bold">{selectedEmployee.HoTen}</span> sang chi nhánh khác.
						</p>

						<div className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">Cử đến chi nhánh</label>
								<select
									className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
									value={targetBranch}
									onChange={(e) => setTargetBranch(e.target.value)}
								>
									<option value="">Chọn chi nhánh...</option>
									{branches.filter(b => b.MaCN !== branchID).map(b => (
										<option key={b.MaCN} value={b.MaCN}> {b.TenCN} </option>
									))}
								</select>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">Ngày bắt đầu làm việc</label>
								<input
									type="date"
									className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
									value={transferDate}
									onChange={(e) => setTransferDate(e.target.value)}
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">Ngày kết thúc làm việc</label>
								<input
									type="date"
									className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
									value={transferEndDate}
									onChange={(e) => setTransferEndDate(e.target.value)}
								/>
							</div>
						</div>

						<div className="mt-8 flex justify-end space-x-3">
							<button
								onClick={() => setIsTransferModalOpen(false)}
								className="cursor-pointer px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium"
							>
								Hủy bỏ
							</button>
							<button
								onClick={executeTransfer}
								disabled={!targetBranch || !transferDate}
								className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								Xác nhận điều động
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Deployment Details Modal */}
			{isdeploymentDetailsOpen && deploymentDetails && (
				<div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
						<div className="bg-blue-600 px-6 py-4 flex justify-between items-center">
							<h2 className="text-white font-bold text-lg">
								Thông tin điều động nhân viên
							</h2>
							<button onClick={() => setIsDeploymentDetailsOpen(false)} className="cursor-pointer text-blue-100 hover:text-white">
								<X size={20} />
							</button>
						</div>

						<div className="deployment-section">
							{deploymentDetails.length === 0 ? (
								<p className="p-6 text-gray-600">Chưa có lịch sử điều động nào.</p>
							) : (
								<div className="deployments-list">
									{deploymentDetails.map((dep, index) => deploymentForm(dep, index))}
								</div>
							)}
						</div>
					</div>
				</div>
			)}
		</div>
	)
};