import { Platform, AsyncStorage } from 'react-native'
import { FITA_SID_KEY } from './constants'

// the default widget container page
const REPORT_URL0 = "https://collector.fitanalytics.com/purchases"
const REPORT_URL1 = "https://collector-de.fitanalytics.com/purchases"

import PurchaseReport from './PurchaseReport'

class PurchaseReporter {
  constructor (props) {
    if (props.sid != null)
      this.sid = props.sid

    this.reportDefaults = new PurchaseReport(props)
  }

  sendReports (items = []) {
    const timeStamp = Date.now()

    let sidProm = this.sid != null
      ? Promise.resolve(this.sid)
      : AsyncStorage.getItem(FITA_SID_KEY)

    return sidProm
    .then((sid) => {
      let opts = {
        "timeStamp": timeStamp,
        "callback": "sender",
        "hostname": `embed-${ Platform.OS }`
      }

      if (sid != null)
        opts["sid"] = sid

      return items.map((item) => {
        if (!(item instanceof PurchaseReport))
          item = new PurchaseReport(item)

        return this.processReport(item, opts)
      })
    })
    .then((reports) => {
      const reqConfig = {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        cache: "no-cache"
      }

      return Promise.all(reports.map((report) => {
        const query = this.buildQuery(report)

        return Promise.all([
          fetch(`${REPORT_URL0}?${query}`, reqConfig),
          fetch(`${REPORT_URL1}?${query}`, reqConfig)
        ])
      }))
    })
    .then((res) => {
      return {
        response: res,
        total: items.length
      }
    })
  }

  buildQuery (params) {
    let out = []
    for (let key in params) {
      let value = params[key]
      if (value != null)
        out.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    }
    return out.join('&')
  }

  processReport (report, opts) {
    return Object.assign(Object.assign(report.export(), this.reportDefaults.export()), opts)
  }
}

export default PurchaseReporter
