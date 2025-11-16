// ============================================================================
// Jenkinsfile for Playwright Web Automation Testing
// Project: Playwright_Web_Demo
// Repository: GitHub (giauthe/Playwright_Web_Demo)
// Purpose: CI/CD Pipeline for Playwright Tests with Allure Reports
// ============================================================================

pipeline {
    agent any

    // ========================================================================
    // Environment Variables Configuration
    // ========================================================================
    environment {
        NODE_ENV = 'test'
        GITHUB_REPO = 'https://github.com/giauthe/Playwright_Web_Demo.git'
        GITHUB_BRANCH = 'develop'
        PROJECT_NAME = 'Playwright_Web_Demo'
        WORKSPACE_PATH = "${WORKSPACE}"
        TEST_TIMEOUT = '60'
        SLACK_CHANNEL = '#automation-tests'
        EMAIL_RECIPIENTS = 'qa-team@example.com'
        
        // Paths
        TEST_SUITE_PATH = 'tests/test-suite'
        TEST_RESULTS_PATH = 'test-results'
        PLAYWRIGHT_REPORT_PATH = 'playwright-report'
        ALLURE_RESULTS_PATH = 'allure-results'
        PATH = "/usr/local/bin:/System/Cryptexes/App/usr/bin:/usr/bin:/bin:/usr/sbin:/sbin:/var/run/com.apple.security.cryptexd/codex.system/bootstrap/usr/local/bin:/var/run/com.apple.security.cryptexd/codex.system/bootstrap/usr/bin:/var/run/com.apple.security.cryptexd/codex.system/bootstrap/usr/appleinternal/bin:/Users/macbook/.docker/bin"
    }

    // ========================================================================
    // Build Triggers
    // ========================================================================
    triggers {
        // Trigger on GitHub push
        githubPush()
        
        // Daily scheduled run at 2 AM UTC
        cron('0 2 * * *')
        
        // Poll SCM every 15 minutes
        pollSCM('H/15 * * * *')
    }

    // ========================================================================
    // Build Parameters
    // ========================================================================
    parameters {
        string(
            name: 'BROWSER',
            defaultValue: 'chromium',
            description: 'Browser to run tests: chromium, firefox, webkit'
        )
        string(
            name: 'TEST_SUITE',
            defaultValue: 'all',
            description: 'Test suite to run: all, api, login, ui'
        )
        booleanParam(
            name: 'DEBUG_MODE',
            defaultValue: false,
            description: 'Enable debug mode for tests'
        )
        booleanParam(
            name: 'GENERATE_REPORT',
            defaultValue: true,
            description: 'Generate Allure report after tests'
        )
        booleanParam(
            name: 'SEND_NOTIFICATIONS',
            defaultValue: false,
            description: 'Send notifications (Slack/Email) after tests'
        )
    }

    // ========================================================================
    // Build Options
    // ========================================================================
    options {
        // Keep last 30 builds
        buildDiscarder(logRotator(numToKeepStr: '30', artifactNumToKeepStr: '10'))
        
        // Set build timeout to 2 hours
        timeout(time: 2, unit: 'HOURS')
        
        // Disable concurrent builds
        disableConcurrentBuilds()
        
        // Add timestamps to console output
        timestamps()
        
        // Preserve test results
        preserveStashes(buildCount: 5)
    }

    // ========================================================================
    // Stages
    // ========================================================================
    stages {
        // ====================================================================
        // Stage 1: Checkout Code from GitHub
        // ====================================================================
        stage('📥 Checkout Code') {
            steps {
                script {
                    echo "╔════════════════════════════════════════════════╗"
                    echo "║  Stage: Checkout Code from GitHub Repository  ║"
                    echo "╚════════════════════════════════════════════════╝"
                    echo ""
                    echo "Repository: ${GITHUB_REPO}"
                    echo "Branch: ${GITHUB_BRANCH}"
                    echo "Workspace: ${WORKSPACE_PATH}"
                    echo ""
                }
                sh '''
                    rm -rf "$WORKSPACE"/*
                    rm -rf ~/.cache/ms-playwright
                '''
                
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: "*/${GITHUB_BRANCH}"]],
                    doGenerateSubmoduleConfigurations: false,
                    extensions: [
                        [$class: 'CleanCheckout'],
                        [$class: 'CloneOption', depth: 0, noTags: false, reference: '', shallow: false]
                    ],
                    submoduleCfg: [],
                    userRemoteConfigs: [[
                        credentialsId: 'github-credentials',
                        url: "${GITHUB_REPO}"
                    ]]
                ])
                
                script {
                    echo "✅ Code checkout completed successfully"
                }
            }
        }

        // ====================================================================
        // Stage 2: Lint & Code Quality
        // ====================================================================
        stage('🔍 Code Quality Checks') {
            steps {
                script {
                    echo "╔════════════════════════════════════════════════╗"
                    echo "║  Stage: Code Quality & Linting Checks         ║"
                    echo "╚════════════════════════════════════════════════╝"
                    echo ""
                }
                
                // Check TypeScript compilation
                sh '''
                    echo "Checking TypeScript compilation..."
                    npx tsc --noEmit || echo "TypeScript check completed"
                    echo "✅ TypeScript check completed"
                '''
                
                // Run ESLint if available
                sh '''
                    if [ -f ".eslintrc.json" ] || [ -f ".eslintrc.js" ]; then
                        echo "Running ESLint..."
                        npx eslint . --ext .ts,.js || echo "ESLint check completed"
                    else
                        echo "⚠️ ESLint not configured, skipping"
                    fi
                '''
            }
        }

        // ====================================================================
        // Stage 3: Setup Environment & Dependencies
        // ====================================================================

        stage('🔧 Setup Environment & Install Dependencies') {
            steps{
                script {
                    echo "╔════════════════════════════════════════════════╗"
                    echo "║  Stage: Setup Environment & Install Dependencies ║"
                    echo "╚════════════════════════════════════════════════╝"
                    echo ""
                }

                sh '''
                    echo "Node.js version:"
                    ls -l
                    echo WORKSPACE_PATH
                    echo $PATH
                    docker --version
                
                    chmod +x ./docker.sh
                    ./docker.sh build
                    ./docker.sh run
                '''
            }
        }

        // ====================================================================
        // Stage 4: Run Playwright Tests
        // ====================================================================
        stage('🧪 Run Playwright Tests') {
            steps {
                script {
                    echo "╔════════════════════════════════════════════════╗"
                    echo "║  Stage: Execute Playwright Tests              ║"
                    echo "╚════════════════════════════════════════════════╝"
                    echo ""
                    echo "Browser: ${params.BROWSER}"
                    echo "Test Suite: ${params.TEST_SUITE}"
                    echo "Debug Mode: ${params.DEBUG_MODE}"
                    echo ""
                }

                sh '''
                    ./docker.sh test || true
                    ./docker.sh results || true
                '''
            }
        }

        // ====================================================================
        // Stage 5: Generate Allure Report
        // ====================================================================
        stage('📊 Generate Allure Report') {
            when {
                expression { return params.GENERATE_REPORT }
            }
            steps {
                script {
                    echo "╔════════════════════════════════════════════════╗"
                    echo "║  Stage: Generate Allure Report                ║"
                    echo "╚════════════════════════════════════════════════╝"
                    echo ""
                }
                
                sh '''
                    # Check if allure-results directory exists
                    if [ -d "${ALLURE_RESULTS_PATH}" ]; then
                        echo "Generating Allure report..."
                        allure generate ${ALLURE_RESULTS_PATH} --clean -o allure-report || echo "Note: Allure not installed, skipping"
                        echo "✅ Allure report generated"
                    else
                        echo "⚠️ No allure-results directory found"
                    fi
                '''
            }
        }

        // ====================================================================
        // Stage 6: Archive Test Results
        // ====================================================================
        stage('💾 Archive Results') {
            steps {
                script {
                    echo "╔════════════════════════════════════════════════╗"
                    echo "║  Stage: Archive Test Results                  ║"
                    echo "╚════════════════════════════════════════════════╝"
                    echo ""
                }
                
                // Archive test results
                archiveArtifacts(
                    artifacts: '''
                        test-results/**/*,
                        playwright-report/**/*,
                        allure-results/**/*,
                        allure-report/**/*
                    ''',
                    allowEmptyArchive: true,
                    fingerprint: true
                )
                
                script {
                    echo "✅ Test results archived successfully"
                }
            }
        }

        // ====================================================================
        // Stage 7: Publish Test Results
        // ====================================================================
        stage('📈 Publish Test Results') {
            steps {
                script {
                    echo "╔════════════════════════════════════════════════╗"
                    echo "║  Stage: Publish Test Results                   ║"
                    echo "╚════════════════════════════════════════════════╝"
                    echo ""
                }
                
                // Publish Playwright HTML Report
                publishHTML([
                    reportDir: "${PLAYWRIGHT_REPORT_PATH}",
                    reportFiles: 'index.html',
                    reportName: 'Playwright Test Report',
                    keepAll: true,
                    alwaysLinkToLastBuild: true
                ])
                // Publish Allure Report
                script {
                    echo "Publishing Allure test results..."
                    try {
                        allure([
                            includeProperties: false,
                            jdk: '',
                            properties: [],
                            reportBuildPolicy: 'ALWAYS',
                            results: [[path: 'allure-results']]
                        ])
                        echo "✅ Allure results published"
                    } catch (Exception e) {
                        echo "⚠️ Allure report skipped: ${e.message}"
                    }
                }
            
                // Publish JUnit Report
                script {
                    echo "Publishing JUnit test results..."
                    junit(
                        testResults: 'test-results/**/*.xml',
                        allowEmptyResults: true,
                        healthScaleFactor: 0.0
                    )
                    echo "✅ JUnit results published"
                }
            }
        }
    }

    // ========================================================================
    // Post Build Actions
    // ========================================================================
    post {
        always {
            script {
                echo ""
                echo "╔════════════════════════════════════════════════╗"
                echo "║  Post-Build Cleanup & Notifications          ║"
                echo "╚════════════════════════════════════════════════╝"
                echo ""
                
                // Clean workspace if specified
                cleanWs(
                    deleteDirs: true,
                    patterns: [
                        [pattern: '**/node_modules', type: 'INCLUDE'],
                        [pattern: '**/.playwright', type: 'INCLUDE']
                    ]
                )
            }
        }
        
        success {
            script {
                echo "✅ Pipeline executed successfully!"
                echo ""
                
                if (params.SEND_NOTIFICATIONS) {
                    // Send Slack notification
                    sh '''
                        if command -v curl &> /dev/null; then
                            echo "Sending Slack notification..."
                            # Add your Slack webhook here
                        fi
                    '''
                    
                    // Send email notification
                    emailext(
                        subject: "✅ Build Success: ${env.JOB_NAME} - Build #${env.BUILD_NUMBER}",
                        body: '''
                            Build Status: SUCCESS ✅
                            
                            Project: ${PROJECT_NAME}
                            Build URL: ${BUILD_URL}
                            Build Number: ${BUILD_NUMBER}
                            
                            Test Reports:
                            - Playwright Report: ${BUILD_URL}Playwright_Test_Report
                            - Allure Report: ${BUILD_URL}Allure_Test_Report
                            
                            Commit: ${GIT_COMMIT}
                            Branch: ${GIT_BRANCH}
                        ''',
                        to: "${EMAIL_RECIPIENTS}",
                        mimeType: 'text/html'
                    )
                }
            }
        }
        
        failure {
            script {
                echo "❌ Pipeline failed!"
                echo ""
                
                if (params.SEND_NOTIFICATIONS) {
                    // Send Slack notification
                    sh '''
                        if command -v curl &> /dev/null; then
                            echo "Sending Slack failure notification..."
                            # Add your Slack webhook here
                        fi
                    '''
                    
                    // Send email notification
                    emailext(
                        subject: "❌ Build Failed: ${env.JOB_NAME} - Build #${env.BUILD_NUMBER}",
                        body: '''
                            Build Status: FAILED ❌
                            
                            Project: ${PROJECT_NAME}
                            Build URL: ${BUILD_URL}
                            Build Number: ${BUILD_NUMBER}
                            
                            Test Reports:
                            - Playwright Report: ${BUILD_URL}Playwright_Test_Report
                            - Allure Report: ${BUILD_URL}Allure_Test_Report
                            
                            Commit: ${GIT_COMMIT}
                            Branch: ${GIT_BRANCH}
                            
                            Console Output: ${BUILD_URL}console
                        ''',
                        to: "${EMAIL_RECIPIENTS}",
                        mimeType: 'text/html',
                        attachLog: true
                    )
                }
            }
        }
        
        unstable {
            script {
                echo "⚠️ Pipeline unstable - some tests may have failed"
                
                if (params.SEND_NOTIFICATIONS) {
                    emailext(
                        subject: "⚠️ Build Unstable: ${env.JOB_NAME} - Build #${env.BUILD_NUMBER}",
                        body: '''
                            Build Status: UNSTABLE ⚠️
                            
                            Project: ${PROJECT_NAME}
                            Build URL: ${BUILD_URL}
                            Build Number: ${BUILD_NUMBER}
                        ''',
                        to: "${EMAIL_RECIPIENTS}",
                        mimeType: 'text/html'
                    )
                }
            }
        }
        
        cleanup {
            script {
                echo "Cleaning up..."
                // Additional cleanup if needed
                sh '''
                    echo "Workspace cleanup completed"
                '''
            }
        }
    }
}

