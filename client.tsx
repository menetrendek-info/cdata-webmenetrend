import axios, { all } from "axios"
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

export const testCORSBlocker = async () => {
    // send a request to the api and return true on success and false on cors error
    const body = {
        "func": "getRoutes",
        "params": {
            "datum": "2023-05-13",
            "erk_stype": "megallo",
            "ext_settings": "block",
            "filtering": 0,
            "helyi": "No",
            "networks": [
                1,
                2,
                3,
                10,
                11,
                12,
                13,
                14,
                24,
                25,
                26
            ],
            "honnan": "Székesfehérvár, autóbusz-állomás",
            "honnan_ls_id": 599,
            "honnan_settlement_id": 1482,
            "honnan_site_code": "1482F1",
            "hour": "09",
            "hova": "Perkáta",
            "hova_ls_id": 0,
            "hova_settlement_id": 1935,
            "hova_site_code": "",
            "ind_stype": "megallo",
            "keresztul": "",
            "keresztul_eovx": "",
            "keresztul_eovy": "",
            "keresztul_ls_id": "",
            "keresztul_settlement_id": "",
            "keresztul_site_code": "",
            "keresztul_stype": "megallo",
            "maxatszallas": "5",
            "maxvar": "240",
            "maxwalk": 1000,
            "timeWindow": 180,
            "timeBuffer": "0",
            "distanceBuffer": "0",
            "min": "57",
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
            "timeText": "09:57",
            "searchInput": {
                "from": {
                    "settlement_name": "Székesfehérvár",
                    "lsname": "Székesfehérvár, autóbusz-állomás",
                    "relevance": 6,
                    "ls_id": 599,
                    "site_code": "1482F1",
                    "settlement_id": 1482,
                    "type": "megallo",
                    "network_id": 1,
                    "geomEov": {
                        "type": "Point",
                        "coordinates": [
                            601641,
                            205153
                        ]
                    }
                },
                "to": {
                    "settlement_name": "Perkáta",
                    "lsname": "Perkáta",
                    "ls_id": 0,
                    "site_code": "",
                    "settlement_id": 1935,
                    "type": "telepules",
                    "network_id": 0,
                    "geomEov": {
                        "type": "Point",
                        "coordinates": [
                            627870,
                            190836
                        ]
                    }
                },
                "through": null
            }
        }
    }
    return fetch(api, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    }).then((response) => {
        return true
    }).catch((error) => {
        return false
    })
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

export const queryRoutes = (date: Date, from: Stop, to: Stop, through?: Stop) => {
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
    }).then((response) => {
        return response.json()
    }).catch((error) => {
        return false
    })
}