import { useState } from 'react';
import { clsx } from 'clsx';
import { currentUser, medicalRecords, myPets, orders } from '../data/mockDatabase';
import { Clock, FileText, Package, User, ShieldCheck } from 'lucide-react';

type Tab = 'orders' | 'pets' | 'info';

export default function Profile() {
    const [activeTab, setActiveTab] = useState<Tab>('orders');

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
                        onClick={() => setActiveTab('pets')}
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
                    <div className="space-y-8">
                        <h2 className="text-2xl font-bold text-gray-900">Hồ sơ sức khỏe</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {myPets.map(pet => (
                                <div key={pet.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                    <div className="flex items-center gap-4 mb-6">
                                        <img src={pet.avatar} className="w-16 h-16 rounded-full object-cover shadow-sm" />
                                        <div>
                                            <div className="text-lg font-bold text-gray-900">{pet.name}</div>
                                            <div className="text-sm text-gray-500">{pet.species} • {pet.breed}</div>
                                            <div className="text-xs text-gray-400 mt-1">{pet.gender} • {pet.weight}kg</div>
                                        </div>
                                    </div>

                                    <h4 className="font-bold text-gray-700 text-sm uppercase tracking-wide mb-3 border-b pb-2">Lịch sử khám gần đây</h4>
                                    <div className="space-y-4">
                                        {medicalRecords.filter(r => r.petId === pet.id).length > 0 ? (
                                            medicalRecords.filter(r => r.petId === pet.id).map(record => (
                                                <div key={record.id} className="relative pl-4 border-l-2 border-blue-200">
                                                    <div className="flex items-center gap-2 text-xs text-blue-600 font-medium mb-1">
                                                        <Clock className="w-3 h-3" /> {record.date}
                                                    </div>
                                                    <div className="font-bold text-gray-900 text-sm">{record.serviceType}</div>
                                                    <div className="text-xs text-gray-500">BS. {record.doctorName}</div>
                                                    <div className="mt-2 text-sm bg-gray-50 p-2 rounded text-gray-700">
                                                        {record.diagnosis}
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center text-gray-400 italic py-4">Chưa có lịch sử khám</div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
