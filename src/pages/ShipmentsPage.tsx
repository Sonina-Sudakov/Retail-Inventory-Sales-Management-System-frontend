import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import { api } from "../api/api"
import type { ShipmentShort } from "../types/shipmentShort"

import {
    Table,
    Input,
    Button,
    Card,
    Typography,
    message
} from "antd"
import { getRole, getShopId, getUserId } from "../utils/jwt"


export default function ShipmentPage() {

    const [shipments, setShipments] = useState<ShipmentShort[]>([])

    const [search, setSearch] = useState("")

    const navigate = useNavigate()

    const role = getRole()?.toLowerCase()
    const userId = getUserId()
    const shopId = getShopId()

    async function loadShipments() {
        let response

        if (role != "shopkeeper") {
            response = await api.get("/shipments/all")
        } else {
            response = await api.get(`/shipments/shop?id=${shopId}`)
        }

        const data = response.data

        const shipments: ShipmentShort[] = data.items.map(shipment => ({
            id: shipment.id,
            fromLocation: shipment.from_location,
            toLocation: shipment.to_shop ? shipment.to_shop.name : "Warehouse",
            createdBy: shipment.created_by.fullname,
            status: shipment.status,
            createdAt: new Date(shipment.created_at).toLocaleString(),
            updatedAt: shipment.updated_at
                ? new Date(shipment.updated_at).toLocaleString() : "-"
        }))

        setShipments(shipments)
    }

    useEffect(() => {
        loadShipments()
    }, [])


    async function handleAccept(shipmentId: number) {
        try {
            await api.put(
                `/shipments/accept?shipment_id=${shipmentId}&user_id=${userId}`
            )

            message.success("Shipment accepted")

            await loadShipments()
        }
        catch (error: any) {
            message.error(
                error.response?.data?.message ??
                "Unknown error"
            )
        }
    }

    async function exportToExcel() {

        const worksheet =
            XLSX.utils.json_to_sheet(filteredShipments);

        const workbook =
            XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(
            workbook,
            worksheet,
            "Shipments"
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
            "shipments_report.xlsx"
        );
    }


    const columns = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id"
        },
        {
            title: "From Location",
            dataIndex: "fromLocation",
            key: "fromLocation"
        },
        {
            title: "To Location",
            dataIndex: "toLocation",
            key: "toLocation"
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
                    text: "Created",
                    value: "CREATED"
                },
                {
                    text: "Accepted",
                    value: "ACCEPTED"
                },
                {
                    text: "Canceled",
                    value: "CANCELED"
                }
            ]
        },
        {
            title: "Created At",
            dataIndex: "createdAt",
            key: "createdAt"
        },
        {
            title: "Updated At",
            dataIndex: "updatedAt",
            key: "updatedAt"
        },

        {
            title: "Actions",
            key: "actions",
            render: (_: unknown, shipment: ShipmentShort) => (
                <>
                    <Button
                        onClick={() => navigate(`${shipment.id}`)}
                        style={{ marginRight: 8 }}
                    >
                        Details
                    </Button>

                    {role === "shopkeeper" &&
                        shipment.status === "CREATED" && (
                            <Button
                                type="primary"
                                onClick={() => handleAccept(shipment.id)}
                            >
                                Accept
                            </Button>
                        )}
                </>
            )
        }
    ]

    const filteredShipments = shipments.filter(shipment =>
        Object.values(shipment).some(value =>
            String(value).toLowerCase().includes(search.toLowerCase())
        )
    )

    console.log(filteredShipments)

    return (
        <div className="p-8">

            <Typography.Title
                level={1}
                style={{
                    textAlign: "left",
                    marginBottom: 16
                }}
            >
                Shipments
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
                        placeholder="Search shipments"
                        value={search}
                        style={{ width: 500 }}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <Button
                        type="primary"
                        onClick={exportToExcel}
                    >
                        Export Excel
                    </Button>

                    {role === "storekeeper" && (
                        <Button
                            type="primary"
                            onClick={() => {
                                navigate(`create`)
                            }}
                        >
                            Create Shipment
                        </Button>
                    )}

                </div>

                <Table
                    rowKey="id"
                    dataSource={filteredShipments}
                    columns={columns}
                    pagination={{
                        pageSize: 10
                    }}
                />

            </Card>

        </div>

    )

}


