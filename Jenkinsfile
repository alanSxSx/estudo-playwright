pipeline {
    agent any

    environment {
        NEXTAUTH_SECRET = 'teste9999999'
        NEXTAUTH_URL = 'http://localhost:3001/'
    }

    stages {

        stage('Clonar Repositório Principal') {
            steps {
                sh 'git clone https://github.com/alanSxSx/estudo-playwright.git'
            }
        }

        stage('Clonar Submódulos') {
            steps {
                dir('estudo-playwright') {
                    sh 'git submodule update --init --recursive'
                }
            }
        }

        stage('Subir Containers Docker') {
            steps {
                dir('estudo-playwright') {
                    sh 'docker-compose up -d'
                }
            }
        }

        stage('Configurar NextAuth .env') {
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

        stage('Instalar e Rodar NextAuth') {
            steps {
                dir('estudo-playwright/projnextauth') {
                    sh 'npm install'
                    sh 'nohup npm run dev &'
                    // Esperar o servidor subir
                    sleep time: 10, unit: 'SECONDS'
                }
            }
        }

        stage('Instalar e Rodar Testes - Playwright') {
            steps {
                dir('estudo-playwright/playwright') {
                    sh 'npm install'
                    sh 'npx playwright test --project=firefox --headed'
                }
            }
        }

        stage('Instalar e Rodar Testes - Cucumber') {
            steps {
                dir('estudo-playwright/playwright') {
                    sh 'npm install'
                    sh 'npm test'
                }
            }
        }
    }

    post {
        always {
            echo 'Finalizando pipeline...'
            sh 'docker-compose down || true'
        }
    }
}
