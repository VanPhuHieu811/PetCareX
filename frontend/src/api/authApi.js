import { apiPost } from "./client";

export function loginApi(email, password) {
  return apiPost("/api/v1/auth/login", { email, password });
}

export function registerApi(email, password, name, cccd) {
  return apiPost("/api/v1/auth/register", { email, password, name, cccd });
}
