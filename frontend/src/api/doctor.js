import { apiGet, apiPost , apiPatch} from "./client";

export function getAppointmentQueue() {
  return apiGet("/api/v1/services/dasboard");
}

//const BASE_PATH = "/api/v1/reception"; // Giả sử route được mount tại đây trong server

// const receptionAPI = {
//   /**
//    * Lấy thông tin khách hàng kèm danh sách thú cưng
//    * Endpoint: GET /?identifier=...
//    */
//   getCustomerDetails: async (identifier: string): Promise<Customer> => {
//     // encodeURIComponent giúp xử lý các ký tự đặc biệt trong Email hoặc SĐT
//     return apiGet(`${BASE_PATH}?identifier=${encodeURIComponent(identifier)}`);
//   },

export function getCustomerDetails(identifier) {
  return apiGet(
    `/api/v1/reception?identifier=${encodeURIComponent(identifier)}`
  );
}

export function getPackageRegistration(petID) {
  return apiGet(`/api/v1/packages/register/${encodeURIComponent(petID)}`);
}

export function getPetExams(petId) {
  return apiGet(`/api/v1/pets/exams/${encodeURIComponent(petId)}`);
}

export function getPetVaccinations(petId) {
  return apiGet(`/api/v1/pets/vaccinations/${encodeURIComponent(petId)}`);
}

export function getMedicinesInStock(branchId) {
  return apiGet(`/api/v1/services/exams/medicines/${branchId}`);
}

export function createPrescription(data) {
  return apiPost("/api/v1/services/exams/medicines", data);
}

export function updateRevisitDate(maPhieuDV, ngayTaiKham) {
  return apiPatch("/api/v1/services/exams/revisit-date", {
    maPhieuDV,
    ngayTaiKham
  });
}