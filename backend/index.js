const {app} = require('./app');
const port = process.env.PORT || 3000;
app.disable('x-powered-by');
app.listen(port, () => {
	console.log(`Servidor rodando na porta ${port}`);
});
