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

        stage('Subir Infraestrutura Docker') {
						steps {
								dir('estudo-playwright') {
										bat 'docker-compose up -d db backend frontend'
										echo 'Aguardando frontend subir...'
										sleep time: 15, unit: 'SECONDS'
								}
					}
			}


        stage('Executar Testes - Playwright') {
            steps {
                dir('estudo-playwright') {
                    bat 'docker-compose run --rm playwright'
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
