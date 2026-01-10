// src/services/staffApi.js
import { apiGet, apiPatch } from "../api/client"; 

const staffApi = {
  getMyProfile: () => {
    return apiGet("/api/v1/staff/profile");
  },

  updateMyProfile: (data) => {
    return apiPatch("/api/v1/staff/profile", data);
  },
};

export default staffApi;