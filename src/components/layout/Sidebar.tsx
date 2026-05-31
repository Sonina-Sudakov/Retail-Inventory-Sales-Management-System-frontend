import { Layout, Menu, Typography } from "antd"
import {
    UserOutlined,
    ShoppingOutlined,
    ShopOutlined,
    FileTextOutlined,
    TruckOutlined
} from "@ant-design/icons"

import { useNavigate, useLocation } from "react-router-dom"
import { useState } from "react"

const { Sider } = Layout

export default function Sidebar() {

    const navigate = useNavigate()
    const location = useLocation()
    const [collapsed, setCollapsed] = useState(false)

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
                    {collapsed ? "ERP" : "Admin Panel"}
                </Typography.Title>
            </div>          

            <Menu
                theme="dark"
                mode="inline"
                style={{
                   textAlign: "left" 
                }}
                selectedKeys={[location.pathname]}
                onClick={({ key }) => navigate(key)}
                items={[
                    {
                        key: "/users",
                        icon: <UserOutlined />,
                        label: "Users"
                    },
                    {
                        key: "/products",
                        icon: <ShoppingOutlined />,
                        label: "Products"
                    },
                    {
                        key: "/shops",
                        icon: <ShopOutlined />,
                        label: "Shops"
                    },
                    {
                        key: "/orders",
                        icon: <FileTextOutlined />,
                        label: "Orders"
                    },
                    {
                        key: "/shipments",
                        icon: <TruckOutlined />,
                        label: "Shipments"
                    }
                ]}
            />
        </Sider>
    )
}
