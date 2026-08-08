import { LoadingOutlined } from "@ant-design/icons";
import { Button, Flex, Input, Spin, theme } from "antd";
import { useState } from "react";
import { useProgressNotification } from "../wrappers/ProgressNotificationProvider";
import type { Dayjs } from "dayjs";
import { useCreateSession } from "../services/sessionService";

type State = "creating" | "default";

type CreateSessionProps = {
  date: Dayjs;
};

export default function CreateSession({ date }: CreateSessionProps) {
  const { token } = theme.useToken();
  const [sessionName, setSessionName] = useState("");
  // Notification api
  const api = useProgressNotification();

  // Create session in backend
  const { mutate: createSession, isPending } = useCreateSession(
    date.format("YYYY-MM-DD")
  );

  const handleCreate = () => {
    if (sessionName === "") {
      api.error({ message: "Please enter a session name before confirming" });
      return;
    }
    createSession(
      {
        name: sessionName,
      },
      {
        onError: () => {
          api.error({
            message: "A network error occured while creating " + sessionName,
          });
          setState("default");
        },
        onSuccess: () => setState("default"),
      }
    );
  };

  const [state, setState] = useState<State>("default");

  // By default, render with an add exercise button
  if (state === "default")
    return (
      <Flex
        vertical
        style={{
          background: token.colorBgContainer,
          borderRadius: token.borderRadiusLG,
          padding: token.padding,
        }}
      >
        <Button
          variant="text"
          color="primary"
          onClick={() => setState("creating")}
        >
          Create Session
        </Button>
      </Flex>
    );

  // If we're creating a PE, show the exercise drop down and a confirm button
  return (
    <Flex
      gap={8}
      vertical
      style={{
        background: token.colorBgContainer,
        borderRadius: token.borderRadiusLG,
        padding: token.padding,
      }}
    >
      {/** Create Session Input and Confirm Button */}
      <Input
        value={sessionName}
        onChange={(e) => setSessionName(e.target.value)}
        placeholder="Enter session name"
        onPressEnter={handleCreate}
      ></Input>
      <Button
        variant="filled"
        color="primary"
        onClick={handleCreate}
        disabled={isPending || sessionName === ""}
      >
        {isPending ? (
          <Spin size="small" indicator={<LoadingOutlined />} />
        ) : (
          "Confirm"
        )}
      </Button>
    </Flex>
  );
}
