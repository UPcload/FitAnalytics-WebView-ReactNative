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

import { FitAnalyticsWidget } from 'FitAnalytics-WebView-ReactNative'

function Separator() {
  return <View style={styles.separator} />
}

export default function App() {
  const [inputValue, setInputValue] = React.useState('widgetpreview-upper-m')
  const [productSerial, setProductSerial] = React.useState(inputValue)
  const [status, setStatus] = React.useState("Init")
  const [isOpen, setIsOpen] = React.useState(false)
  const widget = React.useRef(null)
 
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
          title="Load"
          onPress={() => {
            setStatus('Loading')
            setProductSerial(inputValue)
          }}
        />
        <Button
          title="Recommend"
          onPress={() => widget.current.getRecommendation()}
        />
        <Button
          title="Open"
          onPress={() => {
            setStatus('Opening')
            widget.current.open()
          }}
        />
        <Button
          title="Close"
          disabled={!isOpen}
          onPress={() => widget.current.close()}
        />
      </View>
      <Separator />
      <FitAnalyticsWidget
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
      />
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
