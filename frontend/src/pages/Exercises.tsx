import { useState } from "react";
import {
  Button,
  Table,
  Input,
  Space,
  Modal,
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
import {
  useDeleteExercise,
  useGetAllExercises,
  useUpdateExercise,
} from "../services/exerciseService";
import { useProgressNotification } from "../wrappers/ProgressNotificationProvider";
import type { Exercise } from "../domain/Exercise/Exercise";

const { Title, Text } = Typography;

export default function Exercises() {
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");

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
  const handleUpdateExercise = () => {
    updateExercise(
      { name: editingName },
      {
        onError: () => {
          api.error({
            message:
              "Network error occured while updating exercise " + updatingId,
          });
          setUpdatingId(null);
          setEditingName("");
        },
        onSuccess: () => {
          setUpdatingId(null);
          setEditingName("");
        },
      }
    );
  };

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
            block
            style={{ marginBottom: "12px" }}
          >
            Create Exercise
          </Button>
        )}

        <Table
          columns={columns}
          dataSource={exercises}
          rowKey="eid"
          pagination={{ pageSize: 10, align: isMobile ? "center" : "end" }}
          style={{ backgroundColor: token.colorBgContainer }}
          loading={isLoading}
        />

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
