import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCustomerDetails, getPackageRegistration } from '../../api/doctor';
// import { getPetExams, getPetVaccinations} from '../../api/petApi';
import VaccinePackage from '../../components/doctor/common/VaccinePackage';

const PetDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('history');

  // const petData = petHistories[id];
  // const vaccinePackage = petVaccinePackages[id];

  // if (!petData) return <div className="p-10 text-center">Hồ sơ không tồn tại</div>;

  // const { info, history, vaccinationHistory = [] } = petData;

  // --- STATE QUẢN LÝ DỮ LIỆU THỰC TẾ ---
  const [petInfo, setPetInfo] = useState(null);
  // const [examHistory, setExamHistory] = useState([]);
  // const [vaccineHistory, setVaccineHistory] = useState([]);
  const [vaccinePackage, setVaccinePkg] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPetFullData = async () => {
      try {
        setLoading(true);
        // Chạy song song các API để tối ưu tốc độ
        const [customerData/*, exams, vaccinations, pkg*/] = await Promise.all([
          getCustomerDetails(id)    // Lấy info từ hàm bạn vừa đưa
          /*getPetExams(id),           // Lấy lịch sử khám
          getPetVaccinations(id),    // Lấy lịch sử tiêm
          getPackageRegistration(id)*/ // Lấy thông tin gói tiêm
        ]);
        // Vì getCustomerDetails trả về khách hàng, ta tìm đúng thú cưng có MaTC trùng với id
        // const currentPet = customerData.pets?.find(p => p.MaTC === id);
        const customer = customerData?.data?.[0];
        // if (currentPet) {
        //   // Bổ sung tên chủ nuôi từ object cha vào info thú cưng
        //   setPetInfo({ ...currentPet, TenChuNuoi: customerData.HoTen });
        // // }
        if (customer) {
          setPetInfo(customer);
        }
        // setExamHistory(exams || []);
        // setVaccineHistory(vaccinations || []);
        // setVaccinePkg(pkg);
      } catch (err) {
        console.error("Lỗi khi tải hồ sơ thú cưng:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPetFullData();
  }, [id]);

  const calculateAge = (birthDate) => {
    const birth = new Date(birthDate);
    const today = new Date();
    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    if (months < 0) { years--; months += 12; }
    return `${years} tuổi ${months} tháng`;
  };
  if (loading) return <div className="p-10 text-center">Đang tải hồ sơ thú cưng...</div>;
  if (!petInfo) return <div className="p-10 text-center">Không tìm thấy thông tin thú cưng</div>;
  return (
    <div className="bg-[#f4f7fe] min-h-screen py-6">
      <div className="max-w-6xl mx-auto px-6">
        <button onClick={() => navigate(-1)} className="text-sm text-slate-500 mb-6 flex items-center gap-1 hover:text-blue-600 transition-colors">
          ← Quay lại
        </button>

        {/* Header: Đã bỏ nút Đặt lịch và SDT */}
        <div className="bg-white rounded-2xl border p-6 mb-6 flex gap-6 items-center shadow-sm">
          <div className="w-24 h-24 rounded-2xl bg-slate-200 overflow-hidden flex-shrink-0 border-2 border-white shadow-sm">
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-800">{petInfo.TenTC}</h1>
              <span className="bg-blue-50 text-blue-600 px-3 py-0.5 rounded-lg text-xs font-bold uppercase">{petInfo.LoaiThuCung}</span>
            </div>
            {/* Đã bỏ cân nặng */}
            <p className="text-slate-800 mt-1">
              • Giống: {petInfo.TenGiong} • Tuổi: {calculateAge(petInfo.NgaySinh)} • {petInfo.GioiTinh}
            </p>
            {/* Đã bỏ Số điện thoại */}
            <p className="text-slate-800 mt-1">
              • Chủ nuôi: <span className="text-slate-800">{petInfo.HoTen}</span>
            </p>
          </div>
        </div>

        {/* Cảnh báo đặc biệt (Giống ảnh) */}
        {(petInfo.TinhTrangSucKhoe) && (
          <div className="bg-red-50/50 border border-red-100 rounded-2xl p-5 mb-6 flex items-start gap-4">
            <div className="text-red-500 text-xl mt-1"></div>
            <div className="space-y-2">
              <p className="text-xs font-bold text-red-800 uppercase tracking-widest">Cảnh báo đặc biệt</p>
              <div className="flex flex-wrap gap-2 items-center">
                <span className="bg-red-500 text-white text-[10px] px-3 py-1.5 rounded-full font-bold shadow-sm shadow-red-100">
                  {petInfo.TinhTrangSucKhoe}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Tab Navigation: Thêm nút Vacxin đã tiêm */}
        <div className="flex gap-2 mb-8">
          <TabButton label="Lịch sử khám" count={history.length} active={activeTab === 'history'} onClick={() => setActiveTab('history')} />
          <TabButton label="Gói tiêm phòng" count={vaccinePackage ? 1 : 0} active={activeTab === 'package'} onClick={() => setActiveTab('package')} />
          <TabButton label="Vacxin đã tiêm" count={vaccinationHistory.length} active={activeTab === 'vacxin'} onClick={() => setActiveTab('vacxin')} />
        </div>

        {/* Content Area */}
        {activeTab === 'history' && (
          <div className="relative pl-8 space-y-6">
            <div className="absolute left-3 top-0 bottom-0 w-px bg-slate-200" />
            {history.map((record) => (
              <div key={record.MaPhieuDV} className="relative group">
                <div className="absolute -left-[25px] top-6 w-4 h-4 rounded-full bg-blue-500 border-4 border-[#f4f7fe] group-hover:scale-125 transition-transform" />
                <div className="bg-white border rounded-2xl p-6 shadow-sm flex flex-col gap-0">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 rounded-lg bg-blue-50 text-blue-600 text-[10px] font-black uppercase">{record.LoaiDichVu}</span>
                      <span className="tx-8 py-5 text-sm text-slate-800">{record.NgayKham}</span>
                    </div>
                    <span className="px-8 py-5 text-sm text-slate-800">BS. {record.TenBacSi}</span>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <RecordField label="Triệu chứng" value={record.MoTaTrieuChung}/>
                    <RecordField label="Chẩn đoán" value={record.MoTaChuanDoan}/>
                    <RecordField label="Ngày tái khám" value={record.NgayTaiKham}/>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'package' && <VaccinePackage packageData={vaccinePackage} />}

        {activeTab === 'vacxin' && (
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
             <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100 text-[11px] font-bold text-slate-900 uppercase tracking-widest">
                   <tr>
                      <th className="px-8 py-4">Tên Vacxin</th>
                      <th className="px-8 py-4">Ngày tiêm</th>
                      <th className="px-8 py-4">Bác sĩ</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                   {vaccinationHistory.map((v, i) => (
                      <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                         <td className="px-8 py-5 text-sm text-slate-800">{v.TenVacxin}</td>
                         <td className="px-8 py-5 text-sm text-slate-800">{v.NgayTiem}</td>
                         <td className="px-8 py-5 text-sm text-slate-800">{v.TenBacSi}</td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
        )}
      </div>
    </div>
  );
};

const RecordField = ({ label, value }) => (
  <div className="flex gap-2 text-sm">
    <span className="font-semibold text-slate-800 min-w-[110px]">
      {label}:
    </span>
    <span className="text-slate-700">
      {value || '—'}
    </span>
  </div>
);


const TabButton = ({ label, count, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-6 py-3 rounded-xl text-base font-semibold transition-all flex items-center gap-3 border
    ${active
      ? 'bg-white text-slate-800 border-slate-200 shadow-sm'
      : 'text-slate-500 border-transparent hover:text-slate-700'
    }`}
  >
    {label}
    <span
      className={`px-2 py-0.5 rounded-md text-xs font-semibold
      ${active ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'}`}
    >
      {count}
    </span>
  </button>
);

export default PetDetail;