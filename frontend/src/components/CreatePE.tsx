import { LoadingOutlined } from "@ant-design/icons";
import { Button, Flex, Select, Spin, theme } from "antd";
import { useEffect, useState } from "react";
import {
  useCreateExercise,
  useGetAllExercises,
} from "../services/exerciseService";
import { useSession } from "./SessionColumn";
import { useCreatePE } from "../services/performedExerciseService";
import { useProgressNotification } from "../wrappers/ProgressNotificationProvider";

type State = "creating" | "default";

type Option = {
  value: number;
  label: string;
};

export default function CreateExercise() {
  const { token } = theme.useToken();

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
    createPE(
      {
        eid: selectedEid,
        ssid: session.ssid,
        position: session.performedExercises.length,
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
      <Select
        options={dropdownOptions}
        placeholder="Select an exercise"
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
