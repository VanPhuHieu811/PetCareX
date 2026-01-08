export const dashboardStats = {
  totalAppointments: 7,
  waitingCount: 4,
  clinicalCount: 3,
  vaccinationCount: 3,
};

//Cập nhật maTC cho từng dòng để khớp với key của petHistories bên dưới
export const appointments = [
  { id: 'PDV001', maTC: 'TC101', petName: 'Milu', species: 'Chó', owner: 'Nguyễn Văn An', phone: '0901234567', service: 'Khám mới', time: '08:30', status: 'Hoàn thành', type: 'clinic' },
  { id: 'PDV002', maTC: 'TC102', petName: 'Bông', species: 'Mèo', owner: 'Trần Thị Bình', phone: '0912345678', service: 'Tiêm phòng', time: '09:00', status: 'Đang khám', type: 'vaccine' },
  { id: 'PDV003', maTC: 'TC103', petName: 'Lucky', species: 'Chó', owner: 'Lê Hoàng Cường', phone: '0923456789', service: 'Tái khám', time: '09:30', status: 'Chờ khám', type: 'clinic' },
  { id: 'PDV004', maTC: 'TC104', petName: 'Mochi', species: 'Mèo', owner: 'Phạm Minh Dũng', phone: '0934567890', service: 'Gói tiêm', time: '10:00', status: 'Chờ khám', type: 'vaccine' },
  { id: 'PDV005', maTC: 'TC105', petName: 'Max', species: 'Chó', owner: 'Hoàng Thị Em', phone: '0945678901', service: 'Khám mới', time: '10:30', status: 'Chờ khám', type: 'clinic' },
  { id: 'PDV006', maTC: 'TC101', petName: 'Milu', species: 'Chó', owner: 'Nguyễn Văn An', phone: '0901234567', service: 'Tiêm phòng', time: '14:00', status: 'Chờ khám', type: 'vaccine'},
  { id: 'PDV007', maTC: 'TC101', petName: 'Milu', species: 'Chó', owner: 'Nguyễn Văn An', phone: '0901234567', service: 'Tiêm phòng', time: '14:00', status: 'Chờ khám', type: 'vaccine'},
];

export const currentUser = {
    maNV: 'NV001', // //: 57]
  hoTen: 'BS.  Nguyễn Hương', // //: 49]
   chucVu: 'Bác sĩ thú y', // //: 197]
  avatar: '👤'
};

// export const petHistories = {
//   'TC101': {
//     info: { 
//          MaTC: 'TC101', // //: 276]
//          TenTC: 'Milu', // //: 276]
//          MaGiong: 'G001', // //: 276, 285]
//         TenGiong: 'Golden Retriever', 
//         NgaySinh: '2021-02-15', 
//         Loai: 'Chó',
//          GioiTinh: 'Đực', // //: 276, 278]
//          TinhTrangSucKhoe: 'Viêm da dị ứng', // //: 276]
//          MaKH: 'KH001', // //: 253]
//         TenChuNuoi: 'Nguyễn Văn An',
//         SDT: '0901234567' 
//     },
//     history: [
//       {
//          MaPhieuDV: 'PDV001', //[cite: 346]
//         LoaiDichVu: 'Tái khám', 
//          NgayKham: '2024-12-22', //[cite: 346]
//          BacSiPhuTrach: 'NV005', //[cite: 346]
//         TenBacSi: 'BS. Nguyễn Thị Hương',
//          MoTaTrieuChung: 'Đã hết nôn, ăn uống bình thường', //[cite: 346]
//          MoTaChuanDoan: 'Đã khỏi viêm dạ dày', //[cite: 346]
//         HuongDieuTri: 'Tiếp tục duy trì chế độ ăn nhẹ 3 ngày',
//       },
//       {
//          MaPhieuDV: 'PDV002', //[cite: 346]
//         LoaiDichVu: 'Khám',
//          NgayKham: '2024-12-15', //[cite: 346]
//         TenBacSi: 'BS. Nguyễn Thị Hương',
//          MoTaTrieuChung: 'Bỏ ăn, mệt mỏi, nôn mửa 2 ngày', //[cite: 346]
//          MoTaChuanDoan: 'Viêm dạ dày cấp', //[cite: 346]
//         HuongDieuTri: 'Tiêm thuốc chống nôn + kháng sinh',
//         DonThuoc: [
//            { MaSP: 'SP001', TenSP: 'Metoclopramide', SoLuongMua: 1 }, //[cite: 95]
//            { MaSP: 'SP002', TenSP: 'Amoxicillin', SoLuongMua: 5 } //[cite: 95]
//         ],
//          NgayTaiKham: '2024-12-22', //[cite: 346]
//       },
//       {
//          MaPhieuDV: 'PDV003', //[cite: 361]
//         LoaiDichVu: 'Tiêm phòng',
//          NgayTiem: '2024-11-01', //[cite: 361]
//         TenBacSi: 'BS. Trần Văn Khoa',
//          TenVacxin: 'Rabisin (Vắc-xin dại)', //[cite: 400]
//         GhiChuVacxin: 'Lô: RB2024-0892 • Boehringer Ingelheim',
     
