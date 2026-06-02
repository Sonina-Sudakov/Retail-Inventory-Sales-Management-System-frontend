import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"

import { api } from "../api/api"
import type { ShipmentDetailed } from "../types/shipmentDetailed"

import {
    Card,
    Descriptions,
    Table,
    Button,
    Space,
    message,
    Popover
} from "antd"
import { getRole } from "../utils/jwt"

export default function ShipmentDetailsPage() {

    const { id } = useParams()
    const navigate = useNavigate()

    const [shipment, setShipment] = useState<ShipmentDetailed | null>(null)

    const role = getRole()?.toLowerCase()

    async function loadShipment() {

        const response = await api.get(`/shipments?id=${id}`)

        const data = response.data

        setShipment({
            id: data.id,
            shop: data.to_shop,
            createdBy: data.created_by,
            status: data.status,
            createdAt: data.created_at,
            updatedAt: data.updated_at,
            items: data.items
        })
    }

    useEffect(() => {
        loadShipment()
    }, [id])

    async function handleCancel() {
        try {
            await api.put(`/shipments/${id}/cancel`)
            message.success("Shipment canceled")
            await loadShipment()
        }
        catch (error: any) {
            message.error(error.response?.data?.message)
        }
    }

    async function handleAccept() {
        navigate(`/warehouse/shipments/create/${id}`)
    }

    if (!shipment) {
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

            <Button
                type="link"
                onClick={() => navigate(`/${role}/shipments`)}
                style={{
                    padding: 0,
                    marginBottom: 16,
                    display: 'flex',
                    justifyContent: 'flex-start'
                }}
            >
                ← Back to Shipments
            </Button>

            <Card
                title={`Shipment №${shipment.id}`}
                style={{ marginBottom: 20 }}
                styles={{
                    header: {
                        textAlign: "left" as const
                    }
                }}
            >

                <Descriptions column={1}>

                    <Descriptions.Item label="Shop">
                        {shipment.shop ? (
                            <Popover
                                title="Shop Information"
                                content={
                                    <div>
                                        <div>Contact Face: {shipment.shop.contact_face}</div>
                                        <div>Address: {shipment.shop.address}</div>
                                        <div>Email: {shipment.shop.email}</div>
                                        <div>Phone: {shipment.shop.phone_number}</div>
                                    </div>
                                }
                            >
                                <a>{shipment.shop.name}</a>
                            </Popover>
                        ) : (
                            "Warehouse"
                        )}
                    </Descriptions.Item>

                    <Descriptions.Item label="Created By">
                        <Popover
                            title="User Information"
                            content={
                                <div>
                                    <div>Username: {shipment.createdBy.username}</div>
                                    <div>Role: {shipment.createdBy.role}</div>
                                </div>
                            }
                        >
                            <a>{shipment.createdBy.fullname}</a>
                        </Popover>
                    </Descriptions.Item>

                    <Descriptions.Item label="Status">
                        {shipment.status}
                    </Descriptions.Item>

                    <Descriptions.Item label="Created At">
                        {new Date(shipment.createdAt).toLocaleString()}
                    </Descriptions.Item>

                    <Descriptions.Item label="Updated At">
                        {
                            shipment.updatedAt
                                ? new Date(shipment.updatedAt).toLocaleString()
                                : "-"
                        }
                    </Descriptions.Item>

                </Descriptions>

            </Card>

            <Card title="Products">

                <Table
                    rowKey={(item) => item.product.id}
                    dataSource={shipment.items}
                    columns={columns}
                    pagination={false}
                />

            </Card>

            {shipment.status === "PENDING" && (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        marginTop: 20
                    }}
                >
                    <Space>

                        {role === "storekeeper" && (
                            <Button
                                type="primary"
                                onClick={handleAccept}
                            >
                                Accept
                            </Button>
                        )}

                        {role !== "admin" && (
                            <Button
                                danger
                                onClick={handleCancel}
                            >
                                Cancel
                            </Button>
                        )}

                    </Space>
                </div>
            )}
        </div>
    )
}

