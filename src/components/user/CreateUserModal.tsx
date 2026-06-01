import { useEffect, useState } from "react"
import { Form, Input, Modal, Select, message } from "antd"
import { api } from "../../api/api"
import type { User } from "../../types/user"

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

    async function handleSubmit(values: {
        username: string
        fullname: string
        password: string
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
            </Form>
        </Modal>
    )
}
