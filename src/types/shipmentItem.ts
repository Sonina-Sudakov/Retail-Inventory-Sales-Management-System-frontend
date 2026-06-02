import type { Product } from "./product"

export type ShipmentItem = {
    product: Product
    orderedQuantity: number
    availableQuantity: number
    shipmentQuantity: number
}
