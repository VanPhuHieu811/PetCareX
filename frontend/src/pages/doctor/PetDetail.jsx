import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// Đảm bảo đường dẫn import đúng với cấu trúc dự án của bạn
import { 
  getCustomerDetails, 
  getPackageRegistration, 
  getPetExams, 
  getPetVaccinations 
} from '../../api/doctor';
import VaccinePackage from '../../components/doctor/common/VaccinePackage';

const PetDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('history');

  // --- STATE QUẢN LÝ DỮ LIỆU ---
  const [petInfo, setPetInfo] = useState(null);
  const [history, setExamHistory] = useState([]);
  const [vaccinationHistory, setVaccineHistory] = useState([]);
  const [vaccinePackage, setVaccinePkg] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPetFullData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        // Chạy song song các API để tối ưu tốc độ load trang
        const [customerData, exams, vaccinations, pkg] = await Promise.all([
          getCustomerDetails(id),     // API lấy thông tin chi tiết thú cưng & chủ nuôi
          getPetExams(id),            // API lấy lịch sử khám
          getPetVaccinations(id),     // API lấy lịch sử tiêm
          getPackageRegistration(id)  // API lấy thông tin gói tiêm
        ]);

        // Xử lý dữ liệu Pet Info
        // Giả định API trả về { data: [ { ...thông tin } ] }
        const petDetails = customerData?.data?.[0] || customerData?.data || customerData; 
        
        if (petDetails) {
          setPetInfo(petDetails);
        }

        // Xử lý dữ liệu danh sách (đảm bảo luôn là mảng)
        setExamHistory(Array.isArray(exams) ? exams : (exams?.data || []));
        setVaccineHistory(Array.isArray(vaccinations) ? vaccinations : (vaccinations?.data || []));
        
        // Xử lý gói vaccine
        setVaccinePkg(pkg?.data || pkg);

      } catch (err) {
        console.error("Lỗi khi tải hồ sơ thú cưng:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPetFullData();
  }, [id]);

  const calculateAge = (birthDate) => {
    if (!birthDate) return 'Không rõ';
    const birth = new Date(birthDate);
    const today = new Date();
    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    if (months < 0) { years--; months += 12; }
    
    if (years > 0) return `${years} tuổi ${months} tháng`;
    return `${months} tháng`;
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen bg-[#f4f7fe]">
      <div className="text-slate-500 font-medium">Đang tải hồ sơ thú cưng...</div>
    </div>
  );

  if (!petInfo) return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-[#f4f7fe] gap-4">
      <div className="text-slate-500">Không tìm thấy thông tin thú cưng</div>
      <button onClick={() => navigate(-1)} className="text-blue-600 hover:underline">Quay lại</button>
    </div>
  );

  return (
    <div className="bg-[#f4f7fe] min-h-screen py-6">
      <div className="max-w-6xl mx-auto px-6">
        <button 
          onClick={() => navigate(-1)} 
          className="text-sm text-slate-500 mb-6 flex items-center gap-1 hover:text-blue-600 transition-colors"
        >
          ← Quay lại
        </button>

        {/* --- Header Thông Tin Thú Cưng --- */}
        <div className="bg-white rounded-2xl border p-6 mb-6 flex gap-6 items-center shadow-sm">
          {/* Avatar Placeholder */}
          <div className="w-24 h-24 rounded-2xl bg-slate-200 overflow-hidden flex-shrink-0 border-2 border-white shadow-sm flex items-center justify-center text-slate-400">
             <span className="text-2xl">🐾</span>
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-800">{petInfo.TenTC || 'Không tên'}</h1>
              <span className="bg-blue-50 text-blue-600 px-3 py-0.5 rounded-lg text-xs font-bold uppercase">
                {petInfo.LoaiThuCung || 'Thú cưng'}
              </span>
            </div>
            
            <p className="text-slate-600 mt-2 text-sm">
              • Giống: <span className="font-medium text-slate-800">{petInfo.TenGiong}</span> 
              <span className="mx-2">|</span> 
              Tuổi: <span className="font-medium text-slate-800">{calculateAge(petInfo.NgaySinh)}</span> 
              <span className="mx-2">|</span> 
              Giới tính: <span className="font-medium text-slate-800">{petInfo.GioiTinh}</span>
            </p>
            
            <p className="text-slate-600 mt-1 text-sm">
              • Chủ nuôi: <span className="font-bold text-slate-800">{petInfo.HoTen}</span>
            </p>
          </div>
        </div>

        {/* --- Cảnh báo đặc biệt (Chỉ hiện khi tình trạng khác "Bình thường") --- */}
        {petInfo.TinhTrangSucKhoe && petInfo.TinhTrangSucKhoe !== 'Bình thường' && (
          <div className="bg-red-50/50 border border-red-100 rounded-2xl p-5 mb-6 flex items-start gap-4 animate-pulse-slow">
            <div className="space-y-2">
              <p className="text-xs font-bold text-red-800 uppercase tracking-widest flex items-center gap-2">
                ⚠️ Cảnh báo sức khỏe
              </p>
              <div className="flex flex-wrap gap-2 items-center">
                <span className="bg-red-500 text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-sm shadow-red-100">
                  {petInfo.TinhTrangSucKhoe}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* --- Tab Navigation --- */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          <TabButton 
            label="Lịch sử khám" 
            count={history.length} 
            active={activeTab === 'history'} 
            onClick={() => setActiveTab('history')} 
          />
          <TabButton 
            label="Gói tiêm phòng" 
            count={vaccinePackage ? 1 : 0} 
            active={activeTab === 'package'} 
            onClick={() => setActiveTab('package')} 
          />
          <TabButton 
            label="Vacxin đã tiêm" 
            count={vaccinationHistory.length} 
            active={activeTab === 'vacxin'} 
            onClick={() => setActiveTab('vacxin')} 
          />
        </div>

        {/* --- Content Area --- */}
        
        {/* TAB 1: Lịch sử khám */}
        {activeTab === 'history' && (
          <div className="relative pl-8 space-y-6">
            <div className="absolute left-3 top-0 bottom-0 w-px bg-slate-200" />
            {history.length === 0 ? (
                <div className="text-slate-500 italic text-sm">Chưa có lịch sử khám bệnh.</div>
            ) : (
                history.map((record) => (
                <div key={record.MaPhieuDV || Math.random()} className="relative group">
                    <div className="absolute -left-[25px] top-6 w-4 h-4 rounded-full bg-blue-500 border-4 border-[#f4f7fe] group-hover:scale-125 transition-transform" />
                    <div className="bg-white border rounded-2xl p-6 shadow-sm flex flex-col gap-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                            <span className="px-3 py-1 rounded-lg bg-blue-50 text-blue-600 text-[11px] font-black uppercase">
                                {record.LoaiDichVu}
                            </span>
                            <span className="text-sm font-medium text-slate-500">{new Date(record.NgayKham).toLocaleDateString('vi-VN')}</span>
                            </div>
                            <span className="text-sm font-semibold text-slate-700 bg-slate-50 px-3 py-1 rounded-full">
                                BS. {record.TenBacSi}
                            </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-50">
                            <RecordField label="Triệu chứng" value={record.MoTaTrieuChung} />
                            <RecordField label="Chẩn đoán" value={record.MoTaChuanDoan} />
                            <RecordField label="Ngày tái khám" value={record.NgayTaiKham ? new Date(record.NgayTaiKham).toLocaleDateString('vi-VN') : 'Không có'} />
                        </div>
                    </div>
                </div>
                ))
            )}
          </div>
        )}

        {/* TAB 2: Gói Vaccine */}
        {activeTab === 'package' && (
            vaccinePackage ? (
                <VaccinePackage packageData={vaccinePackage} />
            ) : (
                <div className="bg-white p-10 rounded-2xl text-center border border-dashed border-slate-300">
                    <p className="text-slate-500">Thú cưng này chưa đăng ký gói tiêm chủng nào.</p>
                </div>
            )
        )}

        {/* TAB 3: Lịch sử Vaccine */}
        {activeTab === 'vacxin' && (
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
             {vaccinationHistory.length === 0 ? (
                 <div className="p-8 text-center text-slate-500">Chưa có lịch sử tiêm phòng.</div>
             ) : (
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
                      <tr key={v.MaPhieuDV || i} className="hover:bg-slate-50/50 transition-colors">
                        
                        {/* CỘT TÊN VACXIN: Cần map vào mảng DanhSachVacXin */}
                        <td className="px-8 py-5 text-sm font-medium text-slate-800">
                          {v.DanhSachVacXin && v.DanhSachVacXin.length > 0 ? (
                            // Nếu có danh sách vacxin, nối tên các loại vacxin lại với nhau
                            v.DanhSachVacXin.map(vac => vac.TenVacXin).join(', ')
                          ) : (
                            // Nếu mảng rỗng (như phần tử thứ 3 trong ảnh JSON)
                            <span className="text-slate-400 italic">Không có thông tin</span>
                          )}
                        </td>

                        {/* Ngày tiêm */}
                        <td className="px-8 py-5 text-sm text-slate-600">
                          {v.NgayTiem ? new Date(v.NgayTiem).toLocaleDateString('vi-VN') : '—'}
                        </td>

                        {/* Bác sĩ */}
                        <td className="px-8 py-5 text-sm text-slate-600">
                          {v.TenBacSi}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             )}
          </div>
        )}
      </div>
    </div>
  );
};

// --- Sub Components ---

const RecordField = ({ label, value }) => (
  <div className="flex flex-col sm:flex-row sm:gap-2 text-sm">
    <span className="font-semibold text-slate-700 min-w-[100px]">
      {label}:
    </span>
    <span className="text-slate-600 break-words">
      {value || '—'}
    </span>
  </div>
);

const TabButton = ({ label, count, active, onClick }) => (
  <button
    onClick={onClick}
    className={`whitespace-nowrap px-6 py-3 rounded-xl text-sm font-semibold transition-all flex items-center gap-3 border
    ${active
      ? 'bg-white text-slate-800 border-slate-200 shadow-sm ring-1 ring-slate-200'
      : 'text-slate-500 border-transparent hover:text-slate-700 hover:bg-white/50'
    }`}
  >
    {label}
    {count > 0 && (
        <span
        className={`px-2 py-0.5 rounded-md text-[10px] font-bold
        ${active ? 'bg-blue-100 text-blue-600' : 'bg-slate-200 text-slate-500'}`}
        >
        {count}
        </span>
    )}
  </button>
);

export default PetDetail;