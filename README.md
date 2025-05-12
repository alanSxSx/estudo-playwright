# Estudo Playwright

Este projeto foi criado com o objetivo de praticar e estudar automação de testes utilizando o Playwright, com integração de outras ferramentas como NextAuth e Docker. Abaixo estão as instruções para configurar e executar o projeto localmente.

---

## 🚀 Como Rodar o Projeto

Siga as etapas abaixo para rodar o projeto na sua máquina.

### 1. Clonar o repositório principal

Clone o repositório principal com o seguinte comando:

git clone https://github.com/alanSxSx/estudo-playwright.git

2. Acessar a pasta do projeto
Entre na pasta do projeto:
cd estudo-playwright

3. Clonar os submódulos
O projeto contém submódulos. Para cloná-los, execute o comando:

  git submodule update --init --recursive

4. Executar o Docker Compose
O projeto utiliza o Docker para levantar os containers. Execute o comando abaixo para iniciar os containers necessários:

  docker-compose up

5. Configurar o NextAuth
Entre na pasta projnextauth:

  cd projnextauth

Crie um arquivo .env na pasta e defina as variáveis de ambiente:

NEXTAUTH_SECRET=teste9999999
NEXTAUTH_URL=http://localhost:3001/

6. Instalar as dependências e rodar o servidor
Instale as dependências do projeto e inicie o servidor:

  npm install
  npm run dev

O servidor estará disponível em http://localhost:3001.
CERTIFIQUE-SE QUE O SERVIDOR INICIOU NESSE ENDEREÇO. CASO TENHA INICIADO EM OUTRO ENDEREÇO, TERÁ QUE TROCAR A PORTA EM ALGUNS LUGARES DO PROJETO PARA QUE FUNCIONE.

7. Acessar a pasta Playwright
Entre na pasta playwright:

  cd playwright

8. Instalar as dependências do Playwright e rodar os testes
Instale as dependências do Playwright e execute os testes utilizando o Firefox e a interface gráfica (headed):

  npm install
  npx playwright test --project=firefox --headed

📄 Execução dos Testes
Após seguir todas as etapas acima, os testes estarão prontos para execução no Playwright. Os testes serão executados conforme a configuração do projeto, permitindo que você visualize os resultados na interface gráfica.

OBS:

USUARIO DE TESTE:

USER: teste@teste.com | senha: 123
ADMIN: teste1@teste.com | senha: 123

🛠️ Tecnologias Utilizadas:

Playwright: Framework de automação de testes de navegador.

NextAuth: Sistema de autenticação para o Next.js.

Docker: Contêineres para rodar o ambiente de desenvolvimento.

🤝 Contribuindo
Se você deseja contribuir para o projeto, sinta-se à vontade para fazer um fork, criar uma branch e enviar um pull request.

![image](https://github.com/user-attachments/assets/4256904e-6679-46da-8cf9-c75402721a10)








