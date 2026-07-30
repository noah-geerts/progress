import { useEffect, useRef, useState } from "react";
import {
  Button,
  Pagination,
  Table,
  Input,
  Space,
  Modal,
  Spin,
  Typography,
  Flex,
  Grid,
  theme,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SaveOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import InnerPage from "../wrappers/InnerPage";
import CreateExerciseModal from "../components/CreateExerciseModal";
import MobileMenu from "../components/MobileMenu";
import MobileExerciseRow from "../components/MobileExerciseRow";
import {
  useDeleteExercise,
  useGetAllExercises,
  useUpdateExercise,
} from "../services/exerciseService";
import { useProgressNotification } from "../wrappers/ProgressNotificationProvider";
import type { Exercise } from "../domain/Exercise/Exercise";

const { Title, Text } = Typography;
const MOBILE_PAGE_SIZE = 10;

export default function Exercises() {
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");
  const [editingOriginalName, setEditingOriginalName] = useState("");
  const [mobilePage, setMobilePage] = useState(1);
  const editingRowRef = useRef<HTMLDivElement | null>(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const api = useProgressNotification();

  const { token } = theme.useToken();
  const screens = Grid.useBreakpoint();
  const isMobile = screens.md === false;

  const { data: exercises, isLoading } = useGetAllExercises();

  // Delete exercise functionality
  const { mutate: deleteExercise, isPending: isDeletePending } =
    useDeleteExercise(deletingId || -1);
  const handleDeleteExercise = () => {
    // Do not try deletion operation if no exercise was selected to delete
    if (deletingId === null) {
      api.error({ message: "No exercise is selected to delete" });
      return;
    }

    // Delete
    deleteExercise(undefined, {
      onError: () => {
        api.error({
          message:
            "Network error occured while deleting exercise " + deletingId,
        });
        setDeleteModalOpen(false);
      },
      onSuccess: () => setDeleteModalOpen(false),
    });
  };

  // Update exercise functionality
  const { mutate: updateExercise, isPending: isUpdatePending } =
    useUpdateExercise(updatingId || -1);

  const clearEditing = () => {
    setUpdatingId(null);
    setEditingName("");
    setEditingOriginalName("");
  };

  const handleUpdateExercise = () => {
    updateExercise(
      { name: editingName.trim() },
      {
        onError: () => {
          api.error({
            message:
              "Network error occured while updating exercise " + updatingId,
          });
          clearEditing();
        },
        onSuccess: clearEditing,
      }
    );
  };

  const finishMobileEditing = () => {
    if (updatingId === null) return;

    const nextName = editingName.trim();
    if (nextName && nextName !== editingOriginalName) {
      updateExercise(
        { name: nextName },
        {
          onError: () =>
            api.error({
              message:
                "Network error occured while updating exercise " + updatingId,
            }),
        }
      );
    }

    clearEditing();
  };

  // Save mobile edits after the user pauses typing, without leaving edit mode.
  useEffect(() => {
    if (
      !isMobile ||
      updatingId === null ||
      !editingName.trim() ||
      editingName.trim() === editingOriginalName
    ) {
      return;
    }

    const nextName = editingName.trim();
    const timeout = window.setTimeout(() => {
      updateExercise(
        { name: nextName },
        {
          onError: () =>
            api.error({
              message:
                "Network error occured while updating exercise " + updatingId,
            }),
          onSuccess: () => setEditingOriginalName(nextName),
        }
      );
    }, 600);

    return () => window.clearTimeout(timeout);
  }, [
    api,
    editingName,
    editingOriginalName,
    isMobile,
    updateExercise,
    updatingId,
  ]);

  // Leave mobile edit mode when the user taps anywhere outside the active row.
  useEffect(() => {
    if (!isMobile || updatingId === null) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!editingRowRef.current?.contains(event.target as Node)) {
        finishMobileEditing();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isMobile, updatingId, editingName, editingOriginalName]);

  useEffect(() => {
    setMobilePage(1);
  }, [exercises?.length]);

  const startMobileEditing = (exercise: Exercise) => {
    setUpdatingId(exercise.eid);
    setEditingName(exercise.name);
    setEditingOriginalName(exercise.name);
  };

  const mobileExercises = (exercises ?? []).slice(
    (mobilePage - 1) * MOBILE_PAGE_SIZE,
    mobilePage * MOBILE_PAGE_SIZE
  );

  // Defines how the columns of the antd table should be rendered
  const columns = [
    // Exercise ID column
    {
      title: "Exercise ID",
      dataIndex: "eid",
      key: "eid",
      width: isMobile ? 72 : 120,
    },

    // Exercise name column or input field if we're editing
    {
      title: "Exercise Name",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: Exercise) => {
        if (updatingId === record.eid) {
          return (
            <Input
              value={editingName}
              onChange={(e) => setEditingName(e.target.value)}
              onPressEnter={handleUpdateExercise}
              autoFocus
              style={{ width: "100%", maxWidth: "100%", minWidth: 0 }}
            />
          );
        }
        return text;
      },
    },

    // Actions column (edit and delete buttons)
    {
      title: "Actions",
      key: "actions",
      width: isMobile ? 96 : 150,
      render: (_: any, record: Exercise) => {
        if (updatingId === record.eid) {
          // If we're editing this exercise, render save and cancel buttons
          return (
            <Space>
              <Button
                type="text"
                icon={<SaveOutlined />}
                onClick={handleUpdateExercise}
                size="small"
                disabled={isUpdatePending}
                loading={isUpdatePending}
              />
              <Button
                type="text"
                icon={<CloseOutlined />}
                onClick={() => {
                  setUpdatingId(null);
                  setEditingName("");
                }}
                size="small"
                disabled={isUpdatePending}
              />
            </Space>
          );
        }

        // Otherwise render edit and delete buttons
        return (
          <Space>
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => {
                setUpdatingId(record.eid);
                setEditingName(record.name);
              }}
              size="small"
            />
            <Button
              type="text"
              icon={<DeleteOutlined />}
              onClick={() => {
                setDeletingId(record.eid);
                setDeleteModalOpen(true);
              }}
              danger
              size="small"
            />
          </Space>
        );
      },
    },
  ];

  return (
    <InnerPage>
      <div style={{ padding: isMobile ? "12px" : "24px" }}>
        <Flex
          justify="space-between"
          align="center"
          style={{ marginBottom: isMobile ? "12px" : "24px" }}
        >
          <Title level={2} style={{ margin: 0 }}>
            Exercises
          </Title>
          {isMobile ? (
            <MobileMenu />
          ) : (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setCreateModalOpen(true)}
            >
              Create Exercise
            </Button>
          )}
        </Flex>

        {isMobile && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setCreateModalOpen(true)}
            shape="round"
            size="large"
            block
            style={{ marginBottom: "12px" }}
          >
            Create Exercise
          </Button>
        )}

        {isMobile ? (
          <div
            style={{
              overflow: "hidden",
              border: `1px solid ${token.colorBorderSecondary}`,
              borderRadius: token.borderRadiusLG,
              background: token.colorBgContainer,
            }}
          >
            {isLoading ? (
              <Flex justify="center" style={{ padding: token.paddingLG }}>
                <Spin />
              </Flex>
            ) : (
              mobileExercises.map((exercise) => (
                <MobileExerciseRow
                  key={exercise.eid}
                  exercise={exercise}
                  editing={updatingId === exercise.eid}
                  editingName={editingName}
                  rowRef={
                    updatingId === exercise.eid ? editingRowRef : undefined
                  }
                  onNameChange={setEditingName}
                  onStartEditing={() => startMobileEditing(exercise)}
                  onFinishEditing={finishMobileEditing}
                  onDelete={() => {
                    setDeletingId(exercise.eid);
                    setDeleteModalOpen(true);
                  }}
                />
              ))
            )}
            {!isLoading && (
              <Flex justify="center" style={{ padding: token.paddingSM }}>
                <Pagination
                  current={mobilePage}
                  pageSize={MOBILE_PAGE_SIZE}
                  total={exercises?.length ?? 0}
                  onChange={setMobilePage}
                  showSizeChanger={false}
                />
              </Flex>
            )}
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={exercises}
            rowKey="eid"
            pagination={{ pageSize: MOBILE_PAGE_SIZE }}
            style={{ backgroundColor: token.colorBgContainer }}
            loading={isLoading}
          />
        )}

        {/** Create Exercise Modal */}
        {createModalOpen && (
          <CreateExerciseModal
            open={createModalOpen}
            setOpen={setCreateModalOpen}
          />
        )}

        {/** Delete Exercise Modal */}
        <Modal
          title="Warning"
          closable
          okType="danger"
          okText="Yes"
          cancelText="No"
          open={deleteModalOpen}
          onOk={handleDeleteExercise}
          okButtonProps={{ loading: isDeletePending }}
          onCancel={() => {
            setDeletingId(null);
            setDeleteModalOpen(false);
          }}
        >
          <Text>
            {"Are you sure you want to delete exercise " + deletingId + "?"}
          </Text>
        </Modal>
      </div>
    </InnerPage>
  );
}
