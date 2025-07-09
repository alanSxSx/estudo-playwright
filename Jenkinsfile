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
                    // Espera o frontend subir antes de rodar os testes
                    bat '''
											@echo off
											echo Aguardando o frontend subir...
											for /L %%i in (1,1,10) do (
												curl -s http://localhost:3001 > nul
												if !errorlevel! equ 0 (
													echo Frontend no ar!
													exit /b 0
												)
												echo Aguardando...
												timeout /t 2 > nul
											)
											echo Erro: o frontend não respondeu na porta 3001
											exit /b 1
											'''
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
