import { apiPost } from "./client";

export function loginApi(email, password) {
  return apiPost("/api/v1/auth/login", { email, password });
}

export function registerApi(name, email, password) {
  return apiPost("/api/v1/auth/register", { name, email, password });
}
