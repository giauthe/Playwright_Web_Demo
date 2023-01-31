#!/usr/bin/env bash

IMAGE_NAME=playwright_metis

err() {
    echo $* >&2
}

usage() {
    err "$(basename $0): [build|run|all|login]"
}

clean() {
    IMAGE=$(docker ps -a -q --filter ancestor=${IMAGE_NAME} --format="{{.ID}}")

    if ! test -z "$IMAGE"
    then
        docker rm -f $(docker stop ${IMAGE})
        docker rmi -f ${IMAGE_NAME}
    fi
}

build_docker() {
    docker build --no-cache -t ${IMAGE_NAME} .
}

launch() {
    docker run -i -d ${IMAGE_NAME}
}

login() {
    docker exec -i $(docker ps -q --filter ancestor=${IMAGE_NAME} --format="{{.ID}}") /bin/bash
}

test() {
    docker exec -i -w /automation $(docker ps -q --filter ancestor=${IMAGE_NAME} --format="{{.ID}}") bash -c ". /automation/run.sh"
}

copy_results() {
    docker cp $(docker ps -q --filter ancestor=${IMAGE_NAME} --format="{{.ID}}"):automation/allure-results/ ${PWD}/
    docker cp $(docker ps -q --filter ancestor=${IMAGE_NAME} --format="{{.ID}}"):automation/test-results/ ${PWD}/
    docker cp $(docker ps -q --filter ancestor=${IMAGE_NAME} --format="{{.ID}}"):automation/playwright-report/ ${PWD}/
}


execute() {
    local task=${1}
    case ${task} in
        build)
            clean
            build_docker
            ;;
        run)
            launch
            ;;
        login)
            login
            ;;
        test)
            test
            ;;  
        results)
            copy_results
            ;;
        all) # function to clean, build and run docker
            clean
            build_docker
            launch
            test
            ;;  
        *)
            err "invalid task: ${task}"
            usage
            exit 1
            ;;
    esac
}

main() {
    [ $# -ne 1 ] && { usage; exit 1; }
    local task=${1}
    execute ${task}
}

main $@