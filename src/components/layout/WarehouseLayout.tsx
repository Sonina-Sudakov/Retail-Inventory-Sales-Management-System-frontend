import { Layout } from "antd"
import { Outlet } from "react-router-dom"

import Sidebar from "../layout/Sidebar"
import { menuItems } from "../../config/menu";
import { getRole } from "../../utils/jwt";

import { theme } from "antd";

const { Content } = Layout

export default function WarehouseLayout() {

    const role = getRole();

    const { token } = theme.useToken();

    const items =
        role && role in menuItems
            ? menuItems[role as keyof typeof menuItems]
            : [];

    return (
        <Layout style={{ minHeight: "100vh" }}>

            <Sidebar items={items} />

            <Layout>

                <Content
                    style={{
                        padding: 24,
                        background: token.colorBgContainer
                    }}
                >
                    <Outlet />
                </Content>

            </Layout>

        </Layout>
    )
}
