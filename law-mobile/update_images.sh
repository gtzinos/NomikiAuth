#!/bin/bash
mv platforms/android/res/{values,xml} res
rm -rf platforms/android/res
cp -r res platforms/android
ionic build android