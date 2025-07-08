pipeline {
    agent any

    environment {
        NEXTAUTH_SECRET = 'teste9999999'
        NEXTAUTH_URL = 'http://localhost:3001/'
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

        stage('Subir Containers Docker') {
            steps {
                dir('estudo-playwright') {
                    bat 'docker-compose up -d'
                }
            }
        }

        stage('Criar .env do NextAuth') {
            steps {
                dir('estudo-playwright/projnextauth') {
                    script {
                        writeFile file: '.env', text: """
													NEXTAUTH_SECRET=${env.NEXTAUTH_SECRET}
													NEXTAUTH_URL=${env.NEXTAUTH_URL}
													"""
                    }
                }
            }
        }

        stage('Instalar Dependencias NextAuth') {
            steps {
                dir('estudo-playwright/projnextauth') {
                    bat 'npm install'
										bat 'npm run start -- -p 3001'
                }
            }
        }

        stage('Iniciar NextAuth em segundo plano (Windows)') {
            steps {
                dir('estudo-playwright/projnextauth') {
                    bat 'start /B npm run dev'
                    sleep time: 10, unit: 'SECONDS'
                }
            }
        }

        stage('Instalar e Rodar Testes - Playwright') {
            steps {
                dir('estudo-playwright/playwright') {
                    bat 'npm install'
                    bat 'npx playwright test --project=firefox --headed'
                }
            }
        }

        stage('Instalar e Rodar Testes - Cucumber') {
            steps {
                dir('estudo-playwright/hellocucumber') {
                    bat 'npm install'
                    bat 'npm test'
                }
            }
        }
    }

    post {
        always {
            echo 'Finalizando pipeline...'
            dir('estudo-playwright') {
                bat 'docker-compose down || exit 0'
            }
        }
    }
}
