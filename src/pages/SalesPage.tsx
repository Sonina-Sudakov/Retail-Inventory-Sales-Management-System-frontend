import { useEffect, useState } from "react"
import type { SaleShort } from "../types/saleShort"
import { useNavigate } from "react-router-dom"
import { api } from "../api/api"
import { Button, Input, Table, Typography } from "antd"
import { getRole, getShopId } from "../utils/jwt"

export default function SalesPage() {

    const [sales, setSales] = useState<SaleShort[]>([])

    const [search, setSearch] = useState("")
    const navigate = useNavigate()

    const shopId = getShopId()
    const role = getRole()

    async function loadSales() {
        let response

        if (role === "ADMIN") {
            response = await api.get(`/sales/all`)
        } else {
            response = await api.get(`/sales/shop/${shopId}`)
        }

        const data = response.data

        const sales: SaleShort[] = data.items.map((sale: any) => ({
            id: sale.id,
            shop: sale.shop,
            createdBy: sale.user.fullname,
            createdAt: new Date(sale.createdAt).toLocaleString(),
        }))

        setSales(sales)
    }

    useEffect(() => {
        loadSales()
    }, [])

    function useSaleColumns(isAdmin: boolean) {
        const navigate = useNavigate();

        const allColumns = [
            {
                title: 'ID',
                dataIndex: 'id',
                key: 'id'
            },
            {
                title: 'Shop Name',
                dataIndex: 'shop',
                key: 'shop',
                isAdminOnly: true
            },
            {
                title: 'Created By User',
                dataIndex: 'createdBy',
                key: 'createdBy'
            },
            {
                title: 'Created At',
                dataIndex: 'createdAt',
                key: 'createdAt'
            },
            {
                title: 'Actions',
                key: 'actions',
                render: (_: unknown, sale: SaleShort) => (
                    <Button
                        style={{ marginLeft: 8 }}
                        type="primary"
                        onClick={() => navigate(`${sale.id}`)}>
                        Details
                    </Button>
                )
            }
        ]

        return allColumns.filter(column => !column.isAdminOnly || isAdmin);
    }

    const filteredSales = sales.filter(order =>
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
                Sales
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
                    placeholder="Search sales"
                    value={search}
                    style={{ width: 500 }}
                    onChange={(e) => setSearch(e.target.value)}
                />
                {role === "SHOPKEEPER" && (
                    <Button
                        type="primary"
                        onClick={() => {
                            navigate(`create`)
                        }}
                    >
                        Create Sale
                    </Button>
                )}
            </div>

            <Table
                rowKey="id"
                dataSource={filteredSales}
                columns={useSaleColumns(role === "ADMIN")}
                pagination={{
                    pageSize: 10
                }}
            />
        </div>
    )
}
