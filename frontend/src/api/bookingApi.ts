import { apiGet, apiPost } from "./client";

export interface Branch {
	MaCN: string;
	TenCN: string;
	DiaChi: string;
	SDT: string;
	GioMoCua?: string;
	GioDongCua?: string;
}

export interface Doctor {
	MaNV: string;
	HoTen: string;
	Email: string;
	SDT: string;
}

// --- API Functions ---

// 1. Lấy danh sách chi nhánh
export function getBranches() {
	return apiGet("/api/v1/branches");
}

// 2. Lấy danh sách bác sĩ rảnh theo chi nhánh, ngày, giờ
export function getAvailableDoctors(branchID: string, date: string, time: string) {
	return apiGet(
		`/api/v1/reception/available-doctors?branchID=${branchID}&date=${date}&time=${time}`
	);
}

// 3. Đặt lịch khám bệnh
export function bookExamAppointment(payload: {
	maKH: string;
	maCN: string;
	maDV: string;
	hinhThucDat: string;
	bacSiPhuTrach: string;
	maTC: string;
	ngayKham: string;
}) {
	return apiPost("/api/v1/services/exams", payload);
}

// 4. Đặt lịch tiêm phòng
export function bookVaccineAppointment(payload: {
	maKH: string;
	maCN: string;
	maDV: string;
	hinhThucDat: string;
	bacSiPhuTrach: string;
	maTC: string;
	ngayTiem: string;
	maDK?: string | null;
}) {
	return apiPost("/api/v1/services/vaccinations", payload);
}