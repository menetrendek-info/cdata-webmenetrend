import { StringMappingType } from "typescript"

const api = "https://menetrendek.hu/menetrend/newinterface/index.php"

const allNetworks = [
    1,
    2,
    3,
    10,
    11,
    12,
    13,
    14,
    24,
    25
]

export type Stop = {
    value?: string,
    "settlement_name": string,
    "lsname": string,
    "ls_id": number,
    "site_code": string,
    "settlement_id": number,
    "type": string,
    "network_id": number,
    "geomEov": {
        "type": string,
        "coordinates": [
            number,
            number
        ]
    }
}

export const dateString = (date: Date) => {
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
}

export const queryStops = async (query: string) => {
    const body = {
        "func": "getStationOrAddrByText",
        "params": {
            "inputText": query,
            "currentMode": "stop_based",
            "use_daemon": "",
            "searchIn": [
                "stations"
            ],
            "searchDate": dateString(new Date()),
            "maxResults": 50,
            "networks": allNetworks
        }
    }
    return fetch(api, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    }).then((response) => {
        return response.json()
    }).catch((error) => {
        return false
    })
}

export type jaratinfo = {
    prebuy: number,
    alacsonypadlos: number,
    network: number,
    nagysebessegu: number,
    jelleg: string,
    emeltszintu: number,
    vonalnev: string,
    wifi: number,
    internet: number,
    internetes_jegy: number,
    terelout: number,
    vonalelnevezes: string,
    remark: string,
    news: {
        Title: string,
        Url: string
    },
    CountyPass: string,
    utazasi_tavolsag: number,
    fare: number,
    no_discountable_fare: number,
    additional_ticket_price: number,
    seat_ticket_price: number,
    train_cat: string,
    fare_50_percent: number,
    fare_90_percent: number,
    dcLsId: number,
    bube_accepted: number,
    FromBay?: string,
    travelTime?: number,
    ToBay?: string,
    kozlekedik?: string,
}

export type route = {
    ind_prefix: string,
    indulasi_hely: string,
    ind_kulterulet: number,
    departureCity: string,
    departureStation: string,
    erk_prefix: string,
    erkezesi_hely: string,
    erk_kulterulet: number,
    arrivalCity: string,
    arrivalStation: string,
    indulasi_ido: string,
    erkezesi_ido: string,
    atszallasok_szama: number,
    osszido: string,
    indulasi_hely_info: number,
    jaratinfok: {
        [key: string]: jaratinfo
    },
    atszallasinfok: {
        [key: string]: {
            atszallasinfo: string,
            atszallohely: string,
            atszallaskorlatozas: string,
        }
    },
    explanations: Array<string>,
    totalDistance: number,
    totalFare: number,
    totalFare50: number,
    totalFare90: number,
    totalAdditionalTicketPrice: number,
    eTicketAvailable: number,
    riskyTransfer: boolean,
    kifejtes_postjson: fieldvalue,
    nativeData: Array<{ [key: string]: number | string | any }>,
    ossztav: string,
    talalat_kozlekedik: string
}


export const queryRoutes = async (date: Date, from: Stop, to: Stop, through?: Stop) => {
    const body = {
        "func": "getRoutes",
        "params": {
            "datum": dateString(date),
            "erk_stype": "megallo",
            "ext_settings": "block",
            "filtering": 0,
            "helyi": "No",
            "networks": allNetworks,
            "honnan": from.lsname,
            "honnan_ls_id": from.ls_id,
            "honnan_settlement_id": from.settlement_id,
            "honnan_site_code": from.site_code,
            "hour": "00",
            "hova": to.lsname,
            "hova_ls_id": to.ls_id,
            "hova_settlement_id": to.settlement_id,
            "hova_site_code": to.site_code,
            "ind_stype": from.type,
            "keresztul": through ? through.lsname : "",
            "keresztul_eovx": through ? through.geomEov.coordinates[0] : "",
            "keresztul_eovy": through ? through.geomEov.coordinates[1] : "",
            "keresztul_ls_id": through ? through.ls_id : "",
            "keresztul_settlement_id": through ? through.settlement_id : "",
            "keresztul_site_code": through ? through.site_code : "",
            "keresztul_stype": through ? through.type : "",
            "maxatszallas": "5",
            "maxvar": "240",
            "maxwalk": 1000,
            "timeWindow": 180,
            "timeBuffer": "0",
            "distanceBuffer": "0",
            "min": "00",
            "napszak": "0",
            "naptipus": 0,
            "odavissza": 0,
            "preferencia": 0,
            "rendezes": "1",
            "discountPercent": "0",
            "submitted": 1,
            "talalatok": 1,
            "target": 0,
            "utirany": "oda",
            "var": "0",
            "caller": "browser",
            "lang": "hu",
            "currentMode": "stop_based",
            "use_daemon": "",
            "dayPartText": "Egész nap",
            "orderText": "Indulási idő",
            "discountText": "Teljesárú",
            "timeText": "00:00",
            "searchInput": {
                from,
                to,
                through,
            }
        }
    }
    return fetch(api, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    }).then(async (response) => {
        return await response.json()
    }).catch((error) => {
        return error
    })
}

export type fieldvalue = {
    runcount: number,
    runs: {
        [key: string]: {
            [key: string]: number | string
        }
    }
}

export type nativeData = Array<{ [key: string]: number | string | any }>

export type exposition = {
    allomas: string,
    localCode: string,
    idopont: string,
    muvelet: "átszállás" | "leszállás" | "felszállás",
    varhato_indulas: string,
    rendszam: string,
    keses_perc: number,
    OwnerName?: string,
    runId?: number,
    jaratszam?: string,
    network?: number,
    jarmu?: string,
    DomainCompanyName?: string,
    Headsign?: string,
    jaratinfo?: jaratinfo,
    news?: {
        Title: string,
        Url: string,
    },
    vegallomasok?: string,
    description?: string,
    tarsasag?: string,
    TimeForChange?: number,
    byWhat?: string,
    tavolsag?: number,
    ido?: number,
    ChangeTime?: string,
    ChangeRoute?: string,
    ChangeMode?: string,
}

export const queryExpostition = (date: Date, fieldvalue: fieldvalue, nativeData: nativeData) => {
    const body = {
        "debug": 0,
        "type": "",
        "query": "jarat_kifejtes_text_jsonC",
        "currentMode": "stop_based",
        "use_daemon": "",
        "datum": dateString(date),
        "lang": "hu",
        "fieldvalue": fieldvalue,
        "nativeData": nativeData
    }
    return fetch(api, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    }).then(async (response) => {
        return (await response.json())
    }).catch((error) => {
        return false
    })
}