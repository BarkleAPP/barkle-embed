import Note, { NoteProps } from '@/components/note'
import Skeleton from '@/components/skeleton'
import barkleApi from '@/lib/barkle'
import getOgs from '@/lib/og'
import { GetStaticPaths, GetStaticProps } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'

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
    paths: [{ params: { slug: ['9358xkvosa'] } }]
})

export const getStaticProps: GetStaticProps = async ({ params }) => {
    if (params) {
        const [noteId] = params.slug as string[]
        try {
            const note = (await barkleApi('barkle.chat').request('notes/show', { noteId }))
            return { props: { ...note, ogs: await getOgs(note.text) }, revalidate: 10 }
        } catch (err) {
            console.error('Failed to fetch Barkle note for embed', err)
            return { notFound: true }
        }
    }
    return { notFound: true }
}
