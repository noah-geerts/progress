import { Button, Flex, Modal, theme } from "antd";
import Text from "antd/es/typography/Text";
import type { PerformedExercise } from "../domain/PerformedExercise/PerformedExercise";
import SetInput from "./SetInput";
import CreateSet from "./CreateSet";
import { useState } from "react";
import { CloseOutlined } from "@ant-design/icons";
import { useDeletePE } from "../services/performedExerciseService";
import { useProgressNotification } from "../wrappers/ProgressNotificationProvider";
import { useSession } from "./SessionColumn";

type ExerciseCardProps = { pe: PerformedExercise };

export default function PECard({ pe }: ExerciseCardProps) {
  const { token } = theme.useToken();
  const [creatingSet, setCreatingSet] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const session = useSession();

  const { mutate: deletePE, isPending } = useDeletePE(pe.peid, session.date);

  const api = useProgressNotification();

  const handleDeletePE = () => {
    deletePE(undefined, {
      onError: () => {
        api.error({ message: "Network issue occured while deleting exercise" });
        setModalOpen(false);
      },
      onSuccess: () => {
        setModalOpen(false);
      },
    });
  };

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
      {/** Delete exercise modal */}
      <Modal
        title="Warning"
        closable
        okType="danger"
        okText="Yes"
        cancelText="No"
        open={modalOpen}
        onOk={handleDeletePE}
        okButtonProps={{ loading: isPending }}
        onCancel={() => setModalOpen(false)}
      >
        <Text>
          {"Are you sure you want to delete " + pe.exercise.name + "?"}
        </Text>
      </Modal>

      {/** Exercise name and delete button */}
      <Flex
        justify="space-between"
        align="center"
        style={{ width: "100%", marginBottom: 8 }}
      >
        <p
          style={{
            fontSize: token.fontSizeHeading5,
            fontWeight: token.fontWeightStrong,
          }}
        >
          {pe.exercise.name}
        </p>
        <Button
          variant="text"
          color="danger"
          onClick={() => {
            setModalOpen(true);
          }}
        >
          <CloseOutlined />
        </Button>
      </Flex>

      {/** Set inputs and create new set input*/}
      {pe.sets.map((set) => (
        <SetInput set={set} key={set.stid} />
      ))}
      {creatingSet && (
        <CreateSet onComplete={() => setCreatingSet(false)} pe={pe} />
      )}

      {/** Add set button */}
      <Flex gap={8}>
        <Button
          style={{ flex: 1 }}
          variant="text"
          color="primary"
          onClick={() => setCreatingSet(true)}
        >
          Add Set
        </Button>
      </Flex>
    </Flex>
  );
}
