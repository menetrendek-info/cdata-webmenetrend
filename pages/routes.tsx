import type { NextPage } from "next"
import { apiCall } from "../components/api"
import { dateString, exposition, queryExpostition, queryRoutes, route } from "../client"
import { PageHeading } from "../components/page"
import { IconCalendarEvent, IconClock, IconLine, IconShare } from "@tabler/icons"
import { Accordion, ActionIcon, Group, Loader, Skeleton, Slider, Text, Timeline, Stack, Space } from "@mantine/core"
import { useMyAccordion } from "../components/styles"
import { ActionBullet, RouteExposition, RouteSummary } from "../components/routes"
import { memo, useEffect, useState } from "react"
import { yahoo, office365, google, ics, outlook, CalendarEvent } from "calendar-link";
import { useRouter } from "next/router"
import { useCookies } from "react-cookie"
import { decompressFromBase64 } from "lz-string"

const cal = (service: number, body: any) => {
    window.open((() => {
        switch (service) {
            case 1:
                return google(body)
            case 2:
                return outlook(body)
            case 3:
                return office365(body)
            case 4:
                return yahoo(body)
            case 5:
            default:
                return ics(body)
        }
    })(), "_blank")
}

const RE = memo((props: any) => {
    return (<RouteExposition {...props} />)
})

const Route = ({ route, index }: { route: route, index: any }) => {
    const [exposition, setExposition] = useState<any>(undefined)
    const router = useRouter()
    const [file, setFile] = useState<File | undefined>()
    const [body, setBody] = useState<CalendarEvent | undefined>()
    const [cookies] = useCookies(["calendar-service", "maps-beta"])

    return (<>
        <Accordion.Control onClick={() => {
            queryExpostition(router.query.d ? new Date(router.query.d as string) : new Date(), route.kifejtes_postjson, route.nativeData).then(async (e) => {
                setExposition(e)
                
            })
        }}>
            <RouteSummary item={route} />
        </Accordion.Control>
        <Accordion.Panel>
            {!exposition ? (<Stack>
                <Timeline active={Infinity}>{Array(route.kifejtes_postjson.runcount * 2).fill(0).map((v, i, arr) => {
                    if (i + 1 === arr.length) {// Last element
                        return (<Timeline.Item key={i} bullet={<ActionBullet muvelet="leszállás" network={1} />}>
                            <Skeleton radius="lg" height={53} />
                        </Timeline.Item>)
                    } else {
                        return (<Timeline.Item key={i} lineVariant={i % 2 !== 0 ? "dashed" : "solid"} bullet={<ActionBullet muvelet={i % 2 !== 0 ? "átszállás" : "felszállás"} network={1} />}>
                            <Skeleton radius="lg" height={i % 2 === 0 ? 98 : 120} />
                        </Timeline.Item>)
                    }
                })}</Timeline>
                <Group position="right">
                    <Loader size={28} />
                </Group>
            </Stack>) : <>
                <RE route={route} exposition={Object.keys(exposition.results).map((key: any) => exposition.results[key])} options={{ disableMap: (cookies["maps-beta"]) === "false" }} />
                <Group position="right">
                    <ActionIcon role="button" aria-label="Hozzáadás a naptárhoz" onClick={() => cal(Number(cookies["calendar-service"]), body)}>
                        <IconCalendarEvent />
                    </ActionIcon>
                    {!file ? <Loader size={28} /> :
                        <ActionIcon role="button" aria-label="Megosztás" onClick={() => {
                            const params: any = {
                                from: router.query.from,
                                to: router.query.to,
                                index: index,
                            }
                            navigator.share({ files: [file], url: `https://menetrendek.info/route?${(new URLSearchParams(params)).toString()}`, "title": body?.title })
                        }}>
                            <IconShare />
                        </ActionIcon>}
                </Group>
            </>}
        </Accordion.Panel>
    </>)
}

const marks = () => {
    let m: any = []
    for (let i = 0; i < 9; i++) {
        m.push({ label: (i * 3).toString().padStart(2, '0'), value: i * 3 * 60 })
    }
    return m
}

const Routes: NextPage = (props: any) => {
    const { classes, theme } = useMyAccordion()
    const [cookies] = useCookies(["use-route-limit", "route-limit"])
    const [sliderVal, setSliderVal] = useState<number | undefined>()
    const [time, setTime] = useState<number | undefined>()
    const [display, setDisplay] = useState<any>([])
    const router = useRouter()

    useEffect(() => {
        if (typeof time === "undefined" && !router.query.d) setTime((new Date()).getHours() * 60 + (new Date()).getMinutes())
    }, [time])

    useEffect(() => {
        if (time) setSliderVal(time)
    }, [time])

    useEffect(() => {
        if (cookies["use-route-limit"] === "true") {
            let disp: any = []
            setDisplay(Object.keys(props.routes.results.talalatok).map((key: any, i: any) => {
                const item: route = props.routes.results.talalatok[key]
                const start = item.indulasi_ido.split(":").map((e: string) => Number(e))
                const startmin = start[0] * 60 + start[1]
                if (startmin <= time!) return
                disp.push(i)
            }))
            setDisplay(disp)
        } else {
            setDisplay([...Array(100).keys()].map(e => e.toString()))
        }
    }, [time, cookies["use-route-limit"]])

    return (<>
        <PageHeading title="Járatok" subtitle={`Járatok ${props.routes.fromSettle} és ${props.routes.toSettle} között`} icon={IconLine} />
        {cookies["use-route-limit"] !== 'true' ? <></> : <>
            <Slider my="sm" step={15} value={sliderVal || 0} onChange={setSliderVal} thumbChildren={<IconClock size={30} />} styles={{ thumb: { borderWidth: 0, padding: 0, height: 25, width: 25 } }} onChangeEnd={setTime} marks={marks()} min={0} max={1440} size="lg" label={(e) => `${Math.floor(e / 60).toString().padStart(2, '0')}:${(e % 60).toString().padStart(2, '0')}`} />
            <Space h="xs" />
        </>}
        <Accordion classNames={classes}>
            {!display.length ? <Text size="sm" align="center" color="dimmed">A megadott idő után nem találtunk semmit.</Text> :
                display.map((key: any, i: any) => {
                    const item: route = props.routes.results.talalatok[key]
                    if (!item) return <></>
                    const start = item.indulasi_ido.split(":").map((e: string) => Number(e))
                    const startmin = start[0] * 60 + start[1]
                    if (cookies["use-route-limit"] === "true" && startmin <= time! || i > Number(cookies["route-limit"])) return <div key={key} />
                    return (<Accordion.Item my="sm" key={key} value={key.toString()}>
                        <Route index={key} route={item} />
                    </Accordion.Item>)
                })
            }
        </Accordion>
    </>)

}

Routes.getInitialProps = async (ctx: any) => {
    return {
        routes: await queryRoutes(ctx.query.d || new Date(), JSON.parse(decompressFromBase64(ctx.query.from)), JSON.parse(decompressFromBase64(ctx.query.to))),
    }
}

export default Routes