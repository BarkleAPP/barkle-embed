import Note, { NoteProps } from '@/components/note'
import Skeleton from '@/components/skeleton'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function EmbeddableBark() {
    const router = useRouter()
    const [note, setNote] = useState<NoteProps | null>(null)
    const [error, setError] = useState<string | null>(null)

    const noteId = router.query.slug?.[0]

    useEffect(() => {
        if (!noteId) return

        fetch('https://barkle.chat/api/notes/show', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ noteId })
        })
            .then(res => {
                if (!res.ok) throw new Error(`API error: ${res.status}`)
                return res.json()
            })
            .then(data => {
                setNote({ ...data, instance: 'barkle.chat', ogs: [] })
            })
            .catch(err => {
                console.error('Failed to fetch bark:', err)
                setError(err.message)
            })
    }, [noteId])

    if (error) {
        return <div className="p-4 text-red-500">Failed to load bark: {error}</div>
    }

    if (!note) {
        return <Skeleton />
    }

    return (<>
        <Head>
            <meta name='description' content={`Bark: ${note.text ?? note.id}.`} />
        </Head>
        <Note {...note}></Note>
    </>)
}
