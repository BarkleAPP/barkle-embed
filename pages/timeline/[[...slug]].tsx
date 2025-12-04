import Timeline from '@/components/timeline'
import cli from '@/lib/misskey'
import barkleApi from '@/lib/barkle'
import getOgs from '@/lib/og'
import { Note } from 'misskey-js/built/entities'
import { GetStaticPaths, GetStaticProps } from 'next'
import Head from 'next/head'
import { OgObject } from 'open-graph-scraper/dist/lib/types'

export default function EmbeddableTimeline({ notes, instance, userId, ogs }: {
    notes: Note[],
    instance: string,
    userId: string,
    ogs: OgObject[][]
}) {
    return (<>
        <Head>
            <meta name='description' content={`UID: ${userId}. Username: ${notes[0]?.user?.name ?? 'unknown'}`} />
        </Head>
        <Timeline notes={notes} instance={instance} userId={userId} ogs={ogs}></Timeline>
    </>)
}

export const getStaticPaths: GetStaticPaths = () => ({
    fallback: 'blocking',
    paths: [{ params: { slug: ['9jnioy0lkk'] } }],
})

export const getStaticProps: GetStaticProps = async ({ params }) => {
    if (params) {
        const [userId] = params.slug as string[]
        let notes: Note[] = []
        let ogs: OgObject[][] = []
        try {
            notes = (await barkleApi('barkle.chat').request('users/notes', { userId })) as Note[]
            ogs = await Promise.all(notes.map(async note => getOgs(note.text)))
        } catch (err) {
            console.error('Barkle API request failed:', err)
            // fallback to empty notes so build can complete in environments where Barkle API is blocked
            notes = []
            ogs = []
        }
        return { props: { notes, userId, ogs }, revalidate: 10 }
    }
    return { notFound: true }
}
