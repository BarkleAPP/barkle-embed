import { DriveFile, Note } from 'misskey-js/built/entities'
import { useEffect, useState } from 'react'
import ProgressiveImage from 'react-progressive-image-loading'
import Image from 'next/image'
import { ImageObject, OgObject } from 'open-graph-scraper/dist/lib/types'
import MfmConverter from '@/lib/mfm'
import Avatar from './avatar'

export interface NoteProps extends Note {
    instance: string
    ogs?: OgObject[]
    isRenote?: boolean
    barkleFor?: string
    className?: string
}

// Helper interface to handle potential missing properties in UserLite
interface ExtendedUserLite {
    name: string | null;
    username: string;
    avatarUrl: string | null;
    isBot?: boolean;
    isCat?: boolean;
    isLive?: boolean;
    onlineStatus?: 'online' | 'active' | 'offline' | 'unknown';
    avatarDecorations?: any[];
}

export default function Note({ id, user, createdAt, text, files, cw, poll, renote, instance = 'barkle.chat', ogs = [], isRenote, barkleFor, reactions, myReaction, className = '' }: NoteProps) {
    const [show, setShow] = useState(!cw)
    const converter = new MfmConverter(instance)
    
    // Cast user to ExtendedUserLite to access isBot safely
    const extendedUser = user as unknown as ExtendedUserLite;

    const timeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + "y";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + "mo";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + "d";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + "h";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + "m";
        return Math.floor(seconds) + "s";
    }

    return (
        <article className={`w-full p-5 rounded-2xl bg-[#191919] text-[#dadada] font-sans ${className}`} style={{ boxShadow: isRenote ? 'none' : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}>
            {/* Header */}
            <header className='flex items-center mb-3'>
                <div className='mr-3'>
                    <Avatar user={extendedUser as any} size={48} />
                </div>
                <div className='flex flex-col leading-tight min-w-0'>
                    <div className='flex items-center gap-1 overflow-hidden'>
                         <span className='font-bold text-[#dadada] text-[15px] truncate'>{converter.convert(user.name || user.username)}</span>
                         {extendedUser.isBot && <span className="bg-[#212121] text-[#8b8b8b] text-[10px] px-1 rounded border border-[#333]">BOT</span>}
                    </div>
                    <div className='flex items-center text-[#8b8b8b] text-[13px] gap-1'>
                        <span className='truncate'>@{user.username}</span>
                        <span>·</span>
                        <span>{timeAgo(createdAt)}</span>
                        <i className="ph-globe-hemisphere-west-bold text-xs"></i>
                    </div>
                </div>
                <div className='ml-auto'>
                     <button className='text-[#8b8b8b] hover:text-[#dadada] p-1'>
                        <i className="ph-dots-three-bold text-xl"></i>
                    </button>
                </div>
            </header>

            {/* Content */}
            <div className='mb-3'>
                {
                    cw ? (<div>
                        <div className='flex items-center gap-2 mb-2'>
                            <span className='italic text-[#dadada]'>{converter.convert(cw)}</span> 
                            <button className='text-[#44a4c1] text-sm hover:underline' onClick={() => setShow(show => !show)}>{show ? 'Hide' : 'Show'}</button>
                        </div>
                    </div>) : <></>
                }
                {
                    show && text ? (
                        <div className='whitespace-pre-line text-[15px] leading-relaxed text-[#dadada] break-words'>
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
                <div className='mt-3 mb-2 text-xs font-bold text-[#666]'>
                    Barkle for {barkleFor}
                </div>
            )}

            {/* Reactions */}
            {reactions && Object.keys(reactions).length > 0 && (
                 <div className='flex flex-wrap gap-1.5 mb-3 mt-2'>
                    {Object.entries(reactions).map(([reaction, count]) => (
                        <button key={reaction} className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-sm transition-colors ${myReaction === reaction ? 'bg-[#e84d83] text-white' : 'bg-[#212121] text-[#dadada] hover:bg-[#333]'}`}>
                            <span>{reaction.replace(/:/g, '')}</span> {/* Simple replacement, ideally use a parser */}
                            <span className={`text-xs ${myReaction === reaction ? 'text-white' : 'text-[#8b8b8b]'}`}>{count}</span>
                        </button>
                    ))}
                    <button className='flex items-center justify-center w-8 h-7 rounded-full bg-[#212121] text-[#8b8b8b] hover:bg-[#333] hover:text-[#dadada] transition-colors'>
                        <i className="ph-plus-bold text-sm"></i>
                    </button>
                </div>
            )}

            {/* Action Buttons */}
            <footer className='flex items-center justify-between text-[#8b8b8b] mt-1 pt-2'>
                <button className='hover:text-[#44a4c1] transition-colors flex items-center gap-1.5 p-2 rounded-full hover:bg-[#44a4c1]/10'>
                    <i className="ph-arrow-bend-up-left-bold text-lg"></i>
                </button>
                <button className='hover:text-[#229e82] transition-colors flex items-center gap-1.5 p-2 rounded-full hover:bg-[#229e82]/10'>
                    <i className="ph-arrows-clockwise-bold text-lg"></i>
                    {renote && renote.renoteCount > 0 && <span className='text-xs font-bold'>{renote.renoteCount}</span>}
                </button>
                <button className='hover:text-[#e84d83] transition-colors flex items-center gap-1.5 p-2 rounded-full hover:bg-[#e84d83]/10'>
                    <i className="ph-star-bold text-lg"></i>
                </button>
                 <button className='hover:text-[#dadada] transition-colors flex items-center gap-1.5 p-2 rounded-full hover:bg-[#dadada]/10'>
                    <i className="ph-share-network-bold text-lg"></i>
                </button>
            </footer>
        </article>
    )
}

const Renote = ({ renote }: { renote?: Note }) => renote ? (<>
    <div className="border border-[rgba(255,255,255,0.1)] rounded-xl p-4 mt-3 bg-[#191919]/50">
        <div className="flex items-center gap-2 mb-2 text-[#8b8b8b] text-sm">
            <i className="ph-arrows-clockwise-bold text-[#229e82]"></i>
            <span>Renoted by {renote.user.name || renote.user.username}</span>
        </div>
        <Note {...renote} ogs={[]} instance='barkle.chat' isRenote></Note>
    </div>
</>) : <></>

const Cards = ({ ogs }: { ogs: OgObject[] }) => {
    return ogs.length > 0 ? (<>
        {
            ogs.map(({ ogImage, ogTitle, requestUrl, ogDescription }) => (
                (
                    <a key={requestUrl} href={requestUrl} target='_blank' rel='noreferrer' className="block mt-3 group">
                        <div className='flex h-24 bg-[#212121] rounded-xl overflow-hidden group-hover:bg-[#2a2a2a] transition-colors border border-[rgba(255,255,255,0.05)]'>
                            <div className='relative w-24 h-24 shrink-0'>
                                {ogImage && (ogImage as ImageObject[])[0] && (
                                    <Image quality={100} src={(ogImage as ImageObject[])[0].url} className='object-cover' fill alt={ogTitle as string}></Image>
                                )}
                            </div>
                            <div className='flex-1 p-3 overflow-hidden flex flex-col justify-center'>
                                <div className='font-bold text-sm text-[#dadada] truncate group-hover:text-[#44a4c1] transition-colors'>{ogTitle}</div>
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

    if (!isMounted || imgs.length === 0) return <></>

    const gridClass = imgs.length === 1 ? 'grid-cols-1 aspect-video' :
                      imgs.length === 2 ? 'grid-cols-2 aspect-[2/1]' :
                      imgs.length === 3 ? 'grid-cols-[1fr_0.5fr] grid-rows-2 aspect-[3/2]' :
                      'grid-cols-2 grid-rows-2 aspect-square';

    return (
        <div className={`grid gap-1 mt-3 rounded-xl overflow-hidden ${gridClass}`}>
            {imgs.map(({ id, thumbnailUrl, url, name }, index) => {
                let style = {};
                if (imgs.length === 3) {
                    if (index === 0) style = { gridRow: '1 / 3' };
                    if (index === 1) style = { gridColumn: '2 / 3', gridRow: '1 / 2' };
                    if (index === 2) style = { gridColumn: '2 / 3', gridRow: '2 / 3' };
                }

                return (
                    <div key={id} className='relative bg-[#212121] w-full h-full' style={style}>
                        <ProgressiveImage preview={thumbnailUrl} src={url} render={(src, imageStyle) => (
                            <>
                                <Image fill src={src} alt={name} className='object-cover' style={{ ...imageStyle, opacity: opacities[index], filter: `blur(${Math.floor((1 - opacities[index]) * 5)}px)` }} />
                                {imgs[index].isSensitive && (
                                    <div className='absolute top-2 right-2 bg-black/50 p-1.5 rounded-lg text-white opacity-70 hover:opacity-100 cursor-pointer backdrop-blur-sm z-10'>
                                        <i className="ph-eye-slash-bold"></i>
                                    </div>
                                )}
                                <div style={{ opacity: 1 - opacities[index] }} className={`${1 - opacities[index] > 0 ? '' : 'hidden'} w-full h-full flex flex-col items-center justify-center absolute top-0 left-0 bg-black/60 backdrop-blur-md z-0 transition-opacity`}>
                                    <span className='text-sm font-bold text-white mb-2'>Sensitive Content</span>
                                    <button className='text-white border border-white/30 bg-white/10 px-3 py-1 rounded-full text-xs hover:bg-white hover:text-black transition-all' onClick={() => {
                                        const fadeInInterval = setInterval(() => {
                                            setOpacities(opacities => Array.from(opacities, (opacity, i) => {
                                                const newOpacity = i === index ? opacity + 0.1 : opacity
                                                if (newOpacity >= 1) {
                                                    clearInterval(fadeInInterval)
                                                    return 1
                                                }
                                                return newOpacity
                                            }))
                                        }, 20)
                                    }}>Show</button>
                                </div>
                            </>
                        )} />
                    </div>
                )
            })}
        </div>
    )
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
        <div className="mt-3 space-y-2">
        {
            poll.choices.map(({ text, votes, isVoted }) => (
                <div
                    key={text}
                    className={`w-full border ${isVoted ? 'border-[#44a4c1]' : 'border-[rgba(255,255,255,0.1)]'} rounded-lg overflow-hidden relative bg-[#212121] h-9`}
                >
                    <div style={{ width: `${allVotes > 0 ? (votes / allVotes * 100) : 0}%` }} className='absolute top-0 left-0 h-full bg-[#44a4c1] opacity-20 transition-all duration-500'></div>
                    <div className='relative px-3 h-full flex justify-between items-center text-sm text-[#dadada]'>
                        <span className='truncate mr-2'>{text}</span>
                        <span className='text-xs text-[#8b8b8b] whitespace-nowrap'>{votes} ({allVotes > 0 ? Math.round(votes / allVotes * 100) : 0}%)</span>
                    </div>
                </div>
            ))
        }
        <div className='text-xs text-[#8b8b8b] mt-1'>
            {allVotes} votes
        </div>
        </div>
    </>) : <></>
}
