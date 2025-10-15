import { DatePicker, Input, Modal, Spin, type DatePickerProps } from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { dateToYYYYMMDD } from "../misc/dateHelpers";
import { useCreateSession, useGetSession } from "../services/sessionService";

type AddSessionModalProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function AddSessionModal({
  open,
  setOpen,
}: AddSessionModalProps) {
  const [localDate, setLocalDate] = useState(dateToYYYYMMDD(new Date()));
  const [name, setName] = useState("");

  const { data, isLoading: isGetLoading } = useGetSession(localDate);
  const {
    mutate: createSession,
    isPending: isCreateLoading,
    isError,
  } = useCreateSession(localDate);

  const handleChangeDate: DatePickerProps<Dayjs[]>["onChange"] = (
    date,
    dateString
  ) => {
    setLocalDate(dateString as string);
  };

  const handleOk = () => {
    createSession(
      { name: name },
      {
        onSuccess: () => {
          setOpen(false);
        },
      }
    );
  };

  return (
    <Modal
      title="Add Session"
      open={open}
      onOk={handleOk}
      onCancel={() => setOpen(false)}
      confirmLoading={isGetLoading}
      okButtonProps={{ disabled: data !== undefined }}
    >
      <div className="flex flex-col justify-center gap-2">
        {isCreateLoading ? (
          <Spin />
        ) : (
          <>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter session name"
            ></Input>
            <DatePicker
              defaultValue={[dayjs(new Date())]}
              onChange={handleChangeDate}
            ></DatePicker>
            {data !== undefined ? (
              <p>This date is already in use</p>
            ) : (
              isError && <p>An error occured while creating the session</p>
            )}
          </>
        )}
      </div>
    </Modal>
  );
}
