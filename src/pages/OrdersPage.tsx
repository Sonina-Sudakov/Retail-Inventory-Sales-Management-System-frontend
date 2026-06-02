import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import { api } from "../api/api"
import type { OrderShort } from "../types/orderShort"

import {
    Table,
    Input,
    Button,
    Card,
    Typography
} from "antd"
import { getRole } from "../utils/jwt"


export default function OrderPage() {

    const [orders, setOrders] = useState<OrderShort[]>([])

    const [search, setSearch] = useState("")

    const navigate = useNavigate()

    const role = getRole()?.toLowerCase()

    async function loadOrders() {

        const response = await api.get("/orders/all")

        const orders: OrderShort[] = response.data.items.map(order => ({
            id: order.id,
            shopName: order.to_shop.name,
            createdBy: order.created_by.fullname,
            status: order.status,
            createdAt: new Date(order.created_at).toLocaleString(),
            acceptedAt: order.accepted_at
                ? new Date(order.accepted_at).toLocaleString() : "-"
        }))

        setOrders(orders)
    }

    useEffect(() => {
        loadOrders()
    }, [])


    const columns = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id"
        },
        {
            title: "Shop Name",
            dataIndex: "shopName",
            key: "shopName"
        },
        {
            title: "Created By User",
            dataIndex: "createdBy",
            key: "createdBy"
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status"
        },
        {
            title: "Created At",
            dataIndex: "createdAt",
            key: "createdAt"
        },
        {
            title: "Accepted At",
            dataIndex: "acceptedAt",
            key: "acceptedAt"
        },

        {
            title: "Actions",
            key: "actions",
            render: (_: unknown, order: OrderShort) => (
                <>
                    <Button
                        onClick={() => {
                            navigate(`${order.id}`)
                        }}
                        style={{ marginRight: 8 }}
                    >
                        Details
                    </Button>
                </>
            )
        }
    ]

    const filteredOrders = orders.filter(order =>
        Object.values(order).some(value =>
            String(value).toLowerCase().includes(search.toLowerCase())
        )
    )

    return (
        <div className="p-8">

            <Typography.Title
                level={1}
                style={{
                    textAlign: "left",
                    marginBottom: 16
                }}
            >
                Orders
            </Typography.Title>

            <Card>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 16
                    }}
                >
                    <Input
                        placeholder="Search orders"
                        value={search}
                        style={{ width: 500 }}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    {role === "shopkeeper" && (
                        <Button
                            type="primary"
                            onClick={() => {
                                navigate(`create`)
                            }}
                        >
                            Create Order
                        </Button>
                    )}

                </div>

                <Table
                    rowKey="id"
                    dataSource={filteredOrders}
                    columns={columns}
                    pagination={{
                        pageSize: 10
                    }}
                />

            </Card>

        </div>

    )

}


