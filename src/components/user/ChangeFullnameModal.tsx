import { Form, Input, Modal } from "antd"
import { api } from "../../api/api"
import type { User } from "../../types/user"

type Props = {
    user: User | null
    open: boolean
    onClose: () => void
    onSuccess: () => Promise<void>
}

export default function ChangeFullnameModal({
    user,
    open,
    onClose,
    onSuccess
}: Props) {

    const [form] = Form.useForm()

    async function handleSubmit(values: {
        new_fullname: string
    }) {

        if (!user) return

        await api.put("/users/change_fullname", {
            id: user.id,
            new_fullname: values.new_fullname
        })

        form.resetFields()

        await onSuccess()

        onClose()
    }

    return (
        <Modal
            open={open}
            title={`Change fullname (${user?.username})`}
            onCancel={onClose}
            onOk={() => form.submit()}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
            >
                <Form.Item
                    label="New fullname"
                    name="new_fullname"
                    rules={[
                        { required: true }
                    ]}
                >
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    )
}
