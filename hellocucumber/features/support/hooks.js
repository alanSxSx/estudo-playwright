const { Before, After, Status } = require('@cucumber/cucumber');
const fs = require('fs');
const path = require('path');

// Garante que o diretório de screenshots existe
const screenshotsDir = path.join(process.cwd(), 'test-results', 'screenshots');
if (!fs.existsSync(screenshotsDir)){
    fs.mkdirSync(screenshotsDir, { recursive: true });
}

Before(async function(scenario) {
  console.log(`Iniciando cenário: ${scenario.pickle.name}`);
  await this.init();
});

After(async function(scenario) {
  try {
    // Captura screenshot se o cenário falhar
    if (scenario.result.status === Status.FAILED) {
      const screenshot = await this.page?.screenshot({
        path: path.join(screenshotsDir, `${scenario.pickle.name.replace(/\s+/g, '-')}-failed.png`),
        fullPage: true
      });
      await this.attach(screenshot, 'image/png');
    }
  } catch (error) {
    console.error('Erro ao capturar screenshot:', error);
  } finally {
    await this.cleanup();
    console.log(`Finalizando cenário: ${scenario.pickle.name}`);
  }
});
