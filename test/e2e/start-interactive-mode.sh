#!/bin/bash -e

# This script is intended, to help you writing e2e tests by using protractors interactive mode
# Parameter: can be the routes: technology, benefits, login, register etc. pp.
#
# chrome or firefox should be enabled in protractor.conf.js (you can copy and replace this):
#
# USAGE: 1: grunt clean && grunt serve --variant=generic --flavor=staging'
#           or
#           grunt clean && grunt serve --variant=tlabs --flavor=staging-ai'
#
#        2: start this script at another terminal/shell in the e2e folder

node ../../node_modules/protractor/bin/elementexplorer.js http://localhost:9000/$1


