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
                    bat 'docker-compose up -d'
                    echo 'Aguardando o backend ficar disponível...'
                    bat '''
                      for /L %%i in (1,1,12) do (
                      curl -s -o nul -w "%%{http_code}" http://localhost:3000/db-health && goto ok
                      echo Tentativa %%i falhou, aguardando...
                      timeout /T 15 >nul
                      )
                      echo Falha ao conectar ao BANCO de dados.
                      exit /B 1
                      :ok
                      echo Banco de Dados OK
                      '''
											bat '''
                      for /L %%i in (1,1,12) do (
                      curl -s -o nul -w "%%{http_code}" http://localhost:3001 && goto ok
                      echo Tentativa %%i falhou, aguardando...
                      timeout /T 15 >nul
                      )
                      echo Falha ao conectar no frontend.
                      exit /B 1
                      :ok
                      echo FrontEnd OK
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

        stage('Executar Testes Unitários Backend') {
            steps {
                dir('estudo-playwright') {
                    // bat 'docker-compose run --rm jest'
										bat 'docker-compose exec backend npm run test'
                }
            }
        }

				stage('Executar Testes Unitários Frontend') {
            steps {
                dir('estudo-playwright') {
                    // bat 'docker-compose run --rm jest'
										bat 'docker-compose exec frontend npm run test'
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
                        bat """
                          ${scannerHome}\\bin\\sonar-scanner ^
                        -Dsonar.projectBaseDir=backend ^
                        -Dsonar.projectKey=backend-api ^
                        -Dsonar.sources=. ^
                        -Dsonar.exclusions=**/node_modules/**,**/__tests__/**,**/*.test.js,**/*.spec.js,**/coverage/** ^
                        -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info ^
                        -Dsonar.login=sqa_9efad1dbc88e9bb045c0cbc5f282080d8f07a33f
                        """
                    }
                }
            }
        }

				stage('Analise SonarQube - Frontend') {
          steps {
            dir('estudo-playwright/projnextauth') {
              withSonarQubeEnv('SONAR_LOCAL') {
                bat """
                  ${scannerHome}\\bin\\sonar-scanner ^
                  -Dsonar.projectBaseDir=. ^
                  -Dsonar.projectKey=projnextauth ^
                  -Dsonar.sources=. ^
                  -Dsonar.exclusions=**/node_modules/**,**/__tests__/**,**/*.test.tsx,**/*.spec.tsx,**/coverage/** ^
                  -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info ^
                  -Dsonar.login=sqa_9efad1dbc88e9bb045c0cbc5f282080d8f07a33f
                  """
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
