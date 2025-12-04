import { api } from 'misskey-js'

// Create an API client for a given host (defaults to barkle.chat)
// misskey-js client builds requests to `${origin}/api/${endpoint}` internally.
const cli = (host = 'barkle.chat') => new api.APIClient({
    origin: `https://${host}`
})

export default cli
