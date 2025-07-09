const { setWorldConstructor } = require('@cucumber/cucumber');
const { chromium } = require('playwright');

class CustomWorld {
  constructor() {
    this.browser = null;
    this.context = null;
    this.page = null;
  }

  async init() {
    try {
      this.browser = await chromium.launch({
        headless: true,
        slowMo: 100 // Adiciona um pequeno delay para melhor visualização
      });
      this.context = await this.browser.newContext({
        viewport: { width: 1280, height: 720 },
        recordVideo: {
          dir: 'test-results/videos/'
        }
      });
      this.page = await this.context.newPage();
      await this.page.setDefaultTimeout(10000); // 10 segundos de timeout
    } catch (error) {
      console.error('Falha ao inicializar o navegador:', error);
      throw error;
    }
  }

  async cleanup() {
    try {
      await this.page?.close();
      await this.context?.close();
      await this.browser?.close();
    } catch (error) {
      console.error('Erro durante a limpeza:', error);
    }
  }
}

setWorldConstructor(CustomWorld);
