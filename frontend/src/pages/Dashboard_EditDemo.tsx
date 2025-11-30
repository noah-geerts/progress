import {
  DeleteOutlined,
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { Button, Col, Flex, Input, theme, Typography } from "antd";
import InnerPage from "../wrappers/InnerPage";
import { generateCurrentWeekSessions } from "./sampleSessions";
import { useState } from "react";
const { Title } = Typography;

export default function DashboardEditDemo() {
  const {
    token: {
      colorBgContainer,
      borderRadiusLG,
      fontWeightStrong,
      colorBgLayout,
      padding,
    },
  } = theme.useToken();

  const [sessions] = useState(generateCurrentWeekSessions());
  const [editingSet, setEditingSet] = useState<string | null>(null); // Format: "exerciseIndex-setIndex"
  const [loadingSet, setLoadingSet] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{
    weight: string;
    reps: string;
  }>({ weight: "", reps: "" });

  // Sample set data - in real app this would come from your sessions state
  const [setData, setSetData] = useState([
    { weight: 225, reps: 8 },
    { weight: 235, reps: 6 },
    { weight: 245, reps: 4 },
  ]);

  const handleEditClick = (
    setId: string,
    currentWeight: number,
    currentReps: number
  ) => {
    setEditingSet(setId);
    setEditValues({
      weight: currentWeight.toString(),
      reps: currentReps.toString(),
    });
  };

  const handleCancelEdit = () => {
    setEditingSet(null);
    setEditValues({ weight: "", reps: "" });
  };

  const handleSaveEdit = async (setId: string, setIndex: number) => {
    setLoadingSet(setId);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Update local state (in real app, this would be handled by your API response)
    const newSetData = [...setData];
    newSetData[setIndex] = {
      weight: parseInt(editValues.weight) || 0,
      reps: parseInt(editValues.reps) || 0,
    };
    setSetData(newSetData);

    setLoadingSet(null);
    setEditingSet(null);
    setEditValues({ weight: "", reps: "" });
  };

  return (
    <InnerPage>
      <div
        style={{
          height: "100%",
        }}
      >
        <Flex gap={16} style={{ height: "100%" }}>
          <Col
            style={{
              display: "flex",
              flexDirection: "column",
              background: colorBgLayout,
              borderRadius: borderRadiusLG,
              gap: 8,
              padding: 8,
            }}
            span={4}
          >
            <div
              style={{
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
              }}
            >
              <p
                style={{
                  fontWeight: fontWeightStrong,
                  marginBottom: "16px",
                  textAlign: "center",
                  marginTop: 16,
                }}
              >
                Monday, November 25th - Push Day
              </p>
            </div>

            {/* Interactive Exercise with Edit/Save/Cancel Pattern */}
            <Flex
              style={{
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
                padding: padding,
              }}
              gap={8}
              vertical
            >
              <Title level={5}>Bench Press (Interactive)</Title>

              {setData.map((set, index) => {
                const setId = `0-${index}`;
                const isEditing = editingSet === setId;
                const isLoading = loadingSet === setId;

                return (
                  <Flex key={index} gap={8} align="center">
                    {isEditing ? (
                      /* Edit Mode: Show inputs with Save/Cancel */
                      <>
                        <Input
                          value={editValues.weight}
                          onChange={(e) =>
                            setEditValues((prev) => ({
                              ...prev,
                              weight: e.target.value,
                            }))
                          }
                          variant="filled"
                          suffix="lbs"
                          placeholder="Weight"
                          style={{ flex: 1 }}
                        />
                        <Input
                          value={editValues.reps}
                          onChange={(e) =>
                            setEditValues((prev) => ({
                              ...prev,
                              reps: e.target.value,
                            }))
                          }
                          variant="filled"
                          suffix="reps"
                          placeholder="Reps"
                          style={{ flex: 1 }}
                        />
                        <Button
                          variant="text"
                          color="primary"
                          icon={<SaveOutlined />}
                          loading={isLoading}
                          onClick={() => handleSaveEdit(setId, index)}
                          title="Save"
                        />
                        <Button
                          variant="text"
                          color="default"
                          icon={<CloseOutlined />}
                          onClick={handleCancelEdit}
                          disabled={isLoading}
                          title="Cancel"
                        />
                      </>
                    ) : (
                      /* Display Mode: Show values with Edit button */
                      <>
                        <div
                          style={{
                            flex: 1,
                            padding: "8px 12px",
                            background: "#f5f5f5",
                            borderRadius: "6px",
                            minHeight: "32px",
                            display: "flex",
                            alignItems: "center",
                            fontWeight: 500,
                          }}
                        >
                          {set.weight} lbs
                        </div>
                        <div
                          style={{
                            flex: 1,
                            padding: "8px 12px",
                            background: "#f5f5f5",
                            borderRadius: "6px",
                            minHeight: "32px",
                            display: "flex",
                            alignItems: "center",
                            fontWeight: 500,
                          }}
                        >
                          {set.reps} reps
                        </div>
                        <Button
                          variant="text"
                          color="default"
                          icon={<EditOutlined />}
                          onClick={() =>
                            handleEditClick(setId, set.weight, set.reps)
                          }
                          title="Edit"
                        />
                        {index === setData.length - 1 && (
                          <Button
                            variant="text"
                            color="danger"
                            icon={<DeleteOutlined />}
                            title="Delete"
                          />
                        )}
                      </>
                    )}
                  </Flex>
                );
              })}

              <Button variant="text" color="primary">
                Add Set
              </Button>
            </Flex>

            {/* Static Exercise for Comparison */}
            <Flex
              style={{
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
                padding: padding,
              }}
              gap={8}
              vertical
            >
              <Title level={5}>Overhead Press (Static)</Title>
              <Flex gap={8} align="center">
                <div
                  style={{
                    flex: 1,
                    padding: "8px 12px",
                    background: "#f5f5f5",
                    borderRadius: "6px",
                    minHeight: "32px",
                    display: "flex",
                    alignItems: "center",
                    fontWeight: 500,
                  }}
                >
                  135 lbs
                </div>
                <div
                  style={{
                    flex: 1,
                    padding: "8px 12px",
                    background: "#f5f5f5",
                    borderRadius: "6px",
                    minHeight: "32px",
                    display: "flex",
                    alignItems: "center",
                    fontWeight: 500,
                  }}
                >
                  10 reps
                </div>
                <Button
                  variant="text"
                  color="default"
                  icon={<EditOutlined />}
                  title="Edit"
                />
              </Flex>
              <Flex gap={8} align="center">
                <div
                  style={{
                    flex: 1,
                    padding: "8px 12px",
                    background: "#f5f5f5",
                    borderRadius: "6px",
                    minHeight: "32px",
                    display: "flex",
                    alignItems: "center",
                    fontWeight: 500,
                  }}
                >
                  145 lbs
                </div>
                <div
                  style={{
                    flex: 1,
                    padding: "8px 12px",
                    background: "#f5f5f5",
                    borderRadius: "6px",
                    minHeight: "32px",
                    display: "flex",
                    alignItems: "center",
                    fontWeight: 500,
                  }}
                >
                  8 reps
                </div>
                <Button
                  variant="text"
                  color="default"
                  icon={<EditOutlined />}
                  title="Edit"
                />
              </Flex>
              <Flex gap={8} align="center">
                <div
                  style={{
                    flex: 1,
                    padding: "8px 12px",
                    background: "#f5f5f5",
                    borderRadius: "6px",
                    minHeight: "32px",
                    display: "flex",
                    alignItems: "center",
                    fontWeight: 500,
                  }}
                >
                  155 lbs
                </div>
                <div
                  style={{
                    flex: 1,
                    padding: "8px 12px",
                    background: "#f5f5f5",
                    borderRadius: "6px",
                    minHeight: "32px",
                    display: "flex",
                    alignItems: "center",
                    fontWeight: 500,
                  }}
                >
                  6 reps
                </div>
                <Button
                  variant="text"
                  color="default"
                  icon={<EditOutlined />}
                  title="Edit"
                />
                <Button
                  variant="text"
                  color="danger"
                  icon={<DeleteOutlined />}
                  title="Delete"
                />
              </Flex>
              <Button variant="text" color="primary">
                Add Set
              </Button>
            </Flex>
          </Col>

          <Col
            style={{
              display: "flex",
              flexDirection: "column",
              background: colorBgLayout,
              borderRadius: borderRadiusLG,
              gap: 8,
              padding: 8,
            }}
            span={4}
          >
            <div
              style={{
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
              }}
            >
              <p
                style={{
                  fontWeight: fontWeightStrong,
                  marginBottom: "16px",
                  textAlign: "center",
                  marginTop: 16,
                }}
              >
                Wednesday, November 27th - Pull Day
              </p>
            </div>

            <Flex
              style={{
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
                padding: padding,
              }}
              gap={8}
              vertical
            >
              <Title level={5}>Deadlift</Title>
              <Flex gap={8} align="center">
                <div
                  style={{
                    flex: 1,
                    padding: "8px 12px",
                    background: "#f5f5f5",
                    borderRadius: "6px",
                    minHeight: "32px",
                    display: "flex",
                    alignItems: "center",
                    fontWeight: 500,
                  }}
                >
                  315 lbs
                </div>
                <div
                  style={{
                    flex: 1,
                    padding: "8px 12px",
                    background: "#f5f5f5",
                    borderRadius: "6px",
                    minHeight: "32px",
                    display: "flex",
                    alignItems: "center",
                    fontWeight: 500,
                  }}
                >
                  5 reps
                </div>
                <Button
                  variant="text"
                  color="default"
                  icon={<EditOutlined />}
                />
              </Flex>
              <Flex gap={8} align="center">
                <div
                  style={{
                    flex: 1,
                    padding: "8px 12px",
                    background: "#f5f5f5",
                    borderRadius: "6px",
                    minHeight: "32px",
                    display: "flex",
                    alignItems: "center",
                    fontWeight: 500,
                  }}
                >
                  335 lbs
                </div>
                <div
                  style={{
                    flex: 1,
                    padding: "8px 12px",
                    background: "#f5f5f5",
                    borderRadius: "6px",
                    minHeight: "32px",
                    display: "flex",
                    alignItems: "center",
                    fontWeight: 500,
                  }}
                >
                  3 reps
                </div>
                <Button
                  variant="text"
                  color="default"
                  icon={<EditOutlined />}
                />
              </Flex>
              <Flex gap={8} align="center">
                <div
                  style={{
                    flex: 1,
                    padding: "8px 12px",
                    background: "#f5f5f5",
                    borderRadius: "6px",
                    minHeight: "32px",
                    display: "flex",
                    alignItems: "center",
                    fontWeight: 500,
                  }}
                >
                  365 lbs
                </div>
                <div
                  style={{
                    flex: 1,
                    padding: "8px 12px",
                    background: "#f5f5f5",
                    borderRadius: "6px",
                    minHeight: "32px",
                    display: "flex",
                    alignItems: "center",
                    fontWeight: 500,
                  }}
                >
                  1 rep
                </div>
                <Button
                  variant="text"
                  color="default"
                  icon={<EditOutlined />}
                />
                <Button
                  variant="text"
                  color="danger"
                  icon={<DeleteOutlined />}
                />
              </Flex>
              <Button variant="text" color="primary">
                Add Set
              </Button>
            </Flex>
          </Col>
        </Flex>
      </div>
    </InnerPage>
  );
}
