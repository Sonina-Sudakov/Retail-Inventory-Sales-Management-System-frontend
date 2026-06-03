export type ShopStock = {
    shop_id: number
    product_id: number
    product: string
    units: string
    type: string
    price: string

    productRaw: any

    min_quantity: number
    quantity: number
}
