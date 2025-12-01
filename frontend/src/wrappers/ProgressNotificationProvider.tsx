import type { NotificationInstance } from "antd/es/notification/interface";
import { notification } from "antd";
import { createContext, useContext } from "react";

const ProgressNotificationContext = createContext<NotificationInstance | null>(
  null
);

export function useProgressNotification() {
  const api = useContext(ProgressNotificationContext);
  if (api === null)
    throw new Error(
      "useProgressNotification called outside of ProgressNotificationProvider"
    );
  return api;
}

export default function ProgressNotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [api, contextHolder] = notification.useNotification();

  return (
    <ProgressNotificationContext.Provider value={api}>
      {contextHolder}
      {children}
    </ProgressNotificationContext.Provider>
  );
}
