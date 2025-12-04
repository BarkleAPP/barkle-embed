export default function Skeleton() {
    return (
        <article className='bg-[#191919] w-full p-6 rounded-xl animate-pulse'>
            <header className='flex items-start mb-2'>
                <div className='bg-[#212121] w-12 h-12 rounded-lg mr-3'></div>
                <div className='flex flex-col justify-center w-full'>
                    <div className='h-4 bg-[#212121] rounded w-32 mb-2'></div>
                    <div className='h-3 bg-[#212121] rounded w-24'></div>
                </div>
            </header>

            <div className='mt-4 space-y-2'>
                <div className='h-3 bg-[#212121] rounded w-full'></div>
                <div className='h-3 bg-[#212121] rounded w-5/6'></div>
                <div className='h-3 bg-[#212121] rounded w-4/6'></div>
            </div>
            
            <div className='mt-4 h-48 bg-[#212121] rounded-lg w-full'></div>

            <footer className='mt-4 flex justify-between'>
                 <div className='h-6 w-6 bg-[#212121] rounded'></div>
                 <div className='h-6 w-6 bg-[#212121] rounded'></div>
                 <div className='h-6 w-6 bg-[#212121] rounded'></div>
                 <div className='h-6 w-6 bg-[#212121] rounded'></div>
            </footer>
        </article>
    )
}
