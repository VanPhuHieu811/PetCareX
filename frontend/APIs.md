# PetCareX API Documentation

## Base URL
```
http://localhost:3000/api
```

---

## 1. Chi nhánh (Branches)

### GET /branches
Lấy danh sách tất cả chi nhánh

**Response:**
```json
[
  {
    "id": "CN01",
    "name": "PetCareX Quận 1",
    "address": "123 Nguyễn Huệ, P. Bến Nghé, Quận 1, TP.HCM",
    "phone": "02838234567",
    "openTime": "08:00",
    "closeTime": "21:00"
  }
]
```

**SQL Query:**
```sql
SELECT 
MaCN as id, 
TenCN as name, 
DiaChi as address, 
SDT as phone, 
       CONVERT(varchar(5), ThoiGianMo, 108) as openTime,
       CONVERT(varchar(5), ThoiGianDong, 108) as closeTime
FROM ChiNhanh
Where MaCN = @id -- lay chi tiet 1 chi nhanh
ORDER BY TenCN
```

### GET /branches/:id
Lấy thông tin chi tiết một chi nhánh

---

## 2. Sản phẩm (Products)

### GET /products
Lấy danh sách sản phẩm (có thể filter theo category, search, branch), phân trang, limit

**Query Parameters:**
- `category` (optional): Lọc theo loại sản phẩm (Thuốc, Thức ăn, Phụ kiện)
- `search` (optional): Tìm kiếm theo tên
- `branchId` (optional): Lọc theo chi nhánh (hiển thị tồn kho của chi nhánh đó)

**Response:**
```json
[
  {
    "id": "SP01",
    "name": "Thức ăn hạt Royal Canin Kitten",
    "sku": "RC-KIT-2KG",
    "category": "Thức ăn",
    "originalPrice": 550000,
    "salePrice": 495000,
    "discountPercentage": 10,
    "image": "https://...",
    "description": "Thức ăn đầy đủ dinh dưỡng cho mèo con dưới 12 tháng tuổi.",
    "rating": 4.8,
    "stock": 20,
    "isInStock": true,
    "branchStock": {
      "CN01": 15,
      "CN02": 20,
      "CN03": 12
    }
  }
]
```

**SQL Query (lấy tồn kho theo chi nhánh):**
```sql
SELECT 
    sp.MaSP as id,
    sp.TenSP as name,
    sp.GiaBan as originalPrice,
    ls.TenLoaiSP as category,
    ISNULL(spc.SoLuongTonKho, 0) as stock
FROM SanPham sp
JOIN LoaiSP ls ON sp.MaLoaiSP = ls.MaLoaiSP
LEFT JOIN SPCuaTungCN spc ON sp.MaSP = spc.MaSP AND spc.MaCN = @branchId
WHERE (@category IS NULL OR ls.TenLoaiSP = @category)
  AND (@search IS NULL OR sp.TenSP LIKE '%' + @search + '%')
ORDER BY sp.TenSP
```

**SQL Query (lấy tồn kho tất cả chi nhánh):**
```sql
SELECT 
    sp.MaSP as productId,
    spc.MaCN as branchId,
    spc.SoLuongTonKho as stock
FROM SanPham sp
LEFT JOIN SPCuaTungCN spc ON sp.MaSP = spc.MaSP
WHERE sp.MaSP = @productId
```

### GET /products/:id
Lấy thông tin chi tiết một sản phẩm

**Response:**
```json
{
  "id": "SP01",
  "name": "Thức ăn hạt Royal Canin Kitten",
  "sku": "RC-KIT-2KG",
  "category": "Thức ăn",
  "originalPrice": 550000,
  "salePrice": 495000,
  "discountPercentage": 10,
  "image": "https://...",
  "description": "...",
  "rating": 4.8,
  "stock": 20,
  "isInStock": true,
  "branchStock": {
    "CN01": 15,
    "CN02": 20
  }
}
```

---

## 3. Dịch vụ (Services)

### GET /services
Lấy danh sách dịch vụ

**Response:**
```json
[
  {
    "id": "DV01",
    "name": "Khám bệnh",
    "description": "Khám tổng quát và điều trị các bệnh lý nội khoa.",
    "estimatedDuration": 30,
    "priceRange": "100.000đ - 300.000đ",
    "image": "https://..."
  }
]
```

