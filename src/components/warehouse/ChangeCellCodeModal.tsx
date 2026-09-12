import { Modal, Form, Input, message } from "antd";
import { changeCellCode } from "../../api/warehouse";

interface Stock {
    id: number;
    cell_code: string;
}

interface Props {
    stock: Stock | null;
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function ChangeCellCodeModal({
    stock,
    open,
    onClose,
    onSuccess
}: Props) {

    const [form] = Form.useForm();

    async function submit(values: { cell_code: string }) {
        if (!stock) return;

        try {
            await changeCellCode(stock.id, values.cell_code)

            message.success("Cell code updated");

            onClose();
            onSuccess();

        } catch (error: any) {
            message.error(
                error.response?.data?.message ??
                "Unknown error"
            )
        }
    }

    function handleClose() {
        form.resetFields()
        onClose()
    }

    return (
        <Modal
            open={open}
            title="Change Cell Code"
            onCancel={handleClose}
            onOk={() => form.submit()}
            afterOpenChange={(visible) => {
                if (visible && stock) {
                    form.setFieldsValue({
                        cell_code: stock.cell_code
                    });
                }
            }}
        >
            <Form form={form} layout="vertical" onFinish={submit}>
                <Form.Item
                    name="cell_code"
                    label="Cell Code"
                    rules={[{ required: true }]}
                >
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    );
}
