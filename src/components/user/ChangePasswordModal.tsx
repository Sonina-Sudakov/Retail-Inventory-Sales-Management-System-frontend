import { Form, Input, Modal } from "antd"
import { api } from "../../api/api"
import type { User } from "../../types/user"

type Props = {
    user: User | null
    open: boolean
    onClose: () => void
    onSuccess: () => Promise<void>
}

export default function ChangePasswordModal({
    user,
    open,
    onClose,
    onSuccess
}: Props) {

    const [form] = Form.useForm()

    async function handleSubmit(values: {
        new_password: string
    }) {

        if (!user) return

        await api.put("/users/change_password", {
            id: user.id,
            new_password: values.new_password
        })

        form.resetFields()

        await onSuccess()
         
        onClose()
    }

    function handleClose() {
        form.resetFields()
        onClose()
    }

    return (
        <Modal
            open={open}
            title={`Change password (${user?.username})`}
            onCancel={handleClose}
            onOk={() => form.submit()}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
            >
                <Form.Item
                    label="New password"
                    name="new_password"
                    rules={[
                        { required: true }
                    ]}
                >
                    <Input.Password />
                </Form.Item>
            </Form>
        </Modal>
    )
}
