import { apiGet } from "./client";

export const branchApi = {
  getAll: () => {
    return apiGet("/api/v1/branches"); 
  }
};

export const productApi = {
  getAll: (page: number = 1, limit: number = 12, search: string = '') => {
    return apiGet(`/api/v1/products?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`);
  }
};