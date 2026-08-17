import { DeleteOutlined } from "@ant-design/icons";
import { Button, Input, theme } from "antd";
import { useRef, useState, type RefObject } from "react";
import type { Exercise } from "../domain/Exercise/Exercise";

const DELETE_ACTION_WIDTH = 88;

type MobileExerciseRowProps = {
  exercise: Exercise;
  editing: boolean;
  editingName: string;
  rowRef?: RefObject<HTMLDivElement | null>;
  onNameChange: (name: string) => void;
  onStartEditing: () => void;
  onFinishEditing: () => void;
  onDelete: () => void;
};

export default function MobileExerciseRow({
  exercise,
  editing,
  editingName,
  rowRef,
  onNameChange,
  onStartEditing,
  onFinishEditing,
  onDelete,
}: MobileExerciseRowProps) {
  const { token } = theme.useToken();
  const [offset, setOffset] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  };

  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null) return;

    const distance = event.touches[0].clientX - touchStartX.current;
    setOffset(Math.max(-DELETE_ACTION_WIDTH, Math.min(0, distance)));
  };

  const handleTouchEnd = () => {
    touchStartX.current = null;
    setOffset((currentOffset) =>
      currentOffset <= -DELETE_ACTION_WIDTH / 2 ? -DELETE_ACTION_WIDTH : 0
    );
  };

  return (
    <div
      ref={editing ? rowRef : undefined}
      data-exercise-row={exercise.id}
      style={{
        position: "relative",
        overflow: "hidden",
        borderBottom: `1px solid ${token.colorBorderSecondary}`,
        background: token.colorErrorBg,
      }}
    >
      <Button
        danger
        type="primary"
        icon={<DeleteOutlined />}
        aria-label={`Delete ${exercise.name}`}
        onClick={onDelete}
        style={{
          position: "absolute",
          inset: `0 0 0 auto`,
          width: DELETE_ACTION_WIDTH,
          height: "100%",
          borderRadius: 0,
        }}
      >
        Delete
      </Button>
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          alignItems: "center",
          gap: token.paddingSM,
          minHeight: 52,
          padding: `${token.paddingXS}px ${token.paddingSM}px`,
          background: token.colorBgContainer,
          transform: `translateX(${offset}px)`,
          transition: touchStartX.current === null ? "transform 0.2s ease" : "none",
        }}
      >
        <span
          style={{
            flex: "0 0 44px",
            color: token.colorTextDescription,
            fontSize: token.fontSizeSM,
          }}
        >
          {exercise.id}
        </span>
        {editing ? (
          <Input
            value={editingName}
            onChange={(event) => onNameChange(event.target.value)}
            onPressEnter={onFinishEditing}
            autoFocus
            aria-label={`Edit ${exercise.name}`}
            style={{ flex: 1, minWidth: 0 }}
          />
        ) : (
          <button
            type="button"
            onClick={onStartEditing}
            style={{
              flex: 1,
              minWidth: 0,
              padding: 0,
              overflow: "hidden",
              border: 0,
              background: "transparent",
              color: token.colorText,
              font: "inherit",
              textAlign: "left",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              cursor: "text",
            }}
          >
            {exercise.name}
          </button>
        )}
      </div>
    </div>
  );
}
