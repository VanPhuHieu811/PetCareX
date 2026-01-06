import { useState } from 'react';
import { clsx } from 'clsx';
import { currentUser, medicalRecords, myPets, orders } from '../../services/mockDataKH';
import { FileText, Package, User, ShieldCheck, Plus, Mail, Phone, Edit2, Save, X } from 'lucide-react';
import MedicalRecordDetailModal from '../../components/customer/history/MedicalRecordDetailModal';
import AddPetModal, { PetFormData } from '../../components/customer/pets/AddPetModal';
import PetList from '../../components/customer/pets/PetList';
import PetMedicalHistory from '../../components/customer/pets/PetMedicalHistory';
import { MedicalRecord } from '../../types';

type Tab = 'orders' | 'pets' | 'info';

export default function Profile() {
    const [activeTab, setActiveTab] = useState<Tab>('orders');
    const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAddPetModalOpen, setIsAddPetModalOpen] = useState(false);
    const [selectedPetId, setSelectedPetId] = useState<string | null>(null);
    const [isEditingInfo, setIsEditingInfo] = useState(false);
    const [userInfo, setUserInfo] = useState({
        name: currentUser.name,
        email: currentUser.email,
        phone: currentUser.phone,
    });

    const handleRecordClick = (record: MedicalRecord) => {
        setSelectedRecord(record);
        setIsModalOpen(true);
    };

    const handleAddPet = async (data: PetFormData) => {
        // TODO: Gọi API để thêm thú cưng
        // Ví dụ: await petService.addPet({ ...data, customerId: currentUser.id });
        console.log('Adding pet:', data);

        // Tạm thời hiển thị alert, sau này sẽ cập nhật state và gọi API
        alert(`Đã thêm thú cưng: ${data.name}\nGiống: ${data.breedId}\nNgày sinh: ${data.dob}`);

        // Sau khi thêm thành công, có thể:
        // - Refresh danh sách thú cưng
        // - Đóng modal
        // - Hiển thị thông báo thành công
    };

    const handleSaveInfo = () => {
        // TODO: Gọi API để cập nhật thông tin
        // Ví dụ: await customerService.updateInfo(currentUser.id, userInfo);
        alert('Đã cập nhật thông tin thành công!');
        setIsEditingInfo(false);
    };

    const handleCancelEdit = () => {
        setUserInfo({
            name: currentUser.name,
            email: currentUser.email,
            phone: currentUser.phone,
        });
        setIsEditingInfo(false);
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1 space-y-6">
                {/* User Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
                    <div className="relative inline-block">
                        <img src={currentUser.avatar} alt={currentUser.name} className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-blue-50" />
                        <div className="absolute bottom-2 right-0 bg-yellow-400 text-white p-1 rounded-full border-2 border-white" title={currentUser.memberType}>
                            <ShieldCheck className="w-4 h-4" />
                        </div>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">{currentUser.name}</h2>
                    <p className="text-sm text-gray-500">{currentUser.email}</p>
                    <div className="mt-4 inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                        {currentUser.loyaltyPoints} điểm thưởng
                    </div>
                </div>

                {/* Menu */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <button
                        onClick={() => setActiveTab('orders')}
                        className={clsx(
                            "w-full flex items-center gap-3 px-6 py-4 text-sm font-medium transition-colors border-l-4",
                            activeTab === 'orders' ? "bg-blue-50 border-blue-600 text-blue-700" : "border-transparent text-gray-600 hover:bg-gray-50"
                        )}
                    >
                        <Package className="w-5 h-5" /> Lịch sử đơn hàng
                    </button>
                    <button
                        onClick={() => {
                            setActiveTab('pets');
                            setSelectedPetId(null); // Reset khi chuyển tab
                        }}
                        className={clsx(
                            "w-full flex items-center gap-3 px-6 py-4 text-sm font-medium transition-colors border-l-4",
                            activeTab === 'pets' ? "bg-blue-50 border-blue-600 text-blue-700" : "border-transparent text-gray-600 hover:bg-gray-50"
                        )}
                    >
                        <FileText className="w-5 h-5" /> Hồ sơ thú cưng
                    </button>
                    <button
                        onClick={() => setActiveTab('info')}
                        className={clsx(
                            "w-full flex items-center gap-3 px-6 py-4 text-sm font-medium transition-colors border-l-4",
                            activeTab === 'info' ? "bg-blue-50 border-blue-600 text-blue-700" : "border-transparent text-gray-600 hover:bg-gray-50"
                        )}
                    >
                        <User className="w-5 h-5" /> Thông tin cá nhân
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
                {activeTab === 'orders' && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900">Lịch sử đơn hàng</h2>
                        {orders.map(order => (
                            <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="bg-gray-50 px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                    <div>
                                        <span className="text-sm text-gray-500">Mã đơn: <span className="font-mono text-gray-900 font-medium">#{order.id}</span></span>
                                        <div className="text-xs text-gray-400 mt-1">{order.date} • {order.branchName}</div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={clsx(
                                            "px-3 py-1 rounded-full text-xs font-bold",
                                            order.status === 'Completed' ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                                        )}>
                                            {order.status === 'Completed' ? 'Hoàn thành' : 'Đang xử lý'}
                                        </span>
                                        <span className="text-lg font-bold text-blue-600">{order.totalAmount.toLocaleString('vi-VN')}đ</span>
                                    </div>
                                </div>
                                <div className="p-6 divide-y divide-gray-100">
                                    {order.items.map((item, idx) => (
                                        <div key={idx} className="flex justify-between py-2 last:pb-0 first:pt-0">
                                            <div>
                                                <div className="font-medium text-gray-900">{item.productName}</div>
                                                <div className="text-sm text-gray-500">x{item.quantity}</div>
                                            </div>
                                            <div className="text-gray-900">{item.total.toLocaleString('vi-VN')}đ</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'pets' && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-gray-900">Hồ sơ sức khỏe</h2>
                            {!selectedPetId && (
                                <button
                                    onClick={() => setIsAddPetModalOpen(true)}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
                                >
                                    <Plus className="w-5 h-5" />
                                    Thêm thú cưng
                                </button>
                            )}
                        </div>

                        {selectedPetId ? (
                            <PetMedicalHistory
                                pet={myPets.find(p => p.id === selectedPetId) || null}
                                records={medicalRecords}
                                onBack={() => setSelectedPetId(null)}
                                onRecordClick={handleRecordClick}
                            />
                        ) : (
                            <PetList
                                pets={myPets}
                                selectedPetId={selectedPetId}
                                onSelectPet={setSelectedPetId}
                            />
                        )}
                    </div>
                )}

                {activeTab === 'info' && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-gray-900">Thông tin cá nhân</h2>
                            {!isEditingInfo ? (
                                <button
                                    onClick={() => setIsEditingInfo(true)}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
                                >
                                    <Edit2 className="w-4 h-4" />
                                    Chỉnh sửa
                                </button>
                            ) : (
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleCancelEdit}
                                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                        Hủy
                                    </button>
                                    <button
                                        onClick={handleSaveInfo}
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
                                    >
                                        <Save className="w-4 h-4" />
                                        Lưu
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <div className="space-y-6">
                                {/* Avatar Section */}
                                <div className="flex items-center gap-6 pb-6 border-b border-gray-100">
                                    <div className="relative">
                                        <img
                                            src={currentUser.avatar}
                                            alt={currentUser.name}
                                            className="w-24 h-24 rounded-full border-4 border-blue-50"
                                        />
                                        <div className="absolute bottom-0 right-0 bg-yellow-400 text-white p-1.5 rounded-full border-2 border-white">
                                            <ShieldCheck className="w-4 h-4" />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-500 mb-1">Loại thành viên</div>
                                        <div className="text-lg font-bold text-gray-900">{currentUser.memberType}</div>
                                        <div className="text-sm text-gray-500 mt-1">
                                            {currentUser.loyaltyPoints} điểm thưởng
                                        </div>
                                    </div>
                                </div>

                                {/* Form Fields */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Họ và tên
                                        </label>
                                        {isEditingInfo ? (
                                            <input
                                                type="text"
                                                value={userInfo.name}
                                                onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        ) : (
                                            <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900">
                                                {userInfo.name}
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                            <Mail className="w-4 h-4" />
                                            Email
                                        </label>
                                        {isEditingInfo ? (
                                            <input
                                                type="email"
                                                value={userInfo.email}
                                                onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        ) : (
                                            <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900">
                                                {userInfo.email}
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                            <Phone className="w-4 h-4" />
                                            Số điện thoại
                                        </label>
                                        {isEditingInfo ? (
                                            <input
                                                type="tel"
                                                value={userInfo.phone}
                                                onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        ) : (
                                            <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900">
                                                {userInfo.phone}
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Mã khách hàng
                                        </label>
                                        <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900 font-mono">
                                            {currentUser.id}
                                        </div>
                                    </div>
                                </div>

                                {/* Additional Info */}
                                <div className="pt-6 border-t border-gray-100">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin bổ sung</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                                            <div className="text-sm text-blue-600 font-medium mb-1">Điểm thưởng</div>
                                            <div className="text-2xl font-bold text-blue-700">
                                                {currentUser.loyaltyPoints.toLocaleString('vi-VN')}
                                            </div>
                                            <div className="text-xs text-blue-500 mt-1">Có thể dùng để đổi quà</div>
                                        </div>
                                        <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                                            <div className="text-sm text-green-600 font-medium mb-1">Tổng đơn hàng</div>
                                            <div className="text-2xl font-bold text-green-700">
                                                {orders.length}
                                            </div>
                                            <div className="text-xs text-green-500 mt-1">Đơn hàng đã hoàn thành</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal chi tiết lịch sử khám bệnh */}
            <MedicalRecordDetailModal
                record={selectedRecord}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />

            {/* Modal thêm thú cưng */}
            <AddPetModal
                isOpen={isAddPetModalOpen}
                onClose={() => setIsAddPetModalOpen(false)}
                onSubmit={handleAddPet}
            />
        </div>
    );
}
