import type { Product } from "./product"


export type OrderItem = {
    orderId: number
    product: Product
    quantity: number
}
