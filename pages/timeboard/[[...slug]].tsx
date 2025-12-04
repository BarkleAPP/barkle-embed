import Timeline from '@/components/timeline'
import Skeleton from '@/components/skeleton'
import { Note } from 'misskey-js/built/entities'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function EmbeddableTimeboard() {
    const router = useRouter()
    const [notes, setNotes] = useState<Note[] | null>(null)
    const [error, setError] = useState<string | null>(null)

    const userId = router.query.slug?.[0]

    useEffect(() => {
        if (!userId) return

        fetch('https://barkle.chat/api/users/notes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId })
        })
            .then(res => {
                if (!res.ok) throw new Error(`API error: ${res.status}`)
                return res.json()
            })
            .then(data => {
                setNotes(data)
            })
            .catch(err => {
                console.error('Failed to fetch timeboard:', err)
                setError(err.message)
            })
    }, [userId])

    if (error) {
        return <div className="p-4 text-red-500">Failed to load timeboard: {error}</div>
    }

    if (!notes || !userId) {
        return <Skeleton />
    }

    return (<>
        <Head>
            <meta name='description' content={`UID: ${userId}. Username: ${notes[0]?.user?.name ?? 'unknown'}`} />
        </Head>
        <Timeline notes={notes} instance={'barkle.chat'} userId={userId as string} ogs={notes.map(() => [])} boardly></Timeline>
    </>)
}
