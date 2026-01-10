import { apiGet, apiPost } from './client';

export interface CartResponse {
    success: boolean;
    message?: string;
    data?: any;
}

export const cartApi = {
    getCart: () => {
        return apiGet('/api/v1/carts');
    },

    addToCart: (branchId: string, productId: string, quantity: number) => {
        return apiPost('/api/v1/carts/add', { branchId, productId, quantity });
    },

    removeFromCart: (productId: string) => {
        return apiPost('/api/v1/carts/remove', { productId });
    },

    checkout: (branchId: string, address: string) => {
        return apiPost('/api/v1/carts/checkout', { branchId, address });
    }
};
