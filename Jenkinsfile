pipeline {
    agent any

    environment {
        scannerHome = tool 'SONAR_SCANNER'
        NEXTAUTH_SECRET = 'teste9999999'
        NEXTAUTH_URL = 'http://localhost:3001'
        BACKEND_URL = 'http://backend:3000'
    }

    options {
        skipDefaultCheckout()
    }

    stages {
        stage('Clean Workspace') {
            steps {
                deleteDir()
            }
        }

        stage('Clonar Repositorio Principal') {
            steps {
                bat 'git clone https://github.com/alanSxSx/estudo-playwright.git'
            }
        }

        stage('Clonar Submodulos') {
            steps {
                dir('estudo-playwright') {
                    bat 'git submodule update --init --recursive'
                }
            }
        }

        stage('Instalar Dependências') {
            steps {
                dir('estudo-playwright') {
                    bat 'docker-compose run --rm backend npm install'
                    bat 'docker-compose run --rm frontend npm install'
                }
            }
        }

        stage('Build & Start Containers') {
            steps {
                dir('estudo-playwright') {
                    bat 'docker-compose build'
                    bat 'docker-compose up -d'
                    sleep(time: 15, unit: 'SECONDS')
                }
            }
        }

        stage('Executar Testes - Playwright') {
            steps {
                dir('estudo-playwright') {
                    bat 'docker-compose run --rm playwright'
										sleep time: 5, unit: 'SECONDS'
                }
            }
        }

        stage('Executar Testes - Cucumber') {
            steps {
                dir('estudo-playwright') {
                    bat 'docker-compose run --rm cucumber'
                }
            }
        }

        stage('Análise SonarQube') {
            steps {
                dir('estudo-playwright') {
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
                dir('estudo-playwright') {
                    bat 'curl -I http://localhost:3001 || exit 1'
                    bat 'curl -I http://localhost:3000/health || exit 1'
                }
            }
        }
    }

    post {
        always {
            echo 'Finalizando pipeline...'
            dir('estudo-playwright') {
                bat 'docker-compose down --volumes --remove-orphans || exit 0'
            }
        }
    }
}
