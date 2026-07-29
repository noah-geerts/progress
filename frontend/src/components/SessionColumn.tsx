import type { Session } from "../domain/Session/Session";
import { Button, Flex, Input, Spin, theme } from "antd";
import PECard from "../components/PECard";
import CreatePE from "./CreatePE";
import { Dayjs } from "dayjs";
import { useGetSession, useUpdateSession } from "../services/sessionService";
import { createContext, useContext, useRef, useState } from "react";
import CreateSession from "./CreateSession";
import { EditOutlined, SaveOutlined } from "@ant-design/icons";
import { useProgressNotification } from "../wrappers/ProgressNotificationProvider";

type SessionColumnProps = {
  date: Dayjs;
};

const SessionContext = createContext<Session | null>(null);

export function useSession() {
  const session = useContext(SessionContext);
  if (session === null)
    throw new Error(
      "useSession was consumed outside of SessionContextProvider"
    );
  return session;
}

export default function SessionColumn({ date }: SessionColumnProps) {
  const { token } = theme.useToken();
  const columnRef = useRef<HTMLDivElement>(null);
  const [editingName, setEditingName] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const { data: session, isLoading } = useGetSession(date.format("YYYY-MM-DD"));
  const { mutate: updateSession, isPending } = useUpdateSession(
    date.format("YYYY-MM-DD")
  );

  const [name, setName] = useState(session?.name);
  const api = useProgressNotification();

  // Functions to handle editing the session name
  const editName = () => {
    setName(session?.name);
    setEditingName(true);
  };

  const saveName = () => {
    if (!name || name === "") {
      api.error({ message: "Cannot update session name to an empty name" });
      return;
    }

    updateSession(
      { name: name },
      {
        onError: () => {
          setEditingName(false);
          setName(session?.name);
          api.error({
            message: "Network error occured while updating session name",
          });
        },
        onSuccess: () => setEditingName(false),
      }
    );
  };

  // Function to trigger scrolling to the bottom of the column when new PE's are added
  const scrollToBottom = () => {
    console.log("clicked");
    if (columnRef.current) {
      const element = columnRef.current;
      setTimeout(() => {
        element.scrollTo({
          top: element.scrollHeight,
          behavior: "smooth",
        });
      }, 200);
    }
  };

  const titleTextStyles: React.CSSProperties = {
    fontWeight: token.fontWeightStrong,
    textAlign: "center",
    paddingBottom: "2.5px",
  };

  // Title content (gets complicated with ternaries in jsx)
  let titleContent: React.ReactNode | undefined = undefined;
  if (isLoading) {
    titleContent = (
      <p style={{ ...titleTextStyles, color: token.colorTextDescription }}>
        {date.format("dddd, MMMM D")}&nbsp;-&nbsp;
      </p>
    );
  } else if (session) {
    titleContent = (
      <Flex
        gap={8}
        align="center"
        justify="center"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        style={{ width: "100%" }}
      >
        {!editingName && (
          <>
            <p
              style={{
                ...titleTextStyles,
                color: token.colorText,
              }}
            >
              {date.format("dddd, MMMM D")}&nbsp;-&nbsp;
              {session.name}
            </p>
            {isHovering && (
              <Button
                size="small"
                variant="text"
                color="primary"
                onClick={editName}
                icon={<EditOutlined />}
              />
            )}
          </>
        )}
        {editingName && (
          <>
            <Input
              size="small"
              style={{ height: "30px" }}
              value={name}
              onChange={(e) => setName(e.target.value)}
              onPressEnter={saveName}
              autoFocus
            />
            <Button
              size="small"
              variant="text"
              color="primary"
              onClick={saveName}
              loading={isPending}
              icon={!isPending && <SaveOutlined />}
            />
          </>
        )}
      </Flex>
    );
  } else {
    titleContent = (
      <p
        style={{
          ...titleTextStyles,
          color: token.colorTextDescription,
        }}
      >
        {date.format("dddd, MMMM D")}&nbsp;-&nbsp;Rest Day
      </p>
    );
  }

  // If the session exists, render it
  return (
    <div
      ref={columnRef}
      style={{
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
        overflowX: "hidden",
        justifyContent: isLoading ? "space-between" : "flex-start",
        background: token.colorBgLayout,
        borderRadius: token.borderRadiusLG,
        gap: 8,
        padding: token.paddingSM,
        flex: 1,
        flexShrink: 0,
      }}
    >
      {/* Title  */}
      <div
        style={{
          background: token.colorBgContainer,
          borderRadius: token.borderRadiusLG,
          padding: token.padding,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
        }}
      >
        {titleContent}
      </div>

      {session && (
        <SessionContext.Provider value={session}>
          {/* Performed Exercises */}
          {session.performedExercises.map((pe) => (
            <PECard pe={pe} key={pe.peid} />
          ))}

          {/* Create PE Component */}
          <div onClick={scrollToBottom}>
            <CreatePE />
          </div>
        </SessionContext.Provider>
      )}

      {!session && !isLoading && <CreateSession date={date} />}

      {isLoading && (
        <>
          <Spin />
          <div></div>
        </>
      )}
    </div>
  );
}
