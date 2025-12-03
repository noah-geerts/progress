import { LoadingOutlined } from "@ant-design/icons";
import { Button, Flex, Select, Spin, theme } from "antd";
import { createRef, useEffect, useState } from "react";
import {
  useCreateExercise,
  useGetAllExercises,
} from "../services/exerciseService";
import { useSession } from "./SessionColumn";
import { useCreatePE } from "../services/performedExerciseService";
import { useProgressNotification } from "../wrappers/ProgressNotificationProvider";
import CreateExerciseModal from "./CreateExerciseModal";

type State = "creating" | "default";

type Option = {
  value: number;
  label: string;
};

export default function CreatePE() {
  const { token } = theme.useToken();
  const [createExerciseOpen, setCreateExerciseOpen] = useState(false);

  // Notification api
  const api = useProgressNotification();

  // Get the session this exercise is in
  const session = useSession();

  // Create exercise in backend
  const { mutate: createPE, isPending: isCreatePELoading } = useCreatePE();

  // Fetch exercises from backend
  const { data: exercises, isLoading: isExercisesLoading } =
    useGetAllExercises();

  // Dropdown controls
  const dropdownOptions: Option[] =
    exercises?.map((exercise) => {
      return { label: exercise.name, value: exercise.eid };
    }) || [];
  const [selectedEid, setSelectedEid] = useState<undefined | number>(undefined);

  const handleCreate = () => {
    if (selectedEid === undefined) {
      api.error({ message: "Please select an exercise before confirming" });
      return;
    }
    const nPEs = session.performedExercises.length;
    createPE(
      {
        eid: selectedEid,
        ssid: session.ssid,
        position:
          nPEs > 0 ? session.performedExercises[nPEs - 1].position + 1 : 0,
      },
      {
        onError: () => {
          api.error({
            message: "A network error occured while saving the new exercise",
          });
        },
      }
    );
    setState("default");
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
      {/** Create Exercise modal */}
      {createExerciseOpen && (
        <CreateExerciseModal
          open={createExerciseOpen}
          setOpen={setCreateExerciseOpen}
        />
      )}

      {/** Create PE dropdown and confirm button */}
      <Select
        options={dropdownOptions}
        placeholder="Search for an exercise"
        showSearch
        filterOption={(input, option) =>
          (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
        }
        notFoundContent={
          <Button type="link" onClick={() => setCreateExerciseOpen(true)}>
            + Create new exercise
          </Button>
        }
        value={selectedEid}
        onChange={(eid: number) => {
          setSelectedEid(eid);
        }}
        loading={isExercisesLoading}
      />
      <Button
        variant="filled"
        color="primary"
        onClick={handleCreate}
        disabled={isCreatePELoading || selectedEid === undefined}
      >
        {isCreatePELoading ? (
          <Spin size="small" indicator={<LoadingOutlined />} />
        ) : (
          "Confirm"
        )}
      </Button>
    </Flex>
  );
}
