import { Flex, Spin, theme } from "antd";
import InnerPage from "../wrappers/InnerPage";
import { useState, useMemo } from "react";
import dayjs, { Dayjs } from "dayjs";
import { useGetMonthSessions } from "../services/sessionService";
import SessionCalendar from "../components/SessionCalendar";
import CalendarStatistics from "../components/CalendarStatistics";

export default function Calendar() {
  const { token } = theme.useToken();
  const [currentMonth, setCurrentMonth] = useState(dayjs());

  // Get all dates in the current month
  const getDatesInMonth = (month: Dayjs): string[] => {
    const dates: string[] = [];
    const startOfMonth = month.startOf("month");
    const endOfMonth = month.endOf("month");

    let currentDate = startOfMonth;
    while (
      currentDate.isBefore(endOfMonth) ||
      currentDate.isSame(endOfMonth, "day")
    ) {
      dates.push(currentDate.format("YYYY-MM-DD"));
      currentDate = currentDate.add(1, "day");
    }

    return dates;
  };

  // Memoize dates to prevent unnecessary re-renders
  const dates = useMemo(() => getDatesInMonth(currentMonth), [currentMonth]);

  // Fetch sessions for all dates in the month using the service hook
  // This approach makes it easy to swap to a single getMonthlySessions endpoint later
  const { monthSessions, isLoading: isLoadingMonth } =
    useGetMonthSessions(dates);

  const handleMonthChange = (date: Dayjs) => {
    setCurrentMonth(date);
  };

  return (
    <InnerPage>
      <Flex vertical gap={token.paddingLG} style={{ height: "100%" }}>
        <h1
          style={{
            margin: 0,
            fontSize: token.fontSizeHeading2,
            fontWeight: token.fontWeightStrong,
          }}
        >
          Calendar
        </h1>

        {isLoadingMonth ? (
          <Flex justify="center" align="center" style={{ flex: 1 }}>
            <Spin size="large" />
          </Flex>
        ) : (
          <Flex gap={token.paddingLG} wrap="wrap">
            <SessionCalendar
              monthSessions={monthSessions}
              currentMonth={currentMonth}
              onMonthChange={handleMonthChange}
            />
            <CalendarStatistics
              monthSessions={monthSessions}
              currentMonth={currentMonth}
            />
          </Flex>
        )}
      </Flex>
    </InnerPage>
  );
}
