import api from "@/services/api";

export async function saveWeeklyQuestion(qId) {
    return api.post(`/weekly/${qId}/save`);
}

export async function fetchQuestionDetail(qId) {
    const response = await api.get('/community/question', { params: { qId } });
    return response.data;
}