#!/bin/bash
pkg update
pkg install nodejs openjdk-17 git
npm install -g cordova
mkdir fernanda-towers
cd fernanda-towers
cordova create . com.fernandatowers.app FernandaTowers
cp /sdcard/Download/index.html www/index.html
cordova platform add android
cordova build android