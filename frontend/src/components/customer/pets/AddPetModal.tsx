import { useState, useEffect } from 'react';
import { X, Plus, Calendar, Heart } from 'lucide-react';

interface Breed {
    id: string;
    name: string;
    speciesId: string;
}

interface Species {
    id: string;
    name: string;
}

interface AddPetModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: PetFormData) => void;
}

export interface PetFormData {
    name: string;
    breedId: string;
    dob: string;
    gender: 'Đực' | 'Cái';
    healthStatus: string;
}

// Mock data - trong thực tế sẽ fetch từ API
const species: Species[] = [
    { id: 'LTC01', name: 'Chó' },
    { id: 'LTC02', name: 'Mèo' },
    { id: 'LTC03', name: 'Thỏ' }
];

const breeds: Breed[] = [
    // Chó
    { id: 'G001', name: 'Poodle', speciesId: 'LTC01' },
    { id: 'G002', name: 'Corgi', speciesId: 'LTC01' },
    { id: 'G003', name: 'Husky', speciesId: 'LTC01' },
    { id: 'G009', name: 'Chihuahua', speciesId: 'LTC01' },
    { id: 'G010', name: 'Golden Retriever', speciesId: 'LTC01' },
    // Mèo
    { id: 'G004', name: 'Mèo Anh Lông Ngắn', speciesId: 'LTC02' },
    { id: 'G005', name: 'Mèo Ba Tư', speciesId: 'LTC02' },
    { id: 'G006', name: 'Mèo Mướp', speciesId: 'LTC02' },
    // Thỏ
    { id: 'G007', name: 'Thỏ Hà Lan', speciesId: 'LTC03' },
    { id: 'G008', name: 'Thỏ Sư Tử', speciesId: 'LTC03' }
];

export default function AddPetModal({ isOpen, onClose, onSubmit }: AddPetModalProps) {
    const [formData, setFormData] = useState<PetFormData>({
        name: '',
        breedId: '',
        dob: '',
        gender: 'Đực',
        healthStatus: 'Khỏe mạnh'
    });
    const [selectedSpeciesId, setSelectedSpeciesId] = useState<string>('');
    const [availableBreeds, setAvailableBreeds] = useState<Breed[]>([]);
    const [errors, setErrors] = useState<Partial<Record<keyof PetFormData, string>>>({});

    useEffect(() => {
        if (selectedSpeciesId) {
            const filtered = breeds.filter(b => b.speciesId === selectedSpeciesId);
            setAvailableBreeds(filtered);
            // Reset breedId khi đổi species
            setFormData(prev => ({ ...prev, breedId: '' }));
        } else {
            setAvailableBreeds([]);
        }
    }, [selectedSpeciesId]);

    const handleChange = (field: keyof PetFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error khi user nhập
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    const validate = (): boolean => {
        const newErrors: Partial<Record<keyof PetFormData, string>> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Vui lòng nhập tên thú cưng';
        }

        if (!selectedSpeciesId) {
            newErrors.breedId = 'Vui lòng chọn loại thú cưng';
        }

        if (!formData.breedId) {
            newErrors.breedId = 'Vui lòng chọn giống';
        }

        if (!formData.dob) {
            newErrors.dob = 'Vui lòng chọn ngày sinh';
        } else {
            const dobDate = new Date(formData.dob);
            const today = new Date();
            if (dobDate > today) {
                newErrors.dob = 'Ngày sinh không thể lớn hơn ngày hiện tại';
            }
        }

        if (!formData.healthStatus.trim()) {
            newErrors.healthStatus = 'Vui lòng nhập tình trạng sức khỏe';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            onSubmit(formData);
            // Reset form
            setFormData({
                name: '',
                breedId: '',
                dob: '',
                gender: 'Đực',
                healthStatus: 'Khỏe mạnh'
            });
            setSelectedSpeciesId('');
            setErrors({});
            onClose();
        }
    };

    const handleClose = () => {
        setFormData({
            name: '',
            breedId: '',
            dob: '',
            gender: 'Đực',
            healthStatus: 'Khỏe mạnh'
        });
        setSelectedSpeciesId('');
        setErrors({});
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50" onClick={handleClose}>
            <div
                className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-2xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                                <Plus className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">Thêm thú cưng mới</h2>
                                <p className="text-blue-100 mt-1">Điền thông tin để đăng ký thú cưng</p>
                            </div>
                        </div>
                        <button
                            onClick={handleClose}
                            className="p-2 hover:bg-blue-800 rounded-full transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Tên thú cưng */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tên thú cưng <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                }`}
                            placeholder="Nhập tên thú cưng"
                        />
                        {errors.name && (
                            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                        )}
                    </div>

                    {/* Loại thú cưng */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Loại thú cưng <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={selectedSpeciesId}
                            onChange={(e) => {
                                setSelectedSpeciesId(e.target.value);
                                setErrors(prev => ({ ...prev, breedId: undefined }));
                            }}
                            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${errors.breedId && !selectedSpeciesId ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                }`}
                        >
                            <option value="">-- Chọn loại thú cưng --</option>
                            {species.map(s => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                        </select>
                        {errors.breedId && !selectedSpeciesId && (
                            <p className="mt-1 text-sm text-red-600">{errors.breedId}</p>
                        )}
                    </div>

                    {/* Giống */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Giống <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={formData.breedId}
                            onChange={(e) => handleChange('breedId', e.target.value)}
                            disabled={!selectedSpeciesId}
                            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${errors.breedId ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                } ${!selectedSpeciesId ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                        >
                            <option value="">-- Chọn giống --</option>
                            {availableBreeds.map(breed => (
                                <option key={breed.id} value={breed.id}>{breed.name}</option>
                            ))}
                        </select>
                        {errors.breedId && selectedSpeciesId && (
                            <p className="mt-1 text-sm text-red-600">{errors.breedId}</p>
                        )}
                        {!selectedSpeciesId && (
                            <p className="mt-1 text-sm text-gray-500">Vui lòng chọn loại thú cưng trước</p>
                        )}
                    </div>

                    {/* Ngày sinh và Giới tính */}
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Calendar className="w-4 h-4 inline mr-1" />
                                Ngày sinh <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                value={formData.dob}
                                onChange={(e) => handleChange('dob', e.target.value)}
                                max={new Date().toISOString().split('T')[0]}
                                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${errors.dob ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                    }`}
                            />
                            {errors.dob && (
                                <p className="mt-1 text-sm text-red-600">{errors.dob}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Giới tính <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={formData.gender}
                                onChange={(e) => handleChange('gender', e.target.value as 'Đực' | 'Cái')}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                            >
                                <option value="Đực">Đực</option>
                                <option value="Cái">Cái</option>
                            </select>
                        </div>
                    </div>

                    {/* Tình trạng sức khỏe */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Heart className="w-4 h-4 inline mr-1" />
                            Tình trạng sức khỏe <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.healthStatus}
                            onChange={(e) => handleChange('healthStatus', e.target.value)}
                            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${errors.healthStatus ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                }`}
                            placeholder="Ví dụ: Khỏe mạnh, Bệnh ngoài da, Tiêu chảy..."
                        />
                        {errors.healthStatus && (
                            <p className="mt-1 text-sm text-red-600">{errors.healthStatus}</p>
                        )}
                        <p className="mt-1 text-sm text-gray-500">
                            Mô tả tình trạng sức khỏe hiện tại của thú cưng
                        </p>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Thêm thú cưng
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

