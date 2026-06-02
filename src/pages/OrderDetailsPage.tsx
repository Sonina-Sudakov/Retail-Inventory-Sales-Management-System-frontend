import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"

import { api } from "../api/api"
import type { OrderDetailed } from "../types/orderDetailed"

import {
    Card,
    Typography,
    Descriptions,
    Table,
    Button,
    Space,
    message
} from "antd"

export default function OrderDetailsPage() {

    const { id } = useParams()
    const navigate = useNavigate()

    const [order, setOrder] = useState<OrderDetailed | null>(null)

    async function loadOrder() {

        const response = await api.get(`/orders?id=${id}`)

        const data = response.data

        setOrder({
            id: data.id,
            shop: data.to_shop,
            createdBy: data.created_by,
            status: data.status,
            createdAt: data.created_at,
            acceptedAt: data.accepted_at,
            items: data.items
        })
    }

    useEffect(() => {
        loadOrder()
    }, [id])

    async function handleCancel() {
        try {
            await api.put(`/orders/${id}/cancel`)
            message.success("Order canceled")
            await loadOrder()
        }
        catch (error: any) {
            message.error(error.response?.data?.message)
        }
    }

    async function handleAccept() {
        navigate(`/shipments/create/${id}`)
    }

    if (!order) {
        return <div>Loading...</div>
    }

    const columns = [
        {
            title: "Product",
            dataIndex: ["product", "name"],
            key: "product"
        },
        {
            title: "Quantity",
            dataIndex: "quantity",
            key: "quantity"
        },
        {
            title: "Unit",
            dataIndex: ["product", "unit"],
            key: "unit"
        }
    ]

    return (
        <div className="p-8">

            <Typography.Title level={2}>
                Order #{order.id}
            </Typography.Title>

            <Card style={{ marginBottom: 20 }}>

                <Descriptions column={1}>

                    <Descriptions.Item label="Shop">
                        {order.shop.name}
                    </Descriptions.Item>

                    <Descriptions.Item label="Created By">
                        {order.createdBy.fullname}
                    </Descriptions.Item>

                    <Descriptions.Item label="Status">
                        {order.status}
                    </Descriptions.Item>

                    <Descriptions.Item label="Created At">
                        {new Date(order.createdAt).toLocaleString()}
                    </Descriptions.Item>

                    <Descriptions.Item label="Accepted At">
                        {
                            order.acceptedAt
                                ? new Date(order.acceptedAt).toLocaleString()
                                : "-"
                        }
                    </Descriptions.Item>

                </Descriptions>

            </Card>

            <Card title="Products">

                <Table
                    rowKey={(item) =>
                        `${item.orderId}-${item.product.id}`
                    }
                    dataSource={order.items}
                    columns={columns}
                    pagination={false}
                />

            </Card>

            {
                order.status === "PENDING" && (
                    <Space
                        style={{
                            marginTop: 20
                        }}
                    >
                        <Button
                            type="primary"
                            onClick={handleAccept}
                        >
                            Accept
                        </Button>

                        <Button
                            danger
                            onClick={handleCancel}
                        >
                            Cancel
                        </Button>
                    </Space>
                )
            }

        </div>
    )
}
