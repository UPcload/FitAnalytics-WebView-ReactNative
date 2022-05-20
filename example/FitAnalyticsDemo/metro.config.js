/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */
const path = require('path');

module.exports = {
  resolver: {
    extraNodeModules: {
      "@fitanalytics/webview-reactnative": path.resolve(__dirname, "node_modules/@fitanalytics/webview-reactnative"),
    }
  },
  watchFolders: [
    path.resolve(__dirname, "node_modules/@fitanalytics/webview-reactnative"),
  ],
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
};
