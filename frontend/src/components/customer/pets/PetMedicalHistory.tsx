// src/components/customer/pets/PetMedicalHistory.tsx
import { MedicalRecord, Pet } from "../../../types";
import { ArrowLeft, Calendar, User, Stethoscope, Syringe, Pill, Activity, AlertCircle } from "lucide-react";

interface PetMedicalHistoryProps {
  pet: Pet | null;
  records: MedicalRecord[];
  onBack: () => void;
  // Đã bỏ onRecordClick vì hiển thị chi tiết luôn
}

function formatVND(n?: number | null) {
  const val = typeof n === "number" ? n : 0;
  return val.toLocaleString("vi-VN") + "đ";
}

function safeDate(iso?: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("vi-VN");
}

function formatDateFull(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("vi-VN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

export default function PetMedicalHistory({
  pet,
  records,
  onBack,
}: PetMedicalHistoryProps) {
  if (!pet) return null;

  // Tách records thành 2 mảng dựa trên serviceType
  // Lưu ý: Đảm bảo logic map ở Profile.tsx gán đúng "Khám bệnh" và "Tiêm phòng"
  const examRecords = records.filter((r) => r.serviceType === "Khám bệnh");
  const vaccineRecords = records.filter((r) => r.serviceType === "Tiêm phòng");

  // Thông tin thú cưng
  const initials = (pet.name || "P").trim().charAt(0).toUpperCase();

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* --- HEADER: THÔNG TIN THÚ CƯNG --- */}
      <div className="flex items-center gap-4 border-b border-gray-100 pb-6">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          title="Quay lại"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>

        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold shadow-md ring-4 ring-blue-50">
            {initials}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{pet.name}</h2>
            <p className="text-gray-500 text-sm">
              Loài: {pet.species} • Giống: {pet.breed} • Giới tính: {pet.gender} 
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ========================================================= */}
        {/* CỘT 1: LỊCH SỬ KHÁM BỆNH & ĐƠN THUỐC                    */}
        {/* ========================================================= */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
              <Stethoscope className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Lịch sử Khám bệnh</h3>
          </div>

          {examRecords.length === 0 ? (
            <div className="bg-gray-50 rounded-xl p-8 text-center border border-dashed border-gray-200">
              <p className="text-gray-400 text-sm">Chưa có lịch sử khám bệnh.</p>
            </div>
          ) : (
            examRecords.map((rec) => (
              <div key={rec.id} className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                {/* Card Header */}
                <div className="bg-emerald-50/50 px-5 py-3 border-b border-emerald-100 flex justify-between items-center">
                  <div className="flex items-center gap-2 text-emerald-800 font-medium">
                    <Calendar className="w-4 h-4" />
                    {formatDateFull(rec.orderDate)}
                  </div>
                  <span className="text-xs font-mono text-emerald-600 bg-white px-2 py-1 rounded border border-emerald-200">
                    {rec.id}
                  </span>
                </div>

                {/* Card Body: Chẩn đoán & Triệu chứng */}
                <div className="p-5 space-y-4">
                  <div className="flex items-start gap-2">
                    <User className="w-4 h-4 text-gray-400 mt-0.5" />
                    <span className="text-sm text-gray-600">Bác sĩ: <span className="font-medium text-gray-900">{rec.doctorName}</span></span>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {/* Triệu chứng */}
                    <div className="bg-orange-50 border-l-4 border-orange-300 p-3 rounded-r-md">
                      <div className="flex items-center gap-2 text-orange-800 text-xs font-bold uppercase mb-1">
                        <AlertCircle className="w-3 h-3" /> Triệu chứng
                      </div>
                      <div className="text-sm text-gray-800">{rec.symptoms}</div>
                    </div>
                    
                    {/* Chẩn đoán */}
                    <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded-r-md">
                      <div className="flex items-center gap-2 text-blue-800 text-xs font-bold uppercase mb-1">
                        <Activity className="w-3 h-3" /> Chẩn đoán
                      </div>
                      <div className="text-sm text-gray-800 font-medium">{rec.diagnosis}</div>
                    </div>
                  </div>

                  {/* Đơn thuốc (Table) */}
                  <div className="pt-2">
                    <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-gray-700">
                      <Pill className="w-4 h-4 text-gray-500" /> Đơn thuốc
                    </div>
                    
                    {(!rec.prescription || rec.prescription.length === 0) ? (
                      <div className="text-sm text-gray-400 italic pl-6">Không có đơn thuốc.</div>
                    ) : (
                      <div className="overflow-hidden rounded-lg border border-gray-100">
                        <table className="w-full text-sm text-left">
                          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                            <tr>
                              <th className="px-3 py-2 font-medium">Tên thuốc</th>
                              <th className="px-3 py-2 font-medium text-center">SL</th>
                              <th className="px-3 py-2 font-medium text-right">Thành tiền</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {rec.prescription.map((drug: any, idx: number) => (
                              <tr key={idx} className="bg-white">
                                <td className="px-3 py-2 text-gray-800">
                                  {drug.TenThuoc || drug.name}
                                </td>
                                <td className="px-3 py-2 text-center text-gray-600">
                                  {drug.SoLuongMua || drug.quantity}
                                </td>
                                <td className="px-3 py-2 text-right text-gray-800 font-medium">
                                  {formatVND(drug.ThanhTien || (drug.DonGia * drug.SoLuongMua))}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ========================================================= */}
        {/* CỘT 2: LỊCH SỬ TIÊM PHÒNG                                 */}
        {/* ========================================================= */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
              <Syringe className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Lịch sử Tiêm phòng</h3>
          </div>

          {vaccineRecords.length === 0 ? (
            <div className="bg-gray-50 rounded-xl p-8 text-center border border-dashed border-gray-200">
              <p className="text-gray-400 text-sm">Chưa có lịch sử tiêm phòng.</p>
            </div>
          ) : (
            vaccineRecords.map((rec) => (
              <div key={rec.id} className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                {/* Card Header */}
                <div className="bg-purple-50/50 px-5 py-3 border-b border-purple-100 flex justify-between items-center">
                  <div className="flex items-center gap-2 text-purple-800 font-medium">
                    <Calendar className="w-4 h-4" />
                    {formatDateFull(rec.orderDate)}
                  </div>
                    <span className="text-xs font-mono text-purple-600 bg-white px-2 py-1 rounded border border-purple-200">
                    {rec.id}
                  </span>
                </div>

                {/* Card Body */}
                <div className="p-5 space-y-4">
                  <div className="flex items-start gap-2">
                    <User className="w-4 h-4 text-gray-400 mt-0.5" />
                    <span className="text-sm text-gray-600">Bác sĩ: <span className="font-medium text-gray-900">{rec.doctorName}</span></span>
                  </div>

                  {/* Danh sách Vắc-xin (Table) */}
                  <div className="pt-1">
                    <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-gray-700">
                      <Syringe className="w-4 h-4 text-gray-500" /> Chi tiết Vắc-xin
                    </div>

                    {(!rec.vaccines || rec.vaccines.length === 0) ? (
                      <div className="text-sm text-gray-400 italic pl-6">Không có thông tin vắc-xin.</div>
                    ) : (
                      <div className="overflow-hidden rounded-lg border border-gray-100">
                        <table className="w-full text-sm text-left">
                          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                            <tr>
                              <th className="px-3 py-2 font-medium">Tên Vắc-xin</th>
                              <th className="px-3 py-2 font-medium text-center">Liều</th>
                              <th className="px-3 py-2 font-medium text-right">Đơn giá</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {rec.vaccines.map((vac: any, idx: number) => (
                              <tr key={idx} className="bg-white">
                                <td className="px-3 py-2 text-gray-800">
                                  {vac.TenVacXin || vac.name}
                                </td>
                                <td className="px-3 py-2 text-center text-gray-600">
                                  {vac.LieuLuong || 1}
                                </td>
                                <td className="px-3 py-2 text-right text-gray-800 font-medium">
                                  {formatVND(vac.DonGia)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}