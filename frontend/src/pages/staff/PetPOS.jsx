import React, { useState } from 'react';
import StaffLayout from '../../layouts/StaffLayout';
import { ShoppingBag, Search, Plus, Minus, Trash2, CreditCard, Banknote } from 'lucide-react';

const PetPOS = () => {
  const [cart, setCart] = useState([
    { id: 1, name: 'Thức ăn Royal Canin Puppy', price: 450000, qty: 1, img: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=100' },
    { id: 2, name: 'Đồ chơi xương cao su', price: 85000, qty: 2, img: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=100' },
  ]);

  const total = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

  return (
    <StaffLayout>
      <div className="grid grid-cols-12 gap-8 font-sans h-[calc(100vh-160px)]">
        {/* Bên trái: Danh mục sản phẩm */}
        <div className="col-span-8 flex flex-col">
          <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm mb-6 flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input type="text" placeholder="Tìm sản phẩm bằng tên hoặc barcode..." className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-sm outline-none focus:border-blue-500" />
            </div>
            <div className="flex gap-2">
              <button className="px-6 bg-blue-50 text-blue-500 rounded-2xl font-black text-xs uppercase">Thức ăn</button>
              <button className="px-6 bg-gray-50 text-gray-400 rounded-2xl font-black text-xs uppercase">Y tế</button>
              <button className="px-6 bg-gray-50 text-gray-400 rounded-2xl font-black text-xs uppercase">Đồ chơi</button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto grid grid-cols-3 gap-6 pr-2">
             {[1,2,3,4,5,6].map(i => (
               <div key={i} className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-lg transition-all cursor-pointer group">
                  <div className="w-full aspect-square bg-gray-50 rounded-2xl mb-4 overflow-hidden"><img src="https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=200" className="w-full h-full object-cover group-hover:scale-110 transition-transform" /></div>
                  <h4 className="font-black text-gray-800 text-sm mb-2">Pate Ciao Cho Mèo</h4>
                  <p className="text-[#0095FF] font-black text-lg">35.000đ</p>
                  <button className="mt-4 w-full py-3 bg-blue-50 text-blue-500 rounded-xl font-black text-[10px] uppercase group-hover:bg-blue-500 group-hover:text-white transition-all">+ THÊM VÀO GIỎ</button>
               </div>
             ))}
          </div>
        </div>

        {/* Bên phải: Giỏ hàng & Thanh toán */}
        <div className="col-span-4 bg-white rounded-[40px] border border-gray-100 shadow-2xl flex flex-col overflow-hidden">
          <div className="p-8 border-b border-gray-50 flex items-center gap-3">
             <div className="w-12 h-12 bg-blue-500 text-white rounded-2xl flex items-center justify-center"><ShoppingBag size={24} /></div>
             <h3 className="text-xl font-black text-gray-800 tracking-tight">Đơn hàng hiện tại</h3>
          </div>

          <div className="flex-1 overflow-y-auto p-8 space-y-6">
             {cart.map(item => (
               <div key={item.id} className="flex justify-between items-center gap-4">
                  <img src={item.img} className="w-14 h-14 rounded-xl object-cover" />
                  <div className="flex-1">
                    <p className="font-black text-gray-800 text-xs leading-tight mb-1">{item.name}</p>
                    <p className="text-[10px] font-bold text-gray-400">{item.price.toLocaleString()}đ</p>
                  </div>
                  <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-xl">
                    <button className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-blue-500"><Minus size={14} /></button>
                    <span className="font-black text-sm text-gray-800">{item.qty}</span>
                    <button className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-blue-500"><Plus size={14} /></button>
                  </div>
               </div>
             ))}
          </div>

          <div className="p-8 bg-gray-50/50 border-t border-gray-50 space-y-6">
             <div className="space-y-3">
               <div className="flex justify-between text-sm font-bold text-gray-400"><span>Tạm tính:</span><span className="text-gray-800">{total.toLocaleString()}đ</span></div>
               <div className="flex justify-between text-sm font-bold text-gray-400"><span>Giảm giá:</span><span className="text-emerald-500">- 20.000đ</span></div>
               <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                  <span className="text-lg font-black text-gray-800">Tổng cộng:</span>
                  <span className="text-3xl font-black text-[#0095FF] tracking-tighter">{(total - 20000).toLocaleString()}đ</span>
               </div>
             </div>
             
             <div className="grid grid-cols-2 gap-4">
                <button className="py-4 bg-white border border-gray-200 rounded-2xl font-black text-[10px] uppercase tracking-widest flex flex-col items-center gap-2 text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-all"><Banknote size={20} /> Tiền mặt</button>
                <button className="py-4 bg-white border border-gray-200 rounded-2xl font-black text-[10px] uppercase tracking-widest flex flex-col items-center gap-2 text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-all"><CreditCard size={20} /> Chuyển khoản</button>
             </div>
             <button className="w-full py-5 bg-[#0095FF] text-white rounded-2xl font-black text-sm uppercase shadow-xl shadow-blue-100 hover:bg-blue-600 transition-all">THANH TOÁN & IN HÓA ĐƠN</button>
          </div>
        </div>
      </div>
    </StaffLayout>
  );
};

export default PetPOS;