import Note, { NoteProps } from '@/components/note'
import Skeleton from '@/components/skeleton'
import cli from '@/lib/misskey'
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
        const note = await cli("barkle.chat").request('notes/show', { noteId })
        return { props: { ...note, ogs: await getOgs(note.text) }, revalidate: 10 }
    }
    return { notFound: true }
}
