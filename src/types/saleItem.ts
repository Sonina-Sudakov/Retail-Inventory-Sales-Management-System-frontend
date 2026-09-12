import type { Product } from "./product"

export type SaleItem = {
    saleId: number
    product: Product
    quantity: number
    price: number
}
