#!/bin/bash -e

# Environment to deploy to (e.g. develop, staging, prod, etc...)
ENV=$1
# If set to 'e2e' we do cibuild with e2e
E2E=$2
# The variant to build
VARIANT=$3

GRUNT_TASK="cibuild"

# If no argument is given, we set flavor to 'develop'
if [ -z "$1" ]; then
    ENV="develop"
fi

# If no argument is given, we set variant to 'generic'
if [ -z "$3" ]; then
    VARIANT="generic"
fi

# If second parameter is e2e, do cibuild with e2e
if [ "${2}" == "e2e" ]; then
  GRUNT_TASK="cibuild-e2e"
fi

echo "deploy frontend variant '${VARIANT}' to '${ENV}' environment"

# If flavor is develop, we do cibuild, with e2e tests
if [ "${ENV}" == "develop" ]; then
  GRUNT_TASK="cibuild-e2e"
fi

# If flavor is staging, we do cibuild, with special e2e tests
if [ "${ENV}" == "staging" ]; then
  GRUNT_TASK="cibuild-e2e-staging"
fi

# If flavor is production, we do cibuild, with special  e2e tests
if [ "${ENV}" == "production" ]; then
  GRUNT_TASK="cibuild"
fi

# Prepare rvm, gem and bundle install
test -e ~/.rvm/scripts/rvm || curl -sSL https://get.rvm.io | bash -s -- --autolibs=read-fail stable
source ~/.rvm/scripts/rvm
rvm autolibs enable
rvm install --binary ruby-2.1.2
rvm gemset use 2.1.2@sass --create
bundle install

# Install npm modules
npm install

grunt clean

echo "...'${GRUNT_TASK}'"
grunt ${GRUNT_TASK} --variant=${VARIANT} --flavor=${ENV}
