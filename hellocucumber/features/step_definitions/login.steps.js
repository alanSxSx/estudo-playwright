const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3001';

Given('que o usuário está na página de login', async function () {
  try {
    await this.page.goto(BASE_URL);
    await this.page.waitForLoadState('networkidle');
    await expect(this.page.getByRole('heading', { name: 'Login' })).toBeVisible();
  } catch (error) {
    console.error('Erro ao acessar a página de login:', error);
    throw error;
  }
});

When('ele informa o email {string} e a senha {string}', async function (email, senha) {
  try {
    await this.page.getByLabel('Email').fill(email);
    await this.page.locator('input[type="password"]').fill(senha);
  } catch (error) {
    console.error('Erro ao preencher credenciais:', error);
    throw error;
  }
});

When('clica no botão de login', async function () {
  try {
    await this.page.getByRole('button', { name: 'Entrar' }).click();
  } catch (error) {
    console.error('Erro ao clicar no botão de login:', error);
    throw error;
  }
});

When('ele não preenche o email e a senha', async function () {
  try {
    await this.page.getByRole('button', { name: 'Entrar' }).click();
  } catch (error) {
    console.error('Erro ao limpar campos:', error);
    throw error;
  }
});

Then('ele deve ser redirecionado para a página inicial de {string}', async function (tipoUsuario) {
  try {
    const rota = tipoUsuario.toLowerCase() === 'administrador' ? 'admin' : 'testandouser'; // ajuste se necessário
    await this.page.waitForURL(`**/${rota}`);
    await expect(this.page).toHaveURL(new RegExp(`/${rota}$`));
  } catch (error) {
    console.error(`Erro ao redirecionar para página inicial de ${tipoUsuario}:`, error);
    throw error;
  }
});

Then('deve ver a mensagem {string}', async function (mensagem) {
  try {
    await expect(this.page.getByText(mensagem)).toBeVisible();
  } catch (error) {
    console.error(`Erro ao verificar a mensagem: ${mensagem}`, error);
    throw error;
  }
});

Then('ele deve ver a mensagem de erro {string}', async function (mensagem) {
  try {
    await expect(this.page.getByText(mensagem)).toBeVisible();
  } catch (error) {
    console.error('Erro ao verificar mensagem de erro:', error);
    throw error;
  }
});

Then('ele deve ver as mensagens de campo obrigatório', async function () {
  try {
    await expect(this.page.getByText('Email is required.')).toBeVisible();
    await expect(this.page.getByText('Password is required.')).toBeVisible();
  } catch (error) {
    console.error('Erro ao verificar mensagens de campos obrigatórios:', error);
    throw error;
  }
});

Then('ele deve ver o spinner de carregamento', async function () {
  try {
    await expect(this.page.getByLabel('Carregando Spinner')).toBeVisible();
  } catch (error) {
    console.error('Erro ao verificar spinner de carregamento:', error);
    throw error;
  }
});

Then('ele deve ver elementos específicos de administrador', async function () {
  try {
    // Aguarda a página carregar completamente após o login
    await this.page.waitForLoadState('networkidle');

    // Verifica elementos que só um administrador deveria ver
    // Ajuste estes seletores de acordo com sua interface real
    await expect(this.page.getByRole('heading', { name: 'Painel Administrativo' })).toBeVisible();
    await expect(this.page.getByRole('navigation')).toContainText('Gerenciar Usuários');
    await expect(this.page.getByRole('navigation')).toContainText('Configurações do Sistema');
  } catch (error) {
    console.error('Erro ao verificar elementos de administrador:', error);
    throw error;
  }
});
