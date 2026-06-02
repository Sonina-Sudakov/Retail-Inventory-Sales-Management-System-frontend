import { api } from "./api";

export async function getShops() {
    return api.get("/shops/all");
}
