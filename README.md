# FitAnalytics WebWidget Integration for React Native

## Overview

The SDK allows integrating the Fit Analytics Fit Finder widget into your own React Native app.

As a first step, we suggest that you familiarize yourself with the Fit Analytics web-based Size Advisor service by:  

1. Reading through the Fit Analytics website and trying out a sample product - https://www.fitanalytics.com/  
2. Reading through the Fit Analytics Native Apps Integration guide - http://developers.fitanalytics.com/native-apps  

The integration method currently supported by this SDK is based on loading HTML/JS-based widget code in a separate WebView component instance and establishing communication between the host app and the embedded web widget.

The SDK introduces a layer that imitates a web-based (JavaScript) integration of the Fit Analytics widget by:  
1. Exporting the **FitAnalyticsWidget** React Native component.
2. Creating and initializing the widget in a provided web view instance. Common widget options (e.g. `productSerial` etc) are exposed as props on the component
3. Exposing several methods that allow controlling the widget.

Optionally, you can also include the purchase reporting for the order confirmation page/view.

## Getting started

1. **Prerequisities:**
  1. `react-native` module. The integration has been tested with v0.61.x
  2. `react-native-webview` module. The integration has been tested with v8.0.x
  3. `@react-native-async-storage/async-storage` module. The integration has been tested with v1.13.x
2. Install `@fitanalytics/webview-reactnative` with
  ```
  npm install -s "@fitanalytics/webview-reactnative"
  ```
3. Add the component to your projects
  ```jsx
  import React from 'react'
  import { SafeAreaView } from 'react-native'
  import { FitAnalyticsWidget } from '@fitanalytics/webview-reactnative'

  export default function App() {
    const widget = React.useRef(null)

    return (
      <SafeAreaView>
        <FitAnalyticsWidget
          ref={widget}
          productSerial={productSerial}
          shopPrefix="example"
          shopCountry="US"
          shopLanguage="en"
          onLoad={(productSerial, details) => {
            console.log("LOADED", productSerial, details)
          }}
        />
      </SafeAreaView>
    )
  }
  ```

## Example application

The repository contains an example application which demonstrates a really simple integration. It allows you to load products in the widget, open the widget and request a size recommendation. It also shows a short example of reporting purchases.


## API reference

### Fit Finder Widget component

```js
class FitAnalyticsWidget {
  props = {
    // widget options
    
    // (required) merchant identifier, issued by Fit Analytics
    "shopPrefix": String,

    // product serial; when the prop changes a new product will be loaded
    // the change may trigger `onLoad` callback
    "productSerial": String,

    // dictionary of all possible size codes; the key is a size code and value is true/false depending on the currently in-stock availability of the size
    // the change may trigger `onLoad` callback
    "manufacturedSizes": Object,

    // (deprecated) array of available size; all size codes that are currently available in-stock should be listed
    "sizes": Array,

    // ID of the currently logged-in user
    "userId": String,

    // the ISO-code of the current language (when both shop & user are same)
    "language": String,

    // (when applicable) the ISO-code of user's selected language
    "userLanguage": String,

    // (required) the ISO-code of shop's current default language
    "shopLanguage": String,

    // (required) the ISO country code of the current shop
    "shopCountry": String,

    // the full URL for thumbnail
    "thumb": String,

    // preferred units system (0 - metric; 1 - US imperial; 2 - british imperial)
    "metric": Number,

    // Enable or disable the add-to-cart integration
    "cart": Boolean,

    //// CALLBACKS

    // the widget has been initialized and can received commands
    "onReady": Function,

    // a new product has been loaded
    // onLoad(productSerial, details)
    "onLoad": Function,

    // an error was triggered when loading a products
    // onError(productSerial, details)
    "onError": Function,

    // a recommendation has been received
    // onRecommend(productSerial, size, details)
    "onRecommend": Function, 

    // an add-to-cart button was clicked
    // when this callback is defined, the widget change the wording on the results closing
    // button and will invoke this callback, when the user clicks it
    // onCart(productSerial, size, details)
    "onCart": Function,

    // a close button has been clicked (or `close` method was called)
    // the `size` argument will contain the last visible recommended size, when it's present
    // onClose(productSerial, size, details)
    "onClose": Function,
  }

  // request a size recommendation, should have a product loaded
  // when the recommendation is ready, it will trigger `onRecommend` callback prop
  // @param options; widget options
  getRecommendation(options)

  // open the widget, should have some product loaded;
  // when the opening is finished, it will trigger `onOpen` callback prop
  // @param options; widget options
  open(options)

  // close the widget (if it's currently open)
  // when the widget has been closed, it will trigger `onClose` callback prop
  // @param options; widget options
  close(options)

  // change the configuration of the widget with new parameters;
  // should be used only in special case as all configuration should be
  // done with component props, when possible.
  // will trigger `onLoad` callback prop, if new product was loaded
  // @param options; widget options
  reconfigure(options)
}
```

### Purchase reporting on Order-confirmation pages (OCPs)

Providing purchase data not only provides you with insights but also continually enhances the value Fit Finder and our personalized recommendations add to your e-commerce platform. Therefore, we highly recommend you to set up purchase reporting on your end.

The main class for reporting is the `PurchaseRepo`

```js

// Supported purchase report attribu

class PurchaseReporter {
  // the constructor accepts default report attributes;
  // these are then merged into each report individually
  constructor(defaultAttrs: Object)

  // send an array of purchase reports (either plain objects or PurchaseReport instances)
  // to FitAnalytics
  sendReports(reports: Array<Object|PurchaseReport>)
}


// report wrapper class
// for full description see http://developers.fitanalytics.com/documentation#sales-data-exchange
class PurchaseReport {
  attributes = {
    // merchant identifier
    "shop": String,

    // product serial (ID)
    "productSerial": String,

    // a size-specific identifer if exists
    "shopArticleCode": String,

    // 13-digits universal barcode, that identifies the product and size
    "ean": String,

    // the purchased size code
    "purchasedSize": String,

    // the current logged-in user ID
    "userId": String,

    // an ID of the order
    "orderId": String,

    // price of the item as number
    "price": Number,

    // ISO 4217 currency code
    "currency": String,

    // (if applicable) country in which the purchase was made
    "shopCountry": String,

    // (if applicable) language in which the purchase was made
    "language": String,

    "shopLanguage": String,
    "sizeRegion": String,
    "shopSizingSystem": String,

    // set to `true` if the item was returned (when reporting returns)
    "returned": Boolean, 
    // short message for the reason of the return
    "reason": String,
  }

  constructor (attributes)
}

```


