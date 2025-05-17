Feature: Login de usuários
  Como um usuário registrado
  Quero fazer login no sistema
  Para acessar minhas funcionalidades

  Scenario: Login bem-sucedido com credenciais válidas de usuario
    Given que o usuário está na página de login
    When ele informa o email "teste@teste.com" e a senha "123"
    And clica no botão de login
    Then ele deve ser redirecionado para a página inicial de "usuario"
    And deve ver a mensagem "Olá , bem vindo !"

	Scenario: Login bem-sucedido com credenciais válidas de "administrador"
    Given que o usuário está na página de login
    When ele informa o email "teste1@teste.com" e a senha "123"
    And clica no botão de login
    Then ele deve ser redirecionado para a página inicial de "administrador"
    And deve ver a mensagem "Olá , bem vindo !"

  Scenario: Login com senha incorreta
    Given que o usuário está na página de login
    When ele informa o email "usuario@email.com" e a senha "senhaErrada"
    And clica no botão de login
    Then ele deve ver a mensagem de erro "Email ou Senha inválidos"

  Scenario: Login com campos obrigatórios vazios
    Given que o usuário está na página de login
    When ele não preenche o email e a senha
    And clica no botão de login
    Then ele deve ver as mensagens de campo obrigatório
