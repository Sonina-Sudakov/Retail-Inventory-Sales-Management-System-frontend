import { Modal, Form, message, Select } from "antd";
import type { WarehouseStock } from "../../types/warehouseStock";
import { swapProducts } from "../../api/warehouse";

interface Props {
    stock: WarehouseStock | null;
    open: boolean;
    stocks: WarehouseStock[],
    onClose: () => void;
    onSuccess: () => void;
}

export default function SwapProductsModal({
    stock,
    open,
    stocks,
    onClose,
    onSuccess,
}: Props) {

    const [form] = Form.useForm();

    async function submit(values: { second_id: number }) {

        if (!stock) return;

        try {

            await swapProducts(stock.id, values.second_id)

            message.success("Products swapped");

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
            title="Swap Products"
            onCancel={onClose}
            onOk={() => form.submit()}
        >
            <Form form={form} layout="vertical" onFinish={submit}>

                <Form.Item
                    name="second_id"
                    label="Target Stock"
                    rules={[{ required: true }]}
                >
                    <Select
                        placeholder="Select stock"
                        options={stocks
                            .filter(sec_stock => sec_stock.id !== stock?.id)
                            .map(sec_stock => ({
                                value: sec_stock.id,
                                label: `${sec_stock.cell_code} (Product: ${sec_stock.product}, Quantity: ${sec_stock.quantity})`
                            }))}
                    />
                </Form.Item>

            </Form>
        </Modal>
    );
}
