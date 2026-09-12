import { useEffect, useState } from "react"

import SaveShopModal from "../components/shop/SaveShopModal"
import { api } from "../api/api"
import type { Shop } from "../types/shop"

import {
    Table,
    Input,
    Button,
    Typography,
    Popconfirm
} from "antd"


export default function ShopPage() {

    const [shops, setShops] = useState<Shop[]>([])

    const [search, setSearch] = useState("")

    const [saveOpen, setSaveOpen] = useState(false)
    const [selectedShop, setSelectedShop] = useState<Shop | null>(null)

    async function loadShops() {

        const response = await api.get("/shops/all")

        const shops: Shop[] = response.data.items.map((shop: any) => ({
            id: shop.id,
            name: shop.name,
            address: shop.address,
            contactFace: shop.contactFace,
            phoneNumber: shop.phoneNumber,
            email: shop.email
        }))

        setShops(shops)
    }

    useEffect(() => {
        loadShops()
    }, [])


    async function deleteShop(id: number) {

        await api.delete(`/shops?id=${id}`)

        await loadShops()
    }


    const columns = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id"
        },
        {
            title: "Name",
            dataIndex: "name",
            key: "name"
        },
        {
            title: "Adress",
            dataIndex: "address",
            key: "address"
        },
        {
            title: "Contact Face",
            dataIndex: "contactFace",
            key: "contactFace"
        },
        {
            title: "Phone Number",
            dataIndex: "phoneNumber",
            key: "phoneNumber"
        },
        {
            title: "E-mail",
            dataIndex: "email",
            key: "email"
        },

        {
            title: "Actions",
            key: "actions",
            render: (_: unknown, shop: Shop) => (
                <>
                    <Button
                        onClick={() => {
                            console.log("CREATE CLICK")
                            setSelectedShop(shop)
                            setSaveOpen(true)
                        }}
                        style={{ marginRight: 8, marginLeft: 32 }}
                    >
                        Update Info
                    </Button>

                    <Popconfirm
                        title="Delete shop?"
                        onConfirm={() => deleteShop(shop.id)}
                    >
                        <Button danger>
                            Delete
                        </Button>
                    </Popconfirm>
                </>
            )
        }
    ]

    const filteredShops = shops.filter(shop =>
        Object.values(shop).some(value =>
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
                Shops
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
                    placeholder="Search shops"
                    value={search}
                    style={{ width: 500 }}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <Button
                    type="primary"
                    onClick={() => {
                        setSelectedShop(null)
                        setSaveOpen(true)
                    }}
                >
                    Create Shop
                </Button>
            </div>

            <Table
                rowKey="id"
                dataSource={filteredShops}
                columns={columns}
                pagination={{
                    pageSize: 10
                }}
            />


            <SaveShopModal
                open={saveOpen}
                shop={selectedShop}
                onClose={() => {
                    setSaveOpen(false)
                    setSelectedShop(null)
                }}
                onSuccess={loadShops}
            />

        </div>

    )

}
