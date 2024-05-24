import { endOfToday, startOfToday } from "date-fns";

export function getTodayDate() {
  const from = startOfToday().toISOString();
  const to = endOfToday().toISOString();
  return {
    from,
    to
  }
}