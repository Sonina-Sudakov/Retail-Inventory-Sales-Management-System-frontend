import { Switch } from "antd";
import {
    MoonOutlined,
    SunOutlined
} from "@ant-design/icons";

import { useTheme } from "../../context/ThemeContext";

export default function ThemeSwitcher() {

    const { theme, toggleTheme } = useTheme();

    return (
        <Switch
            checked={theme === "dark"}
            checkedChildren={<MoonOutlined />}
            unCheckedChildren={<SunOutlined />}
            onChange={toggleTheme}
            style={{
                position: "fixed",
                top: 16,
                right: 16,
                zIndex: 1000
            }}
        />
    );
}
