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
import { getRole, getShopId, getUserId } from "../utils/jwt"
import type { User } from "../types/user"
import type { Shop } from "../types/shop"
import { getShop } from "../api/shop"
import { getUser } from "../api/user"

export default function CreateSalePage() {

    const [form] = Form.useForm()

    const navigate = useNavigate()

    const [products, setProducts] = useState<Product[]>([])
    const [user, setUser] = useState<User>()
    const [shop, setShop] = useState<Shop>()

    const items = Form.useWatch("items", form) || []

    const selectedProductIds = items
        .map((item: any) => item?.productId)
        .filter(Boolean)

    const role = getRole()?.toLowerCase()
    const shop_id = getShopId()
    const user_id = getUserId()

    useEffect(() => {
        loadShop()
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

    async function loadShop() {
        const response = await getShop(shop_id)

        setShop(response.data)
    }

    async function loadUser() {
        const response = await getUser(user_id)

        setUser(response.data)
    }

    async function handleSubmit(values: any) {

        const request = {
            shop_id: shop_id,
            user_id: user_id,
            count: values.items.length,
            items: values.items.map((item: any) => {
                const product = products.find(p => p.id === item.productId)
                return {
                    product_id: item.productId,
                    quantity: item.quantity,
                    price: product?.price ?? 0
                }
            })
        }

        console.log(request)

        try {
            const response = await api.post("/sales/", request)

            message.success("Sale created")

            navigate(`/${role}/sales/${response.data.id}`)
        }
        catch (error: any) {
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
                title="Create Sale"
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
                        <strong>Shop: </strong>
                        {shop ? (
                            <Popover
                                title="Shop Information"
                                content={
                                    <div>
                                        <div>ID: {shop.id}</div>
                                        <div>Name: {shop.name}</div>
                                        <div>Contact face: {shop.contactFace}</div>
                                        <div>Phone number: {shop.phoneNumber}</div>
                                        <div>Email: {shop.email}</div>
                                    </div>
                                }
                                trigger="hover"
                            >
                                <a>{shop.name}</a>
                            </Popover>
                        ) :
                            <span>Loading shop...</span>
                        }
                    </p>

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
                                    >
                                        Add Product
                                    </Button>
                                </Form.Item>

                            </Space>
                        )}

                    </Form.List>

                    <Button
                        type="primary"
                        htmlType="submit"
                    >
                        Create Sale
                    </Button>

                </Form>

            </Card>
        </div>
    )
}
