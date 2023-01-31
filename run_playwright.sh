#!/bin/bash

mkdir -p junit html artifacts

reset_playwright_settings () {
    echo "Settings will be changed back to the defaults"
    sed -i "s/junit\/results.*.xml/junit\/results.xml/g" playwright.config.ts
    sed -i "s/outputFolder: 'html.*',/outputFolder: 'html',/g" playwright.config.ts
}

modify_playwright_settings () {
    echo "Settings will be changed for $1"
    sed -i "s/junit\/results.*.xml/junit\/results_$1.xml/g" playwright.config.ts
    sed -i "s/outputFolder: 'html.*',/outputFolder: 'html\/$1',/g" playwright.config.ts
}
export -f modify_playwright_settings

if [[ $1 == "serial" ]]; then
    echo "Running serial tests"
    find tests/*.spec.ts | xargs -I{} bash -c 'modify_playwright_settings $(basename {}); npx playwright test {}'
elif [[ $1 == "parallel" ]]; then
    echo "Running parallel tests"
    modify_playwright_settings "parallel_tests"
    npx playwright test tests/*.spec.ts
else
    echo "$1 is not a valid option"
    exit 1
fi

# reset_playwright_settings