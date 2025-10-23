import { Button, Dropdown, Modal, Select, type MenuProps } from "antd";
import {
  useCreateExercise,
  useGetAllExercises,
} from "../services/exerciseService";
import P from "./P";
import { DownOutlined } from "@ant-design/icons";
import type { SessionResponseDto } from "../domain/Session/Session";
import { useCreatePE } from "../services/performedExerciseService";
import { useState } from "react";

type AddPEModalProps = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  session: SessionResponseDto;
};

export default function AddPEModal({ setOpen, session }: AddPEModalProps) {
  const [selectedExercise, setSelectedExercise] = useState<number | undefined>(
    undefined
  );

  const { data, isLoading } = useGetAllExercises();
  const selectOptions = data?.map((exercise) => ({
    value: exercise.eid,
    label: exercise.name,
  }));
  const { mutate, isPending } = useCreatePE();

  const handleOk = () => {
    if (selectedExercise !== undefined) {
      // Calculate the position for the new PE
      let newPEPosition = 0;
      if (session.performedExercises.length > 0) {
        newPEPosition =
          session.performedExercises[session.performedExercises.length - 1]
            .position + 1;
      }

      // Call the react query mutation to create the new PE
      mutate(
        {
          eid: selectedExercise,
          ssid: session.ssid,
          position: newPEPosition,
        },
        {
          onSuccess: () => {
            setOpen(false); // close the modal if the mutation is successful
          },
        }
      );
    } else {
      console.log("No exercise selected");
    }
  };

  return (
    <Modal
      title="Add Exercise"
      open={true}
      onCancel={() => setOpen(false)}
      onOk={handleOk}
      okButtonProps={{ loading: isPending }}
    >
      <Select
        options={selectOptions}
        loading={isLoading}
        style={{ width: 240 }}
        placeholder="Select an exercise"
        value={selectedExercise}
        onSelect={(value, option) => {
          setSelectedExercise(value);
        }}
      />
    </Modal>
  );
}
