import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Button, Flex, theme } from "antd";
import InnerPage from "../wrappers/InnerPage";
import { useState } from "react";
import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import SessionColumn from "../components/SessionColumn";
import { formatDateString, getDaysOfWeek } from "../common/dateHelpers";

dayjs.extend(weekOfYear);

export default function Dashboard() {
  const { token } = theme.useToken();

  const [firstDayOfWeek, setFirstDayOfWeek] = useState(dayjs().day(0));
  const daysOfWeek = getDaysOfWeek(firstDayOfWeek);

  return (
    <InnerPage>
      <Flex vertical style={{ height: "100%" }}>
        {/** Week Controls */}
        <Flex gap={24} style={{ marginBottom: token.paddingLG }}>
          <Button
            color="primary"
            onClick={() => setFirstDayOfWeek(dayjs().day(0))}
          >
            Go to this week
          </Button>
          <Flex align="center" gap={8}>
            <Button
              variant="text"
              color="primary"
              onClick={() => setFirstDayOfWeek(firstDayOfWeek.day(-7))}
            >
              <LeftOutlined />
            </Button>
            <p
              style={{
                margin: 0,
                padding: 0,
                fontSize: token.fontSizeHeading4,
                fontWeight: token.fontWeightStrong,
              }}
            >
              {"Week of " + formatDateString(firstDayOfWeek.format())}
            </p>
            <Button
              variant="text"
              color="primary"
              onClick={() => setFirstDayOfWeek(firstDayOfWeek.day(7))}
            >
              <RightOutlined />
            </Button>
          </Flex>
        </Flex>

        {/** Sessions */}
        <Flex gap={16} style={{ flex: 1, overflow: "scroll" }}>
          {daysOfWeek.map((date) => (
            <SessionColumn date={date} key={date.format()} />
          ))}
        </Flex>
      </Flex>
    </InnerPage>
  );
}
