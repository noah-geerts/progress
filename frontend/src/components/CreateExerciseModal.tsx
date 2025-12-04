import { Flex, Input, Modal, theme } from "antd";
import { useProgressNotification } from "../wrappers/ProgressNotificationProvider";
import {
  useCreateExercise,
  useGetAllExercises,
} from "../services/exerciseService";
import { useState } from "react";

type CreateExerciseModalProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function CreateExerciseModal({
  open,
  setOpen,
}: CreateExerciseModalProps) {
  const [name, setName] = useState("");

  const api = useProgressNotification();

  const { token } = theme.useToken();

  const { mutate: createExercise, isPending } = useCreateExercise();
  const { data: exercises, isLoading } = useGetAllExercises();

  const handleCreateExercise = () => {
    // Do not allow create exercise requests with an empty name
    if (name === "") {
      api.error({ message: "Cannot create an exercise with no name" });
      return;
    }

    // Do not allow create exercise requests with duplicate names
    const existing = exercises?.find((e) => e.name === name);
    if (existing !== undefined) {
      api.error({ message: "Cannot create two exercises with the same name" });
      return;
    }

    // Make request
    createExercise(
      { name: name },
      {
        onError: () => {
          api.error({
            message:
              "Network error occured while creating new exercise " + name,
          });
          setOpen(false);
        },
        onSuccess: () => setOpen(false),
      }
    );
  };

  return (
    <Modal
      title="Create a new exercise"
      open={open}
      onCancel={() => setOpen(false)}
      loading={isLoading}
      okButtonProps={{ loading: isPending }}
      onOk={handleCreateExercise}
    >
      <Flex
        gap={8}
        align="center"
        style={{ marginTop: token.marginLG, marginBottom: token.marginLG }}
      >
        <p>New exercise name</p>
        <Input
          style={{ flex: 1 }}
          placeholder="Enter name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onPressEnter={handleCreateExercise}
        ></Input>
      </Flex>
    </Modal>
  );
}
