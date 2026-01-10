import { apiGet} from "./client";

export function getAppointmentQueue() {
  return apiGet("/api/v1/services/dasboard");
}

