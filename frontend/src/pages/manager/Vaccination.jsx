import React, { useState, useEffect } from 'react';
import { formatDate } from '../../components/formatter';
import { formatVND } from '../../components/formatter';
import { Search, Info, Activity, Plus, Syringe, X, Save, Trash2 } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import '../../styles/Vaccination.css';

const BASEURL = "http://localhost:3000/api/v1"

function vacxinForm({ MaVacXin, TenVacXin, NgaySanXuat, GiaVacXin, DonViTinh, currentVacxin }, setCurrentVacxin) {
	return (
		<button key={MaVacXin}
			className={currentVacxin.MaVacXin === MaVacXin ? "bg-blue-50 vacxin-info" : "vacxin-info"}
			onClick={() => setCurrentVacxin({ MaVacXin, TenVacXin, NgaySanXuat, GiaVacXin, DonViTinh })}
		>
			<div className='vacxin-icon'>
				<Syringe size={30}/>
			</div>
			<div className='vacxin-text'>
				<p className='font-bold vacxin-maintext'>{MaVacXin} - {TenVacXin}</p>
				<p><span className="vacxin-subtext font-medium">Ngày SX:</span> {formatDate(NgaySanXuat)}</p>
				<p><span className="vacxin-subtext font-medium">Giá:</span> {formatVND(GiaVacXin)} / {DonViTinh}</p>
			</div>
		</button>
	)
}

