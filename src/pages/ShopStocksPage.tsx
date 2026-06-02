import { useEffect, useState } from "react"
import type { ShopStock } from "../types/shopStock"
import { getStocks } from "../api/shop"
import { getShopId } from "../utils/jwt"
import type { Shop } from "../types/shop"
import { Button, Card, Input, Popover, Table, Typography } from "antd"
import SaveShopStockModal from "../components/shop/SaveShopStockModal"

export default function ShopStocksPage() {

    const shop_id: number = parseInt(getShopId(), 10)

    const [shop, setShop] = useState<Shop | null>(null)
    const [stocks, setStocks] = useState<ShopStock[]>([])
    const [search, setSearch] = useState("")

    const [saveOpen, setSaveOpen] = useState(false)
    const [selectedStock, setSelectedStock] = useState<ShopStock | null>(null)

    async function loadStocks() {

        const response = await getStocks(shop_id)

        setShop(response.data.shop)

        const stocks: ShopStock[] = response.data.items.map((stock: any) => ({
            productRaw: stock.product,
            product: stock.product.name,
            product_id: stock.product.id,
            shop_id: shop_id,
            units: stock.product.unit,
            min_quantity: stock.min_quantity,
            quantity: stock.quantity,
        }))

        console.log(stocks)

        setStocks(stocks)
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

                return (
                    <span
                        style={{
                            color: isLowStock ? "#ff4d4f" : "inherit",
                            fontWeight: isLowStock ? "bold" : "normal"
                        }}
                    >
                        {text}
                    </span>
                );
            }
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
                        style={{ marginRight: 8 }}
                    >
                        Update Min. Quantity
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
                </div>

                <Table
                    rowKey="product"
                    dataSource={filteredStocks}
                    columns={columns}
                    pagination={{
                        pageSize: 10
                    }}
                />

            </Card>

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
