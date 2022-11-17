import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head>
        <meta name="twitter:title" content="Brewlabs Earn" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:description"
          content="Stake your tokens on the Brewlabs staking platform to earn passive income, compound or harvest your rewards and reflections anytime!"
        />
        <meta name="twitter:image" content="https://earn.brewlabs.info/images/brewlabs-earn-poster.jpg" />
        <meta name="mobile-web-app-capable" content="yes" />

        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Questrial&family=Caveat&display=swap" rel="stylesheet" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