//       }
//     ]
//   },
//   'TC104': {
//     info: { 
//          MaTC: 'TC102',  //: 276]
//          TenTC: 'Bông',  //: 276]
//          MaGiong: 'G002',  //: 285]
//         TenGiong: 'Mèo Anh lông ngắn', 
//         NgaySinh: '2023-05-10', 
//         Loai: 'Mèo',
//          GioiTinh: 'Cái',  //: 276, 278]
//          TinhTrangSucKhoe: 'Khỏe mạnh',  //: 276]
//          MaKH: 'KH002',  //: 253]
//         TenChuNuoi: 'Trần Thị Bình',
//         SDT: '0912345678' 
//     },
//     history: [
//       {
//          MaPhieuDV: 'PDV004',  //: 361]
//         LoaiDichVu: 'Tiêm phòng', 
//          NgayTiem: '2024-12-20',  //: 361]
//         TenBacSi: 'BS. Lê Văn Nam',
//          TenVacxin: 'Vắc-xin 4 bệnh (Feline)',  //: 400]
//         GhiChuVacxin: 'Tiêm mũi nhắc lại hàng năm',
        
//       }
//     ]
//   },
//   'TC103': {
//     info: { 
//          MaTC: 'TC103',  //: 276]
//          TenTC: 'Lucky',  //: 276]
//          MaGiong: 'G003',  //: 285]
//         TenGiong: 'Poodle', 
//         NgaySinh: '2022-11-20', 
//         Loai: 'Chó',
//          GioiTinh: 'Đực',  //: 276, 278]
//          TinhTrangSucKhoe: 'Mẫn cảm với thuốc',  //: 276]
//          MaKH: 'KH003',  //: 253]
//         TenChuNuoi: 'Lê Hoàng Cường',
//         SDT: '0923456789' 
//     },
//     history: [
//       {
//          MaPhieuDV: 'PDV005',  //: 346]
//         LoaiDichVu: 'Khám', 
//          NgayKham: '2024-12-25',  //: 346]
//         TenBacSi: 'BS. Nguyễn Thị Hương',
//          MoTaTrieuChung: 'Ngứa tai, gãi nhiều',  //: 346]
//          MoTaChuanDoan: 'Viêm tai ngoài',  //: 346]
//         HuongDieuTri: 'Vệ sinh tai hàng ngày + thuốc nhỏ tai',
        
//       }
//     ]
//   }
// };


export const petHistories = {
  'TC104': {
    info: { 
      MaTC: 'TC101', //[cite: 44, 127]
      TenTC: 'Milu', //: 44, 127]
      TenGiong: 'Golden Retriever', //: 47, 129]
      NgaySinh: '2021-02-15', //: 44, 127]
      Loai: 'Chó', //: 50, 131]
      GioiTinh: 'Đực', //: 44, 127]
      TinhTrangSucKhoe: 'Viêm da dị ứng', //: 44, 127]
      TenChuNuoi: 'Nguyễn Văn An', //: 99, 123]
      SDT: '0901234567' //: 99, 100]
    },
    // Lịch sử khám bệnh (Dịch vụ Khám)
    history: [
      {
        MaPhieuDV: 'PDV001', //: 65, 143]
        LoaiDichVu: 'Tái khám', //: 62, 142]
        NgayKham: '22/12/2024', //: 65, 143]
        NgayTaiKham: '29/12/2024',
        TenBacSi: 'Nguyễn Thị Hương', //: 111, 112]
        MoTaTrieuChung: 'Đã hết nôn, ăn uống bình thường', //: 65, 143]
        MoTaChuanDoan: 'Đã khỏi viêm dạ dày', //: 65, 143]
      },
      {
        MaPhieuDV: 'PDV002', //: 65, 143]
        LoaiDichVu: 'Khám mới', //: 62, 142]
        NgayKham: '15/12/2024', //: 65, 143]
        NgayTaiKham: null,
        TenBacSi: 'Nguyễn Thị Hương', //: 111, 112]
        MoTaTrieuChung: 'Bỏ ăn, mệt mỏi, nôn mửa 2 ngày', //: 65, 143]
        MoTaChuanDoan: 'Viêm dạ dày cấp', //: 65, 143]
      }
    ],
    // Lịch sử tiêm phòng (Dịch vụ Tiêm)
    vaccinationHistory: [
      {
        MaPhieuDV: 'PDV003', //: 77, 145]
        TenVacxin: 'Rabisin (Vắc-xin dại)', //: 89, 155]
        NgayTiem: '01/11/2024', //: 77, 145]
        TenBacSi: 'Trần Văn Khoa', //: 111, 112]
      }
    ]
  },
  // ... các thú cưng khác
};

