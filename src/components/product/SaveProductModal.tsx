import { useEffect, useState } from "react"
import { Form, Input, Modal } from "antd"
import InputMask from "react-input-mask"
import { api } from "../../api/api"
import type { Product } from "../../types/product"


type SaveProductModalProps = { 
    open: boolean
    product: Product | null
    onClose: () => void
    onSuccess: () => void
}

export default function SaveProductModal({
    open,
    product,
    onClose,
    onSuccess
}: SaveProductModalProps) {
    
    const [form] = Form.useForm()
    const isEdit = Boolean(product?.id)

    useEffect(() => {
        if (!open) return
        if (product) {
            form.setFieldsValue(product) 
        } else {
            form.resetFields()
        }
    }, [product, open]) 


    async function handleSubmit(values: any) {

        if (isEdit && product) {
            await api.put(`/products/`, {
                id: product.id,
                ...values
            })
        } else {
            await api.post("/products/", values)
        }
        form.resetFields()
        await onSuccess()
        onClose()
    }

   return (
      <Modal
        open={open}
        onCancel={onClose}
        onOk={() => form.submit()}
        title={isEdit ? "Update Product" : "Create Product"}
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
            label="Unit"
            name="unit"
            rules={[{ required: true, message: "Unit is required" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Type"
            name="type"
            rules={[{ required: true, message: "Type is required" }]}
          >
            <Input />
          </Form.Item>

         <Form.Item
            label="Price"
            name="price"
            rules={[
              { required: true, message: "Price is required" }
            ]}
          >
            <Input />
          </Form.Item>


          <Form.Item
            label="Origin"
            name="origin"
            rules={[{ required: true, message: "Origin is required" }]}
          >
            <Input />
          </Form.Item>

        </Form>
      </Modal>
    ) 
}
