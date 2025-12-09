import { Card, Col, Row, Statistic, theme } from "antd";
import dayjs, { type Dayjs } from "dayjs";
import type { Session } from "../domain/Session/Session";
import {
  BarChartOutlined,
  FireOutlined,
  TrophyOutlined,
} from "@ant-design/icons";

type CalendarStatisticsProps = {
  monthSessions: Map<string, Session | undefined>;
  currentMonth: Dayjs;
};

export default function CalendarStatistics({
  monthSessions,
  currentMonth,
}: CalendarStatisticsProps) {
  const { token } = theme.useToken();

  // Get today's date for filtering
  const today = dayjs();
  const isCurrentMonth = currentMonth.isSame(today, "month");

  // Convert map to array of sessions (filter out undefined and future dates)
  const sessions = Array.from(monthSessions.entries())
    .filter(([date, session]) => {
      if (session === undefined) return false;
      // If it's the current month, only include dates up to today
      if (isCurrentMonth) {
        const sessionDate = dayjs(date);
        return (
          sessionDate.isBefore(today, "day") || sessionDate.isSame(today, "day")
        );
      }
      // For past months, include all sessions
      return true;
    })
    .map(([_, session]) => session as Session);

  // Calculate total sets for a session
  const getTotalSets = (session: Session): number => {
    return session.performedExercises.reduce((total, pe) => {
      return total + pe.sets.length;
    }, 0);
  };

  // Calculate average number of sets per week
  const calculateAvgSetsPerWeek = (): number => {
    if (sessions.length === 0) return 0;

    const totalSets = sessions.reduce(
      (total, session) => total + getTotalSets(session),
      0
    );

    // Calculate days to consider (up to today for current month)
    let daysToConsider: number;
    if (isCurrentMonth) {
      daysToConsider = today.date();
    } else {
      daysToConsider = currentMonth.daysInMonth();
    }
    const weeksInMonth = daysToConsider / 7;

    return Math.round(totalSets / weeksInMonth);
  };

  // Calculate longest consecutive sessions streak
  const calculateLongestStreak = (): number => {
    if (sessions.length === 0) return 0;

    // Get sorted array of dates that have sessions
    const sessionDates = Array.from(monthSessions.entries())
      .filter(([_, session]) => session !== undefined)
      .map(([date]) => date)
      .sort();

    let longestStreak = 0;
    let currentStreak = 0;
    let previousDate: Dayjs | null = null;

    for (const dateString of sessionDates) {
      const currentDate = currentMonth
        .year(parseInt(dateString.substring(0, 4)))
        .month(parseInt(dateString.substring(5, 7)) - 1)
        .date(parseInt(dateString.substring(8, 10)));

      if (previousDate === null) {
        currentStreak = 1;
      } else {
        const daysDiff = currentDate.diff(previousDate, "day");
        if (daysDiff === 1) {
          currentStreak++;
        } else {
          longestStreak = Math.max(longestStreak, currentStreak);
          currentStreak = 1;
        }
      }

      previousDate = currentDate;
    }

    return Math.max(longestStreak, currentStreak);
  };

  // Calculate average number of sessions per week
  const calculateAvgSessionsPerWeek = (): number => {
    if (sessions.length === 0) return 0;

    // Calculate days to consider (up to today for current month)
    let daysToConsider: number;
    if (isCurrentMonth) {
      daysToConsider = today.date();
    } else {
      daysToConsider = currentMonth.daysInMonth();
    }
    const weeksInMonth = daysToConsider / 7;

    return parseFloat((sessions.length / weeksInMonth).toFixed(1));
  };

  const avgSetsPerWeek = calculateAvgSetsPerWeek();
  const longestStreak = calculateLongestStreak();
  const avgSessionsPerWeek = calculateAvgSessionsPerWeek();

  return (
    <div style={{ flex: 1, minWidth: 300 }}>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card
            variant="borderless"
            style={{
              background: token.colorBgContainer,
              borderRadius: token.borderRadiusLG,
            }}
          >
            <Statistic
              title="Average # of sets per week"
              value={avgSetsPerWeek}
              prefix={<BarChartOutlined />}
              valueStyle={{ color: token.colorPrimary }}
            />
          </Card>
        </Col>
        <Col span={24}>
          <Card
            variant="borderless"
            style={{
              background: token.colorBgContainer,
              borderRadius: token.borderRadiusLG,
            }}
          >
            <Statistic
              title="Longest streak"
              value={longestStreak}
              suffix="days"
              prefix={<FireOutlined />}
              valueStyle={{ color: token.colorWarning }}
            />
          </Card>
        </Col>
        <Col span={24}>
          <Card
            variant="borderless"
            style={{
              background: token.colorBgContainer,
              borderRadius: token.borderRadiusLG,
            }}
          >
            <Statistic
              title="Average # of sessions per week"
              value={avgSessionsPerWeek}
              prefix={<TrophyOutlined />}
              valueStyle={{ color: token.colorSuccess }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
