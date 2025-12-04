import Note, { NoteProps } from '@/components/note'
import { Note as NoteEntity } from 'misskey-js/built/entities'
import Skeleton from '@/components/skeleton'
import cli from '@/lib/misskey'
import barkleApi from '@/lib/barkle'
import getOgs from '@/lib/og'
import { GetStaticPaths, GetStaticProps } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'

export default function EmbeddableNote(note: NoteProps) {
    const { isFallback } = useRouter()
    return isFallback ? <Skeleton></Skeleton> : (<>
        <Head>
            <meta name='description' content={`Note: ${note.text ?? note.id}.`} />
        </Head>
        <Note {...note}></Note>
    </>)
}

export const getStaticPaths: GetStaticPaths = () => ({
    fallback: true,
    paths: [{ params: { slug: ['9jr63mej1p'] } }]
})

export const getStaticProps: GetStaticProps = async ({ params }) => {
    if (params) {
        const [noteId] = params.slug as string[]
        try {
            const note = (await barkleApi('barkle.chat').request('notes/show', { noteId })) as NoteEntity
            return { props: { ...note, ogs: await getOgs(note.text) }, revalidate: 10 }
        } catch (err) {
            console.error('Barkle API request failed:', err)
            return { notFound: true }
        }
    }
    return { notFound: true }
}
