import { DeleteOutlined } from "@ant-design/icons";
import { Button, Col, Flex, Input, theme, Typography } from "antd";
import InnerPage from "../wrappers/InnerPage";
import { generateCurrentWeekSessions } from "./sampleSessions";
import { useState } from "react";
const { Title } = Typography;

export default function Dashboard() {
  const {
    token: {
      colorBgContainer,
      borderRadiusLG,
      fontWeightStrong,
      colorBgLayout,
      padding,
    },
  } = theme.useToken();

  const [sessions, useSessions] = useState(generateCurrentWeekSessions());

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
              padding: 8,
            }}
            span={4}
          >
            <div
              style={{
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
              }}
            >
              <p
                style={{
                  fontWeight: fontWeightStrong,
                  marginBottom: "16px",
                  textAlign: "center",
                  marginTop: 16,
                }}
              >
                Monday, October 19th - Chest and Back
              </p>
            </div>

            <Flex
              style={{
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
                padding: padding,
              }}
              gap={8}
              vertical
            >
              <Title level={5}>Bench Press</Title>
              <Flex gap={8}>
                <Input variant="filled" suffix="lbs"></Input>
                <Input variant="filled" suffix="reps"></Input>
              </Flex>
              <Flex gap={8}>
                <Input variant="filled" suffix="lbs"></Input>
                <Input variant="filled" suffix="reps"></Input>
              </Flex>
              <Flex gap={8}>
                <Input variant="filled" suffix="lbs"></Input>
                <Input variant="filled" suffix="reps"></Input>
                <Button variant="text" color="danger">
                  <DeleteOutlined />
                </Button>
              </Flex>
              <Button variant="text" color="primary">
                Add Set
              </Button>
            </Flex>
            <Flex
              style={{
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
                padding: padding,
              }}
              gap={8}
              vertical
            >
              <Title level={5}>Bench Press</Title>
              <Flex gap={8}>
                <Input variant="filled" suffix="lbs"></Input>
                <Input variant="filled" suffix="reps"></Input>
              </Flex>
              <Flex gap={8}>
                <Input variant="filled" suffix="lbs"></Input>
                <Input variant="filled" suffix="reps"></Input>
              </Flex>
              <Flex gap={8}>
                <Input variant="filled" suffix="lbs"></Input>
                <Input variant="filled" suffix="reps"></Input>
                <Button variant="text" color="danger">
                  <DeleteOutlined />
                </Button>
              </Flex>
              <Button variant="text" color="primary">
                Add Set
              </Button>
            </Flex>
          </Col>
          <Col
            style={{
              display: "flex",
              flexDirection: "column",
              background: colorBgLayout,
              borderRadius: borderRadiusLG,
              gap: 8,
              padding: 8,
            }}
            span={4}
          >
            <div
              style={{
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
              }}
            >
              <p
                style={{
                  fontWeight: fontWeightStrong,
                  marginBottom: "16px",
                  textAlign: "center",
                  marginTop: 16,
                }}
              >
                Monday, October 19th - Chest and Back
              </p>
            </div>

            <Flex
              style={{
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
                padding: padding,
              }}
              gap={8}
              vertical
            >
              <Title level={5}>Bench Press</Title>
              <Flex gap={8}>
                <Input variant="filled" suffix="lbs"></Input>
                <Input variant="filled" suffix="reps"></Input>
              </Flex>
              <Flex gap={8}>
                <Input variant="filled" suffix="lbs"></Input>
                <Input variant="filled" suffix="reps"></Input>
              </Flex>
              <Flex gap={8}>
                <Input variant="filled" suffix="lbs"></Input>
                <Input variant="filled" suffix="reps"></Input>
                <Button variant="text" color="danger">
                  <DeleteOutlined />
                </Button>
              </Flex>
              <Button variant="text" color="primary">
                Add Set
              </Button>
            </Flex>
            <Flex
              style={{
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
                padding: padding,
              }}
              gap={8}
              vertical
            >
              <Title level={5}>Bench Press</Title>
              <Flex gap={8}>
                <Input variant="filled" suffix="lbs"></Input>
                <Input variant="filled" suffix="reps"></Input>
              </Flex>
              <Flex gap={8}>
                <Input variant="filled" suffix="lbs"></Input>
                <Input variant="filled" suffix="reps"></Input>
              </Flex>
              <Flex gap={8}>
                <Input variant="filled" suffix="lbs"></Input>
                <Input variant="filled" suffix="reps"></Input>
                <Button variant="text" color="danger">
                  <DeleteOutlined />
                </Button>
              </Flex>
              <Button variant="text" color="primary">
                Add Set
              </Button>
            </Flex>
          </Col>
        </Flex>
      </div>
    </InnerPage>
  );
}
