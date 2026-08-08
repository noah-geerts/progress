import dayjs, { Dayjs } from "dayjs";

export function formatDateString(dateString: string) {
  const date = dayjs(dateString);
  const now = dayjs();
  if (date.year() === now.year()) return date.format("dddd, MMMM D");
  return date.format("dddd, MMMM D, YYYY");
}

export function getDaysOfWeek(firstDayOfWeek: Dayjs) {
  const out: Dayjs[] = [];
  for (let i = 0; i <= 6; i++) {
    out.push(firstDayOfWeek.day(i));
  }
  return out;
}
