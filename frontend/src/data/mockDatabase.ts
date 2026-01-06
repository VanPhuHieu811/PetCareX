import { Branch, CurrentUser, Doctor, MedicalRecord, Order, Pet, Product, Service, TimeSlot } from '../types';

export const currentUser: CurrentUser = {
    id: 'KH001',
    name: 'Kho Cháng',
    email: 'nguyenvana@gmail.com',
    phone: '0909123456',
    avatar: 'https://i.pravatar.cc/150?u=KH001',
    loyaltyPoints: 1500,
    memberType: 'VIP'
};

export const branches: Branch[] = [
    {
        id: 'CN01',
        name: 'PetCareX Quận 1',
        address: '123 Nguyễn Huệ, P. Bến Nghé, Quận 1, TP.HCM',
        phone: '02838234567',
        openTime: '08:00',
        closeTime: '21:00'
    },
    {
        id: 'CN02',
        name: 'PetCareX Thủ Đức',
        address: '456 Võ Văn Ngân, TP. Thủ Đức, TP.HCM',
        phone: '02837223456',
        openTime: '08:00',
        closeTime: '20:00'
    },
    {
        id: 'CN03',
        name: 'PetCareX Bình Thạnh',
        address: '789 Điện Biên Phủ, P.25, Bình Thạnh, TP.HCM',
        phone: '02835507891',
        openTime: '08:00',
        closeTime: '20:00'
    },
    {
        id: 'CN04',
        name: 'PetCareX Quận 3',
        address: '222 Võ Thị Sáu, P.7, Quận 3, TP.HCM',
        phone: '02839393939',
        openTime: '08:00',
        closeTime: '21:00'
    },
    {
        id: 'CN05',
        name: 'PetCareX Gò Vấp',
        address: '88 Quang Trung, P.10, Gò Vấp, TP.HCM',
        phone: '02836667788',
        openTime: '08:00',
        closeTime: '20:00'
    },
    {
        id: 'CN06',
        name: 'PetCareX Tân Bình',
        address: '678 Lý Thường Kiệt, P.8, Tân Bình, TP.HCM',
        phone: '02839987654',
        openTime: '08:00',
        closeTime: '21:00'
    },
    {
        id: 'CN07',
        name: 'PetCareX Quận 7',
        address: '18 Nguyễn Thị Thập, P. Bình Thuận, Quận 7, TP.HCM',
        phone: '02837585999',
        openTime: '08:00',
        closeTime: '21:00'
    },
    {
        id: 'CN08',
        name: 'PetCareX Phú Nhuận',
        address: '80 Hoàng Văn Thụ, P.9, Phú Nhuận, TP.HCM',
        phone: '02839941122',
        openTime: '08:00',
        closeTime: '20:00'
    },
    {
        id: 'CN09',
        name: 'PetCareX Quận 5',
        address: '123 Trần Hưng Đạo, P.5, Quận 5, TP.HCM',
        phone: '02838550505',
        openTime: '08:00',
        closeTime: '20:00'
    },
    {
        id: 'CN10',
        name: 'PetCareX Quận 10',
        address: '99 Thành Thái, P.14, Quận 10, TP.HCM',
        phone: '02838685858',
        openTime: '08:00',
        closeTime: '21:00'
    }
];

export const services: Service[] = [
    {
        id: 'DV01',
        name: 'Khám bệnh',
        description: 'Khám tổng quát và điều trị các bệnh lý nội khoa.',
        estimatedDuration: 30,
        priceRange: '100.000đ - 300.000đ',
        image: 'https://images.unsplash.com/photo-1628009368231-76033d0738d3?auto=format&fit=crop&q=80&w=500'
    },
    {
        id: 'DV02',
        name: 'Tiêm phòng',
        description: 'Tiêm vắc-xin phòng bệnh cho chó mèo (Dại, 5 bệnh, 7 bệnh...).',
        estimatedDuration: 15,
        priceRange: '150.000đ - 500.000đ',
        image: 'https://images.unsplash.com/photo-1581888227599-77981198520d?auto=format&fit=crop&q=80&w=500'
    },
];

