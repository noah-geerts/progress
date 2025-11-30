import type { Session } from "../domain/Session/Session";

export const generateCurrentWeekSessions = (): Session[] => {
  // Get current date and find Monday of this week
  const today = new Date();
  const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const daysFromMonday = currentDay === 0 ? 6 : currentDay - 1; // Handle Sunday case

  const monday = new Date(today);
  monday.setDate(today.getDate() - daysFromMonday);
  monday.setHours(0, 0, 0, 0); // Reset time to midnight

  // Helper to format date as YYYY-MM-DD
  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Helper to get date for specific day of week
  const getWeekDay = (dayOffset: number): string => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + dayOffset);
    return formatDate(date);
  };

  const sessions: Session[] = [];

  // Monday - Push Day
  sessions.push({
    ssid: 1,
    date: getWeekDay(0), // Monday
    name: "Push Day",
    performedExercises: [
      {
        peid: 101,
        position: 0,
        exercise: { eid: 1, name: "Bench Press" },
        sets: [
          { stid: 1001, position: 0, reps: 8, weight: 225 },
          { stid: 1002, position: 1, reps: 6, weight: 235 },
          { stid: 1003, position: 2, reps: 4, weight: 245 },
        ],
      },
      {
        peid: 102,
        position: 1,
        exercise: { eid: 2, name: "Overhead Press" },
        sets: [
          { stid: 1004, position: 0, reps: 10, weight: 135 },
          { stid: 1005, position: 1, reps: 8, weight: 145 },
          { stid: 1006, position: 2, reps: 6, weight: 155 },
        ],
      },
    ],
  });

  // Wednesday - Pull Day (skip Tuesday)
  sessions.push({
    ssid: 2,
    date: getWeekDay(2), // Wednesday
    name: "Pull Day",
    performedExercises: [
      {
        peid: 201,
        position: 0,
        exercise: { eid: 3, name: "Deadlift" },
        sets: [
          { stid: 2001, position: 0, reps: 5, weight: 315 },
          { stid: 2002, position: 1, reps: 3, weight: 335 },
          { stid: 2003, position: 2, reps: 1, weight: 365 },
        ],
      },
      {
        peid: 202,
        position: 1,
        exercise: { eid: 4, name: "Pull-ups" },
        sets: [
          { stid: 2004, position: 0, reps: 12, weight: 0 },
          { stid: 2005, position: 1, reps: 10, weight: 25 },
          { stid: 2006, position: 2, reps: 8, weight: 35 },
        ],
      },
    ],
  });

  // Thursday - Legs
  sessions.push({
    ssid: 3,
    date: getWeekDay(3), // Thursday
    name: "Leg Day",
    performedExercises: [
      {
        peid: 301,
        position: 0,
        exercise: { eid: 5, name: "Squat" },
        sets: [
          { stid: 3001, position: 0, reps: 10, weight: 275 },
          { stid: 3002, position: 1, reps: 8, weight: 295 },
          { stid: 3003, position: 2, reps: 6, weight: 315 },
        ],
      },
    ],
  });

  // Saturday - Upper Body (skip Friday)
  sessions.push({
    ssid: 4,
    date: getWeekDay(5), // Saturday
    name: "Upper Body",
    performedExercises: [
      {
        peid: 401,
        position: 0,
        exercise: { eid: 6, name: "Incline Dumbbell Press" },
        sets: [
          { stid: 4001, position: 0, reps: 12, weight: 80 },
          { stid: 4002, position: 1, reps: 10, weight: 90 },
          { stid: 4003, position: 2, reps: 8, weight: 100 },
        ],
      },
      {
        peid: 402,
        position: 1,
        exercise: { eid: 7, name: "Barbell Rows" },
        sets: [
          { stid: 4004, position: 0, reps: 10, weight: 185 },
          { stid: 4005, position: 1, reps: 8, weight: 205 },
        ],
      },
    ],
  });

  // Sunday - Active Recovery
  sessions.push({
    ssid: 5,
    date: getWeekDay(6), // Sunday
    name: "Active Recovery",
    performedExercises: [
      {
        peid: 501,
        position: 0,
        exercise: { eid: 8, name: "Walking" },
        sets: [
          { stid: 5001, position: 0, reps: 30, weight: 0 }, // 30 minutes
        ],
      },
    ],
  });

  return sessions;
};
