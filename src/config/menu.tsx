import {
    UserOutlined,
    ShoppingOutlined,
    ShopOutlined,
    FileTextOutlined,
    TruckOutlined,
    WalletOutlined,
    InboxOutlined

} from "@ant-design/icons";

export const menuItems = {
    ADMIN: [
        {
            key: "/admin/users",
            icon: <UserOutlined />,
            label: "Users"
        },
        {
            key: "/admin/products",
            icon: <ShoppingOutlined />,
            label: "Products"
        },
        {
            key: "/admin/shops",
            icon: <ShopOutlined />,
            label: "Shops"
        },
        {
            key: "/admin/orders",
            icon: <FileTextOutlined />,
            label: "Orders"
        },
        {
            key: "/admin/shipments",
            icon: <TruckOutlined />,
            label: "Shipments"
        },
        {
            key: "/admin/Sales",
            icon: <WalletOutlined />,
            label: "Sales"
        }
    ],

    SHOPKEEPER: [
        {
            key: "/shopkeeper/stocks",
            icon: <InboxOutlined />,
            label: "Stocks"
        },
        {
            key: "/shopkeeper/orders",
            icon: <FileTextOutlined />,
            label: "Orders"
        },
        {
            key: "/shopkeeper/shipments",
            icon: <TruckOutlined />,
            label: "Shipments"
        },
        {
            key: "/shopkeeper/sales",
            icon: <WalletOutlined />,
            label: "Sales"
        }
    ],

    STOREKEEPER: [
        {
            key: "/storekeeper/stocks",
            icon: <InboxOutlined />,
            label: "Stocks"
        },
        {
            key: "/storekeeper/orders",
            icon: <FileTextOutlined />,
            label: "Orders"
        },
        {
            key: "/storekeeper/shipments",
            icon: <TruckOutlined />,
            label: "Shipments"
        }
    ]
};
