export async function asaasRequest(method: string, endpoint: string, body?: any) {
    const ASAS_URL = 'https://api.asaas.com/v3'
    const ASAS_KEY = process.env.ASAAS_API_KEY || process.env.NEXT_PUBLIC_ASAAS_API_KEY

    if (!ASAS_KEY) {
        throw new Error("Asaas API Key is missing in environment.")
    }

    const options: RequestInit = {
        method,
        headers: {
            'accept': 'application/json',
            'access_token': ASAS_KEY,
            'content-type': 'application/json'
        }
    }

    if (body) {
        options.body = JSON.stringify(body)
    }

    try {
        const response = await fetch(`${ASAS_URL}${endpoint}`, options)
        const data = await response.json()

        // Log Asaas error to the console if it exists
        if (!response.ok) {
            console.error("Asaas API Error Response:", data)
            throw new Error(`Asaas API Error: ${response.statusText} - ${JSON.stringify(data.errors || data)}`)
        }

        return data
    } catch (e: any) {
        console.error("Asaas Request Failed:", e)
        throw e
    }
}
