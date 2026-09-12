import { api } from "./api";

export async function getStocks() {
    return api.get("/warehouse/all");
}

export async function createStock(data: {
    cell_code: string,
    product_id: number | null,
    quantity?: number
}) {
    return api.post("/warehouse", {
        ...data,
        quantity: data.quantity ?? 0
    });
}

export async function deleteStock(id: number) {
    return api.delete(`/warehouse?id=${id}`);
}

export async function clearStock(id: number) {
    return api.put(`/warehouse/clear?id=${id}`);
}

export async function changeCellCode(
    id: number,
    cell_code: string
) {
    return api.put(
        "/warehouse/change_cell_code",
        {
            id,
            cell_code
        }
    );
}

export async function swapProducts(
    firstId: number,
    secondId: number
) {
    return api.put(
        `/warehouse/swap_products?first_id=${firstId}&second_id=${secondId}`
    );
}

export async function storeProduct(
    stock_id: number,
    product_id: number,
    quantity: number
) {
    return api.put(
        "/warehouse/store",
        {
            stock_id,
            product_id,
            quantity
        }
    );
}
