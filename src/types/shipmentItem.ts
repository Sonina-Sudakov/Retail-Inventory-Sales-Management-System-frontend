import type { Product } from "./product"

export type ShipmentItem = {
    product: Product

    productName: string
    unit: string

    requestedQuantity: number
    availableQuantity: number
    shipmentQuantity: number
}
