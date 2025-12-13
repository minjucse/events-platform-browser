// utils/eventTime.ts (or paste at top of component file)
const parseTimeString = (time?: string) => {
  if (!time || typeof time !== "string") return null;
  const t = time.trim();

  // 24h: "18:00" or "1800"
  const re24 = /^(\d{1,2}):?(\d{2})$/;
  const m24 = t.match(re24);
  if (m24) {
    const h = Number(m24[1]);
    const mm = Number(m24[2]);
    if (h >= 0 && h <= 23 && mm >= 0 && mm <= 59)
      return { hour: h, minute: mm };
  }

  // 12h with AM/PM e.g. "6:00PM", "6PM", "6:00 PM"
  const re12 = /^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/i;
  const m12 = t.match(re12);
  if (m12) {
    let hour = Number(m12[1]);
    const minute = m12[2] ? Number(m12[2]) : 0;
    const ampm = m12[3].toUpperCase();
    if (hour === 12) hour = ampm === "AM" ? 0 : 12;
    else if (ampm === "PM") hour += 12;
    if (hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59)
      return { hour, minute };
  }

  return null;
};

export const getEventStartLocal = (
  dateIso: string | Date,
  timeStr?: string
): Date | null => {
  try {
    const base = new Date(dateIso);
    const year = base.getFullYear();
    const month = base.getMonth();
    const day = base.getDate();

    const parsed = parseTimeString(timeStr ?? "");
    if (!parsed) return null;

    // Constructs local datetime
    return new Date(year, month, day, parsed.hour, parsed.minute, 0, 0);
  } catch {
    return null;
  }
};

export const endOfDayLocal = (d: Date) => {
  const e = new Date(d);
  e.setHours(23, 59, 59, 999);
  return e;
};