export const doctors: Doctor[] = [
    {
        id: 'NV01',
        name: 'Bác sĩ Lê Thị B',
        specialty: 'Nội khoa',
        branchId: 'CN01',
        avatar: 'https://i.pravatar.cc/150?u=NV01',
        intro: '10 năm kinh nghiệm khám chữa bệnh thú nhỏ.'
    },
    {
        id: 'NV02',
        name: 'Bác sĩ Trần Văn C',
        specialty: 'Phẫu thuật',
        branchId: 'CN01',
        avatar: 'https://i.pravatar.cc/150?u=NV02',
        intro: 'Chuyên gia phẫu thuật chấn thương chỉnh hình.'
    },
    {
        id: 'NV03',
        name: 'Bác sĩ Phạm Thị D',
        specialty: 'Da liễu',
        branchId: 'CN02',
        avatar: 'https://i.pravatar.cc/150?u=NV03',
        intro: 'Chuyên điều trị các bệnh về da và ký sinh trùng.'
    }
];

export const myPets: Pet[] = [
    {
        id: 'TC01',
        name: 'Mimi',
        species: 'Mèo',
        breed: 'Anh Lông Ngắn',
        dob: '2021-05-12',
        gender: 'Cái',
        weight: 4.5,
        avatar: 'https://images.unsplash.com/photo-1529778873920-4da4926a7071?auto=format&fit=crop&q=80&w=300'
    },
    {
        id: 'TC02',
        name: 'Lu',
        species: 'Chó',
        breed: 'Golden Retriever',
        dob: '2020-08-20',
        gender: 'Đực',
        weight: 25,
        avatar: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=300'
    }
];

export const products: Product[] = [
    {
        id: 'SP01',
        name: 'Thức ăn hạt Royal Canin Kitten',
        sku: 'RC-KIT-2KG',
        category: 'Thức ăn',
        originalPrice: 550000,
        salePrice: 495000,
        discountPercentage: 10,
        image: 'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?auto=format&fit=crop&q=80&w=300',
        description: 'Thức ăn đầy đủ dinh dưỡng cho mèo con dưới 12 tháng tuổi.',
        rating: 4.8,
        stock: 20,
        isInStock: true,
        branchStock: {
            'CN01': 15, 'CN02': 20, 'CN03': 12, 'CN04': 18, 'CN05': 10,
            'CN06': 25, 'CN07': 8, 'CN08': 22, 'CN09': 14, 'CN10': 16
        }
    },
    {
        id: 'SP02',
        name: 'Cát vệ sinh Neko',
        sku: 'NEKO-10L',
        category: 'Phụ kiện',
        originalPrice: 120000,
        discountPercentage: 0,
        image: 'https://images.unsplash.com/photo-1632367503923-a261895a6390?auto=format&fit=crop&q=80&w=300',
        description: 'Cát vệ sinh kiểm soát mùi cực tốt, vón cục nhanh.',
        rating: 4.5,
        stock: 50,
        isInStock: true,
        branchStock: {
            'CN01': 45, 'CN02': 50, 'CN03': 38, 'CN04': 52, 'CN05': 42,
            'CN06': 48, 'CN07': 35, 'CN08': 55, 'CN09': 40, 'CN10': 43
        }
    },
    {
        id: 'SP03',
        name: 'Thuốc trị rận lưng Fronline',
        sku: 'FRON-DOG-S',
        category: 'Thuốc',
        originalPrice: 180000,
        discountPercentage: 0,
        image: 'https://plus.unsplash.com/premium_photo-1664303389025-a4b53298a650?auto=format&fit=crop&q=80&w=300',
        description: 'Thuốc đặc trị vé, rận cho chó dưới 10kg.',
        rating: 4.9,
        stock: 0,
        isInStock: false,
        branchStock: {
            'CN01': 0, 'CN02': 0, 'CN03': 0, 'CN04': 0, 'CN05': 0,
            'CN06': 0, 'CN07': 0, 'CN08': 0, 'CN09': 0, 'CN10': 0
        }
    },
    {
        id: 'SP04',
        name: 'Pate Whiskas Vị Cá Thu',
        sku: 'WHIS-MACK',
        category: 'Thức ăn',
        originalPrice: 15000,
        discountPercentage: 0,
        image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=300',
        description: 'Pate tươi ngon vị cá thu, bổ sung Omega 3.',
        rating: 4.6,
        stock: 100,
        isInStock: true,
        branchStock: {
            'CN02': 100, 'CN03': 88, 'CN05': 92,
            'CN06': 98, 'CN07': 85, 'CN09': 90, 'CN10': 93
        }
    },
    {
        id: 'SP05',
        name: 'Xúc xích rau củ',
        sku: 'XUCRAU-100G',
        category: 'Thức ăn',
        originalPrice: 15000,
        discountPercentage: 0,
        image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=300',
        description: 'Xúc xích rau củ ngon miệng cho thú cưng, chứa nhiều chất xơ và dinh dưỡng.',
        rating: 4.6,
        stock: 100,
        isInStock: true,
        branchStock: {
            'CN01': 88, 'CN02': 95, 'CN03': 82, 'CN04': 98, 'CN05': 85,
            'CN06': 92, 'CN07': 78, 'CN08': 102, 'CN09': 80, 'CN10': 90
        }
    },
    {
        id: 'SP06',
        name: 'Máy chải lông Furminator',
        sku: 'FURM-XL',
        category: 'Phụ kiện',
        originalPrice: 350000,
        discountPercentage: 0,
        image: '',
        description: 'Máy chải lông Furminator giúp loại bỏ lông rụng hiệu quả, phù hợp cho chó và mèo.',
        rating: 4.8,
        stock: 100,
        isInStock: true,
        branchStock: {
            'CN01': 88, 'CN02': 95, 'CN03': 82, 'CN05': 85,
            'CN06': 92, 'CN08': 102, 'CN09': 80,
        }
    }
];

