import { MedicalRecord, Pet } from "../../../types";
import { Clock, ArrowLeft, FileText } from "lucide-react";

interface PetMedicalHistoryProps {
  pet: Pet | null;
  records: MedicalRecord[];
  onBack: () => void;
  onRecordClick: (record: MedicalRecord) => void;
}

export default function PetMedicalHistory({
  pet,
  records,
  onBack,
  onRecordClick,
}: PetMedicalHistoryProps) {
  if (!pet) return null;

  // records đã là của pet đang chọn (Profile đã load theo petId)
  const petRecords = records;

  return (
    <div className="space-y-6">
      {/* Header với nút quay lại */}
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>

        <div className="flex-1">
          <div className="flex items-center gap-4">
            {pet.avatar ? (
              <img
                src={pet.avatar}
                alt={pet.name}
                className="w-16 h-16 rounded-full object-cover shadow-sm border-2 border-gray-100"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-2xl font-bold shadow-sm">
                {pet.name.charAt(0)}
              </div>
            )}

            <div>
              <h2 className="text-2xl font-bold text-gray-900">{pet.name}</h2>
              <p className="text-gray-600">
                {pet.species} • {pet.breed}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {pet.gender} • {pet.weight}kg
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Lịch sử */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Lịch sử khám / tiêm
        </h3>

        {petRecords.length > 0 ? (
          <div className="space-y-4">
            {petRecords.map((record) => (
              <div
                key={record.id}
                onClick={() => onRecordClick(record)}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer hover:border-blue-400 hover:shadow-md transition-all group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex items-center gap-2 text-blue-600 font-medium">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">
                          {new Date(record.date).toLocaleDateString("vi-VN", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>

                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                        {record.serviceType}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 mb-3">
                      <span className="font-medium">Bác sĩ:</span> {record.doctorName}
                    </p>

                    {record.symptoms && (
                      <div className="mb-3 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
                        <p className="text-xs font-medium text-yellow-800 mb-1">Triệu chứng:</p>
                        <p className="text-sm text-gray-700">{record.symptoms}</p>
                      </div>
                    )}

                    <div className="p-3 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
                      <p className="text-xs font-medium text-red-800 mb-1">Chẩn đoán:</p>
                      <p className="text-sm text-gray-700 font-medium">{record.diagnosis}</p>
                    </div>

                    {record.nextAppointment && (
                      <div className="mt-3 p-3 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
                        <p className="text-xs font-medium text-blue-800 mb-1">Lịch tái khám:</p>
                        <p className="text-sm text-gray-700">
                          {new Date(record.nextAppointment).toLocaleDateString("vi-VN", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    Click để xem chi tiết →
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg font-medium mb-2">Chưa có lịch sử</p>
            <p className="text-gray-400 text-sm">Thú cưng này chưa có lịch sử khám/tiêm.</p>
          </div>
        )}
      </div>
    </div>
  );
}
