import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"

import { api } from "../api/api"
import type { SaleDetailed } from "../types/saleDetailed"

import {
    Card,
    Descriptions,
    Table,
    Button,
    Popover
} from "antd"
import { getRole } from "../utils/jwt"

export default function SaleDetailsPage() {

    const { id } = useParams()
    const navigate = useNavigate()

    const [sale, setSale] = useState<SaleDetailed | null>(null)

    const role = getRole()?.toLowerCase()

    const totalPrice = sale
        ? sale.items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        )
        : 0

    async function loadSale() {

        const response = await api.get(`/sales?id=${id}`)

        const data = response.data

        setSale({
            id: data.id,
            shop: data.shop,
            user: data.user,
            created_at: data.createdAt,
            items: data.items
        })
    }

    useEffect(() => {
        loadSale()
    }, [id])

    if (!sale) {
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
        },
        {
            title: "Price",
            dataIndex: "price",
            key: "price"
        },
        {
            title: "Total",
            dataIndex: "total_price",
            key: "total_price",
            render: (_: any, record: any) => record.price * record.quantity
        }
    ]

    return (
        <div className="p-8">

            <Button
                type="link"
                onClick={() => navigate(`/${role}/sales`)}
                style={{
                    padding: 0,
                    marginBottom: 16,
                    display: 'flex',
                    justifyContent: 'flex-start'
                }}
            >
                ← Back to Sales
            </Button>

            <Card
                title={`Sale №${sale.id}`}
                style={{ marginBottom: 20 }}
                styles={{
                    header: {
                        textAlign: "left" as const
                    }
                }}
            >

                <Descriptions column={1}>

                    <Descriptions.Item label="Shop">
                        <Popover
                            title="Shop Information"
                            content={
                                <div>
                                    <div>Contact Face: {sale.shop.contactFace}</div>
                                    <div>Address: {sale.shop.address}</div>
                                    <div>Email: {sale.shop.email}</div>
                                    <div>Phone: {sale.shop.phoneNumber}</div> </div>
                            }
                        >
                            <a>{sale.shop.name}</a>
                        </Popover>
                    </Descriptions.Item>

                    <Descriptions.Item label="Created By">
                        <Popover
                            title="User Information"
                            content={
                                <div>
                                    <div>Username: {sale.user.username}</div>
                                    <div>Role: {sale.user.role}</div>
                                </div>
                            }
                        >
                            <a>{sale.user.fullname}</a>
                        </Popover>
                    </Descriptions.Item>

                    <Descriptions.Item label="Created At">
                        {new Date(sale.created_at).toLocaleString()}
                    </Descriptions.Item>

                    <Descriptions.Item label="Total">
                        {
                            totalPrice
                        }
                    </Descriptions.Item>

                </Descriptions>

            </Card>

            <Card title="Products">

                <Table
                    rowKey={(item) =>
                        `${item.saleId}-${item.product.id}`
                    }
                    dataSource={sale.items}
                    columns={columns}
                    pagination={false}
                />

            </Card>
        </div>
    )
}
