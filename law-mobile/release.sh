#!/bin/bash

rm -rf NomikiAuth.apk

jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore NomikiAuth.keystore platforms/android/build/outputs/apk/android-release-unsigned.apk NomikiAuth

zipalign -v 4 platforms/android/build/outputs/apk/android-release-unsigned.apk NomikiAuth.apk

