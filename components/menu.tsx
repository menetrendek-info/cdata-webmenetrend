import { Grid, Button, useMantineTheme, createStyles } from "@mantine/core"
import { DatePicker, DatePickerInput } from "@mantine/dates"
import { IconSearch } from "@tabler/icons"
import { useState } from "react";
import Link from "next/link"
import { useRouter } from "next/router"
import { StopInput } from "./stops";
import { useContext, useCallback, useEffect } from "react"
import { Input } from "@/pages/_app";
import { dateString, Stop } from "@/client";
import { compressToBase64 } from "lz-string"

export const Search = () => {
    const theme = useMantineTheme()
    const [searchHref, setSearchHref] = useState<string>("#")
    const { selection, setSelection, input } = useContext(Input)
    const [from, setFrom]: any = [selection ? selection.from as Stop : undefined, (e: Stop | undefined) => { setSelection({ ...selection, from: e }) }]
    const [to, setTo]: any = [selection ? selection.to as Stop : undefined, (e: Stop | undefined) => { setSelection({ ...selection, to: e }) }]
    const [from_input, to_input] = [input.from, input.to]
    const [date, setDate] = useState<Date | null>(null)
    const router = useRouter()

    const generateUrl = useCallback(async () => {
        if (!from || !to) { setSearchHref("#"); return }
        setSearchHref(`/routes?${(new URLSearchParams({
            ...(from ? { from: compressToBase64(JSON.stringify(from)) } : {}),
            ...(to ? { to: compressToBase64(JSON.stringify(to)) } : {}),
            ...(date ? dateString(date) === dateString(new Date()) ? {} : { d: dateString(date) } : {})
        })).toString()}`)
    }, [from, to, from_input, to_input, date])

    useEffect(() => {
        generateUrl()
    }, [from, to, from_input, to_input, date])

    useEffect(() => {
        if (searchHref) router.prefetch(searchHref)
    }, [searchHref])

    return (<Grid>
        <Grid.Col sm={6} span={12}>
            <StopInput variant='from' />
        </Grid.Col>
        <Grid.Col sm={6} span={12}>
            <StopInput variant='to' />
        </Grid.Col>
        <Grid.Col xs={6} span={12}>
            <DatePickerInput onChange={setDate} clearable={false} locale='hu' value={date || new Date()} variant='unstyled' sx={{ '.mantine-Popover-dropdown': { background: "#1A1B1E", borderRadius: '.5rem', border: '1px solid #373A40' } }} styles={(theme) => ({ input: { paddingLeft: theme.spacing.xs, fontSize: 16, border: 'unset', background: 'transparent' }, wrapper: { width: '100%', height: 36 }, root: { borderBottom: '2px solid #373A40', height: 45, display: 'flex', alignItems: 'center', } })} />
        </Grid.Col>
        <Grid.Col sx={{ display: 'flex', alignItems: 'center' }} xs={6} span={12}>
            <Link href={searchHref} style={{ width: '100%', display: 'flex', alignItems: 'center' }}>
                <Button gradient={{ from: theme.primaryColor, to: theme.colors.blue[theme.primaryShade as number] }} variant="gradient" styles={{ 'root': { width: '100%' } }} leftIcon={<IconSearch />}>Keresés</Button>
            </Link>
        </Grid.Col>
    </Grid>)
}