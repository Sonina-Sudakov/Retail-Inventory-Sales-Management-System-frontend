import { useEffect } from "react"
import { Form, Input, Modal, message } from "antd"
import { api } from "../../api/api"
import type { Shop } from "../../types/shop"


type SaveShopModalProps = {
    open: boolean
    shop: Shop | null
    onClose: () => void
    onSuccess: () => void
}

export default function SaveShopModal({
    open,
    shop,
    onClose,
    onSuccess
}: SaveShopModalProps) {

    const [form] = Form.useForm()
    const isEdit = Boolean(shop?.id)

    useEffect(() => {
        if (!open) return
        if (shop) {
            form.setFieldsValue(shop)
        } else {
            form.resetFields()
        }
    }, [shop, open])


    async function handleSubmit(values: any) {
        const request = {
            name: values.name,
            address: values.address,
            contact_face: values.contactFace,
            phone_number: values.phoneNumber,
            email: values.email
        }
        try {
            if (isEdit && shop) {
                await api.put(`/shops/`, {
                    id: shop.id,
                    ...request
                })
            } else {
                await api.post("/shops/", request)
            }
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
            title={isEdit ? "Update Shop" : "Create Shop"}
            okText={isEdit ? "Update" : "Create"}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
            >
                <Form.Item
                    label="Name"
                    name="name"
                    rules={[{ required: true, message: "Name is required" }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Address"
                    name="address"
                    rules={[{ required: true, message: "Address is required" }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Contact Face"
                    name="contactFace"
                    rules={[{ required: true, message: "Contact person is required" }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Phone Number"
                    name="phoneNumber"
                    rules={[
                        { required: true, message: "Phone is required" },
                        {
                            pattern: /^\+?[0-9\s\-()]{7,20}$/,
                            message: "Invalid phone number"
                        }
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        { required: true, message: "Email is required" },
                        { type: "email", message: "Invalid email format" }
                    ]}
                >
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    )
}
