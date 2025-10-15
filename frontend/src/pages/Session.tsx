import { useState } from "react";
import { getWeekStart, addWeeks, formatWeekLabel } from "../misc/dateHelpers";
import { Button, FloatButton, Modal, theme } from "antd";
import P from "../components/P";
import { useAuth0 } from "@auth0/auth0-react";
import { NavLink } from "react-router";
import ExerciseCard from "../components/ExerciseCard";
import { LeftOutlined, RightOutlined, PlusOutlined } from "@ant-design/icons";
import SessionColumn from "../components/SessionColumn";
import { useApi } from "../wrappers/ApiProvider";
import { useGetWeeklySessions } from "../services/sessionService";
import AddSessionModal from "../components/AddSessionModal";

export default function Session() {
  // weekStart stores the Date for the Monday of the current week view
  const [weekStart, setWeekStart] = useState<Date>(() =>
    getWeekStart(new Date())
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { logout } = useAuth0();
  const sessions = useGetWeeklySessions(weekStart);

  const handleDecreaseWeek: React.MouseEventHandler<HTMLElement> = () => {
    setWeekStart((prev) => addWeeks(prev, -1));
  };

  const handleIncreaseWeek: React.MouseEventHandler<HTMLElement> = () => {
    setWeekStart((prev) => addWeeks(prev, 1));
  };

  return (
    <div className="w-full h-full flex flex-col items-center">
      <AddSessionModal open={isModalOpen} setOpen={setIsModalOpen} />
      <FloatButton
        shape="circle"
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => setIsModalOpen(true)}
      ></FloatButton>
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
          <P>{formatWeekLabel(weekStart)}</P>
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
              <SessionColumn session={session} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
