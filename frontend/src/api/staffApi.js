// src/services/staffApi.js
import { apiGet, apiPatch, apiPost } from "../api/client";

const staffApi = {
  getMyProfile: () => {
    return apiGet("/api/v1/staff/profile");
  },

  updateMyProfile: (data) => {
    return apiPatch("/api/v1/staff/profile", data);
  },

  createOrder: (data) => {
    return apiPost("/api/v1/sales/order", data);
  },
};

export default staffApi;