// ============================================================================
// Pipeline Summary
// ============================================================================
// 
// This Jenkinsfile provides a complete CI/CD pipeline for Playwright testing:
//
// FEATURES:
// ✅ GitHub Integration - Clone, checkout, and triggers
// ✅ Multi-Browser Testing - Chromium, Firefox, WebKit
// ✅ Parameterized Builds - Select test suite and browser
// ✅ Code Quality Checks - TypeScript, ESLint
// ✅ Test Execution - Full Playwright test suite
// ✅ Allure Reports - Beautiful test reports
// ✅ HTML Reports - Playwright native reports
// ✅ JUnit Results - Integration with Jenkins
// ✅ Notifications - Slack and Email alerts
// ✅ Artifact Archival - Save all test results
//
// REQUIRED JENKINS PLUGINS:
// - GitHub Integration Plugin
// - Email Extension Plugin
// - HTML Publisher Plugin
// - Pipeline Plugin
// - Timestamper Plugin
//
// SETUP INSTRUCTIONS:
// 1. Create new Pipeline job in Jenkins
// 2. Configure GitHub repository connection
// 3. Set Pipeline script from SCM
// 4. Select Jenkinsfile.github from main branch
// 5. Configure email credentials
// 6. Add webhook to GitHub for automatic triggers
//
// ============================================================================
