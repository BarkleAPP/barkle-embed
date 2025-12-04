import { Sawarabi_Mincho } from 'next/font/google'
import Head from 'next/head'
import Image from 'next/image'
import { CopyBlock, dracula } from 'react-code-blocks'

const mincho = Sawarabi_Mincho({ weight: '400', subsets: ['latin'] })

export default function Home() {
  const embedCode = `<iframe 
  src="https://barkle-embed.vercel.app/barks/YOUR_NOTE_ID" 
  width="100%" 
  height="400" 
  frameborder="0"
></iframe>`;

  return (
    <main className={`${mincho.className} min-h-screen bg-[#191919] text-[#dadada] selection:bg-[#e84d83] selection:text-white`}>
      <Head>
        <title>Barkle Embed</title>
        <meta name='description' content='Embedding solution for Barkle.' />
      </Head>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <header className="text-center mb-16">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <Image 
              priority 
              src="https://barkle.chat/static-assets/dog.png" 
              alt="Barkle Logo" 
              fill
              className="object-contain animate-bounce-slow"
            />
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#e84d83] to-[#44a4c1]">
            Barkle Embed
          </h1>
          <p className="text-xl text-[#8b8b8b] max-w-2xl mx-auto">
            The easiest way to embed Barkle notes, timelines, and timeboards into your website.
          </p>
        </header>

        {/* Usage Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <i className="ph-code-bold text-[#e84d83]"></i>
            <span>Quick Start</span>
          </h2>
          <div className="rounded-xl overflow-hidden border border-[#333] shadow-2xl">
            <CopyBlock
              text={embedCode}
              language="html"
              showLineNumbers={false}
              theme={dracula}
              codeBlock
            />
          </div>
        </section>

        {/* Examples Section */}
        <section className="space-y-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <i className="ph-eye-bold text-[#44a4c1]"></i>
            <span>Live Examples</span>
          </h2>

          <div className="grid gap-8">
            <div className="bg-[#212121] rounded-2xl p-6 border border-[#333]">
              <h3 className="text-lg font-bold mb-4 text-[#dadada]">Single Note</h3>
              <iframe src='/barks/9358xkvosa' className="w-full rounded-xl border border-[#333] bg-[#191919]" height={300}></iframe>
            </div>

            <div className="bg-[#212121] rounded-2xl p-6 border border-[#333]">
              <h3 className="text-lg font-bold mb-4 text-[#dadada]">Timeboard</h3>
              <iframe src='/timeboard/9jnioy0lkk' className="w-full rounded-xl border border-[#333] bg-[#191919]" height={600}></iframe>
            </div>

            <div className="bg-[#212121] rounded-2xl p-6 border border-[#333]">
              <h3 className="text-lg font-bold mb-4 text-[#dadada]">Timeline</h3>
              <iframe src='/timeline/9jnioy0lkk' className="w-full rounded-xl border border-[#333] bg-[#191919]" height={600}></iframe>
            </div>
          </div>
        </section>

        <footer className="mt-20 text-center text-[#666] text-sm">
          <p>&copy; {new Date().getFullYear()} Barkle. All rights reserved.</p>
        </footer>
      </div>
    </main>
  )
}
