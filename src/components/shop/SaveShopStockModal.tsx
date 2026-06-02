import { useEffect, useState } from "react"
import { Form, Input, InputNumber, Modal, message } from "antd"
import { api } from "../../api/api"
import type { Shop } from "../../types/shop"
import type { ShopStock } from "../../types/shopStock"


type SaveShopStockModalProps = {
    open: boolean
    stock: ShopStock | null
    onClose: () => void
    onSuccess: () => void
}

export default function SaveShopStockModal({
    open,
    stock,
    onClose,
    onSuccess
}: SaveShopStockModalProps) {

    const [form] = Form.useForm()
    const [shopId, setShopId] = useState<number | null>(null)
    const [productId, setProductId] = useState<number | null>(null)

    useEffect(() => {
        console.log(stock)
        if (!open) return
        if (stock) {
            form.setFieldsValue({
                minQuantity: stock.min_quantity
            })
            setShopId(stock.shop_id)
            setProductId(stock.product_id)
        } else {
            form.resetFields()
        }
    }, [stock, open])


    async function handleSubmit(values: any) {
        try {
            await api.put(`/shops/stocks`, {
                shop_id: shopId,
                product_id: productId,
                min_quantity: values.minQuantity,
            })
            form.resetFields()
            await onSuccess()
            onClose()
        }
        catch (error: any) {
            message.error(
                error.response?.data?.message ??
                "Unknown error"
            )
        }

    }

    return (
        <Modal
            open={open}
            onCancel={onClose}
            onOk={() => form.submit()}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
            >
                <Form.Item
                    label="Min. Quantity"
                    name="minQuantity"
                    rules={[{ required: true, message: "Min. Quantity is required" }]}
                >
                    <InputNumber
                        min={0}
                        style={{ width: "100%" }}
                    />
                </Form.Item>
            </Form>
        </Modal>
    )
}
