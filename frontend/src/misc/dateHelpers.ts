// Week-based date helpers used by Session page

// Return a new Date representing the start of the ISO week (Monday) for the given date
export function getWeekStart(date: Date): Date {
  const d = new Date(date);
  // Normalize to midnight to avoid timezone drift
  d.setHours(0, 0, 0, 0);
  const day = d.getDay();
  // JS: Sunday = 0, Monday = 1 ... Saturday = 6. We want Monday as start.
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d;
}

// Add n weeks to the given date (week start). n may be negative.
export function addWeeks(weekStart: Date, n: number): Date {
  const d = new Date(weekStart);
  d.setDate(d.getDate() + n * 7);
  return d;
}

// Format a week label. If the supplied weekStart falls in the same ISO week as today,
// return "This week". Otherwise return a short range like "Oct 7 - 13".
export function formatWeekLabel(weekStart: Date): string {
  const start = getWeekStart(weekStart);
  const today = new Date();
  const thisWeekStart = getWeekStart(today);

  // If the same week start day, it's this week
  if (start.getTime() === thisWeekStart.getTime()) {
    return "This week";
  }

  // Build end of week (Sunday)
  const end = new Date(start);
  end.setDate(start.getDate() + 6);

  // Short month/day format, e.g. "Oct 7 - 13"
  const monthStart = start.toLocaleString("en-US", { month: "short" });
  const dayStart = start.getDate();
  const dayEnd = end.getDate();

  // If range spans months (e.g., Sep 29 - Oct 5) show month for both start and end
  const monthEnd = end.toLocaleString("en-US", { month: "short" });
  if (monthStart === monthEnd) {
    return `${monthStart} ${dayStart} - ${dayEnd}`;
  }

  return `${monthStart} ${dayStart} - ${monthEnd} ${dayEnd}`;
}

export function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    weekday: "short", // Mon–Sun
    month: "short", // Jan–Dec
    day: "numeric", // 1–31
  });
}

// Utility: format ISO date YYYY-MM-DD (kept for compatibility)
export function dateToYYYYMMDD(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}
