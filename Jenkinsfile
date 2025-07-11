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
        stage('Limpar Workspace') {
            steps {
                deleteDir()
            }
        }

        stage('Clonar Repositorio') {
            steps {
                bat 'git clone https://github.com/alanSxSx/estudo-playwright.git'
            }
        }

        stage('Atualizar Submodulos') {
            steps {
                dir('estudo-playwright') {
                    bat 'git submodule update --init --recursive'
                }
            }
        }

        stage('Instalar Dependencias (Node.js)') {
            steps {
                dir('estudo-playwright') {
                    bat 'docker-compose run --rm backend npm install'
                    bat 'docker-compose run --rm frontend npm install'
                }
            }
        }

        stage('Build e Subir Todos os Containers') {
            steps {
                dir('estudo-playwright') {
                    bat 'docker-compose build'
                    // Sobe todos os serviços de uma vez: db, backend, frontend, pg-sonar, sonarqube
                    bat 'docker-compose up -d'
                    echo 'Aguardando containers subirem...'
                    sleep time: 45, unit: 'SECONDS'
                }
            }
        }

        stage('Executar Testes - Playwright') {
            steps {
                dir('estudo-playwright') {
                    bat 'docker-compose run --rm playwright'
                    sleep time: 10, unit: 'SECONDS'
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

        stage('Analise SonarQube') {
            steps {
                dir('estudo-playwright') {
                    withSonarQubeEnv('SONAR_LOCAL') {
                    bat "${scannerHome}\\bin\\sonar-scanner -Dsonar.login=sqa_9efad1dbc88e9bb045c0cbc5f282080d8f07a33f"
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
                    bat 'curl -I http://localhost:9000 || exit 1'
                }
            }
        }
    }

}
