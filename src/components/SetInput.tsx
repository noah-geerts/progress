import { Button, Flex, Input, Modal, Spin } from "antd";
import Text from "antd/es/typography/Text";
import type { PerformedSet } from "../domain/PerformedSet/PerformedSet";
import { useState } from "react";
import {
  CheckOutlined,
  CloseOutlined,
  EditOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { useProgressNotification } from "../wrappers/ProgressNotificationProvider";
import { useDeleteSet, useUpdateSet } from "../services/setService";
import { useSession } from "./SessionColumn";

type SetInputProps = {
  set: PerformedSet;
};

type InputState = "editing" | "default";

export default function SetInput({ set }: SetInputProps) {
  const [lbs, setLbs] = useState(set.weight.toString());
  const [reps, setReps] = useState(set.reps.toString());

  const [modalOpen, setModalOpen] = useState(false);
  const [inputState, setInputState] = useState<InputState>("default");

  const api = useProgressNotification();

  const session = useSession();

  const { mutate: deleteSet, isPending: deleteSetPending } = useDeleteSet(
    set.id,
    session.date
  );
  const { mutate: updateSet, isPending: updateSetPending } = useUpdateSet(
    set.id,
    session.date
  );

  const handleDeleteSet = () => {
    deleteSet(undefined, {
      onError: () => {
        api.error({ message: "Network error occured while deleting the set" });
        setModalOpen(false);
      },
      onSuccess: () => setModalOpen(false),
    });
  };

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
    updateSet(
      { weight: lbsNum, reps: repsNum },
      {
        onError: () => {
          api.error({
            message: "Network error occured while saving changes to the set",
          });
          setLbs(set.weight.toString());
          setReps(set.reps.toString());
          setInputState("default");
        },
        onSuccess: () => setInputState("default"),
      }
    );
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

    // Display 1 button with a loading indicator when updates are pending
    if (updateSetPending)
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
          color="default"
          onClick={() => setInputState("default")}
        >
          <CloseOutlined />
        </Button>
      </>
    );
  }

  return (
    <Flex gap={8}>
      {/** Deletion modal */}
      <Modal
        title="Warning"
        closable
        okType="danger"
        okText="Yes"
        cancelText="No"
        open={modalOpen}
        onOk={handleDeleteSet}
        okButtonProps={{ loading: deleteSetPending }}
        onCancel={() => setModalOpen(false)}
      >
        <Text>
          {"Are you sure you want to delete the set " +
            set.weight +
            "lbs for " +
            set.reps +
            " reps?"}
        </Text>
      </Modal>

      {/** Delete button and inputs */}
      {inputState === "default" && (
        <Button
          variant="filled"
          color="danger"
          onClick={() => setModalOpen(true)}
        >
          <CloseOutlined />
        </Button>
      )}
      <Input
        disabled={inputState !== "editing"}
        variant="filled"
        color="primary"
        suffix="lbs"
        value={lbs}
        onChange={(e) => setLbs(e.target.value)}
        onPressEnter={handleSave}
      />
      <Input
        disabled={inputState !== "editing"}
        variant="filled"
        color="primary"
        suffix="reps"
        value={reps}
        onChange={(e) => setReps(e.target.value)}
        onPressEnter={handleSave}
      />

      {/** Post input buttons */}
      <Options />
    </Flex>
  );
}
