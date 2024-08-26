import React, { Component } from 'react'
import { Platform } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { WebView } from 'react-native-webview'
import PropTypes from 'prop-types'

import { FITA_SID_KEY } from './constants'
import base64 from './base64'

const callbackProps = {
  "onReady": "ready",
  "onLoad": "load",
  "onError": "error",
  "onOpen": "open",
  "onCart": "cart",
  "onClose": "close",
  "onRecommend": "recommend",
}

class FitAnalyticsWidget extends Component {
  static propTypes = {
    // widget options
    "productSerial": PropTypes.string,
    "manufacturedSizes": PropTypes.object,
    "sizes": PropTypes.array,
    "userId": PropTypes.string,
    "language": PropTypes.string,
    "userLanguage": PropTypes.string,
    "shopLanguage": PropTypes.string,
    "shopCountry": PropTypes.string,
    "thumb": PropTypes.string,
    "metric": PropTypes.number,

    // callbacks
    "onReady": PropTypes.func,
    "onLoad": PropTypes.func,
    "onRecommend": PropTypes.func,
    "onError": PropTypes.func,
    "onCart": PropTypes.func,
    "onClose": PropTypes.func,
  }

  interfaceScript = `
    window.fitaMessageInterface = window.fitaMessageInterface || {
      receiveMessage: function (data) {
        window.ReactNativeWebView.postMessage(data)
      }
    }
    true
  `;

  constructor(props) {
    super(props)
    this.webview = React.createRef()
  }

  /* PUBLIC INTERFACE */
  reconfigure(options) {
    this.sendAction('reconfigure', [ this.buildWidgetOptions(options) ])
  }

  getRecommendation(options) {
    this.sendAction('getRecommendation', [ this.buildWidgetOptions(options) ])
  }

  open(options) {
    this.sendAction('open', [ this.buildWidgetOptions(options) ])
  }

  close(options) {
    this.sendAction('close', [ this.buildWidgetOptions(options) ])
  }
  /* END PUBLIC INTERFACE */

  componentDidUpdate(prevProps) {
    let shouldReconfigure = false
    let changedProps = {}

    for (key in this.props) {
      let val = this.props[key]
      let isCallback = Boolean(callbackProps[key])

      if (Boolean(FitAnalyticsWidget.propTypes[key]) && !isCallback) {
        if (val !== prevProps[key]) {
          shouldReconfigure = true
          changedProps[key] = val
        }
      }
    }

    if (shouldReconfigure)
      this.reconfigure(changedProps)
  }

  buildInitialWidgetOptions(props) {
    let options = {}

    for (key in props) {
      // convert all callbacks to `1`s for crossing the native<->JS interface
      let callback = callbackProps[key]

      if (callback != null)
        options[callback] = 1
      else
        options[key] = props[key]
    }

    return options
  }

  buildWidgetOptions(props) {
    let options = {}

    for (key in props) {
      // in later calls, skip any callback updates to avoid overwriting them
      if (callbackProps[key] == null) {
        options[key] = props[key]
      }
    }

    return options
  }

  encodeMessage (data) {
    return base64.btoa(unescape(encodeURIComponent(JSON.stringify(data))))
  }

  decodeMessage (str) {
    var out = null
    try {
      out = JSON.parse(decodeURIComponent(escape(base64.atob(str))))
    }
    catch (err) {
      console.error(err)
    }
    return out
  }

  sendAction (action, args) {
    const msg = {
      "action": action,
      "arguments": args,
    }
    let code = `window.__widgetManager.receiveMessage('${this.encodeMessage(msg)}');`
    this.webview.current.injectJavaScript(code)
  }

  onWebViewLoadStart(webView) {
    webView.injectJavaScript(this.interfaceScript)
  }

  onWebViewMessage(data) {
    const msg = this.decodeMessage(data)

    if (msg != null && msg.action != null) {
      let { action, arguments: args  } = msg

      switch (action) {
      case "__ready":
        // create and configure a widget instance
        let widgetOptions = this.buildInitialWidgetOptions(this.props)
        widgetOptions.hostname = `embed-${ Platform.OS }`
        this.sendAction("init", [ widgetOptions ])
        break
      case "__init":
        this.props.onReady != null && this.props.onReady()
        break
      case "load":
        if (args != 0 && args.length > 0) {
          let [ productId, details ] = args
          if (details.sid != null) {
            // storing SID locally for purchase reporting
            try {
              AsyncStorage.setItem(FITA_SID_KEY, details.sid).then((res) => {
                // noop
              })
            } catch (err) {
              console.error("FitAnalyticsWidget: couldn't save SID locally", err)
            }
          }
          this.props.onLoad != null && this.props.onLoad(productId, details)
        }
        break
      case "error":
        if (args != 0 && args.length > 0) {
          let [ productId, details ] = args
          this.props.onError != null && this.props.onError(productId, details)
        }
        break
      case "open":
        if (args != 0 && args.length > 0) {
          let [ productId ] = args
          this.props.onOpen != null && this.props.onOpen(productId)
        }
        break
      case "close":
        if (args != 0 && args.length > 0) {
          let [ productId, size, details ] = args
          if (size === "new user")
            size = null 
          this.props.onClose != null && this.props.onClose(productId, size, details)
        }
        break
      case "cart":
        if (args != 0 && args.length > 0) {
          let [ productId, size, details ] = args
          if (size === "new user")
            size = null
          this.props.onCart != null && this.props.onCart(productId, size, details)
        }
        break
      case "recommend":
        if (args != 0 && args.length > 0) {
          let [ productId, size, details ] = args
          if (size === "new user")
            size = null
          this.props.onRecommend != null && this.props.onRecommend(productId, size, details)
        }
        break
      }
    }
  }

  render() {
    return <WebView
      ref={this.webview}
      source={{ uri: 'https://widget.fitanalytics.com/widget/app-embed.html?rn=0.7.0' }}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
      }}
      injectedJavaScriptBeforeContentLoaded={this.interfaceScript}
      onLoadStart={() => { this.onWebViewLoadStart(this.webview.current) }}
      onMessage={(ev) => { this.onWebViewMessage(ev.nativeEvent.data) }}
      onShouldStartLoadWithRequest={request => {
        if (request.url.startsWith('fita:')) {
          // just in case, "fita:" scheme is somehow used
          return false
        }
        return true
      }}
    />
  }
}

export default FitAnalyticsWidget
