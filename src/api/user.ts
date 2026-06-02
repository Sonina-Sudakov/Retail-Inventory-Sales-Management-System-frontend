import { api } from "./api";

export async function getUser(id: number) {
    return api.get(`/users?id=${id}`);
}
