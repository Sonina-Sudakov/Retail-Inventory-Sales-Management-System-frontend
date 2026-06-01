import { useEffect, useState } from "react"

import SaveProductModal from "../components/product/SaveProductModal"
import { api } from "../api/api"
import type { Product } from "../types/product"

import {
    Table,
    Input,
    Button,
    Card,
    Typography,
    Popconfirm
} from "antd"


export default function ProductPage() {

    const [products, setProducts] = useState<Product[]>([])

    const [search, setSearch] = useState("")

    const [saveOpen, setSaveOpen] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

    async function loadProducts() {

        const response = await api.get("/products/all")

        setProducts(response.data.items)
    }

    useEffect(() => {
        loadProducts()
    }, [])


    async function deleteProduct(id: number) {

        await api.delete(`/products?id=${id}`)

        await loadProducts()
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
            title: "Unit",
            dataIndex: "unit",
            key: "unit"
        },
        {
            title: "Type",
            dataIndex: "type",
            key: "type"
        },
        {
            title: "Price",
            dataIndex: "price",
            key: "price"
        },
        {
            title: "Origin",
            dataIndex: "origin",
            key: "origin"
        },

        {
            title: "Actions",
            key: "actions",
            render: (_: unknown, product: Product) => (
               <>
                <Button
                    onClick={() => {
                        setSelectedProduct(product)
                        setSaveOpen(true)
                    }}
                    style={{ marginRight: 8 }}
                >
                    Update Info
                </Button>

                <Popconfirm
                    title="Delete product?"
                    onConfirm={() => deleteProduct(product.id)}
                >
                    <Button danger>
                        Delete
                    </Button>
                </Popconfirm>
              </>            
            )
        }
    ]

   const filteredProducts = products.filter(product =>
        Object.values(product).some(value =>
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
                Products
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
                        placeholder="Search products"
                        value={search}
                        style={{ width: 500 }}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <Button
                        type="primary"
                        onClick={() => {
                            setSelectedProduct(null) 
                            setSaveOpen(true)
                        }}
                    >
                        Create Product
                    </Button>
                </div> 
                
                <Table
                    rowKey="id"
                    dataSource={filteredProducts}
                    columns={columns}
                    pagination={{
                        pageSize: 10
                    }}
                />

            </Card>

            <SaveProductModal
                open={saveOpen}
                product={selectedProduct}
                onClose={() => {
                    setSaveOpen(false)
                    setSelectedProduct(null)
                }}
                onSuccess={loadProducts}
            />

            </div>

    ) 

}

