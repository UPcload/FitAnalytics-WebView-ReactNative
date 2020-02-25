#/bin/bash

# re-install the "@fitanalytics/webview-reactnative" from the source above

rm -rf "./node_modules/@fitanalytics/webview-reactnative"
pushd ../..
PACKAGE=`npm pack .`
popd
npm install --no-save "../../${PACKAGE}"
rm "../../${PACKAGE}"
