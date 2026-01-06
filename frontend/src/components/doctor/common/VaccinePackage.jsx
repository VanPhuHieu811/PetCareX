import React from 'react';

const VaccinePackage = ({ packageData }) => {
  if (!packageData) {
    return (
      <div className="bg-white rounded-2xl p-10 text-center border border-dashed border-slate-200 mt-4">
        <p className="text-slate-500 text-sm font-semibold">
          Không có gói tiêm phòng nào đang hoạt động
        </p>
      </div>
    );
  }

  return (
    <div className="mt-4">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-800">
          Gói tiêm phòng
        </h2>
        <p className="text-sm text-slate-500">
          Bắt đầu: <span className="text-slate-700">{packageData.ngayBatDau}</span>
        </p>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-slate-200">
        {/* Thông tin gói */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-slate-800">
            {packageData.tenGoi}
          </h3>
          <span className="text-sm font-medium text-blue-600">
            {packageData.muiDaTiem}/{packageData.tongMui} mũi
          </span>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500"
              style={{ width: `${packageData.tienTrinh}%` }}
            />
          </div>
          <p className="text-xs text-right text-slate-500 mt-1">
            Hoàn thành {packageData.tienTrinh}%
          </p>
        </div>

        {/* Danh sách mũi */}
        <div className="space-y-3">
          {packageData.danhSachMui.map((mui, idx) => {
            const isCompleted = mui.trangThai === 'Đã tiêm';
            const isToday = mui.trangThai === 'Hôm nay';
            const displayDate = mui.ngayThucHien || mui.ngayDuKien;

            return (
              <div
                key={idx}
                className={`flex justify-between items-center p-4 rounded-xl border
                  ${isToday ? 'border-blue-300 bg-blue-50'
                  : isCompleted ? 'border-slate-200 bg-slate-50'
                  : 'border-slate-200 bg-white'}
                `}
              >
                <div>
                  <p className="font-medium text-slate-800">
                    Mũi {idx + 1} – {mui.tenVacxin}
                  </p>
                  <p className="text-xs text-slate-500">
                    {isCompleted ? 'Đã tiêm' : isToday ? 'Hôm nay' : 'Dự kiến'}
                  </p>
                </div>

                <div className="text-sm font-medium text-slate-700">
                  {displayDate}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default VaccinePackage;
