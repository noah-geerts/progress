import { DeleteOutlined } from "@ant-design/icons";
import { Button, Col, Flex, Input, theme, Typography } from "antd";
import InnerPage from "../wrappers/InnerPage";
import { generateCurrentWeekSessions } from "./sampleSessions";
import { useState } from "react";
import SetInput from "../components/SetInput";
import PECard from "../components/PECard";
import CreateExercise from "../components/CreateExercise";
const { Title } = Typography;

export default function Dashboard() {
  const {
    token: {
      colorBgContainer,
      borderRadiusLG,
      fontWeightStrong,
      colorBgLayout,
      padding,
      paddingSM,
    },
  } = theme.useToken();

  const [sessions, setSessions] = useState(generateCurrentWeekSessions());

  return (
    <InnerPage>
      <div
        style={{
          height: "100%",
        }}
      >
        <Flex gap={16} style={{ height: "100%" }}>
          <Col
            style={{
              display: "flex",
              flexDirection: "column",
              background: colorBgLayout,
              borderRadius: borderRadiusLG,
              gap: 8,
              padding: paddingSM,
            }}
            span={4}
          >
            {/* Title  */}
            <div
              style={{
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
                padding: padding,
              }}
            >
              <p
                style={{
                  fontWeight: fontWeightStrong,
                  textAlign: "center",
                }}
              >
                Monday, October 19th - Chest and Back
              </p>
            </div>

            {/* Performed Exercises */}
            {sessions[0].performedExercises.map((pe) => (
              <PECard pe={pe} />
            ))}

            {/* Create Exercise Component */}
            <CreateExercise />
          </Col>
          <Col
            style={{
              display: "flex",
              flexDirection: "column",
              background: colorBgLayout,
              borderRadius: borderRadiusLG,
              gap: 8,
              padding: paddingSM,
            }}
            span={2}
          >
            {/* Title  */}
            <div
              style={{
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
                padding: padding,
              }}
            >
              <p
                style={{
                  fontWeight: fontWeightStrong,
                  textAlign: "center",
                }}
              >
                Tuesday, October 20th - Rest
              </p>
            </div>
          </Col>
        </Flex>
      </div>
    </InnerPage>
  );
}
