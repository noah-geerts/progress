import { Button, Flex, Input, notification, Spin } from "antd";
import { useState } from "react";
import {
  CheckOutlined,
  CloseOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { useProgressNotification } from "../wrappers/ProgressNotificationProvider";

type CreateSetProps = {
  onComplete: () => void;
};

export default function CreateSet({ onComplete }: CreateSetProps) {
  const [lbs, setLbs] = useState("");
  const [reps, setReps] = useState("");

  const [loading, setLoading] = useState(false);

  const api = useProgressNotification();

  const handleCancel = () => {
    onComplete();
  };

  const handleSave = () => {
    // Ensure lbs input is valid. Reset fields if not.
    const lbsNum = Number(lbs);
    if (isNaN(lbsNum)) {
      api.error({
        message: "Weight must be a valid decimal number to create new set",
      });
      onComplete();
      return;
    }

    // Ensure reps input is valid
    const repsNum = Number(reps);
    if (isNaN(repsNum) || !Number.isInteger(repsNum)) {
      api.error({
        message: "Reps must be a valid whole number to create new set",
      });
      onComplete();
      return;
    }

    // If both were valid, try to persist changes using the api
    setLoading(true);
    setTimeout(() => {
      onComplete();
    }, 800);
  };

  // Buttons following the input fields
  function Options() {
    // Display 1 button with a loading indicator when loading
    if (loading)
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
        <Button variant="filled" color="danger" onClick={handleCancel}>
          <CloseOutlined />
        </Button>
      </>
    );
  }

  return (
    <Flex gap={8}>
      <Input
        disabled={loading}
        variant="filled"
        color="primary"
        suffix="lbs"
        value={lbs}
        onChange={(e) => setLbs(e.target.value)}
      />
      <Input
        disabled={loading}
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
