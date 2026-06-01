import type { OrderItem } from './orderItem'
import type { Shop } from './shop'
import type { User } from './user'

export type OrderDetailed = {
    id: number
    shop: Shop
    createdBy: User
    status: string
    createdAt: string
    acceptedAt: string | null
    items: OrderItem[]
}
