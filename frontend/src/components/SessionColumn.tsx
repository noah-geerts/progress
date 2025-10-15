import Title from "antd/es/typography/Title";
import ExerciseCard from "./ExerciseCard";
import type { SessionResponseDto } from "../domain/Session/Session";
import { formatDate } from "../misc/dateHelpers";

type SessionColumnProps = {
  session: SessionResponseDto;
};

export default function SessionColumn({ session }: SessionColumnProps) {
  return (
    <div className="flex flex-col border-t border-r border-gray-200 gap-3 p-3">
      <div>
        <Title level={4} className="text-center mt-2">
          {session.name}
        </Title>
        <Title level={5} className="text-center">
          {formatDate(new Date(session.date))}
        </Title>
      </div>
      {session.performedExercises.map((pe) => (
        <ExerciseCard pe={pe} />
      ))}
    </div>
  );
}
