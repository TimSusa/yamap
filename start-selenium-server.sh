#!/bin/bash -e

# This script can be used to run webdriver manually
#
# Please Note: Protractor_webdriver is already
# included to our grunt test tasks, which starts
# webdriver automatically.

# update
node_modules/protractor/bin/webdriver-manager update

# start
node_modules/protractor/bin/webdriver-manager start
