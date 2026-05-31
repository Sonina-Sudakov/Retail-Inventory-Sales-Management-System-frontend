import { Layout } from "antd"
import { Outlet } from "react-router-dom"

import Sidebar from "../layout/Sidebar"

const { Content } = Layout

export default function AdminLayout() {

    return (
        <Layout style={{ minHeight: "100vh" }}>

            <Sidebar />

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
