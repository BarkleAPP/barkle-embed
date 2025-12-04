import { DriveFile, Note } from 'misskey-js/built/entities'
import { useEffect, useState } from 'react'
import ProgressiveImage from 'react-progressive-image-loading'
import Image from 'next/image'
import { ImageObject, OgObject } from 'open-graph-scraper/dist/lib/types'
import MfmConverter from '@/lib/mfm'

export interface NoteProps extends Note {
    instance: string
    ogs?: OgObject[]
    isRenote?: boolean
    barkleFor?: string
}

export default function Note({ id, user, createdAt, text, files, cw, poll, renote, instance = 'barkle.chat', ogs = [], isRenote, barkleFor }: NoteProps) {
    const [show, setShow] = useState(!cw)
    const converter = new MfmConverter(instance)
    
    const timeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " year(s) ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " month(s) ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " day(s) ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " hour(s) ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " minute(s) ago";
        return Math.floor(seconds) + " second(s) ago";
    }

    return (
        <article className={`w-full p-6 rounded-xl bg-[#191919] text-[#dadada] font-sans`} style={{ boxShadow: isRenote ? 'none' : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}>
            {/* Header */}
            <header className='flex items-start mb-2'>
                <Image width={48} height={48} src={user.avatarUrl} alt='Avatar' className='rounded-lg mr-3'></Image>
                <div className='flex flex-col leading-tight'>
                    <div className='flex items-baseline gap-2'>
                         <p className='font-bold text-white text-base'>{converter.convert(user.name)}</p>
                    </div>
                    <p className='text-[#8b8b8b] text-sm'>{`@${user.username}`}</p>
                </div>
                <div className='ml-auto text-[#8b8b8b] text-xs'>
                    {timeAgo(createdAt)}
                </div>
            </header>

            {/* Content */}
            <div className='mb-3'>
                {
                    cw ? (<div>
                        <span className='italic text-gray-400'>{converter.convert(cw)}</span> 
                        <button className='text-[#44a4c1] ml-2 text-sm hover:underline' onClick={() => setShow(show => !show)}>{show ? 'Hide' : 'Show'}</button>
                    </div>) : <></>
                }
                {
                    show && text ? (
                        <div className='whitespace-pre-line text-[15px] leading-relaxed text-[#dadada]'>
                            {converter.convert(text)}
                        </div>
                    ) : <></>
                }
            </div>

            {/* Media */}
            {show && (
                <>
                    <Images imgs={files.filter(({ type }) => type.startsWith('image'))}></Images>
                    <Renote renote={renote}></Renote>
                    <Cards ogs={ogs}></Cards>
                    <Enquette poll={poll}></Enquette>
                </>
            )}

            {/* Footer Info */}
            {barkleFor && (
                <div className='mt-2 mb-3 text-xs font-bold text-[#666]'>
                    {barkleFor}
                </div>
            )}

            {/* Reactions */}
             <div className='flex gap-2 mb-3'>
                <div className='flex items-center bg-[#e84d83] text-white px-2 py-1 rounded text-sm font-bold'>
                    <i className="ph-star-bold mr-1"></i> 1
                </div>
            </div>

            {/* Action Buttons */}
            <footer className='flex items-center justify-between text-[#8b8b8b] mt-2 border-t border-[rgba(255,255,255,0.1)] pt-3'>
                <button className='hover:text-white transition-colors flex items-center gap-1'>
                    <i className="ph-arrow-bend-up-left-bold text-xl"></i>
                </button>
                <button className='hover:text-white transition-colors flex items-center gap-1'>
                    <i className="ph-repeat-bold text-xl"></i>
                    <span className='text-sm'>1</span>
                </button>
                <button className='hover:text-white transition-colors flex items-center gap-1'>
                    <i className="ph-minus-bold text-xl text-[#e84d83]"></i>
                </button>
                 <button className='hover:text-white transition-colors flex items-center gap-1'>
                    <i className="ph-dots-three-outline-bold text-xl"></i>
                </button>
            </footer>
        </article>
    )
}

const Renote = ({ renote }: { renote?: Note }) => renote ? (<>
    <div className="border border-[rgba(255,255,255,0.1)] rounded-lg p-4 mt-2">
        <Note {...renote} ogs={[]} instance='barkle.chat' isRenote></Note>
    </div>
</>) : <></>

