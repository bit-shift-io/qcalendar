#!/bin/bash

TOOLS_DIR=~/Android/Sdk/tools
EMULATOR=$TOOLS_DIR/emulator

echo $EMULATOR
AVD=$($EMULATOR -list-avds | head -n 1)
echo $AVD
$EMULATOR -avd $AVD
