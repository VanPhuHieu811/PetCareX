import React, { useState, useEffect } from 'react';
import {
  ShoppingBag, Search, Plus, Minus, Trash2, CreditCard,
  Banknote, X, CheckCircle2, User, Package, Store
} from 'lucide-react';
import staffApi from '../../api/staffApi';

const PetPOS = () => {
  // 1. Dữ liệu sản phẩm mẫu
  const products = [
    { id: 1, name: 'Pate Ciao Cho Mèo', price: 35000, img: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=200', category: 'Thức ăn' },
    { id: 2, name: 'Hạt Royal Canin Puppy', price: 450000, img: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=200', category: 'Thức ăn' },
    { id: 3, name: 'Xương Cao Su Gặm', price: 85000, img: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=200', category: 'Đồ chơi' },
    { id: 4, name: 'Sữa Tắm Master Care', price: 125000, img: 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=200', category: 'Y tế' },
    { id: 5, name: 'Vòng Cổ Chuông Đỏ', price: 45000, img: 'https://images.unsplash.com/photo-1591768575198-88dac53fbd0a?w=200', category: 'Phụ kiện' },
    { id: 6, name: 'Cát Vệ Sinh Đậu Nành', price: 95000, img: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200', category: 'Vệ sinh' },
  ];

  // 2. States quản lý logic
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [staffProfile, setStaffProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await staffApi.getMyProfile();
        if (res.success) {
          setStaffProfile(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch staff profile:", error);
      }
    };
    fetchProfile();
  }, []);

  // Logic Thêm vào giỏ hàng
  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item));
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  // Logic Thay đổi số lượng
  const updateQty = (id, delta) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.qty + delta);
        return { ...item, qty: newQty };
      }
      return item;
    }));
  };

  // Logic Xóa sản phẩm
  const removeFromCart = (id) => setCart(cart.filter(item => item.id !== id));

  // Tính toán tiền bạc
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const discount = subtotal > 500000 ? 50000 : 0;
  const total = subtotal - discount;

  return (
    <>
      <div className="grid grid-cols-12 gap-8 font-sans h-[calc(100vh-140px)]">

        {/* BÊN TRÁI: DANH MỤC SẢN PHẨM */}
        <div className="col-span-8 flex flex-col min-h-0">
          <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm mb-6 flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input type="text" placeholder="Tìm bằng tên hoặc barcode..." className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-sm outline-none focus:ring-4 focus:ring-blue-500/5 transition-all" />
            </div>
            {staffProfile && (
              <div className="hidden lg:flex items-center gap-3 px-5 py-3 bg-blue-50/50 rounded-2xl border border-blue-100">
                <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                  <User size={20} />
                </div>
                <div>
                  <h3 className="text-xs font-black text-gray-800 uppercase leading-tight">{staffProfile.HoTen}</h3>
                  <div className="flex items-center gap-1.5 text-blue-500">
                    <Store size={12} />
                    <span className="text-[10px] font-black uppercase tracking-wide">{staffProfile.TenCN}</span>
                  </div>
                </div>
              </div>
            )}
            <div className="flex gap-2">
              <button className="px-6 bg-blue-50 text-blue-500 rounded-2xl font-black text-xs uppercase shadow-sm">Tất cả</button>
              <button className="px-6 bg-gray-50 text-gray-400 rounded-2xl font-black text-xs uppercase hover:bg-gray-100">Thức ăn</button>
              <button className="px-6 bg-gray-50 text-gray-400 rounded-2xl font-black text-xs uppercase hover:bg-gray-100">Y tế</button>
            </div>
          </div>

          {/* Grid sản phẩm */}
          <div className="flex-1 overflow-y-auto grid grid-cols-3 gap-6 pr-2 pb-4 scrollbar-hide">
            {products.map(product => (
              <div key={product.id} className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl transition-all group flex flex-col">
                <div className="w-full aspect-square bg-gray-50 rounded-2xl mb-4 overflow-hidden relative">
                  <img src={product.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                  <span className="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-[9px] font-black uppercase text-blue-500 shadow-sm">{product.category}</span>
                </div>
                <h4 className="font-black text-gray-800 text-sm mb-1 leading-tight">{product.name}</h4>
                <p className="text-[#0095FF] font-black text-lg mb-4">{product.price.toLocaleString()}đ</p>
                <button
                  onClick={() => addToCart(product)}
                  className="mt-auto w-full py-3.5 bg-blue-50 text-blue-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all active:scale-95 shadow-sm"
                >
                  + THÊM VÀO GIỎ
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* BÊN PHẢI: GIỎ HÀNG & THANH TOÁN */}
        <div className="col-span-4 bg-white rounded-[40px] border border-gray-100 shadow-2xl flex flex-col overflow-hidden relative">
          <div className="p-8 border-b border-gray-50 bg-white sticky top-0 z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-[#0095FF] text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-100"><ShoppingBag size={24} /></div>
              <h3 className="text-xl font-black text-gray-800 tracking-tight">Đơn hàng mới</h3>
            </div>

            {/* Ô điền tên khách hàng */}
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Nhập tên khách hàng..."
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-sm outline-none focus:bg-white focus:border-blue-200 transition-all"
              />
            </div>
          </div>

          {/* Danh sách giỏ hàng */}
          <div className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-hide">
            {cart.length > 0 ? cart.map(item => (
              <div key={item.id} className="flex justify-between items-center gap-4 animate-in fade-in slide-in-from-right-4">
                <img src={item.img} className="w-16 h-16 rounded-2xl object-cover shadow-sm border border-gray-50" alt="" />
                <div className="flex-1">
                  <p className="font-black text-gray-800 text-xs leading-tight mb-1">{item.name}</p>
                  <p className="text-[11px] font-black text-[#0095FF]">{(item.price * item.qty).toLocaleString()}đ</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-3 bg-gray-50 p-1.5 rounded-xl border border-gray-100">
                    <button onClick={() => updateQty(item.id, -1)} className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-blue-500"><Minus size={14} /></button>
                    <span className="font-black text-sm text-gray-800">{item.qty}</span>
                    <button onClick={() => addToCart(item)} className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-blue-500"><Plus size={14} /></button>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="text-gray-300 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                </div>
              </div>
            )) : (
              <div className="h-full flex flex-col items-center justify-center opacity-20 text-center grayscale">
                <Package size={80} className="mb-4" />
                <p className="font-black uppercase text-xs tracking-widest leading-relaxed">Giỏ hàng đang trống<br />Vui lòng chọn sản phẩm</p>
              </div>
            )}
          </div>

          {/* Tổng kết tiền bạc */}
          <div className="p-8 bg-gray-50/50 border-t border-gray-50 space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between text-sm font-bold text-gray-400"><span>Tạm tính:</span><span className="text-gray-800 font-black">{subtotal.toLocaleString()}đ</span></div>
              <div className="flex justify-between text-sm font-bold text-gray-400"><span>Giảm giá:</span><span className="text-emerald-500 font-black">-{discount.toLocaleString()}đ</span></div>
              <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                <span className="text-lg font-black text-gray-800">TỔNG TIỀN:</span>
                <span className="text-3xl font-black text-[#0095FF] tracking-tighter">{total.toLocaleString()}đ</span>
              </div>
            </div>

            {/* Phương thức thanh toán */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setPaymentMethod('cash')}
                className={`py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex flex-col items-center gap-2 transition-all border ${paymentMethod === 'cash' ? 'bg-white border-blue-500 text-blue-500 shadow-md shadow-blue-50' : 'bg-white border-gray-200 text-gray-400 hover:border-blue-200'}`}
              >
                <Banknote size={20} /> Tiền mặt
              </button>
              <button
                onClick={() => setPaymentMethod('card')}
                className={`py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex flex-col items-center gap-2 transition-all border ${paymentMethod === 'card' ? 'bg-white border-blue-500 text-blue-500 shadow-md shadow-blue-50' : 'bg-white border-gray-200 text-gray-400 hover:border-blue-200'}`}
              >
                <CreditCard size={20} /> Chuyển khoản
              </button>
            </div>

            <button
              onClick={() => setShowSuccess(true)}
              disabled={cart.length === 0 || !customerName}
              className={`w-full py-5 rounded-2xl font-black text-sm uppercase shadow-xl transition-all active:scale-95 ${cart.length > 0 && customerName ? 'bg-[#0095FF] text-white shadow-blue-100 hover:bg-blue-600' : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'}`}
            >
              THANH TOÁN & IN HÓA ĐƠN
            </button>
          </div>
        </div>
      </div>

      {/* POPUP THÔNG BÁO THÀNH CÔNG */}
      {showSuccess && (
        <div className="fixed inset-0 bg-[#1E293B]/60 backdrop-blur-md z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white rounded-[40px] w-full max-w-[440px] shadow-2xl p-10 text-center animate-in zoom-in duration-300">
            <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
              <CheckCircle2 size={56} />
            </div>
            <h2 className="text-3xl font-black text-gray-800 tracking-tight mb-3">Thanh toán hoàn tất!</h2>
            <p className="text-gray-400 font-bold text-base leading-relaxed mb-8">
              Hóa đơn của khách hàng <span className="text-gray-800 underline">{customerName}</span> đã được lưu và đang thực hiện in tự động.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => { setCart([]); setCustomerName(''); setShowSuccess(false); }}
                className="w-full py-4 bg-[#0095FF] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-100 hover:bg-blue-600 transition-all active:scale-95"
              >
                TIẾP TỤC BÁN HÀNG
              </button>
              <button
                onClick={() => setShowSuccess(false)}
                className="w-full py-4 bg-gray-50 text-gray-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-100"
              >
                XEM LẠI HÓA ĐƠN
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PetPOS;