
class PurchaseReport {
  static allowedProps = {
    "productSerial": String,
    "shopArticleCode": String,
    "userId": String,
    "orderId": String,
    "purchasedSize": String,
    "price": Number,
    "currency": String,
    "quantity": Number,
    "sizeRegion": String,
    "shop": String,
    "shopCountry": String,
    "shopLanguage": String,
    "shopSizingSystem": String,
    "ean": String,
    "funnel": String,
    "hostname": String,
    "returned": Boolean,
    "reason": String,
    "shopSession": String
  }

  static remap = {
    "productSerial": "productId",
    "shopArticleCode": "variantId",
    "ssid": "shopSessionId",
  }

  constructor (props) {
    for (let key in props) {
      let val = props[key]
      let propType = PurchaseReport.allowedProps[key]
      if (propType != null) {
        // re-cast the value into the expected type 
        // (invalid types will force rejecting the whole request)
        this[key] = propType(val)
      }
    }
  }

  export () {
    const out = JSON.parse(JSON.stringify(this))

    for (let key in PurchaseReport.remap) {
      let val = out[key]

      if (val != null) {
        out[PurchaseReport.remap[key]] = val
        delete out[key]
      }
    }

    return out
  }
}

export default PurchaseReport
