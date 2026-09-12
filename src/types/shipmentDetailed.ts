import type { ShipmentItem } from './shipmentItem'
import type { Shop } from './shop'
import type { User } from './user'

export type ShipmentDetailed = {
    id: number
    shop: Shop
    createdBy: User
    status: string
    createdAt: string
    updatedAt: string | null
    items: ShipmentItem[]
}
