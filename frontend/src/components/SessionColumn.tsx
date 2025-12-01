import type { Session } from "../domain/Session/Session";
import { Col, theme } from "antd";
import PECard from "../components/PECard";
import CreateExercise from "./CreatePE";
import dayjs, { Dayjs } from "dayjs";
import { formatDateString } from "../common/dateHelpers";
import { useGetSession } from "../services/sessionService";
import { createContext, useContext } from "react";

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

  const { data: session } = useGetSession(date.format("YYYY-MM-DD"));

  // If the session exists, render it
  if (session)
    return (
      <SessionContext.Provider value={session}>
        <Col
          style={{
            display: "flex",
            flexDirection: "column",
            background: token.colorBgLayout,
            borderRadius: token.borderRadiusLG,
            gap: 8,
            padding: token.paddingSM,
          }}
          span={4}
        >
          {/* Title  */}
          <div
            style={{
              background: token.colorBgContainer,
              borderRadius: token.borderRadiusLG,
              padding: token.padding,
            }}
          >
            <p
              style={{
                fontWeight: token.fontWeightStrong,
                textAlign: "center",
              }}
            >
              {formatDateString(date.format())} - {session.name}
            </p>
          </div>

          {/* Performed Exercises */}
          {session.performedExercises.map((pe) => (
            <PECard pe={pe} />
          ))}

          {/* Create Exercise Component */}
          <CreateExercise />
        </Col>
      </SessionContext.Provider>
    );

  // If it doesn't exist, render a rest day
  return (
    <Col
      style={{
        display: "flex",
        flexDirection: "column",
        background: token.colorBgLayout,
        borderRadius: token.borderRadiusLG,
        gap: 8,
        padding: token.paddingSM,
      }}
      span={2}
    >
      {/* Title  */}
      <div
        style={{
          background: token.colorBgContainer,
          borderRadius: token.borderRadiusLG,
          padding: token.padding,
        }}
      >
        <p
          style={{
            fontWeight: token.fontWeightStrong,
            textAlign: "center",
          }}
        >
          {formatDateString(date.format())} - Rest Day
        </p>
      </div>
    </Col>
  );
}
