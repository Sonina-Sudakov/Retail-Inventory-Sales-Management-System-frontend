import { Layout } from "antd"
import { Outlet } from "react-router-dom"

import Sidebar from "../layout/Sidebar"
import { menuItems } from "../../config/menu";
import { getRole } from "../../utils/jwt";

const { Content } = Layout

export default function ShopkeeperLayout() {

    const role = getRole();

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
                        background: "#f5f5f5"
                    }}
                >
                    <Outlet />
                </Content>

            </Layout>

        </Layout>
    )
}
