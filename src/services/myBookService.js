import api from "@/services/api";

export async function fetchMyBook() {
    const response = await api.get('/community/myBook');
    return response.data;
}