import { Calendar, theme } from "antd";
import type { Dayjs } from "dayjs";
import type { Session } from "../domain/Session/Session";
import { useNavigate } from "react-router";

type SessionCalendarProps = {
  monthSessions: Map<string, Session | undefined>;
  currentMonth: Dayjs;
  onMonthChange: (date: Dayjs) => void;
};

export default function SessionCalendar({
  monthSessions,
  currentMonth,
  onMonthChange,
}: SessionCalendarProps) {
  const { token } = theme.useToken();
  const navigate = useNavigate();

  // Handle date click to navigate to dashboard
  const handleDateClick = (date: Dayjs) => {
    const firstDayOfWeek = date.day(0).format("YYYY-MM-DD");
    navigate(`/dashboard?week=${firstDayOfWeek}`);
  };

  // Calculate total sets for a session
  const getTotalSets = (session: Session): number => {
    return session.performedExercises.reduce((total, pe) => {
      return total + pe.sets.length;
    }, 0);
  };

  // Custom cell render for calendar dates
  const dateCellRender = (date: Dayjs) => {
    const dateString = date.format("YYYY-MM-DD");
    const session = monthSessions.get(dateString);

    if (!session) {
      return null;
    }

    const totalSets = getTotalSets(session);

    return (
      <div
        onClick={() => handleDateClick(date)}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = token.colorPrimaryBgHover;
          e.currentTarget.style.transform = "translateY(-1px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = token.colorPrimaryBg;
          e.currentTarget.style.transform = "translateY(0)";
        }}
        onMouseDown={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
        }}
        onMouseUp={(e) => {
          e.currentTarget.style.transform = "translateY(-1px)";
        }}
        style={{
          background: token.colorPrimaryBg,
          borderRadius: token.borderRadiusSM,
          padding: "4px 8px",
          fontSize: token.fontSizeSM,
          color: token.colorPrimary,
          fontWeight: token.fontWeightStrong,
          textAlign: "center",
          marginTop: 4,
          cursor: "pointer",
          transition: "all 0.2s ease",
        }}
      >
        <div
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {session.name}
        </div>
        <div style={{ fontSize: token.fontSizeSM - 1 }}>
          {totalSets} set{totalSets !== 1 ? "s" : ""}
        </div>
      </div>
    );
  };

  return (
    <div
      style={{
        background: token.colorBgContainer,
        borderRadius: token.borderRadiusLG,
        padding: token.paddingLG,
        flex: 1,
        minWidth: 600,
      }}
    >
      <Calendar
        value={currentMonth}
        onPanelChange={onMonthChange}
        cellRender={dateCellRender}
        mode="month"
      />
    </div>
  );
}
