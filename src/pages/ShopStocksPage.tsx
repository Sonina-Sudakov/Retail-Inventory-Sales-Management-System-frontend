import { useEffect, useState } from "react"
import * as XLSX from "xlsx"
import { saveAs } from "file-saver"

import type { ShopStock } from "../types/shopStock"
import { getStocks } from "../api/shop"
import { getShopId } from "../utils/jwt"
import { Button, Input, Popover, Table, Typography } from "antd"
import SaveShopStockModal from "../components/shop/SaveShopStockModal"

export default function ShopStocksPage() {

    const shopId: number = parseInt(getShopId(), 10)

    const [stocks, setStocks] = useState<ShopStock[]>([])
    const [search, setSearch] = useState("")

    const [saveOpen, setSaveOpen] = useState(false)
    const [selectedStock, setSelectedStock] = useState<ShopStock | null>(null)

    async function loadStocks() {

        const response = await getStocks(shopId)

        const stocks: ShopStock[] = response.data.items.map((stock: any) => ({
            productRaw: stock.product,
            shop_id: shopId,
            product_id: stock.product.id,
            product: stock.product.name,
            units: stock.product.unit,
            type: stock.product.type,
            price: stock.product.price,

            min_quantity: stock.minQuantity,
            quantity: stock.quantity
        }))

        console.log(stocks)

        setStocks(stocks)
    }


    async function createCertificate(stock: ShopStock) {

        const data = [
            {
                Shop: shop.name,
                Product: stock.product,
                Type: stock.type,
                Unit: stock.units,
                Price: stock.price,
                Quantity: stock.quantity,
                MinQuantity: stock.minQuantity,
                GeneratedAt: new Date().toLocaleString()
            }
        ]

        const worksheet =
            XLSX.utils.json_to_sheet(data)

        const workbook =
            XLSX.utils.book_new()

        XLSX.utils.book_append_sheet(
            workbook,
            worksheet,
            "Certificate"
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
            `shop_certificate_${stock.product}.xlsx`
        )
    }

    useEffect(() => {
        loadStocks()
    }, [])

    const columns = [
        {
            title: "Product",
            dataIndex: "product",
            key: "product",
            render: (text: string, record: any) => (
                <Popover
                    title="Product Information"
                    content={
                        <div>
                            <div>ID: {record.productRaw.id}</div>
                            <div>Name: {record.productRaw.name}</div>
                            <div>Units: {record.productRaw.unit}</div>
                            <div>Type: {record.productRaw.type}</div>
                            <div>Price: {`${record.productRaw.price} ₽`}</div>
                        </div>
                    }
                    trigger="hover"
                >
                    <a>{text}</a>
                </Popover>
            )
        },
        {
            title: "Units",
            dataIndex: "units",
            key: "units"
        },
        {
            title: "Quantity",
            dataIndex: "quantity",
            key: "quantity",
            render: (text: number, record: any) => {
                const isLowStock = record.quantity < record.min_quantity;
                const isGreatStock = record.quantity >= record.min_quantity * 2;

                return (
                    <span
                        style={{
                            color: isLowStock ? "#ff4d4f" : isGreatStock ? "#00cc00" : "inherit",
                            fontWeight: isLowStock || isGreatStock ? "bold" : "normal"
                        }}
                    >
                        {text}
                    </span>
                );
            },
            sorter: (a: any, b: any) => a.quantity - b.quantity
        },
        {
            title: "Min. Quantity",
            dataIndex: "min_quantity",
            key: "min_quantity"
        },
        {
            title: "Actions",
            key: "actions",
            render: (_: unknown, stock: ShopStock) => (
                <>
                    <Button
                        onClick={() => {
                            setSelectedStock(stock)
                            setSaveOpen(true)
                        }}
                        style={{ marginRight: 8, marginLeft: 40 }}
                    >
                        Update Min. Quantity
                    </Button>
                    <Button
                        onClick={() => createCertificate(stock)}
                    >
                        Certificate
                    </Button>
                </>
            )
        }
    ]

    const filteredStocks = stocks.filter(stock => {

        const foundInProduct =
            stock.product
                .toLowerCase()
                .includes(search.toLowerCase())

        return foundInProduct
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
            </div>

            <Table
                rowKey="product"
                dataSource={filteredStocks}
                columns={columns}
                pagination={{
                    pageSize: 10
                }}
            />

            <SaveShopStockModal
                open={saveOpen}
                stock={selectedStock}
                onClose={() => {
                    setSaveOpen(false)
                    setSelectedStock(null)
                }}
                onSuccess={loadStocks}
            />
        </div>
    )
}
