import { apiGet, apiPost } from "./client";

export function getMyPets() {
  return apiGet("/api/v1/pets");
}

export function createPet(payload: {
  TenTC: string;
  MaGiong: string;
  NgaySinh: string;
  GioiTinh: string; // backend đang nhận string
  TinhTrangSucKhoe?: string | null;
}) {
  return apiPost("/api/v1/pets", payload);
}

export function getPetExams(petId: string) {
  return apiGet(`/api/v1/pets/exams/${petId}`);
}

export function getPetVaccinations(petId: string) {
  return apiGet(`/api/v1/pets/vaccinations/${petId}`);
}
