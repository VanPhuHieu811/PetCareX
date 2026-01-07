import React, { useState } from 'react';
import { mockVaccines } from '../../../services/mockDataBS';

const VaccineSelection = ({ onSelect, selectedId }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // 🔍 Chỉ tìm theo TÊN VACCINE
  const keyword = searchTerm.trim().toLowerCase();
  const filteredVaccines = keyword
  ? mockVaccines.filter(v =>
      v.TenVacXin.toLowerCase().includes(keyword)
    )
  : mockVaccines;

  return (
    <div className="border border-slate-100 rounded-2xl overflow-hidden">
      
      {/* Search */}
      <div className="p-4 border-b bg-white border-slate-50 flex items-center gap-2">
        <span className="text-slate-400">🔍</span>
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Tìm vaccine theo tên..."
          className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm outline-none focus:border-blue-400"
        />
      </div>

      {/* Table */}
      <div className="max-h-[360px] overflow-y-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 text-[11px] uppercase font-bold text-slate-600 sticky top-0 z-10">
            <tr>
              <th className="px-7 py-4">Vaccine</th>
              <th className="px-6 py-4">Ngày SX</th>
              <th className="px-6 py-4">Tồn kho</th>
              <th className="px-6 py-4 text-center">Chọn</th>
            </tr>
          </thead>

        <tbody className="text-sm">
          {filteredVaccines.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center py-10 text-slate-400">
                Không tìm thấy vaccine phù hợp
              </td>
            </tr>
          )}

          {filteredVaccines.map(v => (
            <tr
              key={v.MaVacXin}
              onClick={() => v.TonKho > 0 && onSelect(v)}
              className={`border-t border-slate-50 cursor-pointer transition-colors
                ${v.TonKho === 0
                    ? 'opacity-40 cursor-not-allowed'
                    : 'cursor-pointer hover:bg-blue-50/30'}
                ${selectedId === v.MaVacXin
                  ? 'bg-blue-50/60'
                  : 'hover:bg-blue-50/30'}
              `}
            >
              <td className="px-6 py-4">
                <p className="text-slate-600">{v.TenVacXin}</p>
              </td>

              <td className="px-6 py-4 text-slate-500">
                {v.NgaySX}
              </td>

              <td className="px-6 py-4 text-slate-700">
                {v.TonKho}
                <span className="text-[13px] text-slate-600 ml-1">
                  {v.DonViTinh}
                </span>
              </td>

              <td className="px-6 py-4 text-center">
                <div
                  className={`w-5 h-5 rounded-full border-2 mx-auto flex items-center justify-center
                    ${selectedId === v.MaVacXin
                      ? 'border-blue-600 bg-blue-600'
                      : 'border-slate-200'}
                  `}
                >
                  {selectedId === v.MaVacXin && (
                    <span className="text-white text-[10px]">✓</span>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
        </table>
      </div>
    </div>
  );
};

export default VaccineSelection;
