import Title from "antd/es/typography/Title";
import PECard from "./PECard";
import type { SessionResponseDto } from "../domain/Session/Session";
import { Button } from "antd";
import { useState } from "react";
import AddPEModal from "./AddPEModal";
import { useDeleteSession } from "../services/sessionService";

type SessionColumnProps = {
  session: SessionResponseDto;
};

export default function SessionColumn({ session }: SessionColumnProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { mutate, isPending } = useDeleteSession(session.date);

  const handleDeleteSession: React.MouseEventHandler<HTMLElement> = () =>
    mutate();

  return (
    <div className="flex flex-col justify-between border-t border-r border-gray-200 p-3">
      <div className="flex flex-col gap-3">
        <div>
          <Title level={4} className="text-center mt-2">
            {session.name}
          </Title>
          <Title level={5} className="text-center">
            {session.date}
          </Title>
        </div>
        {session.performedExercises.map((pe) => (
          <PECard key={pe.peid} pe={pe} />
        ))}
      </div>
      <div className="flex flex-col gap-3">
        <Button
          onClick={() => setIsModalOpen(true)}
          color="primary"
          variant="outlined"
        >
          + Add Exercise
        </Button>
        <Button
          color="danger"
          variant="outlined"
          loading={isPending}
          onClick={handleDeleteSession}
        >
          Delete Session
        </Button>
      </div>
      {isModalOpen && <AddPEModal setOpen={setIsModalOpen} session={session} />}
    </div>
  );
}
