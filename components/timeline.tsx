import Note from './note'
import { useState, useEffect, useRef, useCallback } from 'react'
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
    const [isFinished, setIsFinished] = useState(notes.length < 10)
    const observerTarget = useRef(null);

    const loadNotes = useCallback(async () => {
        if (isLoading || isFinished) return;
        
        setIsLoading(true)

        let loadingNotes: NoteType[] = []
        try {
            loadingNotes = (await barkleApi(instance).request('users/notes', {
                userId,
                untilId: loadedNotes[loadedNotes.length - 1].id,
                limit: 10
            })) as NoteType[]
        } catch (err) {
            console.error('Failed to load more notes from Barkle API', err)
            setIsLoading(false)
            return
        }

        if (loadingNotes.length === 0) {
            setIsFinished(true);
            setIsLoading(false);
            return;
        }

        let loadingOgs: OgObject[][] = [];
        try {
            const response = await fetch('/api/og', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    texts: loadingNotes.map(note => note.text)
                })
            });
            const data = await response.json();
            loadingOgs = data.ogs;
        } catch (e) {
            console.error("Failed to fetch OGs", e);
            // Fallback to empty OGs if fetch fails
            loadingOgs = new Array(loadingNotes.length).fill([]);
        }
        
        setLoaded(prev => ({ 
            loadedNotes: prev.loadedNotes.concat(loadingNotes), 
            loadedOgs: prev.loadedOgs.concat(loadingOgs) 
        }))

        if (loadingNotes.length < 10)
            setIsFinished(true)
        
        setIsLoading(false)
    }, [instance, userId, loadedNotes, isLoading, isFinished]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting) {
                    loadNotes();
                }
            },
            { threshold: 0.1 }
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => {
            if (observerTarget.current) {
                observer.unobserve(observerTarget.current);
            }
        };
    }, [loadNotes]);

    return (
        <div className={boardly ? 'grid items-center grid-cols-3 gap-5' : ''}>
            {
                loadedNotes.map((note, index) => (
                    <div key={note.id} className="mb-4 animate-fade-in-up">
                        <Note {...note} instance={instance} ogs={loadedOgs[index]}></Note>
                    </div>
                ))
            }
            
            <div ref={observerTarget} className="w-full py-8 flex justify-center items-center">
                {isLoading && (
                    <div className="flex items-center gap-2 text-[#8b8b8b]">
                        <i className="ph-spinner-gap-bold animate-spin text-xl"></i>
                        <span>Loading more barks...</span>
                    </div>
                )}
                {isFinished && loadedNotes.length > 0 && (
                    <div className="text-[#666] text-sm italic">
                        You've reached the end of the timeline.
                    </div>
                )}
            </div>
        </div>
    )
}
