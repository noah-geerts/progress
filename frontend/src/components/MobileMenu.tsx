import { MenuOutlined } from "@ant-design/icons";
import { Button, Dropdown, type MenuProps } from "antd";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router";

export const MOBILE_MENU_WIDTH = 40;

export default function MobileMenu() {
  const navigate = useNavigate();
  const { logout } = useAuth0();

  const menuItems: MenuProps["items"] = [
    {
      key: "/dashboard",
      label: <span style={{ display: "block", paddingBlock: 8 }}>Dashboard</span>,
    },
    {
      key: "/exercises",
      label: <span style={{ display: "block", paddingBlock: 8 }}>Exercises</span>,
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      label: <span style={{ display: "block", paddingBlock: 8 }}>Log out</span>,
      danger: true,
    },
  ];

  const handleMenuClick: MenuProps["onClick"] = ({ key }) => {
    if (key === "logout") {
      logout();
      return;
    }

    navigate(key);
  };

  return (
    <Dropdown
      menu={{
        items: menuItems,
        onClick: handleMenuClick,
        style: { minWidth: 200 },
      }}
      placement="bottomRight"
      trigger={["click"]}
    >
      <Button
        type="text"
        icon={<MenuOutlined />}
        aria-label="Open navigation menu"
        style={{ width: MOBILE_MENU_WIDTH, flexShrink: 0 }}
      />
    </Dropdown>
  );
}
