// Minimal Barkle API wrapper using fetch and the project's OpenAPI spec.
// This provides a very small alternative to misskey-js for direct API calls.
export const barkleApi = (host = 'barkle.chat') => {
    const origin = `https://${host}/api`
    return {
        request: async (endpoint: string, body?: any) => {
            const res = await fetch(`${origin}/${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body || {})
            })
            if (!res.ok) {
                const errorText = await res.text().catch(() => '')
                throw new Error(`Barkle API error ${res.status}: ${errorText}`)
            }
            if (res.status === 204) return null
            return await res.json()
        }
    }
}

export default barkleApi
