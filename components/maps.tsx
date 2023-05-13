import { ActionIcon, Avatar, Box, Card, Group, LoadingOverlay, Space, Stack, Text, ThemeIcon, Timeline, useMantineTheme } from "@mantine/core"
import * as L from "leaflet"
import 'leaflet/dist/leaflet.css'
import { useEffect } from "react";
import proj4 from "proj4";
import {
    IconArrowBigTop,
    IconInfoCircle,
    IconWifi,
    IconQuestionMark,
    IconArrowBigDown,
    IconCheck,
    IconRefresh,
} from "@tabler/icons";
import Link from "next/link";
import router from "next/router";
import { currency, calcDisc, ActionBullet, ExpositionBody } from "./routes";
import { renderToStaticMarkup } from 'react-dom/server'
import { useCookies } from "react-cookie";
import { exposition } from "@/client";

require("proj4leaflet")
require("leaflet.markercluster")

proj4.defs("EPSG:23700", "+title=Hungarian EOV EPSG:23700 +proj=somerc +lat_0=47.14439372222222 +lon_0=19.04857177777778 +k_0=0.99993 +x_0=650000 +y_0=200000 +ellps=GRS67 +datum=HD72 +towgs84=52.17,-71.82,-14.9,0,0,0,0 +units=m +no_defs");
const crs = {
    crs: {
        type: "name",
        properties: {
            name: "EPSG:23700"
        }
    }
}
const bp: L.LatLngExpression = [47.4979, 19.0402]
const getExtent = (map: L.Map, pad: number = 0) => {
    const bounds = map.getBounds().pad(pad)
    const a = bounds.getNorthWest()
    const b = bounds.getSouthEast()
    return [a.lng, a.lat, b.lng, b.lat]
}

export const RouteMapView = ({ id, details, exposition }: { id: any, details: any, exposition: any }) => {
    const stops = !details ? undefined : (details.results.features as Array<any>).filter((item) => item.geometry.type === "Point")
    const theme = useMantineTheme()
    const color = theme.colors[theme.primaryColor][7]
    const iconProps = { size: 25 }

    useEffect(() => {
        const map = L.map(`map-${id}`).setView(bp, 13);
        (window as any).map = map
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);
        return () => { map.off(); map.remove(); (window as any).map = undefined }
    }, [])

    useEffect(() => {
        if (details) {
            const markers = L.markerClusterGroup({
                spiderfyDistanceMultiplier: .05,
                showCoverageOnHover: true,
                zoomToBoundsOnClick: true,
                iconCreateFunction: (cluster) => {
                    return L.divIcon({ html: (renderToStaticMarkup(<ThemeIcon radius="xl"><IconRefresh {...iconProps} /></ThemeIcon>)) });
                },
                animate: true,
            });
            const mapPin = (muvelet: string) => L.divIcon({
                html: renderToStaticMarkup(<ThemeIcon radius="xl">{(() => {
                    switch (muvelet) {
                        case 'felszall':
                            return <IconArrowBigTop {...iconProps} />
                        case 'atszallashoz_felszall':
                            return <IconArrowBigTop {...iconProps} />
                        case 'atszallashoz_leszall':
                            return <IconArrowBigDown {...iconProps} />
                        case 'leszall':
                            return <IconCheck {...iconProps} />
                        default:
                            return <IconQuestionMark {...iconProps} />
                    }
                })()}</ThemeIcon>),
                className: "map-pin-marker",
                iconSize: [20, 20],
                iconAnchor: [10, 20],
            });
            const [inside, outside] = [new L.FeatureGroup(), new L.FeatureGroup()]
            for (let feature of details.results.features) {
                const geoJson: any = {
                    ...feature,
                    ...crs
                }
                const elem = L.Proj.geoJson(geoJson, { style: { weight: 3 }, pointToLayer: (feature, latlng) => L.marker(latlng, { icon: mapPin(geoJson.properties.type) }) })
                switch (feature.geometry.type) {
                    case 'Point':
                        elem.addTo(markers)
                        break
                    case 'LineString':
                        if (feature.properties.inside) { elem.addTo(inside) } else { elem.addTo(outside) }
                        inside.setStyle({ color: color })
                        outside.setStyle({ color: theme.colors.gray[7], dashArray: [10, 5] })
                        break
                    case 'MultiPoint':
                        break
                    default:
                        break
                }
            }
            outside.addTo((window as any).map)
            inside.addTo((window as any).map)
            markers.addTo((window as any).map);
            (window as any).map.flyToBounds(inside.getBounds(), { duration: .5 })
        }
    }, [details])

    return (<Box sx={{ minHeight: '20rem', position: 'relative', display: 'flex', flexWrap: 'wrap', '& > *': { flex: '40%', minWidth: '20rem' } }} mb="sm">
        <LoadingOverlay visible={!details} />
        <Box aria-label="Térkép" id={`map-${id}`} sx={({ minHeight: '20rem', fontFamily: 'unset !important' })} />
        <Card sx={(theme) => ({ borderRadius: 0 })}>
            <Timeline active={Infinity}>
                {!stops ? <></> : stops.map((stop: any, i: any) => {
                    const focus = () => {
                        try {
                            const emptyPin = L.divIcon({
                                html: ``,
                                className: "empty-marker",
                                iconSize: [0, 0],
                                iconAnchor: [0, 0],
                            });
                            var feature = L.Proj.geoJson({ ...stop, ...crs }, { pointToLayer: (feature, latlng) => L.marker(latlng, { icon: emptyPin }) }).addTo((window as any).map);
                            (window as any).map.flyToBounds(feature.getBounds(), { maxZoom: 15, duration: .5 })
                            feature.off()
                            feature.remove()
                        } catch (e) { console.log(e) }
                    }
                    const stopExposition: exposition = exposition[i]
                    return (<Timeline.Item bullet={<Box onClick={focus} p={0} m={0} sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}><ActionBullet size={18} muvelet={stopExposition.action} network={stopExposition.network} /></Box>} key={i}>
                        <Stack spacing={0}>
                            <ExpositionBody onClick={focus} item={stopExposition} />
                        </Stack>
                    </Timeline.Item>)
                })}
            </Timeline>
        </Card>
    </Box>)
}