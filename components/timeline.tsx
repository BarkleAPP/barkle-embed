import Note from './note'
import { useState } from 'react'
// legacy misskey client is still available: import cli from '@/lib/misskey'
import barkleApi from '@/lib/barkle'
import { Note as NoteType } from 'misskey-js/built/entities'
import { OgObject } from 'open-graph-scraper/dist/lib/types'

export default function Timeline({ notes, userId, instance, boardly = false, ogs }: {
    notes: NoteType[],
    userId: string,
    instance: string,
    ogs: OgObject[][],
    boardly?: boolean
}) {
    const [loaded, setLoaded] = useState({ loadedNotes: notes, loadedOgs: ogs })
    const { loadedNotes, loadedOgs } = loaded

    const [isLoading, setIsLoading] = useState(false)
    const [isFinished, setIsFinished] = useState(notes.length < 10 ? true : false)

    const loadNotes = async () => {
        setIsLoading(true)

        let loadingNotes: NoteType[] = []
        try {
            loadingNotes = (await barkleApi(instance).request('users/notes', {
            userId,
            untilId: loadedNotes[loadedNotes.length - 1].id,
            })) as NoteType[]
        } catch (err) {
            console.error('Failed to load more notes from Barkle API', err)
            setIsLoading(false)
            return
        }
        const loadingOgs = (await (await fetch('/api/og', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                texts: loadingNotes.map(note => note.text)
            })
        })).json()).ogs
        setLoaded(({ loadedNotes, loadedOgs }) => ({ loadedNotes: loadedNotes.concat(loadingNotes), loadedOgs: loadedOgs.concat(loadingOgs) }))

        if (loadingNotes.length < 10)
            setIsFinished(true)
        setIsLoading(false)
    }

    return (
        <div className={boardly ? 'grid items-center grid-cols-3 gap-5' : ''}>
            {
                loadedNotes.map((note, index) => (
                    <div key={note.id} className="mb-4">
                        <Note {...note} instance={instance} ogs={loadedOgs[index]}></Note>
                    </div>
                ))
            }
            <button disabled={isLoading || isFinished} onClick={loadNotes} className='w-full py-3 mx-auto group relative block text-sm font-medium text-[#dadada] rounded bg-[#1f1f1f] hover:bg-[#333] transition-colors'>
                <div className='w-full h-full flex items-center justify-center'>
                    {isLoading ? 'Loading...' : isFinished ? 'No more barks' : 'Load more'}
                </div>
            </button>
        </div>
    )
}
