import { X, Calendar, User, MapPin, FileText, Pill, Clock } from 'lucide-react';
import { MedicalRecord } from '../../../types';

interface MedicalRecordDetailModalProps {
    record: MedicalRecord | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function MedicalRecordDetailModal({ record, isOpen, onClose }: MedicalRecordDetailModalProps) {
    if (!isOpen || !record) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50" onClick={onClose}>
            <div 
                className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-2xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold">Chi tiết lịch sử khám bệnh</h2>
                            <p className="text-blue-100 mt-1">Mã phiếu: #{record.id}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-blue-800 rounded-full transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Thông tin cơ bản */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-gray-50 p-4 rounded-xl">
                            <div className="flex items-center gap-2 text-gray-600 mb-2">
                                <Calendar className="w-5 h-5" />
                                <span className="font-medium">Ngày khám</span>
                            </div>
                            <p className="text-lg font-semibold text-gray-900">
                                {new Date(record.date).toLocaleDateString('vi-VN', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </p>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-xl">
                            <div className="flex items-center gap-2 text-gray-600 mb-2">
                                <User className="w-5 h-5" />
                                <span className="font-medium">Bác sĩ điều trị</span>
                            </div>
                            <p className="text-lg font-semibold text-gray-900">{record.doctorName}</p>
                        </div>
                    </div>

                    {/* Thông tin thú cưng */}
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
                                <span className="text-blue-700 font-bold text-lg">
                                    {record.petName.charAt(0)}
                                </span>
                            </div>
                            <div>
                                <p className="font-bold text-gray-900">{record.petName}</p>
                                <p className="text-sm text-gray-600">Mã thú cưng: {record.petId}</p>
                            </div>
                        </div>
                    </div>

                    {/* Triệu chứng */}
                    {record.symptoms && (
                        <div className="border-l-4 border-yellow-400 bg-yellow-50 p-4 rounded-r-xl">
                            <div className="flex items-center gap-2 text-yellow-800 mb-2">
                                <FileText className="w-5 h-5" />
                                <span className="font-bold">Triệu chứng</span>
                            </div>
                            <p className="text-gray-800">{record.symptoms}</p>
                        </div>
                    )}

                    {/* Chẩn đoán */}
                    <div className="border-l-4 border-red-400 bg-red-50 p-4 rounded-r-xl">
                        <div className="flex items-center gap-2 text-red-800 mb-2">
                            <FileText className="w-5 h-5" />
                            <span className="font-bold">Chẩn đoán</span>
                        </div>
                        <p className="text-gray-800">{record.diagnosis}</p>
                    </div>

                    {/* Đơn thuốc */}
                    {record.prescription && record.prescription.length > 0 && (
                        <div className="border border-gray-200 rounded-xl overflow-hidden">
                            <div className="bg-green-50 px-6 py-4 border-b border-gray-200">
                                <div className="flex items-center gap-2 text-green-800">
                                    <Pill className="w-5 h-5" />
                                    <span className="font-bold text-lg">Đơn thuốc</span>
                                </div>
                            </div>
                            <div className="divide-y divide-gray-200">
                                {record.prescription.map((med, idx) => (
                                    <div key={idx} className="p-6">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h4 className="font-bold text-gray-900">{med.medicineName}</h4>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    Số lượng: {med.quantity}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="mt-2 bg-gray-50 p-3 rounded-lg">
                                            <p className="text-sm text-gray-700">
                                                <span className="font-medium">Cách dùng:</span> {med.usage}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Vắc-xin (nếu có) */}
                    {record.vaccines && record.vaccines.length > 0 && (
                        <div className="border border-gray-200 rounded-xl overflow-hidden">
                            <div className="bg-purple-50 px-6 py-4 border-b border-gray-200">
                                <div className="flex items-center gap-2 text-purple-800">
                                    <Pill className="w-5 h-5" />
                                    <span className="font-bold text-lg">Vắc-xin đã tiêm</span>
                                </div>
                            </div>
                            <div className="divide-y divide-gray-200">
                                {record.vaccines.map((vaccine, idx) => (
                                    <div key={idx} className="p-6">
                                        <h4 className="font-bold text-gray-900">{vaccine.name}</h4>
                                        {vaccine.batch && (
                                            <p className="text-sm text-gray-600 mt-1">
                                                Lô: {vaccine.batch}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Ngày tái khám */}
                    {record.nextAppointment && (
                        <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl">
                            <div className="flex items-center gap-2 text-blue-800 mb-2">
                                <Clock className="w-5 h-5" />
                                <span className="font-bold">Lịch tái khám</span>
                            </div>
                            <p className="text-gray-800">
                                {new Date(record.nextAppointment).toLocaleDateString('vi-VN', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </p>
                        </div>
                    )}

                    {/* Footer */}
                    <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

