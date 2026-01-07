import React from 'react';

const Step1Diagnosis = ({ formData, setFormData }) => {
  // Hàm handle change để cập nhật dữ liệu vào state của cha
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">🩺</span>
        <h3 className="text-lg font-bold text-slate-800">Chẩn đoán</h3>
      </div>
      <p className="text-sm text-slate-400">Nhập triệu chứng và kết quả chẩn đoán</p>
      
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-2">
          Mô tả triệu chứng <span className="text-red-500">*</span>
        </label>
        <textarea 
          name="trieuChung"
          value={formData.trieuChung}
          onChange={handleChange}
          className="w-full p-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-100 outline-none h-32 bg-slate-50/30 transition-all" 
          placeholder="Nhập tại đây..."
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-slate-700 mb-2">
          Mô tả chẩn đoán <span className="text-red-500">*</span>
        </label>
        <textarea 
          name="chuanDoan"
          value={formData.chuanDoan}
          onChange={handleChange}
          className="w-full p-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-100 outline-none h-32 bg-slate-50/30 transition-all" 
          placeholder="Nhập tại đây..."
        />
      </div>
    </div>
  );
};

export default Step1Diagnosis;