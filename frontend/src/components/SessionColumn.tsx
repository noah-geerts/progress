import type { Session } from "../domain/Session/Session";
import { Col, Spin, theme } from "antd";
import PECard from "../components/PECard";
import CreatePE from "./CreatePE";
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

  const { data: session, isLoading } = useGetSession(date.format("YYYY-MM-DD"));

  // If the session exists, render it
  return (
    <Col
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: isLoading ? "space-between" : "flex-start",
        background: token.colorBgLayout,
        borderRadius: token.borderRadiusLG,
        gap: 8,
        padding: token.paddingSM,
      }}
      span={!isLoading && session ? 4 : 2}
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
          {formatDateString(date.format())} -{" "}
          {session ? session.name : isLoading ? "" : "Rest Day"}
        </p>
      </div>

      {session && (
        <SessionContext.Provider value={session}>
          {/* Performed Exercises */}
          {session.performedExercises.map((pe) => (
            <PECard pe={pe} key={pe.peid} />
          ))}

          {/* Create Exercise Component */}
          <CreatePE />
        </SessionContext.Provider>
      )}

      {isLoading && (
        <>
          <Spin />
          <div></div>
        </>
      )}
    </Col>
  );
}
