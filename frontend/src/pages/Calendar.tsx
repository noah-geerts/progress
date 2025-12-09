import { Flex, Spin, theme } from "antd";
import InnerPage from "../wrappers/InnerPage";
import { useState, useMemo } from "react";
import dayjs, { Dayjs } from "dayjs";
import { useGetMonthlySessions } from "../services/sessionService";
import SessionCalendar from "../components/SessionCalendar";
import CalendarStatistics from "../components/CalendarStatistics";
import type { Session } from "../domain/Session/Session";

export default function Calendar() {
  const { token } = theme.useToken();
  const [currentMonth, setCurrentMonth] = useState(dayjs());

  // Fetch sessions for all dates in the month using the service hook
  // This approach makes it easy to swap to a single getMonthlySessions endpoint later
  const { data, isLoading: isLoadingMonth } = useGetMonthlySessions(
    currentMonth.format("YYYY-MM-DD")
  );

  const monthlySessions = new Map<string, Session | undefined>();
  if (data) {
    for (let session of data) {
      monthlySessions.set(session.date, session);
    }
  }

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
              monthSessions={monthlySessions}
              currentMonth={currentMonth}
              onMonthChange={handleMonthChange}
            />
            <CalendarStatistics
              monthSessions={monthlySessions}
              currentMonth={currentMonth}
            />
          </Flex>
        )}
      </Flex>
    </InnerPage>
  );
}
