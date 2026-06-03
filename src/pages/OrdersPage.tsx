import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import { api } from "../api/api"
import type { OrderShort } from "../types/orderShort"

import {
    Table,
    Input,
    Button,
    Typography
} from "antd"
import { getRole, getShopId } from "../utils/jwt"


export default function OrderPage() {

    const [orders, setOrders] = useState<OrderShort[]>([])

    const [search, setSearch] = useState("")

    const navigate = useNavigate()

    const role = getRole()?.toLowerCase()
    const shopId = getShopId()

    async function loadOrders() {
        let response

        if (role != "shopkeeper") {
            response = await api.get("/orders/all")
        } else {
            response = await api.get(`/orders/shop/${shopId}`)
        }

        const data = response.data

        const orders: OrderShort[] = data.items.map(order => ({
            id: order.id,
            shopName: order.toShop.name,
            createdBy: order.createdBy.fullname,
            status: order.status,
            createdAt: new Date(order.createdAt).toLocaleString(),
            acceptedAt: order.acceptedAt
                ? new Date(order.acceptedAt).toLocaleString() : "-"
        }))

        setOrders(orders)
    }

    useEffect(() => {
        loadOrders()
    }, [])

    async function exportToExcel() {

        const worksheet =
            XLSX.utils.json_to_sheet(filteredOrders);

        const workbook =
            XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(
            workbook,
            worksheet,
            "Orders"
        );

        const excelBuffer =
            XLSX.write(workbook, {
                bookType: "xlsx",
                type: "array"
            });

        const blob = new Blob(
            [excelBuffer],
            {
                type: "application/octet-stream"
            }
        );

        saveAs(
            blob,
            "orders_report.xlsx"
        );
    }


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
            key: "status",
            filters: [
                {
                    text: "Canceled",
                    value: "CANCELED"
                },
                {
                    text: "Accepted",
                    value: "ACCEPTED"
                },
                {
                    text: "Pending",
                    value: "PENDING"
                }
            ],

            onFilter: (value: string, record: OrderShort) =>

                record.status === value
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
                        style={{ marginLeft: 32 }}
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

                <div style={{ display: "flex", gap: 8 }}>
                    <Button
                        type="primary"
                        onClick={exportToExcel}
                    >
                        Export Excel
                    </Button>

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

            </div>

            <Table
                rowKey="id"
                dataSource={filteredOrders}
                columns={columns}
                pagination={{
                    pageSize: 10
                }}
            />

        </div>

    )

}