**SQL Query:**
```sql
SELECT 
    MaDV as id,
    TenDV as name
FROM DichVu
ORDER BY TenDV
```

### GET /services/:branchId
Lấy danh sách dịch vụ được cung cấp tại một chi nhánh

**SQL Query:**
```sql
SELECT 
    dv.MaDV as id,
    dv.TenDV as name
FROM DichVu dv
JOIN CungCapDV ccdv ON dv.MaDV = ccdv.MaDV
WHERE ccdv.MaCN = @branchId
ORDER BY dv.TenDV
```

---

## 4. Bác sĩ (Doctors)

### GET /doctors?branchId=:branchId
Lấy danh sách bác sĩ theo chi nhánh

**Response:**
```json
[
  {
    "id": "NV01",
    "name": "Bác sĩ Lê Thị B",
    "specialty": "Nội khoa",
    "branchId": "CN01",
    "avatar": "https://...",
    "intro": "10 năm kinh nghiệm khám chữa bệnh thú nhỏ."
  }
]
```

**SQL Query:**


### GET /doctors/:id
Lấy thông tin chi tiết bác sĩ

```sql
SELECT 
    nv.MaNV as id,
    nd.HoTen as name,
    cv.TenChucVu as specialty,
    nv.MaCN as branchId,
    nv.MaCN as branchId
FROM NhanVien nv
JOIN NguoiDung nd ON nv.MaNV = nd.MaND
JOIN ChucVu cv ON nv.MaChucVu = cv.MaChucVu
WHERE nv.MaNV = @id
  AND nv.TrangThai = N'Đang làm'
  AND cv.TenChucVu LIKE N'%Bác sĩ%'
ORDER BY nd.HoTen
```

---

## 5. Thú cưng (Pets)

### GET /pets
Lấy danh sách thú cưng của khách hàng (phải login để lấy id khách hàng trong token)

**Response:**
```json
[
  {
    "id": "TC01",
    "name": "Mimi",
    "species": "Mèo",
    "breed": "Anh Lông Ngắn",
    "dob": "2021-05-12",
    "gender": "Đực",
    "weight": 4.5,
    "avatar": "https://..."
  }
]
```

**SQL Query:**
```sql
SELECT 
    tc.MaTC as id,
    tc.TenTC as name,
    ltc.TenLoaiTC as species,
    g.TenGiong as breed,
    tc.NgaySinh as dob,
    tc.GioiTinh as gender,
    tc.TinhTrangSucKhoe as healthStatus
FROM ThuCung tc
JOIN Giong g ON tc.MaGiong = g.MaGiong
JOIN LoaiThuCung ltc ON g.MaLoaiTC = ltc.MaLoaiTC
WHERE tc.MaKH = @customerId
ORDER BY tc.TenTC
```

### POST /pets
Thêm thú cưng mới

**Request Body:**
```json
{
  "name": "Mimi",
  "breedId": "G01",
  "dob": "2021-05-12",
  "gender": "Cái",
  "healthStatus": "Khỏe mạnh",
  "customerId": "KH001"
}
```

---

## 6. Đặt lịch (Booking)

### POST /bookings
Tạo phiếu đặt dịch vụ

**Request Body (Khám bệnh):**
```json
{
  "customerId": "KH001",
  "branchId": "CN01",
  "serviceId": "DV01",
  "serviceType": "Khám bệnh",
  "bookingType": "Online",
  "petId": "TC01",
  "doctorId": "NV01",
  "appointmentDate": "2024-01-15T09:00:00",
  "symptoms": "Ngứa, rụng lông vùng cổ"
}
```

**Request Body (Tiêm phòng):**
```json
{
  "customerId": "KH001",
  "branchId": "CN01",
  "serviceId": "DV02",
  "serviceType": "Tiêm Phòng",
  "bookingType": "Online",
  "petId": "TC01",
  "doctorId": "NV01",
  "appointmentDate": "2024-01-15T09:00:00",
  "packageId": "DK01",
  "vaccines": [
    { "vaccineId": "VX01", "dose": 1 }
  ]
}
```

