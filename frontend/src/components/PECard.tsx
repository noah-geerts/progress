import { Button, Card, Input } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import type { PerformedExerciseResponseDto } from "../domain/PerformedExercise/PerformedExercise";
import { useDeletePE } from "../services/performedExerciseService";

function cardTitle(peName: string) {
  return (
    <div className="flex justify-between items-center">
      <span>{peName}</span>
      <Button color="primary" variant="outlined" size="small">
        + Add Set
      </Button>
    </div>
  );
}

type PECardProps = {
  pe: PerformedExerciseResponseDto;
};

export default function PECard({ pe }: PECardProps) {
  const { mutate, isPending } = useDeletePE(pe.peid);

  const handleDelete: React.MouseEventHandler<HTMLElement> = () => mutate();

  return (
    <Card
      variant="borderless"
      title={cardTitle(pe.exercise.name)}
      className="w-96 shadow-lg"
    >
      <div className="flex items-center gap-2">
        <Input addonAfter="lbs"></Input>
        <Input addonAfter="reps"></Input>
        <Button
          shape="circle"
          color="danger"
          variant="outlined"
          size="small"
          icon={<CloseOutlined />}
          onClick={handleDelete}
          loading={isPending}
        ></Button>
      </div>
    </Card>
  );
}
