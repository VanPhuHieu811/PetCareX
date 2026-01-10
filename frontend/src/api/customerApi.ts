import { apiGet, apiPut } from "./client";

export function getCustomerMe() {
  return apiGet("/api/v1/customers/me");
}

export function updateCustomerMe(payload: {
  HoTen?: string;
  NgaySinh?: string | null;
  GioiTinh?: string | null;
  SDT?: string | null;
  CCCD?: string | null;
}) {
  return apiPut("/api/v1/customers/me", payload);
}

export function getCustomerReceipts() {
  return apiGet("/api/v1/customers/receipts");
}

export function getReceiptDetailsApi(receiptId: string) {
  return apiGet(`/api/v1/customers/receipts/${receiptId}`);
}
