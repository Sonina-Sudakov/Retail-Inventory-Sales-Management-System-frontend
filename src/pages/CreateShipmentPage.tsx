import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"

import {
    Card,
    Descriptions,
    Table,
    Button,
    message,
    Popover,
    InputNumber
} from "antd"
import type { OrderDetailed } from "../types/orderDetailed"
import { api } from "../api/api"
import type { ShipmentItem } from "../types/shipmentItem"
import { getRole, getUserId } from "../utils/jwt"

export default function CreateShipmentPage() {

    const { id } = useParams()
    const navigate = useNavigate()

    const [order, setOrder] = useState<OrderDetailed | null>(null)

    const [shipmentItems, setShipmentItems] = useState<ShipmentItem[]>([])
    const user_id = getUserId()

    const role = getRole()

    const columns = [
        {
            title: "Product",
            dataIndex: "productName",
            key: "productName"
        },
        {
            title: "Unit",
            dataIndex: "unit",
            key: "unit"
        },
        {
            title: "Requested",
            dataIndex: "requestedQuantity",
            key: "requestedQuantity"
        },
        {
            title: "Available",
            dataIndex: "availableQuantity",
            key: "availableQuantity"
        },
        {
            title: "Shipment Quantity",
            key: "shipmentQuantity",
            render: (_: any, record: any) => (
                <InputNumber
                    min={0}
                    max={record.availableQuantity}
                    value={record.shipmentQuantity}
                    onChange={(value) => {
                        setShipmentItems(items =>
                            items.map(item =>
                                item.product.id === record.product.id
                                    ? {
                                        ...item,
                                        shipmentQuantity: value ?? 0
                                    }
                                    : item
                            )
                        )
                    }}
                />
            )
        },
        {
            title: "Actions",
            key: "actions",
            render: (_: any, record: any) => (
                <Button
                    danger
                    onClick={() =>
                        setShipmentItems(items =>
                            items.filter(
                                item =>
                                    item.product.id !== record.product.id
                            )
                        )
                    }
                >
                    Delete
                </Button>
            )
        }
    ]

    useEffect(() => {
        loadOrder()
    }, [id])

    useEffect(() => {
        if (order) {
            loadShipmentItems()
        }
    }, [order])

    async function loadOrder() {

        const response = await api.get(`/orders?id=${id}`)

        const data = response.data

        setOrder({
            id: data.id,
            shop: data.toShop,
            createdBy: data.createdBy,
            status: data.status,
            createdAt: data.createdAt,
            acceptedAt: data.acceptedAt,
            items: data.items
        })
    }


    async function loadShipmentItems() {

        if (!order) {
            return
        }

        const items = await Promise.all(
            order.items.map(async item => {

                const response = await api.get(
                    `/warehouse/product?id=${item.product.id}`
                )

                return {
                    product: item.product,
                    productName: item.product.name,
                    unit: item.product.unit,
                    requestedQuantity: item.quantity,
                    availableQuantity: response.data.totalQuantity,
                    shipmentQuantity: Math.min(
                        item.quantity,
                        response.data.totalQuantity
                    )
                }
            })
        )

        setShipmentItems(items)
    }


    async function handleCreateShipment() {

        if (!order) {
            return
        }

        const request = {
            from_location: "WAREHOUSE",
            to_shop_id: order.shop.id,
            created_by_id: user_id,
            items: shipmentItems.map(item => ({
                product_id: item.product.id,
                quantity: item.shipmentQuantity
            }))
        }

        try {
            const response = await api.post(
                "/shipments/",
                request
            )

            await api.put(
                `orders/${order.id}/accept`
            )

            message.success("Shipment created")

            navigate(`/${role}/shipments/${response.data.id}`)

        } catch (error: any) {

            message.error(
                error.response?.data?.message ??
                "Unknown error"
            )
        }
    }

    if (!order) {
        return <div>Loading...</div>
    }

    return (
        <div className="p-8">

            <Button
                type="link"
                onClick={() => navigate(`/${role}/orders/${id}`)}
                style={{
                    padding: 0,
                    marginBottom: 16,
                    display: 'flex',
                    justifyContent: 'flex-start'
                }}
            >
                ← Back to Order
            </Button>

            <Card
                title="Shipment"
                style={{ marginBottom: 20 }}
                styles={{
                    header: {
                        textAlign: "left" as const
                    }
                }}
            >

                <Descriptions column={1}>

                    <Descriptions.Item label="Order №">
                        {order.id}
                    </Descriptions.Item>

                    <Descriptions.Item label="Shop">
                        <Popover
                            title="Shop Information"
                            content={
                                <div>
                                    <div>Contact Face: {order.shop.contactFace}</div>
                                    <div>Address: {order.shop.address}</div>
                                    <div>Email: {order.shop.email}</div>
                                    <div>Phone: {order.shop.phoneNumber}</div>
                                </div>
                            }
                        >
                            <a>{order.shop.name}</a>
                        </Popover>
                    </Descriptions.Item>

                    <Descriptions.Item label="Created By">
                        <Popover
                            title="User Information"
                            content={
                                <div>
                                    <div>Username: {order.createdBy.username}</div>
                                    <div>Role: {order.createdBy.role}</div>
                                </div>
                            }
                        >
                            <a>{order.createdBy.fullname}</a>
                        </Popover>
                    </Descriptions.Item>

                    <Descriptions.Item label="Created At">
                        {new Date(order.createdAt).toLocaleString()}
                    </Descriptions.Item>

                </Descriptions>

            </Card>

            <Card
                title="Shipment Items"
                style={{ marginBottom: 20 }}
            >
                <Table
                    rowKey={(record) => record.product.id}
                    columns={columns}
                    dataSource={shipmentItems}
                    pagination={false}
                />
            </Card>

            <div
                style={{
                    display: "flex",
                    justifyContent: "flex-end"
                }}
            >
                <Button
                    type="primary"
                    onClick={handleCreateShipment}
                    disabled={shipmentItems.length === 0}
                >
                    Create Shipment
                </Button>
            </div>

        </div>
    )
}
