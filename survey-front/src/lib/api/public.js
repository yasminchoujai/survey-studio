const API_URL = 'http://localhost:3000/api';

export async function getPublicSurvey(id) {
    const response = await fetch(`${API_URL}/public/surveys/${id}`)

    const result = await response.json()

    if (!response.ok) {
        throw new Error(result.message || 'Failed to load survey')
    }

    return result.data
}