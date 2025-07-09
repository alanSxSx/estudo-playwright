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
											powershell -Command "
											$maxAttempts = 10
											$success = $false
											for ($i = 1; $i -le $maxAttempts; $i++) {
													try {
															$response = Invoke-WebRequest -Uri http://localhost:3001 -UseBasicParsing -TimeoutSec 2
															if ($response.StatusCode -eq 200) {
																	Write-Host \\"Frontend no ar!\\"
																	$success = $true
																	break
															}
													} catch {
															Write-Host \\"Aguardando frontend... Tentativa $i\\"
															Start-Sleep -Seconds 2
													}
											}
											if (-not $success) {
													Write-Host \\"Erro: o frontend não respondeu na porta 3001\\"
													exit 1
											}
											"
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