export default function Vaccination() {
	const [activeTab, setActiveTab] = useState('list');
	const [searchTerm, setSearchTerm] = useState('');

	// State quản lý danh sách vắc-xin (Local state simulation)
	const [vaccines, setVaccines] = useState([]);
	const [allVaccines, setAllVaccines] = useState([]);
	const [vacxinUseRates, setVacxinUseRates] = useState([]);

	const [branchID, setBranchID] = useState("");
	// Lấy dữ liệu branch của quản lý
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

	useEffect(() => {
		if(!branchID) return;
		async function fetchVacxinsByBranch() {
			try {
				const res = await fetch(`${BASEURL}/vacxin/branch?id=${branchID}`);
				if (!res.ok)
					throw new Error(`Failed to fetch vaccines by branch: ${res.status} ${res.statusText}`);
				const data = await res.json();
				setVaccines(data);
			} catch (error) {
				console.error('Error fetching vaccines by branch:', error);
			}
		}

		async function fetchAllVacxins() {
			try {
				const res = await fetch(`${BASEURL}/vacxin`);
				if (!res.ok)
					throw new Error(`Failed to fetch all vaccines: ${res.status} ${res.statusText}`);
				const data = await res.json();
				setAllVaccines(data);
			} catch (error) {
				console.error('Error fetching all vaccines:', error);
			}
		}
		
		async function fetchVacxinUseRates() {
			try {
				const res = await fetch(`${BASEURL}/vacxin/branch/use-rate?id=${branchID}`);
				if (!res.ok)
					throw new Error(`Failed to fetch vaccine use rates: ${res.status} ${res.statusText}`);
				const data = await res.json();
				setVacxinUseRates(data);
			}
			catch (error) {
				console.error('Error fetching vaccine use rates:', error);
			}
		}

		fetchVacxinUseRates();
		fetchVacxinsByBranch();
		fetchAllVacxins();
	}, [branchID]);

	// State cho Modal thêm/sửa
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isSelectOpen, setIsSelectOpen] = useState(false);
	const [currentVacxin, setCurrentVacxin] = useState({
		MaVacXin: '',
		TenVacXin: '',
		NgaySanXuat: '',
		GiaVacXin: 0,
		TonKho: 0
	});

	const filteredVaccines = vaccines.filter(v =>
		v.TenVacXin.toLowerCase().includes(searchTerm.toLowerCase()) ||
		v.MaVacXin.toLowerCase().includes(searchTerm.toLowerCase())
	);

	// Mở modal để thêm mới
	const handleAddNew = () => {
		setCurrentVacxin({
			MaVacXin: '',
			TenVacXin: '',
			NgaySanXuat: '',
			GiaVacXin: 0,
			DonViTinh: '',
			TonKho: 0
		});
		setIsModalOpen(true);
	};

	// Xóa vắc-xin khỏi chi nhánh
	const handleDelete = async (maVacXin) => {
		try {
			const res = await fetch(`${BASEURL}/vacxin/branch?branchId=${branchID}&vacxinId=${maVacXin}`, {
				method: 'DELETE'
			});
			if (!res.ok)
				throw new Error(`Failed to delete vaccine from branch: ${res.status} ${res.statusText}`);
			setVaccines(vaccines.filter(v => v.MaVacXin !== maVacXin));
			alert('Đã xóa vắc-xin khỏi chi nhánh thành công');
		} catch (error) {
			console.error('Error deleting vaccine from branch:', error);
			alert('Xóa vắc-xin thất bại. Vui lòng thử lại.');
		}
	};

	// Xử lý khi chọn vac-xin từ danh sách
	const handleSelectedVacxin = () => {
		if (!currentVacxin.MaVacXin) {
			alert("Vui lòng chọn vắc-xin từ danh sách!");
			return;
		}

		if (vaccines.find(v => v.MaVacXin === currentVacxin.MaVacXin)) {
			alert("Vắc-xin đã có trong chi nhánh!");
			return;
		}

		setIsModalOpen(false);
		setIsSelectOpen(true);
	};

	// Thêm vac-xin vào chi nhánh
	const handleSave = async () => {
		if (currentVacxin.TonKho <= 0) {
			alert("Tồn kho không thể là số âm hoặc bằng 0!");
			return;
		}

		try {
			// Thêm vắc-xin vào chi nhánh
			const resBranch = await fetch(`${BASEURL}/vacxin/branch`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					branchId: branchID,
					vacxinId: currentVacxin.MaVacXin,
					tonKho: currentVacxin.TonKho
				})
			});
			if (!resBranch.ok)
				throw new Error(`Failed to add vaccine to branch: ${resBranch.status} ${resBranch.statusText}`);

			setVaccines([...vaccines, currentVacxin]);
			setIsModalOpen(false);
			alert('Đã thêm vắc-xin mới thành công');
		} catch (error) {
			console.error('Error adding vaccine:', error);
			alert('Thêm vắc-xin thất bại. Vui lòng thử lại.');
		}

		setIsSelectOpen(false);
	};

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-2xl font-bold text-gray-800">Quản lý Tiêm phòng</h1>
					<p className="text-gray-500">Tra cứu vắc-xin và thống kê lượt tiêm</p>
				</div>

				<div className="flex space-x-3">
					{/* Tab Switcher */}
					<div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
						<button
							className={`cursor-pointer px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'list' ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
							onClick={() => setActiveTab('list')}
						>
							Danh mục
						</button>
						<button
							className={`cursor-pointer px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'stats' ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
							onClick={() => setActiveTab('stats')}
						>
							Thống kê
						</button>
					</div>

					{/* Add vacxin Button */}
					{activeTab === 'list' && (
						<button
							onClick={handleAddNew}
							className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors shadow-sm"
						>
							<Plus size={18} />
							<span>Thêm Vắc-xin</span>
						</button>
					)}
				</div>
			</div>

			{activeTab === 'list' && (
				<div className="space-y-4">
					<div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
						<div className="relative">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
							<input
								type="text"
								placeholder="Tìm vắc-xin theo tên, mã hoặc loại..."
								className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
							/>
						</div>
					</div>

					<div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
						<table className="w-full text-left">
							<thead className="bg-gray-50 border-b border-gray-200">
								<tr>
									<th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase text-center">Mã VX</th>
									<th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase text-center">Tên Vắc-xin</th>
									<th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase text-center">Ngày SX</th>
									<th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase text-center">Giá</th>
									<th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase text-center">Đơn vị tính</th>
									<th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase text-center">Tồn kho</th>
									<th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase text-center">Thao tác</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-200">
								{filteredVaccines.length > 0 ? filteredVaccines.map((vx) => (
									<tr key={vx.MaVacXin} className="hover:bg-gray-50 transition-colors">
										<td className="px-6 py-4 text-sm font-medium text-gray-900 text-center">{vx.MaVacXin}</td>
										<td className="px-6 py-4 text-sm text-gray-800 font-medium text-center">{vx.TenVacXin}</td>
										<td className="px-6 py-4 text-sm text-gray-600 text-center">{formatDate(vx.NgaySanXuat)}</td>
										<td className="px-6 py-4 text-sm text-gray-800 text-center">
											{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(vx.GiaVacXin)}
										</td>
										<td className="px-6 py-4 text-sm text-gray-800 text-center">{vx.DonViTinh}</td>
										<td className="px-6 py-4 text-sm text-center">
											<span className={`font-bold ${vx.TonKho < 10 ? 'text-red-500' : 'text-gray-800'}`}>
												{vx.TonKho}
											</span>
										</td>
										<td className="px-6 py-4 text-sm text-center flex justify-center space-x-3">
											<button
												onClick={() => handleDelete(vx.MaVacXin)}
												className="text-gray-500 hover:text-red-600 transition-colors p-1"
												title="Xóa vắc-xin"
											>
												<Trash2 size={16} />
											</button>
										</td>
									</tr>
								)): <td colSpan="7" className="text-center text-gray-500 py-4">Đang tìm kiếm danh sách vắc-xin ...</td> 
								}
							</tbody>
						</table>
					</div>
				</div>
			)}

			{activeTab === 'stats' && (
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					<div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
						<h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
							<Activity className="mr-2 text-blue-600" />
							Top Vắc-xin được đặt nhiều nhất
						</h3>
						<div className="h-80">
							<ResponsiveContainer width="100%" height="100%">
								<BarChart data={vacxinUseRates} layout="vertical">
									<CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
									<XAxis type="number" hide />
									<YAxis type="category" dataKey="TenVacXin" width={150} tick={{ fontSize: 12 }} />
									<Tooltip cursor={{ fill: '#f8fafc' }} />
									<Bar dataKey="LuotSuDung" fill="#4f46e5" radius={[0, 4, 4, 0]} barSize={30} name="Số lượt tiêm" />
								</BarChart>
							</ResponsiveContainer>
						</div>
					</div>
				</div>
			)}

			{/* Modal Popup */}
			{isModalOpen && (
				<div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
						<div className="bg-blue-600 px-6 py-4 flex justify-between items-center">
							<h2 className="text-white font-bold text-lg">
								Thêm Vac-xin mới
							</h2>
							<button onClick={() => setIsModalOpen(false)} className="cursor-pointer text-blue-100 hover:text-white">
								<X size={20} />
							</button>
						</div>

						<label className="block px-6 pt-4 font-medium text-gray-700 mb-5 text-[18px]">Chọn vắc-xin từ danh sách bên dưới:<hr className="w-[250px]"/></label>
						<div className="vacxin-list">
							{allVaccines.map(
								vx => vacxinForm({ ...vx, currentVacxin }, setCurrentVacxin))}
						</div>

						<div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3 border-t border-gray-100">
							<button
								onClick={() => setIsModalOpen(false)}
								className="cursor-pointer px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium"
							>
								Hủy bỏ
							</button>
							<button
								onClick={() => handleSelectedVacxin()}
								className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center space-x-2"
							>
								<Save size={16} />
								<span>Thêm mới</span>
							</button>
						</div>
					</div>
				</div>
			)}

			{isSelectOpen && !isModalOpen && (
				<div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
						<div className="bg-blue-600 px-6 py-4 flex justify-between items-center">
							<h2 className="text-white font-bold text-lg">
								Nhập Vacxin vào chi nhánh
							</h2>
							<button onClick={() => setIsSelectOpen(false)} className="cursor-pointer text-blue-100 hover:text-white">
								<X size={20} />
							</button>
						</div>

						<input
							type="number"
							min="1"
							className="w-[90%] border border-gray-300 rounded-lg p-3 my-4 outline-none focus:ring-2 focus:ring-blue-500"
							style={{ margin: '20px auto', display: 'block' }}
							placeholder="Nhập số lượng tồn kho"
							value={currentVacxin.TonKho}
							onChange={(e) => setCurrentVacxin({ ...currentVacxin, TonKho: parseInt(e.target.value) })}
						/>

						<div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3 border-t border-gray-100">
							<button
								onClick={() => setIsSelectOpen(false)}
								className="cursor-pointer px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium"
							>
								Hủy bỏ
							</button>
							<button
								onClick={() => handleSave()}
								className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center space-x-2"
							>
								<Save size={16} />
								<span>Thêm mới</span>
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};