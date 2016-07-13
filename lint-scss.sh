#!/bin/bash -e

# This script will lint projects scss files and create a xml-checkstyle-report.

# Start RVM
test -e ~/.rvm/scripts/rvm || curl -sSL https://get.rvm.io | bash -s -- --autolibs=read-fail stable
source ~/.rvm/scripts/rvm
rvm autolibs enable
rvm install --binary ruby-2.1.2
rvm gemset use 2.1.2@sass --create
bundle install

# Variables
REQUIRE='scss_lint_reporter_checkstyle' # 'scss_lint_reporter_junit'
FORMAT='Checkstyle' # 'JUnit'
OUTNAME='build/reports/checkstyle-scss.xml'
FILES='app/variants/generic/scss/* app/variants/tlabs/scss/*'


if [ -f "$OUTNAME" ]
then
    echo "Deletion of old $OUTNAME"
    rm $OUTNAME
fi

echo 'Creating new checkstyle for scss files'
scss-lint --require=$REQUIRE --format=$FORMAT $FILES > $OUTNAME