export const orders: Order[] = [
    {
        id: 'HD1023',
        date: '2023-10-25',
        totalAmount: 1110000,
        status: 'Completed',
        paymentMethod: 'Transfer',
        branchName: 'PetCareX Quận 1',
        items: [
            { productId: 'SP01', productName: 'Thức ăn hạt Royal Canin Kitten', quantity: 2, price: 495000, total: 990000 },
            { productId: 'SP02', productName: 'Cát vệ sinh Neko', quantity: 1, price: 120000, total: 120000 }
        ]
    },
    {
        id: 'HD1025',
        date: '2023-11-05',
        totalAmount: 180000,
        status: 'Pending',
        paymentMethod: 'Cash',
        branchName: 'PetCareX Thủ Đức',
        items: [
            { productId: 'SP03', productName: 'Thuốc trị rận lưng Fronline', quantity: 1, price: 180000, total: 180000 }
        ]
    }
];

export const medicalRecords: MedicalRecord[] = [
    {
        id: 'PH005',
        date: '2023-09-15',
        petId: 'TC01',
        petName: 'Mimi',
        serviceType: 'Khám bệnh',
        doctorName: 'Bác sĩ Lê Thị B',
        diagnosis: 'Viêm da dị ứng do thức ăn lạ.',
        symptoms: 'Ngứa, rụng lông vùng cổ, gãi nhiều.',
        prescription: [
            { medicineName: 'Thuốc bôi SkinCare', quantity: 1, usage: 'Bôi 2 lần/ngày sáng tối' },
            { medicineName: 'Vitamin C bổ sung', quantity: 10, usage: 'Uống 1 viên/ngày' }
        ],
        nextAppointment: '2023-09-22'
    },
    {
        id: 'PH009',
        date: '2023-06-01',
        petId: 'TC02',
        petName: 'Lu',
        serviceType: 'Tiêm phòng',
        doctorName: 'Bác sĩ Phạm Thị D',
        diagnosis: 'Sức khỏe bình thường.',
        symptoms: 'Đến lịch tiêm phòng định kỳ.',
        vaccines: [
            { name: 'Vắc-xin 7 bệnh', batch: 'VXR-2023-005' }
        ]
    }
];

// Helper to generate slots
export const getAvailableSlots = (_date: string, _doctorId: string): TimeSlot[] => {
    // Mock logic: random availability
    const slots = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'];
    return slots.map(time => ({
        time,
        isAvailable: Math.random() > 0.3 // 70% chance available
    }));
};

// Helper to get available slots for a date (without doctor)
export const getAvailableSlotsForDate = (_date: string, _branchId: string): TimeSlot[] => {
    // Mock logic: random availability
    const slots = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'];
    return slots.map(time => ({
        time,
        isAvailable: Math.random() > 0.3 // 70% chance available
    }));
};

// Helper to get doctors available at a specific time slot
export const getAvailableDoctorsForSlot = (_date: string, _timeSlot: string, _branchId: string): Doctor[] => {
    // Return all doctors in the branch (mock logic)
    return doctors.filter(d => d.branchId === _branchId);
};