export const petVaccinePackages = {
  'TC102': null,

  'TC104': {
    maDK: 'DK001', // Khóa chính bảng DangKyGoiTP [cite: 109, 371]
    tenGoi: 'Gói vaccine cơ bản mèo', // TenGoiTP [cite: 104, 381]
    ngayBatDau: '2024-10-15', // ThoiGianBD [cite: 109, 373]
    tongMui: 5,
    muiDaTiem: 2,
    tienTrinh: 40,
    danhSachMui: [
      { 
        tenVacxin: 'FVRCP', 
        trangThai: 'Đã tiêm', 
        ngayDuKien: '2024-10-15', // ThangTiem chỉ định [cite: 110, 391]
        ngayThucHien: '2024-10-15' // NgayTiem thực tế từ PhieuDatDVTiemPhong [cite: 102, 361]
      },
      { 
        tenVacxin: 'FVRCP', 
        trangThai: 'Đã tiêm', 
        ngayDuKien: '2024-11-15', 
        ngayThucHien: '2024-11-16' // Tiêm trễ 1 ngày so với dự kiến
      },
      { 
        tenVacxin: 'FVRCP + Rabies', 
        trangThai: 'Hôm nay', 
        ngayDuKien: '2026-01-02', 
        ngayThucHien: null // Chưa tiêm nên để null
      },
      { 
        tenVacxin: 'FeLV', 
        trangThai: 'Dự kiến', 
        ngayDuKien: '2026-01-15', 
        ngayThucHien: null 
      },
      { 
        tenVacxin: 'FeLV', 
        trangThai: 'Dự kiến', 
        ngayDuKien: '2026-02-15', 
        ngayThucHien: null 
      },
    ]
  },
  
  'TC103': null
};

export const mockMedicines = [
  { MaSP: 'SP001', TenSP: 'Amoxicillin 250mg', Ton: 200, DonVi: 'Viên nén • 250mg' },
  { MaSP: 'SP002', TenSP: 'Metoclopramide 10mg', Ton: 150, DonVi: 'Viên nén' },
  { MaSP: 'SP003', TenSP: 'Prednisolone 5mg', Ton: 100, DonVi: 'Viên nén' },
  { MaSP: 'SP004', TenSP: 'Meloxicam 1.5mg/ml', Ton: 30, DonVi: 'Hỗn dịch' },
  { MaSP: 'SP005', TenSP: 'Famotidine 10mg', Ton: 80, DonVi: 'Viên nén' },
  { MaSP: 'SP006', TenSP: 'Cephalexin 500mg', Ton: 120, DonVi: 'Viên nén' },
];

// Dữ liệu giả lập cho Vaccine (Bổ sung thuộc tính DonViTinh)
export const mockVaccines = [
  { MaVacXin: 'V001', TenVacXin: 'Rabisin (Dại)', NgaySX: '01/06/2024', TonKho: 45, DonViTinh: 'Liều' },
  { MaVacXin: 'V002', TenVacXin: 'FVRCP (Mèo)', NgaySX: '15/05/2024', TonKho: 30, DonViTinh: 'Liều' },
  { MaVacXin: 'V003', TenVacXin: 'DHPP 5in1 (Chó)', NgaySX: '01/07/2024', TonKho: 25, DonViTinh: 'Liều' },
  { MaVacXin: 'V004', TenVacXin: 'Lepto 4 (Xoắn khuẩn)', NgaySX: '10/08/2024', TonKho: 0, DonViTinh: 'Liều' },
  { MaVacXin: 'V005', TenVacXin: 'Lepto 4 (Xoắn khuẩn)', NgaySX: '10/08/2024', TonKho: 0, DonViTinh: 'Liều' },
  { MaVacXin: 'V006', TenVacXin: 'Lepto 4 (Xoắn khuẩn)', NgaySX: '10/08/2024', TonKho: 0, DonViTinh: 'Liều' },
  { MaVacXin: 'V007', TenVacXin: 'Lepto 4 (Xoắn khuẩn)', NgaySX: '10/08/2024', TonKho: 0, DonViTinh: 'Liều' },
];
