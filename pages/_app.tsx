import { AppProps } from 'next/app';
import Head from 'next/head';
import { Box, Container, LoadingOverlay, MantineProvider } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { NavbarMinimal } from '@/components/nav';
import { IconInfoCircle, IconRoadSign, IconSettings } from '@tabler/icons';
import { useEffect, useState } from 'react';
import "@/styles/globals.css"
import { createContext } from 'react';
import { Stop } from '@/client';
import Script from 'next/script';
import { PWAAssets } from '@/builtComponents/pwa';
import { useUserAgent } from '@/components/ua';
import { useCookies } from 'react-cookie';
import { useRouter } from 'next/router';

export interface Selection {
  from: Stop | undefined;
  to: Stop | undefined;
}
export interface Input {
  from: string;
  to: string;
}
export const Input = createContext<{ selection: Selection, setSelection: (a: Selection) => void, input: Input, setInput: (a: Input) => void }>({ selection: { from: undefined, to: undefined }, setSelection: () => { }, input: { from: "", to: "" }, setInput: () => { } })
export const MenuHandler = createContext<{ menuOpen: number, setMenuOpen: (a: number) => void }>({ menuOpen: -1, setMenuOpen: () => { } })

export default function App(props: AppProps) {
  const { Component, pageProps } = props;
  const mobileBreakpoint = useMediaQuery("(max-width: 600px)")
  const [pageLoading, setPageLoading] = useState(false)
  const [[selection, setSelection], [input, setInput]] = [useState<Selection>({ to: undefined, from: undefined }), useState<Input>({ to: "", from: "" })]
  const [menuOpen, setMenuOpen] = useState(-1)
  const [cookies, setCookie, removeCookie] = useCookies(['discount-percentage', 'calendar-service', 'install-declined', 'route-limit', 'use-route-limit', 'maps-beta'])
  const ua = useUserAgent()
  const [dlVisible, setDlVisible] = useState(false)
  const [prompt, setPropmt] = useState<Event & any | undefined>()
  const router = useRouter()

  useEffect(() => { // Init cookies
    if (typeof cookies['discount-percentage'] === "undefined") setCookie('discount-percentage', 0, { path: '/', maxAge: 60 * 60 * 24 * 365 })
    if (typeof cookies['calendar-service'] === "undefined") setCookie('calendar-service', ua?.device.vendor === "Apple" ? '5' : '1', { path: '/', maxAge: 60 * 60 * 24 * 365 })
    if (typeof cookies['install-declined'] === "undefined") setCookie("install-declined", 'false', { path: '/', maxAge: 60 * 60 * 24 * 365 })
    if (typeof cookies['use-route-limit'] === "undefined") setCookie("use-route-limit", 'true', { path: '/', maxAge: 60 * 60 * 24 * 365 })
    if (typeof cookies['route-limit'] === "undefined") setCookie("route-limit", '15', { path: '/', maxAge: 60 * 60 * 365 })
    if (typeof cookies['maps-beta'] === "undefined") setCookie("maps-beta", 'false', { path: '/', maxAge: 60 * 60 * 365 })
  }, [cookies])

  useEffect(() => {
    if (prompt && cookies["install-declined"] === "false") {
      setDlVisible(true)
    }
  }, [prompt, cookies])

  useEffect(() => {
    const handler = (e: Event & any) => {
      e.preventDefault()
      setPropmt(e)
    }
    if (typeof window !== 'undefined') {
      window.addEventListener("beforeinstallprompt", handler)
    }
    return () => {
      window.removeEventListener("beforeinstallprompt", handler)
    }
  }, [])

  useEffect(() => {
    router.events.on('routeChangeStart', () => setPageLoading(true))
    router.events.on('routeChangeComplete', () => setPageLoading(false))
    router.events.on('routeChangeError', () => setPageLoading(false))
    return () => {
      router.events.off('routeChangeStart', () => setPageLoading(true))
      router.events.off('routeChangeComplete', () => setPageLoading(false))
      router.events.off('routeChangeError', () => setPageLoading(false))
    }
  })

  return (
    <>
      <Head>
        <title>Menetrendek</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />

        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <link rel='icon' type="image/x-icon" href='/favicon.ico' />
        <meta property="og:type" content="website" />
        <meta property="twitter:card" content="summary_large_image" />
        <link rel="manifest" href="/api/manifest.webmanifest" />
        <PWAAssets />
      </Head>

      <Script id="google-tag-manager" strategy="afterInteractive" /*Google tag manager*/>
        {`
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','GTM-MVHLMXV');
                `}
      </Script>

      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          colorScheme: 'dark',
          primaryColor: 'indigo',
          primaryShade: 7,
          fontFamily: 'Sora, sans-serif',
        }}
      >
        <Input.Provider value={{ selection, setSelection, input, setInput }}>
          <MenuHandler.Provider value={{ menuOpen, setMenuOpen }}>
            <NavbarMinimal doBreak={mobileBreakpoint} data={[
              {
                icon: IconRoadSign,
                label: 'Útvonal tervezés',
                href: '/',
              },
              {
                icon: IconInfoCircle,
                label: 'A projektről',
                href: 'https://github.com/menetrendek-info',
              },
              {
                icon: IconSettings,
                label: 'Beállítások',
                href: '/settings',
              }
            ]} />
            <div className='bg' style={{ backgroundImage: 'url("/api/img/bg.jpg?s=2000")' }} />
            <Box ml={mobileBreakpoint ? 0 : 80} mb={mobileBreakpoint ? 80 : 0} pt="xl" sx={{ position: "relative", minHeight: !mobileBreakpoint ? '100vh' : 'calc(100vh - 80px)', width: mobileBreakpoint ? '100%' : 'calc(100% - 80px)' }}>
              <LoadingOverlay overlayOpacity={.5} loaderProps={{ size: "lg" }} style={{ zIndex: '99 !import', width: '100vw', height: '100vh', position: 'fixed', top: 0, left: 0 }} visible={pageLoading} />
              <Container p="lg" pt="xl">
                <Component {...pageProps} />
              </Container>
            </Box>
          </MenuHandler.Provider>
        </Input.Provider>
      </MantineProvider>
      <noscript
        dangerouslySetInnerHTML={{
          __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-MVHLMXV" height="0" width="0" style="display: none; visibility: hidden;" />`,
        }}
      />
    </>
  );
}