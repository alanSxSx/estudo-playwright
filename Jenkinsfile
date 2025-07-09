pipeline {
    agent any

    environment {
        scannerHome = tool 'SONAR_SCANNER'
    }

    stages {

        stage('Install Dependencies') {
            steps {
                bat 'docker-compose run --rm backend npm install'
                bat 'docker-compose run --rm frontend npm install'
            }
        }

        stage('Build & Start Containers') {
            steps {
                bat 'docker-compose build'
                bat 'docker-compose up -d'
                sleep(10) // aguarda os serviços subirem
            }
        }

        stage('Functional Tests') {
            steps {
                bat 'docker-compose run --rm playwright'
                bat 'docker-compose run --rm cucumber'
            }
        }

        stage('Sonar Analysis') {
            steps {
                withSonarQubeEnv('SONAR_LOCAL') {
                    bat "${scannerHome}\\bin\\sonar-scanner -e " +
                        "-Dsonar.projectKey=projeto-qa " +
                        "-Dsonar.sources=backend,projnextauth " +
                        "-Dsonar.tests=playwright,hellocucumber " +
                        "-Dsonar.test.inclusions=**/*.test.ts,**/*.steps.ts " +
                        "-Dsonar.exclusions=**/node_modules/**,**/dist/**,**/coverage/** " +
                        "-Dsonar.sourceEncoding=UTF-8"
                }
            }
        }

        stage('Quality Gate') {
            steps {
                timeout(time: 1, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage('Health Check') {
            steps {
                bat 'curl -I http://localhost:3001 || exit 1'
                bat 'curl -I http://localhost:3000/health || exit 1'
            }
        }
    }

    post {
        always {
            echo 'Pipeline finalizado. Você pode configurar emails ou relatórios aqui.'
            bat 'docker-compose down -v'
        }
    }
}
