const app = require('./app');
const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`Servidor rodando na porta ${port}`);
});
// app.listen(port, () => console.log(`Servidor rodando na porta ${port}`));
