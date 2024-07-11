import { ActionIcon, Menu } from "@mantine/core";
import Link from "next/link";
import { MdMoreVert } from "react-icons/md";

export function AppDotMenu() {
  return (
    <Menu>
      <Menu.Target>
        <ActionIcon variant="subtle">
          <MdMoreVert />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item component={Link} href={"/chat"}>
          Chat
        </Menu.Item>
        <Menu.Item component={Link} href={"/bali"}>
          Bali
        </Menu.Item>
        <Menu.Item component={Link} href={"/jowo"}>
          Jowo
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
