import { api } from 'misskey-js'

const cli = (host: string) => new api.APIClient({
    origin: `https://barkle.chat`
})

export default cli
