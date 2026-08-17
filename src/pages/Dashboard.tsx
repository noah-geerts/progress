import {
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { Button, DatePicker, Flex, Grid, theme } from "antd";
import InnerPage from "../wrappers/InnerPage";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import SessionColumn from "../components/SessionColumn";
import MobileMenu, { MOBILE_MENU_WIDTH } from "../components/MobileMenu";
import { formatDateString, getDaysOfWeek } from "../common/dateHelpers";
import { useSearchParams } from "react-router";

dayjs.extend(weekOfYear);

export default function Dashboard() {
  const [searchParams] = useSearchParams();
  const [firstDayOfWeek, setFirstDayOfWeek] = useState(dayjs().day(0));
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const daysOfWeek = getDaysOfWeek(firstDayOfWeek);

  const { token } = theme.useToken();
  const screens = Grid.useBreakpoint();
  const isMobile = screens.md === false;

  // Handle week query param from Calendar navigation
  useEffect(() => {
    const weekParam = searchParams.get("week");
    if (weekParam) {
      const weekDate = dayjs(weekParam);
      if (weekDate.isValid()) {
        setFirstDayOfWeek(weekDate);
        setSelectedDate(weekDate);
      }
    }
  }, [searchParams]);

  if (isMobile) {
    return (
      <InnerPage>
        <Flex vertical style={{ height: "100%" }}>
          <Flex
            align="center"
            justify="space-between"
            gap={token.paddingSM}
            style={{ marginBottom: token.paddingLG }}
          >
            <div
              aria-hidden="true"
              style={{ width: MOBILE_MENU_WIDTH, flexShrink: 0 }}
            />
            <Button
              variant="text"
              color="primary"
              icon={<LeftOutlined />}
              aria-label="Show previous day"
              style={{ flex: 1 }}
              onClick={() => setSelectedDate(selectedDate.subtract(1, "day"))}
            />
            <DatePicker
              value={selectedDate}
              onChange={(date) => date && setSelectedDate(date)}
              suffixIcon={null}
              className="mobile-date-picker"
              format="ddd, MMM D, YYYY"
              picker="date"
              inputReadOnly
              allowClear={false}
              variant="borderless"
              size="large"
              aria-label="Select session date"
            />
            <Button
              variant="text"
              color="primary"
              icon={<RightOutlined />}
              aria-label="Show next day"
              style={{ flex: 1 }}
              onClick={() => setSelectedDate(selectedDate.add(1, "day"))}
            />
            <MobileMenu />
          </Flex>
          <Flex style={{ flex: 1, minHeight: 0, overflow: "auto" }}>
            <SessionColumn date={selectedDate} />
          </Flex>
        </Flex>
      </InnerPage>
    );
  }

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
        <Flex
          gap={16}
          style={{ flex: 1, width: "150%", overflowX: "auto", overflowY: "hidden" }}
        >
          {daysOfWeek.map((date) => (
            <SessionColumn date={date} key={date.format()} />
          ))}
        </Flex>
      </Flex>
    </InnerPage>
  );
}
