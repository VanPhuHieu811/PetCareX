import React, { useState } from 'react';
import { MOCK_PRODUCTS } from '../services/mockData';
import { Search, AlertTriangle, Plus, Edit, X, Save, Trash2 } from 'lucide-react';
import { SanPham } from '../types';

const Inventory: React.FC = () => {
  const [products, setProducts] = useState<SanPham[]>(MOCK_PRODUCTS);
  const [searchTerm, setSearchTerm] = useState('');

  // State quản lý Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<SanPham>({
    MaSP: '',
    TenSP: '',
    MaLoaiSP: '',
    TenLoaiSP: '',
    GiaBan: 0,
    TonKho: 0,
    SoLuongDaBan: 0
  });

  const filteredProducts = products.filter(p => 
    p.TenSP.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.MaSP.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Mở modal để thêm mới
  const handleAddNew = () => {
    setIsEditing(false);
    setCurrentProduct({
      MaSP: '',
      TenSP: '',
      MaLoaiSP: '',
      TenLoaiSP: '',
      GiaBan: 0,
      TonKho: 0,
      SoLuongDaBan: 0
    });
    setIsModalOpen(true);
  };

  // Mở modal để chỉnh sửa
  const handleEdit = (prod: SanPham) => {
    setIsEditing(true);
    setCurrentProduct({ ...prod });
    setIsModalOpen(true);
  };

  // Lưu dữ liệu
  const handleSave = () => {
    if (!currentProduct.MaSP || !currentProduct.TenSP) {
      alert("Vui lòng nhập Mã và Tên sản phẩm");
      return;
    }

    if (isEditing) {
      // Cập nhật
      setProducts(products.map(p => p.MaSP === currentProduct.MaSP ? currentProduct : p));
      alert(`Đã cập nhật thông tin sản phẩm ${currentProduct.MaSP}`);
    } else {
      // Thêm mới (Kiểm tra trùng mã)
      if (products.find(p => p.MaSP === currentProduct.MaSP)) {
        alert("Mã sản phẩm đã tồn tại!");
        return;
      }
      setProducts([...products, currentProduct]);
      alert(`Đã thêm mới sản phẩm ${currentProduct.TenSP}`);
    }
    setIsModalOpen(false);
  };

  // Xóa sản phẩm (Logic đơn giản)
  const handleDelete = (maSP: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này không?')) {
        setProducts(products.filter(p => p.MaSP !== maSP));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản lý Kho hàng</h1>
          <p className="text-gray-500">Theo dõi tồn kho, nhập hàng và điều chỉnh</p>
        </div>
        <button 
          onClick={handleAddNew}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus size={18} />
          <span>Nhập hàng mới</span>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Tìm kiếm sản phẩm theo tên hoặc mã..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <span className="w-3 h-3 bg-red-100 border border-red-500 rounded-full block"></span>
          <span>Sắp hết hàng (&lt;10)</span>
        </div>
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Mã SP</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tên Sản Phẩm</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Loại</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Giá Bán</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Đã bán</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Tồn Kho</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredProducts.map((product) => (
              <tr key={product.MaSP} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{product.MaSP}</td>
                <td className="px-6 py-4 text-sm text-gray-800">{product.TenSP}</td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">{product.TenLoaiSP}</span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-800 text-right">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.GiaBan)}
                </td>
                <td className="px-6 py-4 text-sm text-center text-gray-800 font-medium">
                  {product.SoLuongDaBan || 0}
                </td>
                <td className="px-6 py-4 text-sm text-center">
                    <div className={`flex items-center justify-center space-x-2 ${product.TonKho < 10 ? 'text-red-600 font-bold' : 'text-gray-800'}`}>
                      {product.TonKho < 10 && <AlertTriangle size={14} />}
                      <span>{product.TonKho}</span>
                    </div>
                </td>
                <td className="px-6 py-4 text-sm text-center flex justify-center space-x-3">
                    <button 
                        onClick={() => handleEdit(product)}
                        className="text-gray-500 hover:text-blue-600 transition-colors p-1"
                        title="Chỉnh sửa / Điều chỉnh kho"
                    >
                        <Edit size={16} />
                    </button>
                    <button 
                        onClick={() => handleDelete(product.MaSP)}
                        className="text-gray-500 hover:text-red-600 transition-colors p-1"
                        title="Xóa sản phẩm"
                    >
                        <Trash2 size={16} />
                    </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredProducts.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            Không tìm thấy sản phẩm nào.
          </div>
        )}
      </div>

       {/* Modal Popup */}
       {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
                  <div className="bg-blue-600 px-6 py-4 flex justify-between items-center">
                      <h2 className="text-white font-bold text-lg">
                          {isEditing ? 'Cập nhật Sản phẩm' : 'Nhập hàng mới'}
                      </h2>
                      <button onClick={() => setIsModalOpen(false)} className="text-blue-100 hover:text-white">
                          <X size={20} />
                      </button>
                  </div>
                  
                  <div className="p-6 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                          <div className="col-span-1">
                              <label className="block text-sm font-medium text-gray-700 mb-1">Mã Sản phẩm</label>
                              <input 
                                  type="text"
                                  className={`w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none ${isEditing ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'border-gray-300'}`}
                                  value={currentProduct.MaSP}
                                  onChange={(e) => setCurrentProduct({...currentProduct, MaSP: e.target.value})}
                                  disabled={isEditing}
                                  placeholder="SP..."
                              />
                          </div>
                          <div className="col-span-1">
                               <label className="block text-sm font-medium text-gray-700 mb-1">Mã Loại</label>
                              <input 
                                  type="text"
                                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                  value={currentProduct.MaLoaiSP}
                                  onChange={(e) => setCurrentProduct({...currentProduct, MaLoaiSP: e.target.value})}
                                  placeholder="LSP..."
                              />
                          </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-1">
                           <label className="block text-sm font-medium text-gray-700 mb-1">Tên Sản phẩm</label>
                            <input 
                                type="text"
                                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                value={currentProduct.TenSP}
                                onChange={(e) => setCurrentProduct({...currentProduct, TenSP: e.target.value})}
                                placeholder="Nhập tên..."
                            />
                        </div>
                        <div className="col-span-1">
                             <label className="block text-sm font-medium text-gray-700 mb-1">Tên Loại</label>
                              <input 
                                  type="text"
                                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                  value={currentProduct.TenLoaiSP}
                                  onChange={(e) => setCurrentProduct({...currentProduct, TenLoaiSP: e.target.value})}
                                  placeholder="Thức ăn/Vệ sinh..."
                              />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                          <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Giá bán (VND)</label>
                              <input 
                                  type="number"
                                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                  value={currentProduct.GiaBan}
                                  onChange={(e) => setCurrentProduct({...currentProduct, GiaBan: Number(e.target.value)})}
                              />
                          </div>
                          <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Tồn kho</label>
                              <input 
                                  type="number"
                                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                  value={currentProduct.TonKho}
                                  onChange={(e) => setCurrentProduct({...currentProduct, TonKho: Number(e.target.value)})}
                              />
                          </div>
                          <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Đã bán</label>
                              <input 
                                  type="number"
                                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                  value={currentProduct.SoLuongDaBan || 0}
                                  onChange={(e) => setCurrentProduct({...currentProduct, SoLuongDaBan: Number(e.target.value)})}
                              />
                          </div>
                      </div>
                  </div>

                  <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3 border-t border-gray-100">
                      <button 
                          onClick={() => setIsModalOpen(false)}
                          className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium"
                      >
                          Hủy bỏ
                      </button>
                      <button 
                          onClick={handleSave}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center space-x-2"
                      >
                          <Save size={16} />
                          <span>{isEditing ? 'Lưu thay đổi' : 'Thêm mới'}</span>
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default Inventory;