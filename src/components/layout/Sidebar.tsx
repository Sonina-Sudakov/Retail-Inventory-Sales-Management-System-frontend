import { Button, Layout, Menu, Modal, Typography } from "antd"

import { useNavigate, useLocation } from "react-router-dom"
import { useState } from "react"
import { LogoutOutlined } from "@ant-design/icons";

const { Sider } = Layout

import "../../styles/sidebar.css";

interface SidebarProps {
    items: any[];
}

export default function Sidebar({
    items
}: SidebarProps) {

    const navigate = useNavigate()
    const location = useLocation()
    const [collapsed, setCollapsed] = useState(false)

    function logout() {
        Modal.confirm({
            title: "Logout",
            content: "Are you sure you want to logout?",
            okText: "Logout",
            cancelText: "Cancel",
            okButtonProps: {
                danger: true
            },
            onOk: () => {
                localStorage.removeItem("access_token");
                navigate("/login");
            }
        });
    }

    return (
        <Sider
            collapsible
            collapsed={collapsed}
            onCollapse={setCollapsed}
            width={200}
            theme="dark"
        >
            <div
                style={{
                    padding: 16
                }}
            >
                <Typography.Title
                    level={4}
                    style={{
                        color: "white",
                        margin: 0,
                        whiteSpace: "nowrap"
                    }}
                >
                    {collapsed ? "ERP" : "ERP System"}
                </Typography.Title>
            </div>

            <Menu
                theme="dark"
                mode="inline"
                style={{
                    textAlign: "left"
                }}
                selectedKeys={[location.pathname]}
                items={items}
                onClick={({ key }) => navigate(key)}
            />

            <div
                style={{
                    padding: 12,
                    borderTop: "1px solid rgba(255,255,255,0.1)",
                    alignItems: "left"
                }}
            >

                <Button
                    danger
                    type="text"
                    icon={<LogoutOutlined />}
                    onClick={logout}
                    className="logout-button"
                    style={{
                        color: "white",
                        width: "100%",
                        textAlign: "left",
                        display: "flex",
                    }}
                >

                    {collapsed ? "" : "Logout"}

                </Button>
            </div>

        </Sider>
    )
}
