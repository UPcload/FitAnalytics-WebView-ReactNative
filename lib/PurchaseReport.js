
class PurchaseReport {
  static allowedProps = {
    "productSerial": String,
    "shopArticleCode": String,
    "userId": String,
    "orderId": String,
    "price": Number,
    "currency": String,
    "sizeRegion": String,
    "shop": String,
    "shopCountry": String,
    "shopLanguage": String,
    "shopSizingSystem": String,
    "ean": String,
    "funnel": String,
    "hostname": String,
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
    return JSON.parse(JSON.stringify(this))
  }
}

export default PurchaseReport
