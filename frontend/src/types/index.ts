export interface CurrentUser {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatar: string;
    loyaltyPoints: number;
    memberType: 'Basic' | 'Silver' | 'VIP';
}

export interface Branch {
    id: string;
    name: string;
    address: string;
    phone: string;
    openTime: string;
    closeTime: string;
}

export interface Service {
    id: string;
    name: string;
    description: string;
    estimatedDuration: number; // minutes
    priceRange?: string;
    image: string;
}

export interface Doctor {
    id: string;
    name: string;
    specialty: string;
    branchId: string;
    avatar: string;
    intro: string;
}

export interface Pet {
    id: string;
    name: string;
    species: string; // Chó, Mèo
    breed: string; // Giống
    dob: string;
    gender: 'Đực' | 'Cái';
    weight: number;
    avatar?: string;
}

export interface Product {
    id: string;
    name: string;
    sku: string;
    category: string;
    originalPrice: number;
    salePrice?: number;
    discountPercentage: number;
    image: string;
    description: string;
    rating: number;
    stock: number;
    isInStock: boolean;
    branchStock?: { [branchId: string]: number }; // Tồn kho theo từng chi nhánh
}

export interface ProductAvailability {
    branchId: string;
    branchName: string;
    stock: number;
}

export interface OrderItem {
    productId: string;
    productName: string;
    price: number;
    quantity: number;
    total: number;
}

export interface Order {
    id: string;
    date: string;
    totalAmount: number;
    status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
    paymentMethod: 'Cash' | 'Transfer';
    branchName: string;
    items: OrderItem[];
}

export interface MedicalRecord {
    id: string;
    date: string;
    petId: string;
    petName: string;
    serviceType: string;
    doctorName: string;
    diagnosis: string;
    symptoms: string;
    prescription?: {
        medicineName: string;
        quantity: number;
        usage: string;
    }[];
    vaccines?: {
        name: string;
        batch: string;
    }[];
    nextAppointment?: string;
}

export interface TimeSlot {
    time: string;
    isAvailable: boolean;
}
