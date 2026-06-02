import { Modal, Form, Input, message, Select } from "antd";
import { useEffect, useState } from "react";
import type { Product } from "../../types/product";
import { getProducts } from "../../api/product";
import { createStock } from "../../api/warehouse";

interface Props {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function CreateCellModal({
    open,
    onClose,
    onSuccess
}: Props) {

    const [form] = Form.useForm();
    const [products, setProducts] = useState<Product[]>([])
    const [product, setProduct] = useState<Product | null>(null)

    useEffect(() => {
        async function loadProducts() {
            try {
                const response = await getProducts();
                const fetchedProducts = response.data.items.map((item: any) => ({
                    id: item.id,
                    name: item.name,
                    unit: item.unit
                }));
                setProducts(fetchedProducts);
            } catch (error: any) {
                message.error(
                    error.response?.data?.message ??
                    "Unknown error"
                )
            }
        }

        loadProducts();
    }, [])

    function handleClose() {
        form.resetFields()
        setProduct(null)
        onClose()
    }

    async function submit(values: {
        cell_code: string,
        product_id: number,
        quantity?: number
    }) {
        try {
            await createStock({
                cell_code: values.cell_code,
                product_id: values.product_id,
                quantity: values.quantity
            })

            message.success("Cell created");

            form.resetFields();
            onClose();
            onSuccess();

        } catch (error: any) {
            message.error(
                error.response?.data?.message ??
                "Unknown error"
            )
        }
    }

    return (
        <Modal
            open={open}
            title="Create Cell"
            onCancel={handleClose}
            onOk={() => form.submit()}
        >
            <Form form={form} layout="vertical" onFinish={submit}>
                <Form.Item
                    name="cell_code"
                    label="Cell Code"
                    rules={[{ required: true }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="product_id"
                    label="Product"
                    rules={[{ required: false }]}
                >
                    <Select
                        placeholder="Select product"
                        options={products.map(product => ({
                            value: product.id,
                            label: `${product.name} (ID: ${product.id})`
                        }))}
                        onSelect={(value) => {
                            const selectedProduct = products.find(p => p.id === value);
                            setProduct(selectedProduct);
                        }}
                    />
                </Form.Item>
                {product != null && (
                    <Form.Item
                        name="quantity"
                        label={`Quantity (${product.unit})`}
                        rules={[{ required: false }]}
                    >
                        <Input />
                    </Form.Item>
                )}
            </Form>
        </Modal>
    );
}
