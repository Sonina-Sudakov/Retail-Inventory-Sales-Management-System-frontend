import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"

import {
    Form,
    Button,
    Space,
    InputNumber,
    Select,
    Card,
    message,
    Popover
} from "antd"

import { api } from "../api/api"
import type { Product } from "../types/product"
import { getRole, getUserId } from "../utils/jwt"
import type { User } from "../types/user"
import { getUser } from "../api/user"
import SaveProductModal from "../components/product/SaveProductModal"


export default function CreateShipmentForStorePage() {

    const [form] = Form.useForm()

    const navigate = useNavigate()

    const [products, setProducts] = useState<Product[]>([])
    const [createProductOpen, setCreateProductOpen] = useState(false)
    const [user, setUser] = useState<User | null>(null) 
    
    const items = Form.useWatch("items", form) || []

    const selectedProductIds = items
        .map((item: any) => item?.productId)
        .filter(Boolean)

    const role = getRole()?.toLowerCase()
    const user_id = getUserId()

    useEffect(() => {
        loadUser()
        loadProducts()
    }, [])

    useEffect(() => {
        form.setFieldsValue({
            items: [{}]
        })
    }, [])


    async function loadProducts() {

        const response = await api.get("/products/all")

        const products: Product[] = response.data.items.map((product: any) => ({
            id: product.id,
            name: product.name,
            unit: product.unit,
            type: product.type,
            price: product.price,
            origin: product.origin
        }))

        setProducts(products)
    }

    async function loadUser() {
        const response = await getUser(user_id)

        setUser(response.data)
    }

    async function handleSubmit(values: any) {

        const request = {
            from_location: "SUPPLIER",
            to_shop_id: null,
            created_by_id: user_id,
            items: values.items.map((item: any) => ({
                product_id: item.productId,
                quantity: item.quantity
            }))
        }

        try {
            const response = await api.post(
                "/shipments/",
                request
            )

            message.success("Shipment created")

            navigate(`/${role}/shipments/${response.data.id}`)

        } catch (error: any) {

            message.error(
                error.response?.data?.message ??
                "Unknown error"
            )
        }
    }

    return (

        <div>
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
                title="Create Shipment"
                styles={{
                    header: {
                        textAlign: "left"
                    }
                }}
            >
                <div
                    style={{
                        padding: 24,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start"
                    }}
                >

                    <p>
                        <strong>Created by: </strong>
                        {user ? (
        <Popover
                                title="User Information"
                                content={
                                    <div>
                                        <div>ID: {user.id}</div>
                                        <div>Username: {user.username}</div>
                                        <div>Name: {user.fullname}</div>
                                        <div>Role: {user.role}</div>
                                    </div>
                                }
                                trigger="hover"
                            >
                                <a>{user.fullname}</a>
                            </Popover>
                        ) :
                            <span>Loading user...</span>
                        }
                    </p>

                </div>

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                >

                    <Form.List name="items">

                        {(fields, { add, remove }) => (
                            <Space
                                orientation="vertical"
                                style={{ width: "100%" }}
                            >
                                {fields.map(field => {

                                    const { key, ...restField } = field;

                                    return (
                                        <Space
                                            key={field.key}
                                            align="center"
                                        >

                                            <Form.Item
                                                {...restField}
                                                label="Product"
                                                name={[field.name, "productId"]}
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: "Select product"
                                                    }
                                                ]}
                                            >
                                                <Select
                                                    style={{ width: 250 }}
                                                    options={products
                                                        .filter(product =>
                                                            !selectedProductIds.includes(product.id) ||
                                                            product.id === form.getFieldValue([
                                                                "items",
                                                                field.name,
                                                                "productId"
                                                            ])
                                                        )
                                                        .map(product => ({
                                                            value: product.id,
                                                            label: `${product.name} (#${product.id})`
                                                        }))
                                                    }
                                                />
                                            </Form.Item>

                                            <div style={{ minWidth: 80 }}>
                                                {
                                                    products.find(
                                                        p =>
                                                            p.id ===
                                                            form.getFieldValue([
                                                                "items",
                                                                field.name,
                                                                "productId"
                                                            ])
                                                    )?.unit
                                                }
                                            </div>

                                            <Form.Item
                                                {...restField}
                                                label="Quantity"
                                                name={[field.name, "quantity"]}
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: "Enter quantity"
                                                    }
                                                ]}
                                            >
                                                <InputNumber min={1} />
                                            </Form.Item>

                                            <Button
                                                danger
                                                disabled={fields.length === 1}
                                                onClick={() => remove(field.name)}
                                            >
                                                Delete
                                            </Button>

                                        </Space>
                                    )
                                })}

                                <Form.Item>
                                    <Button
                                        type="dashed"
                                        onClick={() => add()}
                                        style={{ marginRight: 8 }}
                                    >
                                        Add Product
                                    </Button>

                                    <Button
                                        type="dashed"
                                        onClick={() => setCreateProductOpen(true)}
                                    >
                                        Create New Product
                                    </Button>
                                </Form.Item>

                            </Space>
                        )}

                    </Form.List>

                    <Button
                        type="primary"
                        htmlType="submit"
                        disabled={!items.length}
                    >
                        Create Shipment
                    </Button>

                </Form>

            </Card>

            <SaveProductModal
                open={createProductOpen}
                product={null}
                onClose={() => setCreateProductOpen(false)}
                onSuccess={async () => {
                    await loadProducts()
                }} 
            />
        </div>
    )
}
