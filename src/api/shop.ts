import { api } from "./api";

export async function getShops() {
    return api.get("/shops/all");
}

export async function getShop(id: number) {
    return api.get(`/shops?id=${id}`);
}

export async function getStocks(shop_id: number) {
    return api.get(`shops/${shop_id}/stocks`)
}