const Cards = ({ ogs }: { ogs: OgObject[] }) => {
    return ogs.length > 0 ? (<>
        {
            ogs.map(({ ogImage, ogTitle, requestUrl, ogDescription }) => (
                (
                    <a key={requestUrl} href={requestUrl} target='_blank' rel='noreferrer' className="block mt-2">
                        <div className='flex h-24 bg-[#212121] rounded-lg overflow-hidden hover:bg-[#333] transition-colors'>
                            <div className='relative w-24 h-24 shrink-0'>
                                <Image quality={100} src={(ogImage as ImageObject[])[0].url} className='object-cover' fill alt={ogTitle as string}></Image>
                            </div>
                            <div className='flex-1 p-3 overflow-hidden'>
                                <div className='font-bold text-sm text-[#dadada] truncate'>{ogTitle}</div>
                                <div className='text-xs text-[#8b8b8b] mt-1 line-clamp-2'>
                                    {ogDescription ?? ''}
                                </div>
                            </div>
                        </div>
                    </a>
                )))
        }
    </>) : <></>
}

const Images = ({ imgs }: { imgs: DriveFile[] }) => {
    const [isMounted, setIsMounted] = useState(false)
    useEffect(() => setIsMounted(true), [])
    const [opacities, setOpacities] = useState<number[]>(imgs.map(({ isSensitive }) => (isSensitive ? 0.1 : 1)))

    return imgs.length > 0 ? (<>
        <div className={`grid ${imgs.length === 1 ? 'grid-cols-1' : 'grid-cols-2'} gap-2 mt-2`}>
            {
                isMounted ? imgs.map(({ id, thumbnailUrl, url, name }, index) => (
                    <ProgressiveImage key={id} preview={thumbnailUrl} src={url} render={(src, style) => (
                        <div className='overflow-hidden aspect-video rounded-lg relative bg-[#212121]'>
                            <Image fill src={src} alt={name} style={{ ...style, objectFit: 'cover', opacity: opacities[index], filter: `blur(${Math.floor((1 - opacities[index]) * 5)}px)` }} />
                            <div className='absolute top-2 right-2 bg-[#333] p-1 rounded text-white opacity-70 hover:opacity-100 cursor-pointer'>
                                <i className="ph-eye-slash"></i>
                            </div>
                             <div style={{ opacity: 1 - opacities[index] }} className={`${1 - opacities[index] > 0 ? '' : 'hidden'} w-full h-full flex flex-col items-center justify-center absolute top-0 left-0 bg-black/50`}>
                                <span className='text-lg font-bold text-white mb-2'>NSFW</span>
                                <button className='text-white border border-white px-3 py-1 rounded text-sm hover:bg-white hover:text-black transition-colors' onClick={() => {
                                    const fadeInInterval = setInterval(() => {
                                        setOpacities(opacities => Array.from(opacities, (opacity, i) => {
                                            const newOpacity = i === index ? opacity + 0.01 : opacity
                                            if (newOpacity > 1) {
                                                clearInterval(fadeInInterval)
                                            }
                                            return newOpacity
                                        }))
                                    }, 5)
                                }}>Click to View</button>
                            </div>
                        </div>
                    )}></ProgressiveImage>
                )) : <></>
            }
        </div>
    </>) : <></>
}

const Enquette = ({ poll }: {
    poll: {
        expiresAt: string | null
        multiple: boolean
        choices: {
            isVoted: boolean
            text: string
            votes: number
        }[]
    } | undefined
}) => {
    const allVotes = poll ? poll.choices.reduce((a, b) => a + b.votes, 0) : 0
    return poll ? (<>
        <div className="mt-2">
        {
            poll.choices.map(({ text, votes }) => (
                <div
                    key={text}
                    className='w-full border border-[rgba(255,255,255,0.1)] my-1 rounded overflow-hidden relative bg-[#212121]'
                >
                    <div style={{ width: `${votes / allVotes * 100}%` }} className='absolute top-0 left-0 h-full bg-[#333] opacity-50'></div>
                    <div className='relative p-2 flex justify-between items-center text-sm text-[#dadada]'>
                        <span>{text}</span>
                        <span className='text-xs text-[#8b8b8b]'>{votes} {votes === 1 ? 'Vote' : 'Votes'}</span>
                    </div>
                </div>
            ))
        }
        </div>
    </>) : <></>
}
