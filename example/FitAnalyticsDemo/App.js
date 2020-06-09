import React from 'react'
import {
  Component,
  StyleSheet,
  Button,
  View,
  SafeAreaView,
  Text,
  Alert,
  TextInput,
} from 'react-native'

import { FitAnalyticsWidget, PurchaseReporter } from '@fitanalytics/webview-reactnative'

const reporter = new PurchaseReporter({
  // set some purchase defaults
  "shop": "widgetpreview",
  "shopCountry": "US",
  "shopLanguage": "en",
  "currency": "usd"
})

function Separator() {
  return <View style={styles.separator} />
}

function getRandomString() {
  return Math.random().toString(36).slice(2)
}

function generatePurchaseReports(total) {
  let shop = "widgetpreview"
  let orderId = `order-${getRandomString()}`
  let userId = `user-${getRandomString()}`
  let out = []

  for (let i = 0, n = total; i < n; i++) {
    out.push({
      "productSerial": `widgetpreview-${getRandomString()}`,
      "userId": userId,
      "orderId": orderId,
      "purchasedSize": `${20 + Math.floor(Math.random() * 20)}`,
      "price": Math.floor(Math.random() * 100),
    })
  }

  return out
}

export default function App() {
  const [inputValue, setInputValue] = React.useState('widgetpreview-upper-m')
  const [productSerial, setProductSerial] = React.useState(inputValue)
  const [status, setStatus] = React.useState("Init")
  const [isOpen, setIsOpen] = React.useState(false)
  const [isMounted, setIsMounted] = React.useState(false)
  const widget = React.useRef(null)

  const reportPurchases = function () {
    let reports = generatePurchaseReports(Math.ceil(Math.random() * 10))
    reporter.sendReports(reports)
    .then((res) => {
      console.log("Reported", res)
      setStatus("Reported")
    })
    .catch((err) => {
      console.error("Error reporting", err)
      setStatus(`Error reporting: ${ err }`)
    })
  }
 
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.control}>
        <TextInput
          style={styles.input}
          onChangeText={text => setInputValue(text)}
          value={inputValue}
        />
        <Text style={styles.status}>{status}</Text>
      </View>
      <View style={styles.control}>
        <Button
          title={ isMounted ? "Unmount" : "Mount" }
          onPress={() => {
            setIsMounted(!isMounted)
            setIsOpen(isMounted)
          }}
        />
        <Button
          title="Load"
          disabled={!isMounted}
          onPress={() => {
            setStatus('Loading')
            setProductSerial(inputValue)
          }}
        />
        <Button
          title="Rec."
          disabled={!isMounted}
          onPress={() => widget.current.getRecommendation()}
        />
        <Button
          title={isOpen && isMounted ? "Close" : "Open"}
          disabled={!isMounted}
          onPress={() => {
            setStatus('Opening')
            isOpen ? widget.current.close() : widget.current.open()
          }}
        />
        <Button
          title="ReportPur."
          onPress={() => reportPurchases()}
        />
      </View>
      <Separator />
      { isMounted && <FitAnalyticsWidget
        ref={widget}
        productSerial={productSerial}
        onLoad={(productSerial, details) => {
          setStatus(`Loaded ${productSerial}`)
          console.log("LOADED", productSerial, details)
        }}
        onError={(productSerial, details) => {
          setStatus(`Error loading ${productSerial}`)
          console.log("ERROR_LOADING", productSerial, details)
        }}
        onRecommend={(productSerial, size, details) => {
          setStatus(`Recommend ${size}`)
          console.log("LOADED", productSerial, details)
        }}
        onOpen={(productSerial) => {
          setStatus(`Open`)
          setIsOpen(true)
          console.log("OPENED", productSerial)
        }}
        onClose={(productSerial, size, details) => {
          setStatus(`Close ${size}`)
          setIsOpen(false)
          console.log("CLOSED", productSerial, size, details)
        }}
        onCart={(productSerial, size, details) => {
          setStatus(`Cart ${size}`)
          setIsOpen(false)
          console.log("ADDED_TO_CART", productSerial, size, details)
        }}
      />}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 16,
    marginHorizontal: 16,
  },
  title: {
    textAlign: 'center',
    marginVertical: 8,
  },
  control: {
    flexDirection: 'row',
    height: 'auto',
  },
  input: {
    width: "60%",
    height: 40,
    padding: 2,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    color: 'black',
  },
  status: {
    height: 40,
    marginLeft: 4,
    marginRight: 4,
    flex: 1,
    flexWrap: 'wrap',
    overflow: 'hidden', 
    fontSize: 10,
  },
  fixToText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  separator: {
    marginVertical: 8,
    borderBottomColor: '#737373',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
})
