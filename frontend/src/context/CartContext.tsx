import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '../types';
import { cartApi } from '../api/cartApi';
import { useAuth } from './AuthContext';

interface CartItem {
	product: Product;
	quantity: number;
	branchId?: string;
}

interface CartContextType {
	items: CartItem[];
	addToCart: (product: Product, quantity: number, branchId: string) => Promise<void>;
	removeFromCart: (productId: string) => Promise<void>;
	updateQuantity: (productId: string, quantity: number, branchId?: string) => Promise<void>;
	clearCart: () => void;
	getTotalItems: () => number;
	getTotalPrice: () => number;
	checkout: (branchId: string, address: string) => Promise<any>;
	loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
	const { user } = useAuth();
	const [items, setItems] = useState<CartItem[]>([]);
	const [loading, setLoading] = useState(false);

	const fetchCart = async () => {
		if (!user) {
			setItems([]);
			return;
		}

		try {
			setLoading(true);
			const response = await cartApi.getCart();
			if (response.success && Array.isArray(response.data)) {
				// Map API response to CartItem structure
				// API returns: { MaSP, TenSP, DonGia, SoLuongMua, MaCN, ... }
				const mappedItems: CartItem[] = response.data.map((item: any) => ({
					product: {
						id: item.MaSP,
						name: item.TenSP,
						originalPrice: item.DonGia,
						salePrice: item.DonGia,
						image: '', // API doesn't return image currently
						category: '',
						sku: item.MaSP,
						description: '',
						rating: 0,
						stock: 999,
						isInStock: true
					},
					quantity: item.SoLuongMua,
					branchId: item.MaCN
				}));
				setItems(mappedItems);
			}
		} catch (error) {
			console.error('Failed to fetch cart:', error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchCart();
	}, [user]);

	const addToCart = async (product: Product, quantity: number = 1, branchId: string) => {
		try {
			await cartApi.addToCart(branchId, product.id, quantity);
			await fetchCart();
		} catch (error) {
			console.error('Failed to add to cart:', error);
			alert('Không thể thêm vào giỏ hàng. Vui lòng thử lại.');
		}
	};

	const removeFromCart = async (productId: string) => {
		// Optimistic Update
		const previousItems = [...items];
		setItems(prev => prev.filter(item => item.product.id !== productId));

		try {
			await cartApi.removeFromCart(productId);
			// Success: do nothing, kept optimistic state
		} catch (error) {
			console.error('Failed to remove from cart:', error);
			// Revert
			setItems(previousItems);
			alert('Xóa sản phẩm thất bại. Đã khôi phục giỏ hàng.');
		}
	};

	const updateQuantity = async (productId: string, newQuantity: number, branchId?: string) => {
		const currentItem = items.find(item => item.product.id === productId);
		if (!currentItem) return;

		const currentQty = currentItem.quantity;
		const diff = newQuantity - currentQty;
		if (diff === 0) return;

		if (newQuantity <= 0) {
			await removeFromCart(productId);
			return;
		}

		const targetBranchId = branchId || currentItem.branchId;
		if (!targetBranchId) {
			console.warn('Branch ID missing for updateQuantity');
			alert('Không xác định được chi nhánh sản phẩm. Vui lòng xóa và thêm lại.');
			return;
		}

		// Optimistic Update
		const previousItems = [...items];
		setItems(prev => prev.map(item =>
			item.product.id === productId
				? { ...item, quantity: newQuantity }
				: item
		));

		try {
			// Call API with delta
			await cartApi.addToCart(targetBranchId, productId, diff);
			// Success: do nothing, kept optimistic state means no re-fetch needed immediately
		} catch (error) {
			console.error('Failed to update quantity:', error);
			// Revert
			setItems(previousItems);
			alert('Cập nhật số lượng thất bại. Xin thử lại.');
		}
	};

	const clearCart = () => {
		// Not directly supported by API as "clear all", but we can define it if needed.
		// For now, simple client side clear or loop remove? 
		// Or assume checkout clears it.
		// Let's refresh.
		setItems([]);
	};

	const checkout = async (branchId: string, address: string) => {
		try {
			const result = await cartApi.checkout(branchId, address);
			await fetchCart(); // Cart should be empty after checkout
			return result;
		} catch (error) {
			throw error;
		}
	};

	const getTotalItems = () => {
		return items.reduce((total, item) => total + item.quantity, 0);
	};

	const getTotalPrice = () => {
		return items.reduce((total, item) => {
			const price = item.product.salePrice || item.product.originalPrice;
			return total + price * item.quantity;
		}, 0);
	};

	return (
		<CartContext.Provider
			value={{
				items,
				addToCart,
				removeFromCart,
				updateQuantity,
				clearCart,
				getTotalItems,
				getTotalPrice,
				checkout,
				loading
			}}
		>
			{children}
		</CartContext.Provider>
	);
}

export function useCart() {
	const context = useContext(CartContext);
	if (context === undefined) {
		throw new Error('useCart must be used within a CartProvider');
	}
	return context;
}

