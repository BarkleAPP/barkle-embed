import dynamic from 'next/dynamic'
import { Sawarabi_Mincho } from 'next/font/google'
import Head from 'next/head'
import GithubCorner from 'react-github-corner'
import Image from 'next/image'

const ReactEmbedGist = dynamic(() => import('react-embed-gist'), {
  ssr: false,
})
const mincho = Sawarabi_Mincho({ weight: '400', subsets: ['latin'] })

export default function Home() {
  const customStyle = {
    backgroundColor: '#1f1d28', // Set the background color to #1f1d28
    color: '#e84d83', // Default text color
  };

  const barkleTextColor = {
    color: '#e84d83', // Text color for "Barkle"
  };

  const embeddingTextColor = {
    color: 'white', // Text color for "Embedding solution for Barkle"
  };

  return (
    <main style={customStyle} className={`${mincho.className} overflow-y-auto p-8`}>
      <Head>
        <meta name='description' content={'Embedding solution for Barkle.'} />
      </Head>

      <h1 className='text-5xl text-center'>
        <div className='my-2 relative h-20'>
          <Image priority={true} className='absolute animate-fade left-1/2 -translate-x-1/2' src={'https://baog.pngrkle.chat/static-assets/d'} quality={100} width={80} height={80} alt='Barkle Logo'></Image>
        </div>
        <div className='bg-clip-text font-extrabold text-transparent bg-gradient-to-r from-indigo-300 to-purple-400' style={barkleTextColor}>Barkle</div>
      </h1>
      <p className='text-center text-#e84d83 italic' style={embeddingTextColor}>Embedding solution for Barkle</p>
      <br></br>

      <div className='w-2/3 mx-auto rounded-lg opacity-90 p-5 overflow-x-hidden' style={{ minWidth: 280 }}>
        <ReactEmbedGist titleClass='hidden' loadingClass='hidden' gist='AidanTheBandit/390ed225bc649bf1b1cf8c211a73c160'></ReactEmbedGist>
        <hr className='my-5 border-purple-400'></hr>
        <iframe src='/note/9358xkvosa' width={'100%'} height={260}></iframe>
        <br></br>
        <iframe src='/timeboard/9jnioy0lkk' width={'100%'} height={1000}/>
        <br></br>
        <iframe src='/timeline/9jnioy0lkk' width={'100%'} height={1000}></iframe>
      </div>
      <br></br>
    </main>
  )
}
