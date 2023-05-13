import { ActionIcon, Avatar, Divider, Grid, Group, Stack, Text, Timeline, Badge, Box, Loader } from "@mantine/core";
import { IconWalk, IconCheck, IconAlertTriangle, IconInfoCircle, IconMap, IconListDetails, IconTicket } from "@tabler/icons";
import Link from "next/link"
import { useRouter } from "next/router"
import useColors from "./colors"
import { ColoredStopIcon, StopIcon } from "../components/stops"
import { memo, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { dateString, exposition, route } from "../client";
import { useMediaQuery } from "@mantine/hooks";

export const calcDisc = (fee: number, discount?: number) => {
    return discount ? Math.abs(fee - (fee * (discount / 100))) : fee
}

export const currency = new Intl.NumberFormat('hu-HU', { style: 'currency', currency: 'HUF', maximumFractionDigits: 0, minimumFractionDigits: 0 })

function onlyUnique(value: any, index: any, self: any) {
    return self.indexOf(value) === index;
}

export const ActionBullet = memo(({ muvelet, network, size, ...props }: { muvelet: "átszállás" | "leszállás" | "felszállás", network?: number, size?: number }) => {
    if (!size) { size = 20 }
    switch (muvelet) {
        case 'átszállás':
            return <IconWalk size={size} />
        case 'leszállás':
            return <IconCheck size={size} />
        case 'felszállás':
            return <StopIcon size={size} network={network!} />
    }
})

export const RouteSummary = memo(({ item, options }: { item: route, options?: { hideNetworks?: boolean } }) => {
    const { warning } = useColors()
    const [cookies] = useCookies(["discount-percentage"])
    const breakPoint = useMediaQuery("(max-width: 600px)")
    return (<Stack sx={{ position: 'relative' }} spacing={0}>
        <Grid>
            <Grid.Col sx={{ position: 'relative' }} span="auto">
                <Text align="center" size="xl">{item.indulasi_ido}</Text>
                <Text align="center" size="sm">{item.departureCity}, {item.departureStation}</Text>
            </Grid.Col>
            <Grid.Col span="auto" sx={{ position: 'relative' }}>
                <Text align="center" size="xl">{item.erkezesi_ido}</Text>
                <Text align="center" size="sm">{item.arrivalCity}, {item.arrivalStation}</Text>
            </Grid.Col>
        </Grid>
        <Divider size="lg" my={6} />
        <Text align="center">{item.atszallasok_szama} átszállás {item.riskyTransfer ? <IconAlertTriangle size={15} stroke={2} color={warning} /> : <></>}</Text>
        <Group position="center" spacing='sm'>
            <Text size="sm">{item.osszido}</Text>
            {item.totalFare > 0 ? <Text suppressHydrationWarning size="sm">{currency.format(calcDisc(item.totalFare, cookies["discount-percentage"]))}</Text> : <></>}
            <Text size="sm">{item.ossztav}</Text>
        </Group>
    </Stack>)
})

export const RouteExposition = ({ route, exposition, options }: { route: route, exposition: Array<exposition>, options?: { hideRunsButton?: boolean, disableMap?: boolean } }) => {
    const [mapView, setMapView] = useState(false)
    const [geoInfo, setGeoInfo] = useState(null)
    const router = useRouter()

    return (<Stack>
        <Timeline active={Infinity}>
            {Object.keys(exposition).map((key: any, index) => {
                const item: exposition = exposition[key]
                return (<Timeline.Item lineVariant={item.muvelet === "átszállás" ? "dashed" : "solid"} key={index} bullet={<ActionBullet muvelet={item.muvelet} network={item.network!} />}>
                    <Stack spacing={0}>
                        <ExpositionBody item={item} options={options} />
                    </Stack>
                </Timeline.Item>)
            })}
        </Timeline>
    </Stack>)
}

const MyBadge = ({ icon, text }: { icon: any, text: string }) => (<Badge size="lg" leftSection={<Box sx={{ display: "flex", alignItems: "center" }}>{icon}</Box>}>{text}</Badge>)

export const ExpositionBody = ({ item, options, onClick }: { item: exposition, options?: { hideRunsButton?: boolean }, onClick?: any }) => {
    const router = useRouter()
    const [cookies] = useCookies(["discount-percentage"])

    return (<>
        <Group onClick={onClick} spacing={0} position="apart">
            <Stack spacing={0}>
                <Text>{item.allomas}</Text>
                <Group spacing="xs" position="left">
                    <Text size="xl" my={-2}>{item.idopont}</Text>
                    {!item.jaratinfo?.FromBay ? <></> : <Avatar variant="outline" radius="xl" size={25}>{item.jaratinfo.FromBay}</Avatar>}
                </Group>
            </Stack>
        </Group>
        {!item.tarsasag || !item.runId || !item.network ? <></> : <Group spacing="xs">
            <ColoredStopIcon stroke={1.5} network={item.network} />
            <Text size="sm">{item.tarsasag}</Text>
            <Text size="sm">{item.jaratszam}</Text>
        </Group>}
        {!item.jaratinfo?.fare || !item.jaratinfo.utazasi_tavolsag || !item.jaratinfo.travelTime ? <></> :
            <Group spacing={10}>
                {item.jaratinfo.fare < 0 ? <></> : <Text suppressHydrationWarning size="sm">{currency.format(calcDisc(item.jaratinfo.fare, cookies["discount-percentage"]))}</Text>}
                <Text size="sm">{item.jaratinfo.utazasi_tavolsag} km</Text>
                <Text size="sm">{item.jaratinfo.travelTime} perc</Text>
            </Group>
        }
        {!item.vegallomasok ? <></> : <Text size="sm">{item.vegallomasok}</Text>}
        {!item.jaratinfo?.kozlekedik ? <></> : <Text size="sm">Közlekedik: {item.jaratinfo.kozlekedik}</Text>}
        {item.muvelet !== "felszállás" ? <></> :
            <Group mt={4}>
                {item.jaratinfo?.CountyPass !== "" ? <MyBadge icon={<IconTicket />} text={`Országos vagy ${item.jaratinfo?.CountyPass} vármegyebérlet`} /> : <></>}
            </Group>
        }
    </>)
}