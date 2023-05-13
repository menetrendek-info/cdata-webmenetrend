import { Box, Code, Divider, Group, List, Space, Stack, Text, ActionIcon } from '@mantine/core';
import type { NextPage } from 'next';
import { PageHeading, PageSection } from '../components/page';
import {
    IconApps,
    IconBrandPaypal,
    IconCoin,
    IconHeart,
    IconLayout,
    IconMap,
    IconPlus,
    IconRoadSign,
    IconRotateClockwise,
    IconSearch,
    IconShare,
    IconWallet,
} from '@tabler/icons';
import "dayjs/locale/hu"
import { Search } from '../components/menu';
import { FeaturesGrid } from '../components/hello';
import { useMediaQuery } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { MyThemeIcon } from '@/components/brand';

const Home: NextPage = () => {
    const versionHide = useMediaQuery('(max-width: 435px)');
    const [donate, setDonate] = useState(false);

    return (<>
        <Group onClick={() => setDonate(false)} position='center' sx={{ pointerEvents: donate ? 'all' : 'none', overflow: 'hidden', transition: 'background .2s', zIndex: 9999, position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: donate ? 'rgba(0,0,0,.6)' : 'transparent' }}>
            <iframe id='kofiframe' src='https://ko-fi.com/menetrendekinfo/?hidefeed=true&widget=true&embed=true&preview=true' style={{ opacity: donate ? 1 : 0, border: 'none', borderRadius: 8 }} width={400} height={712} title='menetrendekinfo'></iframe>
        </Group >
        <PageHeading icon={IconRoadSign} title="Menetrendek" subtitle='A modern menetrend kereső' suffix={versionHide ? <></> : <Code>v3.1</Code>} />
        <Stack px="xs" spacing={0} sx={{ position: 'relative', display: 'flex' }}>
            <Box sx={(theme) => ({ zIndex: -1, position: 'absolute', top: 0, left: 0, width: '100%', height: 'calc(100% - 20px)', margin: '5px 0', borderRadius: theme.radius.md, background: theme.fn.rgba(theme.colors.dark[9], .7) })} />
            <Divider size="sm" my="sm" mt="md" label={<Text size="md">Útvonalterv készítése</Text>} />
            <Search />
            <Space h="xl" />
            <Space h="md" />
        </Stack>
        <Stack my="lg" spacing={0}>
            <PageSection icon={IconPlus} title="Miért válassz minket?" subtitle="Íme néhány dolog, amiben egyszerűen jobbak vagyunk" />
            <Space h="md" />
            <FeaturesGrid
                data={[
                    { title: "Kezelőfelület", icon: IconLayout, description: "Modern, letisztult és mobilbarát kezelőfelület." },
                    { title: "Gyors elérés", icon: IconSearch, description: "Egyszerű megálló- és állomáskeresés, a legutóbbi elemek mentése gyors elérésbe." },
                    { title: "Megosztás", icon: IconShare, description: "Útvonaltervek gyors megosztása kép formájában." },
                    { title: "Térkép nézet [BETA]", icon: IconMap, description: "Az útvonaltervek térképen is megtekinthetőek. Így garantáljuk, hogy eligazodsz az átszállásoknál. Keresd a beállításokban!" },
                    { title: "PWA támogatás", icon: IconApps, description: "Ez a weboldal egy PWA (progresszív webalkalmazás), így könnyen letöltheted alkalmazásként a telefonodra." },
                    { title: "Aktív fejlesztés", icon: IconRotateClockwise, description: "A weboldal szinte minden héten frissül. A funkciók folyamatosan bővülnek és a hibák folyamatosan javítva vannak." },
                ]}
            />
            <Space h="lg" />
        </Stack>
        <Stack my="lg" spacing={0}>
            <PageSection icon={IconHeart} title="Projekt támogatása" subtitle="Szeretnéd segíteni a Menetrendek.info-t?" />
            <Space h="md" />
            <Text>A weboldal fenntartása és fejlesztése sok időt és erőforrást igényel, ezért hálásak vagyunk minden támogatásért, amely segít minket abban, hogy továbbra is minőségi szolgáltatást nyújtsunk. Ha elégedett vagy a weboldalunkkal, és szeretnéd támogatni a munkánkat, kérjük, fontold meg az alábbi lehetőségeket:</Text>
            <List spacing='sm' mt="sm">
                <List.Item
                    onClick={() => setDonate(true)}
                    style={{ cursor: 'pointer' }}
                    icon={<MyThemeIcon><IconCoin /></MyThemeIcon>}
                >
                    <Stack spacing={0}>
                        <Text size="xl">Adományozz Ko-Fi-n keresztül</Text>
                        <Text>Egyszerű és biztonságos módja annak, hogy pénzbeli támogatást nyújts a weboldalnak. Csak kattints ide és kövesd az utasításokat. Bármilyen összeget elfogadunk és nagyra értékelünk.</Text>
                    </Stack>
                </List.Item>
                <List.Item
                    icon={<MyThemeIcon><IconWallet /></MyThemeIcon>}
                >
                    <Stack spacing={0}>
                        <Text size="xl">Hirdess a weboldalon</Text>
                        <Text>Ha szeretnéd elérni a közlekedés iránt érdeklődő közönséget, akkor hirdess a weboldalon. Ha érdekel a hirdetési lehetőség, kérjük, lépj kapcsolatba velünk az <Link className='my-link' target='_blank' href="mailto:shibibence@gmail.com">shibibence@gmail.com</Link> e-mail címen.</Text>
                    </Stack>
                </List.Item>
                <List.Item
                    icon={<MyThemeIcon><IconShare /></MyThemeIcon>}
                >
                    <Stack spacing={0}
                        style={{ cursor: 'pointer' }}
                        onClick={() => navigator.share({ url: 'https://menetrendek.info', title: "Menetrendek.info", text: "A modern menetrend kereső" })}
                    >
                        <Text size="xl">Oszd meg a weboldalt!</Text>
                        <Text>Ha tetszik a weboldalunk, és szeretnéd megosztani másokkal is, akkor kattints ide, vagy használd a megosztás gombokat az utvonaltervek jobb alsó sarkában. Minél több ember ismeri meg a weboldalunkat, annál jobban tudunk fejlődni és bővülni.</Text>
                    </Stack>
                </List.Item>
            </List>
        </Stack>
    </>)
}

export default Home