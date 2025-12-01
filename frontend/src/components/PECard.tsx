import { Button, Flex, theme } from "antd";
import Title from "antd/es/typography/Title";
import type { PerformedExercise } from "../domain/PerformedExercise/PerformedExercise";
import SetInput from "./SetInput";
import CreateSet from "./CreateSet";
import { useState } from "react";

type ExerciseCardProps = { pe: PerformedExercise };

export default function PECard({ pe }: ExerciseCardProps) {
  const { token } = theme.useToken();
  const [creatingSet, setCreatingSet] = useState(false);

  return (
    <Flex
      vertical
      gap={8}
      style={{
        padding: token.padding,
        background: token.colorBgContainer,
        borderRadius: token.borderRadiusLG,
      }}
    >
      <Title level={5}>{pe.exercise.name}</Title>
      {pe.sets.map((set) => (
        <SetInput set={set} />
      ))}
      {creatingSet && <CreateSet onComplete={() => setCreatingSet(false)} />}
      <Flex gap={8}>
        <Button
          style={{ flex: 1 }}
          variant="text"
          color="primary"
          onClick={() => setCreatingSet(true)}
        >
          Add Set
        </Button>
        <Button style={{ flex: 1 }} variant="text" color="danger">
          Delete Set
        </Button>
      </Flex>
    </Flex>
  );
}
