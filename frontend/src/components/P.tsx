import { Typography } from "antd";
const { Text } = Typography;
export default function P({ children }: { children: React.ReactNode }) {
  return (
    <Text className="flex m-0 p-0 leading-none justify-center items-center">
      {children}
    </Text>
  );
}
