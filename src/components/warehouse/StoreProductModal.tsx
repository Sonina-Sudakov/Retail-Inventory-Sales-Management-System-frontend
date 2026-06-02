import { Modal, Form, InputNumber, message, Select } from "antd";
import { useEffect, useState } from "react";
import { getProducts } from "../../api/product";
import type { Product } from "../../types/product";
import { storeProduct } from "../../api/warehouse";

interface Stock {
    id: number;
    product?: string | null;
}

interface Props {
    stock: Stock | null;
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function StoreProductModal({
    stock,
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
            } catch (error) {
                console.error("Ошибка загрузки продуктов:", error);
            }
        }

        loadProducts();
    }, [])

    function handleClose() {
        form.resetFields()
        onClose()
    }

    async function submit(values: {
        product_id: number;
        quantity: number;
    }) {

        if (!stock) return;

        try {
            await storeProduct(
                stock.id,
                values.product_id,
                values.quantity
            )

            message.success("Product stored");

            form.resetFields();
            onClose();
            onSuccess();

        } catch {
            message.error("Failed to store product");
        }
    }

    return (
        <Modal
            open={open}
            title="Store Product"
            onCancel={handleClose}
            onOk={() => form.submit()}
        >
            <Form form={form} layout="vertical" onFinish={submit}>

                <Form.Item
                    name="product_id"
                    label="Product"
                    rules={[{ required: true }]}
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

                <Form.Item
                    name="quantity"
                    label={`Quantity ${product ? `(${product.unit})` : ""}`}
                    rules={[{ required: true }]}
                >
                    <InputNumber style={{ width: "100%" }} />
                </Form.Item>

            </Form>
        </Modal >
    );
}
