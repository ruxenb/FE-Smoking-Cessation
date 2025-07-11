import { parse, isValid, format } from "date-fns";

// Parse "dd-MM-yyyy" to Date object
export const parseDate = (dateStr) => {
  if (!dateStr) return null;
  const parsed = parse(dateStr, "dd-MM-yyyy", new Date());
  return isValid(parsed) ? parsed : null;
};

// Format Date object -> "dd-MM-yyyy" (nếu cần xuất ngược lại)
export const formatDate = (date) => {
  return date ? format(date, "dd-MM-yyyy") : "";
};
