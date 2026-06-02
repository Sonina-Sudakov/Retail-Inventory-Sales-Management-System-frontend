import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import {
    Form,
    Button,
    Space,
    InputNumber,
    Select,
    Card,
    message
} from "antd"

import { api } from "../api/api"
import type { Product } from "../types/product"

export default function CreateOrderPage() {

    const [form] = Form.useForm()

    const navigate = useNavigate()

    const [products, setProducts] = useState<Product[]>([])

    const items = Form.useWatch("items", form) || []

    const selectedProductIds = items
        .map((item: any) => item?.productId)
        .filter(Boolean)

    useEffect(() => {
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


    async function handleSubmit(values: any) {

        const request = {
            to_shop_id: 1,
            created_by_id: 7,  
            count: values.items.length,
            items: values.items.map((item: any) => ({
                product_id: item.productId,
                quantity: item.quantity
            }))
        }

        try {
            const response = await api.post("/orders/", request)

            message.success("Order created")

            navigate(`/orders/${response.data.id}`)
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
                onClick={() => navigate("/orders")}
                style={{ 
                    padding: 0, 
                    marginBottom: 16, 
                    display: 'flex', 
                    justifyContent: 'flex-start' 
                }}
           >
                ← Back to Orders
           </Button>

           <Card
                title="Create Order"
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
                        <strong>Shop:</strong> Temp Shop
                    </p>

                    <p>
                        <strong>Created by:</strong> Temp User
                    </p>
                    <p></p>

                </div>

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                >

                    <Form.List name="items">

                        {(fields, { add, remove }) => (
                            <Space
                                direction="vertical"
                                style={{ width: "100%" }}
                            >
                                {fields.map(field => (
                                    <Space
                                        key={field.key}
                                        align="center"
                                    >

                                        <Form.Item
                                            {...field}
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
                                            {...field}
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
                                ))}

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
                        Create Order
                    </Button>

                </Form>

            </Card>
        </div>
    )
}
