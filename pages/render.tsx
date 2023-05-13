import { Box, Center, Group, MantineProvider, Paper, Space, Text } from "@mantine/core";
import { IconLink } from "@tabler/icons";
import type { NextPage } from "next";
import { dateString, queryExpostition, queryRoutes } from "../client";
import { apiCall, getHost } from "../components/api";
import { RouteExposition, RouteSummary } from "../components/routes";
import React from "react";
import { decompressFromBase64 } from "lz-string";

const Render: NextPage = (props: any) => {
    const { route, exposition } = props

    return (<MantineProvider withGlobalStyles withNormalizeCSS theme={{
        colorScheme: 'dark',
        primaryColor: 'indigo',
        primaryShade: 7,
        fontFamily: 'Sora, sans-serif',
        fontSizes: {
            "xs": '18px',
            "sm": '20px',
            "md": '22px',
            "lg": '24px',
            "xl": '26px',
        }
    }}>
        <Center sx={{ zIndex: 89, position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'black' }}>
            <Box id="renderBox" p="md" pb={0} sx={{ zIndex: 90, background: '#25262B', maxWidth: 600 }}>
                <Paper p="sm" radius="lg">
                    <RouteSummary item={route} options={{ hideNetworks: true }} />
                    <Space h='md' />
                    <RouteExposition route={route} exposition={exposition} options={{ hideRunsButton: true, disableMap: true }} />
                </Paper>
                <Group py={6} style={{ opacity: .8 }} position="right" spacing={2}>
                    <IconLink size={17} />
                    <Text suppressHydrationWarning size={15}>{typeof window !== 'undefined' && location.origin.split("://")[1]}</Text>
                </Group>
            </Box>
        </Center>
    </MantineProvider>)
}

Render.getInitialProps = async (ctx) => {
    const host = getHost(ctx.req)
    let props: any = {}
    props.route = (await queryRoutes(ctx.query.d ? new Date(ctx.query.d as string) : new Date(), JSON.parse(decompressFromBase64(ctx.query.from as string)), JSON.parse(decompressFromBase64(ctx.query.to as string)))).results.talalatok[ctx.query.i as string]
    props.exposition = (await queryExpostition(ctx.query.d ? new Date(ctx.query.d as string) : new Date(), props.route.kifejtes_postjson, props.route.nativeData)).results
    return props
}

export default Render;