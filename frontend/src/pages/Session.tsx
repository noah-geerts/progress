import { useState } from "react";
import { Button, FloatButton, Modal, theme } from "antd";
import P from "../components/P";
import { useAuth0 } from "@auth0/auth0-react";
import { NavLink } from "react-router";
import ExerciseCard from "../components/PECard";
import { LeftOutlined, RightOutlined, PlusOutlined } from "@ant-design/icons";
import SessionColumn from "../components/SessionColumn";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import { useGetWeeklySessions } from "../services/sessionService";
import AddSessionModal from "../components/AddSessionModal";

export default function Session() {
  // weekStart stores the date for the Monday of the current week view
  const today = dayjs();
  const thisSunday = today.startOf("week"); // Sunday of this week
  const thisMonday = thisSunday.add(1, "day"); // Monday of this week
  const [weekStart, setWeekStart] = useState<Dayjs>(thisMonday);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { logout } = useAuth0();
  const sessions = useGetWeeklySessions(weekStart);

  const handleDecreaseWeek: React.MouseEventHandler<HTMLElement> = () => {
    setWeekStart((prev) => prev.subtract(1, "week"));
  };

  const handleIncreaseWeek: React.MouseEventHandler<HTMLElement> = () => {
    setWeekStart((prev) => prev.add(1, "week"));
  };

  return (
    <div className="w-full h-full flex flex-col items-center">
      {isModalOpen && <AddSessionModal setOpen={setIsModalOpen} />}
      <FloatButton
        shape="circle"
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => setIsModalOpen(true)}
      />

      <nav className="w-full h-16 flex flex-row justify-between p-4 bg-white border-b border-gray-200 shadow-sm">
        <Button type="link">
          <NavLink to="/dashboard">
            {"< "}
            Back to Dashboard
          </NavLink>
        </Button>
        <div className="flex gap-4">
          <Button onClick={handleDecreaseWeek} shape="circle">
            <LeftOutlined />
          </Button>
          <P>{weekStart.toString()}</P>
          <Button onClick={handleIncreaseWeek} shape="circle">
            <RightOutlined />
          </Button>
        </div>
        <Button onClick={() => logout()} color="danger" variant="solid">
          Log out
        </Button>
      </nav>

      <div className="flex-1 w-full flex flex-col overflow-auto [scrollbar-gutter:stable]">
        <div className="flex-1 flex w-max flex-col p-4">
          <div className="flex flex-1 border-gray-200 border-l">
            {sessions.map((session) => (
              <SessionColumn key={session.ssid} session={session} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