**Response:**
```json
{
  "bookingId": "PDV001",
  "status": "Đang chờ",
  "message": "Đặt lịch thành công!"
}
```

**SQL Query (Tạo PhieuDatDV):**
```sql
INSERT INTO PhieuDatDV (MaPhieuDV, NgayDatDV, MaKH, MaCN, MaDV, HinhThucDat, TrangThai, LoaiDichVu)
VALUES (@maPhieuDV, GETDATE(), @maKH, @maCN, @maDV, @hinhThucDat, N'Đang chờ', @loaiDichVu)
```

**SQL Query (Tạo PhieuDatDVKhamBenh):**
```sql
INSERT INTO PhieuDatDVKhamBenh (MaPhieuDV, NgayKham, MoTaTrieuChung, TongTienDonThuoc, MaTC, BacSiPhuTrach)
VALUES (@maPhieuDV, @ngayKham, @moTaTrieuChung, 0, @maTC, @bacSiPhuTrach)
```

### GET /bookings?customerId=:customerId
Lấy danh sách đặt lịch của khách hàng

**Response:**
```json
[
  {
    "id": "PDV001",
    "date": "2024-01-15T09:00:00",
    "serviceType": "Khám bệnh",
    "branchName": "PetCareX Quận 1",
    "status": "Đang chờ",
    "petName": "Mimi"
  }
]
```

**SQL Query:**
```sql
SELECT 
    pdv.MaPhieuDV as id,
    pdv.NgayDatDV as date,
    pdv.LoaiDichVu as serviceType,
    cn.TenCN as branchName,
    pdv.TrangThai as status,
    CASE 
        WHEN pdv.LoaiDichVu = N'Khám bệnh' THEN (SELECT TenTC FROM ThuCung WHERE MaTC = pk.MaTC)
        WHEN pdv.LoaiDichVu = N'Tiêm Phòng' THEN (SELECT TenTC FROM ThuCung WHERE MaTC = pt.MaTC)
        ELSE NULL
    END as petName
FROM PhieuDatDV pdv
JOIN ChiNhanh cn ON pdv.MaCN = cn.MaCN
LEFT JOIN PhieuDatDVKhamBenh pk ON pdv.MaPhieuDV = pk.MaPhieuDV
LEFT JOIN PhieuDatDVTiemPhong pt ON pdv.MaPhieuDV = pt.MaPhieuDV
WHERE pdv.MaKH = @customerId
ORDER BY pdv.NgayDatDV DESC
```

### GET /bookings/available-slots?doctorId=:doctorId&date=:date
Lấy danh sách slot thời gian khả dụng của bác sĩ

**Response:**
```json
[
  { "time": "08:00", "isAvailable": true },
  { "time": "08:30", "isAvailable": false },
  { "time": "09:00", "isAvailable": true }
]
```

---

## 7. Hồ sơ cá nhân (Profile)

### GET /customers/:id
Lấy thông tin khách hàng

**Response:**
```json
{
  "id": "KH001",
  "name": "Nguyễn Văn A",
  "email": "nguyenvana@gmail.com",
  "phone": "0909123456",
  "dob": "1990-01-01",
  "gender": "Nam",
  "avatar": "https://...",
  "loyaltyPoints": 1500,
  "memberType": "VIP",
  "lastVisit": "2024-01-10T10:00:00"
}
```

**SQL Query:**
```sql
SELECT 
    kh.MaKH as id,
    nd.HoTen as name,
    nd.Email as email,
    nd.SDT as phone,
    nd.NgaySinh as dob,
    nd.GioiTinh as gender,
    kh.DiemLoyalty as loyaltyPoints,
    ltv.TenLoaiTV as memberType,
    kh.LanCuoiToiCuaHang as lastVisit
FROM KhachHang kh
JOIN NguoiDung nd ON kh.MaKH = nd.MaND
JOIN LoaiThanhVien ltv ON kh.MaLoaiTV = ltv.MaLoaiTV
WHERE kh.MaKH = @customerId
```

### GET /customers/:id/orders
Lấy lịch sử đơn hàng của khách hàng

