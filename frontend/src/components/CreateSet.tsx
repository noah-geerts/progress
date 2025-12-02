import { Button, Flex, Input, notification, Spin } from "antd";
import { useState } from "react";
import {
  CheckOutlined,
  CloseOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { useProgressNotification } from "../wrappers/ProgressNotificationProvider";
import { useCreateSet } from "../services/setService";
import type { PerformedExercise } from "../domain/PerformedExercise/PerformedExercise";

type CreateSetProps = {
  onComplete: () => void;
  pe: PerformedExercise;
};

export default function CreateSet({ onComplete, pe }: CreateSetProps) {
  const [lbs, setLbs] = useState("");
  const [reps, setReps] = useState("");

  const api = useProgressNotification();

  const { mutate: createSet, isPending } = useCreateSet();

  const handleCancel = () => {
    onComplete();
  };

  const handleCreate = () => {
    // Ensure lbs input is valid. Reset fields if not.
    const lbsNum = Number(lbs);
    if (lbs === "" || isNaN(lbsNum)) {
      api.error({
        message: "Weight must be a valid decimal number to create new set",
      });
      onComplete();
      return;
    }

    // Ensure reps input is valid
    const repsNum = Number(reps);
    if (reps === "" || isNaN(repsNum) || !Number.isInteger(repsNum)) {
      api.error({
        message: "Reps must be a valid whole number to create new set",
      });
      onComplete();
      return;
    }

    // If both were valid, try to persist changes using the api
    const nSets = pe.sets.length;
    createSet(
      {
        position: nSets > 0 ? pe.sets[nSets - 1].position + 1 : 0,
        reps: repsNum,
        weight: lbsNum,
        peid: pe.peid,
      },
      {
        onError: () => {
          api.error({
            message: "Network error occured while creating the set",
          });
          onComplete();
        },
        onSuccess: onComplete,
      }
    );
  };

  // Buttons following the input fields
  function Options() {
    // Display 1 button with a loading indicator when loading
    if (isPending)
      return (
        <Button variant="filled" color="primary">
          <Spin size="small" indicator={<LoadingOutlined />} />
        </Button>
      );

    // Display a save and cancel button when editing
    return (
      <>
        <Button variant="filled" color="primary" onClick={handleCreate}>
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
        disabled={isPending}
        variant="filled"
        color="primary"
        suffix="lbs"
        value={lbs}
        onChange={(e) => setLbs(e.target.value)}
      />
      <Input
        disabled={isPending}
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
