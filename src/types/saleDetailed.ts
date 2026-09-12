import type { SaleItem } from "./saleItem"
import type { Shop } from "./shop"
import type { User } from "./user"

export type SaleDetailed = {
    id: number
    shop: Shop
    user: User
    created_at: string
    items: SaleItem[]
}