**Response:**
```json
[
  {
    "id": "HD1023",
    "date": "2023-10-25",
    "totalAmount": 1110000,
    "status": "Completed",
    "paymentMethod": "Transfer",
    "branchName": "PetCareX Quận 1",
    "items": [
      {
        "productId": "SP01",
        "productName": "Thức ăn hạt Royal Canin Kitten",
        "quantity": 2,
        "price": 495000,
        "total": 990000
      }
    ]
  }
]
```

**SQL Query:**
```sql
SELECT 
    hd.MaHoaDon as id,
    hd.NgayLap as date,
    hd.TongTien as totalAmount,
    hd.HinhThucThanhToan as paymentMethod,
    cn.TenCN as branchName
FROM HoaDon hd
JOIN ChiNhanh cn ON hd.MaCN = cn.MaCN
WHERE hd.MaKH = @customerId
ORDER BY hd.NgayLap DESC
```

**SQL Query (Chi tiết đơn hàng - Mua hàng):**
```sql
SELECT 
    sp.MaSP as productId,
    sp.TenSP as productName,
    dssp.SoLuongMua as quantity,
    sp.GiaBan as price,
    (dssp.SoLuongMua * sp.GiaBan) as total
FROM ChiTietHoaDon cthd
JOIN PhieuDatDV pdv ON cthd.MaPhieuDV = pdv.MaPhieuDV
JOIN PhieuDatDVMuaHang pmh ON pdv.MaPhieuDV = pmh.MaPhieuDV
JOIN DanhSachSP dssp ON pmh.MaPhieuDV = dssp.MaPhieuDV
JOIN SanPham sp ON dssp.MaSP = sp.MaSP
WHERE cthd.MaHoaDon = @orderId
```

### GET /customers/:id/medical-records
Lấy lịch sử khám bệnh của khách hàng

**Response:**
```json
[
  {
    "id": "PH005",
    "date": "2023-09-15",
    "petId": "TC01",
    "petName": "Mimi",
    "serviceType": "Khám bệnh",
    "doctorName": "Bác sĩ Lê Thị B",
    "diagnosis": "Viêm da dị ứng do thức ăn lạ.",
    "symptoms": "Ngứa, rụng lông vùng cổ, gãi nhiều.",
    "prescription": [
      {
        "medicineName": "Thuốc bôi SkinCare",
        "quantity": 1,
        "usage": "Bôi 2 lần/ngày sáng tối"
      }
    ],
    "nextAppointment": "2023-09-22"
  }
]
```

**SQL Query:**
```sql
SELECT 
    pk.MaPhieuDV as id,
    pk.NgayKham as date,
    tc.MaTC as petId,
    tc.TenTC as petName,
    pdv.LoaiDichVu as serviceType,
    nd.HoTen as doctorName,
    pk.MoTaChuanDoan as diagnosis,
    pk.MoTaTrieuChung as symptoms,
    pk.NgayTaiKham as nextAppointment
FROM PhieuDatDVKhamBenh pk
JOIN PhieuDatDV pdv ON pk.MaPhieuDV = pdv.MaPhieuDV
JOIN ThuCung tc ON pk.MaTC = tc.MaTC
JOIN NhanVien nv ON pk.BacSiPhuTrach = nv.MaNV
JOIN NguoiDung nd ON nv.MaNV = nd.MaND
WHERE tc.MaKH = @customerId
ORDER BY pk.NgayKham DESC
```

**SQL Query (Lấy đơn thuốc):**
```sql
SELECT 
    sp.TenSP as medicineName,
    dt.SoLuongMua as quantity,
    dt.ThanhTien as total
FROM DonThuoc dt
JOIN SanPham sp ON dt.MaSP = sp.MaSP
WHERE dt.MaPhieuDV = @recordId
```

---

## 8. Đơn hàng (Orders)

### POST /orders
Tạo đơn hàng mua sản phẩm

**Request Body:**
```json
{
  "customerId": "KH001",
  "branchId": "CN01",
  "items": [
    {
      "productId": "SP01",
      "quantity": 2
    },
    {
      "productId": "SP02",
      "quantity": 1
    }
  ],
  "paymentMethod": "Transfer"
}
```

**Response:**
```json
{
  "orderId": "PDV002",
  "totalAmount": 1110000,
  "status": "Đang chờ"
}
```

---

## Status Codes

- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error
