import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang='en'>
      <Head>
        <meta property='og:title' content='Barkle embeds' />
        <meta property='og:description' content='An embedding solution for Barkle' />
        <meta property='og:image' content='https://barkle.chat/static-assets/dog.png' />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
