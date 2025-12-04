import Note, { NoteProps } from '@/components/note'
import Skeleton from '@/components/skeleton'
import barkleApi from '@/lib/barkle'
import getOgs from '@/lib/og'
import { GetStaticPaths, GetStaticProps } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Note as NoteEntity } from 'misskey-js/built/entities'

export default function EmbeddableBark(note: NoteProps) {
    const { isFallback } = useRouter()
    return isFallback ? <Skeleton></Skeleton> : (<>
        <Head>
            <meta name='description' content={`Bark: ${note.text ?? note.id}.`} />
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
        const [barkId] = params.slug as string[]
        try {
            const note = (await barkleApi('barkle.chat').request('notes/show', { noteId: barkId })) as NoteEntity
            return { props: { ...note, instance: 'barkle.chat', ogs: await getOgs(note.text) }, revalidate: 10 }
        } catch (err) {
            console.error('Barkle API request failed (bark page):', err)
            return { notFound: true }
        }
    }
    return { notFound: true }
}
