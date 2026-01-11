import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAppointmentQueue } from '../../api/doctor';


const Dashboard = () => {
	const navigate = useNavigate();
	// const [filter, setFilter] = useState('all');
	// // 1. Thêm state để quản lý nội dung tìm kiếm
	// const [searchTerm, setSearchTerm] = useState('');

	// // 2. Cập nhật logic lọc dữ liệu kết hợp cả Tabs và Thanh tìm kiếm
	// const filteredAppointments = appointments.filter(apt => {
	// 	// Lọc theo Tab (Tất cả / Khám bệnh / Tiêm phòng)
	// 	const matchesTab = filter === 'all' || apt.type === filter;

	// 	// Lọc theo nội dung tìm kiếm (Mã, tên thú cưng, chủ nuôi)
	// 	const searchLower = searchTerm.toLowerCase();
	// 	const matchesSearch =
	// 		apt.petName.toLowerCase().includes(searchLower) ||
	// 		apt.owner.toLowerCase().includes(searchLower) ||
	// 		apt.maTC.toLowerCase().includes(searchLower);

	// 	return matchesTab && matchesSearch;
	// });


	// --- KHAI BÁO STATE MỚI ---
    const [queue, setQueue] = useState([]); // Lưu danh sách hàng đợi thực tế
    const [stats, setStats] = useState({    // Lưu các con số thống kê thực tế
        totalAppointments: 0,
        waitingCount: 0,
        clinicalCount: 0,
        vaccinationCount: 0
    });
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    // --- GỌI API KHI COMPONENT LOAD ---
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const response = await getAppointmentQueue();
                if (response.success) {
                    // Cấu trúc response khớp với Backend bạn đã viết: { dashboardStats, queue }
                    setQueue(response.queue);
                    setStats(response.dashboardStats);
                }
            } catch (err) {
                console.error("Lỗi khi lấy dữ liệu dashboard:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    // --- CẬP NHẬT LOGIC LỌC (Dựa trên tên cột từ SQL) ---
    const filteredAppointments = queue.filter(apt => {
        // Ánh xạ LoaiDichVu từ DB sang filter của UI
        const typeMapping = apt.LoaiDichVu === 'Khám bệnh' ? 'clinic' : 'vaccine';
        const matchesTab = filter === 'all' || typeMapping === filter;

        const searchLower = searchTerm.toLowerCase();
        const matchesSearch =
            apt.TenThuCung.toLowerCase().includes(searchLower) ||
            apt.TenKhachHang.toLowerCase().includes(searchLower) ||
            apt.MaPhieuDV.toLowerCase().includes(searchLower);

        return matchesTab && matchesSearch;
    });

    if (loading) return <div className="p-8 text-center">Đang tải dữ liệu...</div>;



	return (
		<div className="p-8 bg-[#f4f7fe] min-h-screen text-slate-900 antialiased">
			{/* ===== HEADER ===== */}
			<div className="flex justify-between items-start mb-8">
				<div>
					<h1 className="text-2xl font-extrabold tracking-tight">Dashboard</h1>
					<p className="text-sm text-slate-600 mt-1">
						🗓 Thứ Năm, 1 tháng 1, 2026
					</p>
				</div>

				<div className="relative">
					{/* 3. Kết nối ô input với state searchTerm */}
					<input
						type="text"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						placeholder="Tìm theo tên thú cưng, chủ nuôi..."
						className="w-80 pl-11 pr-4 py-2.5 rounded-2xl border border-slate-300 text-sm font-medium
                      placeholder:text-slate-500 focus:ring-4 focus:ring-blue-200 outline-none"
					/>
					<span className="absolute left-4 top-3 text-slate-500">🔍</span>
				</div>
			</div>

			{/* ===== STATS ===== */}
			{/* <div className="grid grid-cols-4 gap-6 mb-8">
				<StatBox title="Tổng lịch hẹn" val={dashboardStats.totalAppointments} sub="Hôm nay" icon="📅" />
				<StatBox title="Đang chờ" val={dashboardStats.waitingCount} sub="1 đang khám" icon="🕒" />
				<StatBox title="Khám bệnh" val={dashboardStats.clinicalCount} sub="Khám mới + Tái khám" icon="🩺" />
				<StatBox title="Tiêm phòng" val={dashboardStats.vaccinationCount} sub="Lẻ + Gói tiêm" icon="💉" />
			</div> */}

			<div className="grid grid-cols-4 gap-6 mb-8">
                <StatBox title="Tổng lịch hẹn" val={stats.totalAppointments} sub="Hôm nay" icon="📅" />
                <StatBox title="Đang chờ" val={stats.waitingCount} sub="Chưa thực hiện" icon="🕒" />
                <StatBox title="Khám bệnh" val={stats.clinicalCount} sub="Khám mới + Tái khám" icon="🩺" />
                <StatBox title="Tiêm phòng" val={stats.vaccinationCount} sub="Lẻ + Gói tiêm" icon="💉" />
            </div>

			{/* ===== TABLE ===== */}
			<div className="bg-white rounded-3xl border border-slate-300 overflow-hidden">
				{/* Tabs - Cập nhật số lượng count hiển thị dựa trên dữ liệu thực tế nếu muốn */}
				<div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
					<div className="flex gap-8">
						{/* <FilterTab label="Tất cả" count={appointments.length} active={filter === 'all'} onClick={() => setFilter('all')} />
						<FilterTab label="Khám bệnh" count={appointments.filter(a => a.type === 'clinic').length} active={filter === 'clinic'} onClick={() => setFilter('clinic')} />
						<FilterTab label="Tiêm phòng" count={appointments.filter(a => a.type === 'vaccine').length} active={filter === 'vaccine'} onClick={() => setFilter('vaccine')} /> */}
						<FilterTab label="Tất cả" count={queue.length} active={filter === 'all'} onClick={() => setFilter('all')} />
                        <FilterTab label="Khám bệnh" count={queue.filter(a => a.LoaiDichVu === 'Khám bệnh').length} active={filter === 'clinic'} onClick={() => setFilter('clinic')} />
                        <FilterTab label="Tiêm phòng" count={queue.filter(a => a.LoaiDichVu === 'Tiêm phòng').length} active={filter === 'vaccine'} onClick={() => setFilter('vaccine')} />
					</div>

					<button className="px-4 py-2 border border-slate-300 rounded-xl text-sm font-semibold hover:bg-slate-100">
						⚚ Bộ lọc
					</button>
				</div>

				<table className="w-full table-fixed border-collapse">
					<thead>
						<tr className="bg-slate-100 text-sm font-bold border-b border-slate-300">
							<th className="w-[60px] px-6 py-4 text-center">STT</th>
							<th className="w-[100px] px-6 py-4 text-left">Thú cưng</th>
							<th className="w-[150px] px-6 py-4 text-left">Chủ nuôi</th>
							<th className="w-[130px] px-6 py-4 text-left">Dịch vụ</th>
							<th className="w-[120px] px-6 py-4 text-center">Giờ hẹn</th>
							<th className="w-[140px] px-6 py-4 text-center">Trạng thái</th>
							<th className="w-[140px] px-6 py-4 text-center">Hành động</th>
						</tr>
					</thead>

					<tbody>
						{filteredAppointments.length > 0 ? (
							filteredAppointments.map((apt, index) => (
								<tr
									key={apt.MaPhieuDV}
									onClick={() => navigate(`/doctor/pet/${apt.MaTC}`)}
									className={`border-b border-slate-200 hover:bg-slate-50 cursor-pointer
                    ${apt.TrangThai === 'Đang chờ' ? 'bg-blue-50' : ''}
                  `}
								>
									<td className="w-[60px] px-6 py-5 text-center flex-col leading-tight font-semibold text-sm">
										{String(index + 1).padStart(2, '0')}
									</td>
									<td className="w-[100px] px-6 py-5">
										<div className="flex flex-col leading-tight">
											<span className="font-semibold">{apt.TenThuCung}</span>
										</div>
									</td>
									<td className="w-[150px] px-6 py-5">
										<div className="flex flex-col leading-tight">
											<span className="font-semibold">{apt.TenKhachHang}</span>
										</div>
									</td>
									<td className="w-[130px] px-6 py-5">
										<div className="flex items-center gap-3 font-semibold">
											<span>{apt.LoaiDichVu === 'Khám bệnh' ? '🩺' : '💉'}</span>
											{apt.LoaiDichVu}
										</div>
									</td>
									<td className="w-[120px] px-6 py-5 text-center font-semibold">
										🕒 {apt.GioDat}
									</td>
									<td className="w-[140px] px-6 py-5 text-center">
										{/* <span className={`px-3 py-1 rounded-full text-sm font-bold inline-block
											${apt.TrangThai === 'Đang thực hiện' && 'bg-blue-100 text-blue-800'}
											${apt.TrangThai === 'Đang chờ' && 'bg-amber-100 text-amber-800'}
                    					`}>
											{apt.TrangThai}
										</span> */}
										<span className={`px-3 py-1 rounded-full text-sm font-bold inline-block
											${apt.TrangThai === 'Đang chờ' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'}
										`}>
											{apt.TrangThai}
										</span>
									</td>
									<td className="w-[140px] px-6 py-5 text-center">
										{apt.TrangThai === 'Đang chờ' && (
											<button
												onClick={(e) => {
													e.stopPropagation();
													if (apt.LoaiDichVu === 'Khám bệnh') {
														navigate(`/doctor/exam/${apt.MaPhieuDV}`); // Chuyển sang trang khám bạn vừa tạo
													} else {
														navigate(`/doctor/vaccination/${apt.MaPhieuDV}`);
													}
												}}
												className={`w-[90px] h-[38px] rounded-xl text-sm font-bold text-white
                          						${apt.LoaiDichVu === 'Khám bệnh'
														? 'bg-blue-600 hover:bg-blue-700'
														: 'bg-emerald-600 hover:bg-emerald-700'}
                        						`}
											>
												{apt.LoaiDichVu === 'Khám bệnh' ? 'Khám' : 'Tiêm'}
											</button>
										)}
									</td>
								</tr>
							))
						) : (
							<tr>
								<td colSpan="7" className="px-6 py-10 text-center text-slate-500 font-medium">
									Không tìm thấy lịch hẹn nào phù hợp.
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
};

/* ===== COMPONENTS GIỮ NGUYÊN ===== */
const FilterTab = ({ label, count, active, onClick }) => (
	<button onClick={onClick} className={`font-semibold pb-3 relative
    ${active ? 'text-slate-900' : 'text-slate-600 hover:text-slate-800'}
  `}>
		{label} <span className="text-slate-500 font-medium">{count}</span>
		{active && <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 rounded-full" />}
	</button>
);

const StatBox = ({ title, val, sub, icon }) => (
	<div className="bg-white p-6 rounded-3xl border border-slate-300 flex justify-between">
		<div>
			<p className="text-xs font-semibold text-slate-600 uppercase">{title}</p>
			<h3 className="text-3xl font-extrabold">{val}</h3>
			<p className="text-sm text-slate-600">{sub}</p>
		</div>
		<div className="w-12 h-12 rounded-2xl bg-slate-200 flex items-center justify-center text-xl">
			{icon}
		</div>
	</div>
);

export default Dashboard;





