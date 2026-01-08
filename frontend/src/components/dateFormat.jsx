export const formatDate = (value) => {
  if (!value) return "";
  // value dạng "2024-01-01T00:00:00.000Z"
  return value.split("T")[0]; // lấy phần trước chữ 'T' → "2024-01-01"
};