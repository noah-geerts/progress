import { LoadingOutlined } from "@ant-design/icons";
import { Button, Flex, Select, Spin, theme } from "antd";
import { useState } from "react";

type State = "loading" | "creating" | "default";

const exercises = [
  { value: "Bench Press", label: "Bench Press" },
  { value: "Overhead Press", label: "Overhead Press" },
  { value: "Squat", label: "Squat" },
];

export default function CreateExercise() {
  const { token } = theme.useToken();

  const handleCreate = () => {
    setState("loading");
    setTimeout(() => {
      setState("default");
    }, 800);
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
          Add Exercise
        </Button>
      </Flex>
    );
  // If we're creating an exercise, show the exercise drop down and a confirm button
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
      <Select options={exercises} placeholder="Select an exercise"></Select>
      <Button
        variant="filled"
        color="primary"
        onClick={handleCreate}
        disabled={state === "loading"}
      >
        {state === "loading" ? (
          <Spin size="small" indicator={<LoadingOutlined />} />
        ) : (
          "Confirm"
        )}
      </Button>
    </Flex>
  );
}
