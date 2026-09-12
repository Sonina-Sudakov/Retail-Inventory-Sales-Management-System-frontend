import { useEffect, useState } from "react"
import { Form, Input, Modal, Select, message } from "antd"
import { api } from "../../api/api"
import type { Shop } from "../../types/shop"


type Props = {
    open: boolean
    onClose: () => void
    onSuccess: () => Promise<void>
}

export default function CreateUserModal({
    open,
    onClose,
    onSuccess
}: Props) {

    const [form] = Form.useForm()
    const [shops, setShops] = useState<Shop[]>([])
    const role = Form.useWatch("role", form)

    useEffect(() => {
        async function loadShops() {
            const response = await api.get("/shops/all")

            const shops = response.data.items.map((shop: any) => ({
                id: shop.id,
                name: shop.name
            }))

            setShops(shops)
        }

        loadShops()
    }, [])


    async function handleSubmit(values: {
        username: string
        fullname: string
        password: string
        works_in_shop_id: number
        role: string
    }) {

        try {
            await api.post("/users/", values)
            form.resetFields()
            await onSuccess()
            onClose()
        }
        catch (error: any){
            message.error(
                error.response?.data?.message ??
                "Unknown error"
            )   
        }
    }

    return (
        <Modal
            open={open}
            title="Create User"
            okText="Create"
            cancelText="Cancel"
            onCancel={onClose}
            onOk={() => form.submit()}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
            >
                <Form.Item
                    label="Username"
                    name="username"
                    rules={[
                        { required: true }
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Fullname"
                    name="fullname"
                    rules={[
                        { required: true }
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[
                        { required: true }
                    ]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    label="Role"
                    name="role"
                    rules={[
                        { required: true }
                    ]}
                >
                    <Select
                        options={[
                            {
                                value: "ADMIN",
                                label: "Admin"
                            },
                            {
                                value: "STOREKEEPER",
                                label: "Storekeeper"
                            },
                            {
                                value: "SHOPKEEPER",
                                label: "Shopkeeper"
                            }
                        ]}
                    />
                </Form.Item>

               {role === "SHOPKEEPER" && (
                    <Form.Item
                        label="Workplace"
                        name="works_in_shop_id"
                        rules={[
                            { required: true, message: "Select workplace" }
                        ]}
                    >
                        <Select
                            placeholder="Select shop"
                            options={shops.map(shop => ({
                                value: shop.id,
                                label: `${shop.name} (ID: ${shop.id})`
                            }))}
                        />
                    </Form.Item>
               )}
                </Form>
        </Modal>
    )
}
