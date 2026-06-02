import { useEffect, useState } from "react"
import * as XLSX from "xlsx"
import { saveAs } from "file-saver"

import CreateCellModal from "../components/warehouse/CreateCellModal"
import ChangeCellCodeModal from "../components/warehouse/ChangeCellCodeModal"
import StoreProductModal from "../components/warehouse/StoreProductModal"
import SwapProductsModal from "../components/warehouse/SwapProductsModal"

import {
    Table,
    Input,
    Button,
    Card,
    Space,
    Typography,
    Popconfirm
} from "antd"

import type { WarehouseStock } from "../types/warehouseStock"
import { getStocks, deleteStock, clearStock } from "../api/warehouse"
import { api } from "../api/api"


export default function WarehouseStocksPage() {

    const [stocks, setStocks] = useState<WarehouseStock[]>([])
    const [createOpen, setCreateOpen] = useState<boolean>(false)
    const [storeOpen, setStoreOpen] = useState<boolean>(false)
    const [swapOpen, setSwapOpen] = useState<boolean>(false)
    const [cellCodeOpen, setCellCodeOpen] = useState<boolean>(false)
    const [selectedStock, setSelectedStock] = useState<WarehouseStock | null>(null)
    const [search, setSearch] = useState("")

    async function loadStocks() {

        const response = await getStocks()

        const stocks: WarehouseStock[] = response.data.items.map((stock: any) => ({
            id: stock.id,
            cell_code: stock.cell_code,
            product_id: stock.product?.id,
            product: stock.product?.name ?? "-",
            quantity: stock.quantity
        }))

        setStocks(stocks)
    }


    async function createCertificate(stock: WarehouseStock) {

        if (!stock.product_id) {
            return
        }

        const response = await api.get(
            `/warehouse/product?id=${stock.product_id}`
        )

        const data = response.data

        const summary = [
            {
                Product: data.product.name,
                Unit: data.product.unit,
                Type: data.product.type,
                TotalQuantity: data.total_quantity,
                GeneratedAt: new Date().toLocaleString()
            }
        ]

        const locations = data.items.map((item: any) => ({
            CellCode: item.cell_code,
            Quantity: item.quantity
        }))

        const workbook = XLSX.utils.book_new()

        const summarySheet =
            XLSX.utils.json_to_sheet(summary)

        XLSX.utils.book_append_sheet(
            workbook,
            summarySheet,
            "Summary"
        )

        const locationsSheet =
            XLSX.utils.json_to_sheet(locations)

        XLSX.utils.book_append_sheet(
            workbook,
            locationsSheet,
            "Locations"
        )

        const excelBuffer =
            XLSX.write(workbook, {
                bookType: "xlsx",
                type: "array"
            })

        const blob = new Blob(
            [excelBuffer],
            {
                type:
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            }
        )

        saveAs(
            blob,
            `warehouse_certificate_${data.product.name}.xlsx`
        )
    }


    useEffect(() => {
        loadStocks()
    }, [])

    const columns = [
        {
            title: "Cell code",
            dataIndex: "cell_code",
            key: "cell_code"
        },
        {
            title: "Product",
            dataIndex: "product",
            key: "product"
        },
        {
            title: "Quantity",
            dataIndex: "quantity",
            key: "quantity",
        },
        {
            title: "Actions",
            key: "actions",
            render: (_: unknown, stock: WarehouseStock) => (
                <Space>
                    <Button
                        onClick={() => {
                            setSelectedStock(stock)
                            setStoreOpen(true)
                        }}
                    >
                        Store
                    </Button>

                    <Button
                        onClick={() => {
                            setSelectedStock(stock)
                            setCellCodeOpen(true)
                        }}
                    >
                        Change Cell
                    </Button>

                    <Button
                        onClick={() => {
                            setSelectedStock(stock)
                            setSwapOpen(true)
                        }}
                    >
                        Swap
                    </Button>

                    <Popconfirm
                        title="Clear cell?"
                        onConfirm={async () => {
                            await clearStock(stock.id)
                            loadStocks()
                        }}
                    >
                        <Button>
                            Clear
                        </Button>
                    </Popconfirm>

                    <Popconfirm
                        title="Delete cell?"
                        onConfirm={async () => {
                            await deleteStock(stock.id)
                            loadStocks()
                        }}
                    >
                        <Button danger>
                            Delete
                        </Button>
                    </Popconfirm>

                    <Button
                        onClick={() => createCertificate(stock)}
                    >
                        Certificate
                    </Button>

                </Space>
            )
        }
    ]

    const filteredStocks = stocks.filter(stock => {

        const foundInCellCode =
            stock.cell_code
                .toLowerCase()
                .includes(search.toLowerCase())

        const foundInProduct =
            stock.product
                .toLowerCase()
                .includes(search.toLowerCase())

        return foundInCellCode || foundInProduct
    })

    return (
        <div className="p-8">

            <Typography.Title
                level={1}
                style={{
                    textAlign: "left",
                    marginBottom: 16
                }}
            >
                Stocks
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
                        placeholder="Search stocks"
                        value={search}
                        style={{ width: 500 }}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <Button
                        type="primary"
                        onClick={() => {
                            setCreateOpen(true)
                        }}
                    >
                        Create Cell
                    </Button>
                </div>

                <Table
                    rowKey="id"
                    dataSource={filteredStocks}
                    columns={columns}
                    pagination={{
                        pageSize: 10
                    }}
                />

            </Card>

            <CreateCellModal
                open={createOpen}
                onClose={() => setCreateOpen(false)}
                onSuccess={loadStocks}
            />

            <ChangeCellCodeModal
                stock={selectedStock}
                open={cellCodeOpen}
                onClose={() => setCellCodeOpen(false)}
                onSuccess={loadStocks}
            />

            <StoreProductModal
                stock={selectedStock}
                open={storeOpen}
                onClose={() => setStoreOpen(false)}
                onSuccess={loadStocks}
            />

            <SwapProductsModal
                stock={selectedStock}
                stocks={stocks}
                open={swapOpen}
                onClose={() => setSwapOpen(false)}
                onSuccess={loadStocks}
            />

        </div>

    )

}
