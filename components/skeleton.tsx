export default function Skeleton() {
    return (
        <article className='bg-[#191919] w-full p-5 rounded-2xl animate-pulse'>
            <header className='flex items-center mb-3'>
                <div className='bg-[#212121] w-12 h-12 rounded-full mr-3'></div>
                <div className='flex flex-col justify-center w-full'>
                    <div className='h-4 bg-[#212121] rounded w-32 mb-2'></div>
                    <div className='h-3 bg-[#212121] rounded w-24'></div>
                </div>
            </header>

            <div className='mt-3 space-y-2'>
                <div className='h-4 bg-[#212121] rounded w-full'></div>
                <div className='h-4 bg-[#212121] rounded w-5/6'></div>
                <div className='h-4 bg-[#212121] rounded w-4/6'></div>
            </div>
            
            <div className='mt-3 h-48 bg-[#212121] rounded-xl w-full'></div>

            <footer className='mt-4 flex justify-between pt-2 border-t border-[rgba(255,255,255,0.05)]'>
                 <div className='h-8 w-8 bg-[#212121] rounded-full'></div>
                 <div className='h-8 w-8 bg-[#212121] rounded-full'></div>
                 <div className='h-8 w-8 bg-[#212121] rounded-full'></div>
                 <div className='h-8 w-8 bg-[#212121] rounded-full'></div>
            </footer>
        </article>
    )
}
