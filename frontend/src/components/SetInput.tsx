import { Button, Flex, Input, notification, Spin } from "antd";
import type { PerformedSet } from "../domain/PerformedSet/PerformedSet";
import { useState } from "react";
import {
  CheckOutlined,
  CloseOutlined,
  EditOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { useProgressNotification } from "../wrappers/ProgressNotificationProvider";

type SetInputProps = {
  set: PerformedSet;
};

type InputState = "loading" | "editing" | "default";

export default function SetInput({ set }: SetInputProps) {
  const [lbs, setLbs] = useState(set.weight.toString());
  const [reps, setReps] = useState(set.reps.toString());

  const [inputState, setInputState] = useState<InputState>("default");

  const api = useProgressNotification();

  const handleSave = () => {
    // Ensure lbs input is valid. Reset fields if not.
    const lbsNum = Number(lbs);
    if (isNaN(lbsNum)) {
      api.error({
        message: "Weight must be a valid decimal number to save changes",
      });
      setLbs(set.weight.toString());
      setReps(set.reps.toString());
      setInputState("default");
      return;
    }

    // Ensure reps input is valid
    const repsNum = Number(reps);
    if (isNaN(repsNum) || !Number.isInteger(repsNum)) {
      api.error({
        message: "Reps must be a valid whole number to save changes",
      });
      setLbs(set.weight.toString());
      setReps(set.reps.toString());
      setInputState("default");
      return;
    }

    // If both were valid, try to persist changes using the api
    setInputState("default");
  };

  // Buttons following the input fields
  function Options() {
    // Display an edit button when saved
    if (inputState === "default")
      return (
        <Button
          variant="filled"
          color="primary"
          onClick={() => setInputState("editing")}
        >
          <EditOutlined />
        </Button>
      );

    // Display 1 button with a loading indicator when loading
    if (inputState === "loading")
      return (
        <Button variant="filled" color="primary">
          <Spin size="small" indicator={<LoadingOutlined />} />
        </Button>
      );

    // Display a save and cancel button when editing
    return (
      <>
        <Button variant="filled" color="primary" onClick={handleSave}>
          <CheckOutlined />
        </Button>{" "}
        <Button
          variant="filled"
          color="danger"
          onClick={() => setInputState("default")}
        >
          <CloseOutlined />
        </Button>
      </>
    );
  }

  return (
    <Flex gap={8}>
      <Input
        disabled={inputState !== "editing"}
        variant="filled"
        color="primary"
        suffix="lbs"
        value={lbs}
        onChange={(e) => setLbs(e.target.value)}
      />
      <Input
        disabled={inputState !== "editing"}
        variant="filled"
        color="primary"
        suffix="reps"
        value={reps}
        onChange={(e) => setReps(e.target.value)}
      />
      <Options />
    </Flex>
  );
}
