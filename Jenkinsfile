node{
    sh 'rm -rf "$WORKSPACE"/*'
    withCredentials([usernamePassword(credentialsId: 'remoteServer_credentials', usernameVariable:'REMOTE_USER',  passwordVariable: 'REMOTE_PASS')]) {
        def remote = [:]
        remote.name = 'test'
        remote.host = 'dkr.alpha.bullsphere.com'
        remote.port = 6223
        remote.user = 'dtgiau'
        remote.password = REMOTE_PASS
        remote.allowAnyHosts = true
        stage('Checkout Code') {
            withCredentials([usernamePassword(credentialsId: 'bitbucket_credentials', usernameVariable:'APP_USER', passwordVariable: 'APP_PASSWORD')]) {
                checkout([$class: 'GitSCM',
                branches: [[name: '*/master']],
                doGenerateSubmoduleConfigurations: false,
                extensions: [[$class: 'CleanCheckout']],
                userRemoteConfigs: [[credentialsId: 'metis_ui_automation', url: "https://GiauDo:"+"$APP_PASSWORD"+"@bitbucket.org/BeeBullsphere/metis-ui-automation.git"]]
                ])
            }
        }
        sh 'rm -rf Metis_Ui_Playwright.tar.gz'
        tar file: 'Metis_Ui_Playwright.tar.gz', dir: ''
        stage('Docker Build') {
            sshCommand remote: remote, command: "echo"+" $REMOTE_PASS"+" | sudo -S rm -rf Metis_Ui_Playwright/*"
            sshPut remote: remote, from: 'Metis_Ui_Playwright.tar.gz', into: 'Metis_Ui_Playwright/'
            sshCommand remote: remote, command: 'cd Metis_Ui_Playwright/ && tar -xzvf Metis_Ui_Playwright.tar.gz && chmod +x docker.sh '
            sshCommand remote: remote, command: 'cd Metis_Ui_Playwright/ && ./docker.sh build'
            sshCommand remote: remote, command: 'cd Metis_Ui_Playwright/ && ./docker.sh run'
        }
        stage('Execute Test') {
            sshCommand remote: remote, command: 'cd Metis_Ui_Playwright/ && ./docker.sh test'
            sshCommand remote: remote, command: 'cd Metis_Ui_Playwright/ && ./docker.sh results'
        }
        stage('Reports') {
            sshGet remote: remote, from: 'Metis_Ui_Playwright/test-results/', filterRegex: /.*/, into: ".", override: true
            sshGet remote: remote, from: 'Metis_Ui_Playwright/playwright-report/', filterRegex: /.*/, into: ".", override: true
            sshGet remote: remote, from: 'Metis_Ui_Playwright/allure-results/', filterRegex: /.*/, into: ".", override: true
            allure([
                    includeProperties: false,
                    jdk: '',
                    properties: [],
                    reportBuildPolicy: 'ALWAYS',
                    results: [[path: 'allure-results']]
            ])
        }
    }
}
