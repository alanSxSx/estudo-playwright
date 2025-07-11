const express = require('express');
const pool = require('./db');
const dotenv = require('dotenv');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

dotenv.config();

const app = express();
app.use(express.json()); // Permitir JSON no body das requisições

app.use(cors({
	origin: 'http://localhost:3001',
	methods: ['GET', 'POST'],
	credentials: false
}));

function autenticarToken(req, res, next) {
	const authHeader = req.headers['authorization']; // Ex: "Bearer eyJhbGciOi..."
	const token = authHeader && authHeader.split(' ')[1];

	if (!token) return res.status(401).json({ erro: 'Token não fornecido' });

	jwt.verify(token, process.env.JWT_SECRET, (err, usuario) => {
		if (err) return res.status(403).json({ erro: 'Token inválido ou expirado' });

		req.usuario = usuario; // Anexa os dados do usuário no req
		next();
	});
}

app.get('/health', (req, res) => {
	res.status(200).json({ status: 'API Online' });
});

// Rota para testar conexão com o banco de dados
app.get('/db-health', async (req, res) => {
	try {
		const client = await pool.connect();
		await client.query('SELECT NOW()');
		client.release();
		res.status(200).json({ status: 'DB Conectado' });
	} catch (err) {
		res.status(500).json({ status: 'Erro ao conectar com o banco de dados'});
	}
});


app.post('/login' , async (req, res) => {
	const { email, senha, tipo } = req.body;

	if (!email || !senha) {
		return res.status(400).json({ erro: 'E-mail e senha são obrigatórios' });
	}

	try {
		const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);

		if (result.rows.length === 0) {
			return res.status(401).json({ erro: 'Usuário não encontrado' });
		}

		const usuario = result.rows[0];
		const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

		if (!senhaCorreta) {
			return res.status(401).json({ erro: 'Senha incorreta' });
		}

		const token = jwt.sign({ id: usuario.id, email: usuario.email, tipo: usuario.tipo }, process.env.JWT_SECRET, {
			expiresIn: '10h',
		});


		res.status(200).json({ mensagem: 'Login bem-sucedido', token, id: usuario.id, email: usuario.email, tipo: usuario.tipo });
	} catch (err) {
		console.error('Erro ao autenticar usuário:', err.message);
		res.status(500).json({ erro: 'Erro no login' });
	}
});

app.post('/usuarios', autenticarToken, async (req, res) => {
	const { nome, email, senha, tipo } = req.body;

	if (!nome || !email || !senha || !tipo) {
		return res.status(400).json({ erro: 'Nome, e-mail, senha e tipo são obrigatórios' });
	}

	try {
		// Verificando se o e-mail já existe
		const existingUser = await pool.query('SELECT id FROM usuarios WHERE email = $1', [email]);
		if (existingUser.rows.length > 0) {
			return res.status(409).json({ erro: 'E-mail já cadastrado' });
		}

		// Hashing da senha
		const hashedPassword = await bcrypt.hash(senha, 10);

		// Inserção no banco de dados
		const result = await pool.query(
			'INSERT INTO usuarios (nome, email, senha, tipo) VALUES ($1, $2, $3, $4) RETURNING id, nome, email, tipo',
			[nome, email, hashedPassword, tipo]
		);

		return res.status(201).json(result.rows[0]);
	} catch (err) {
		console.error('Erro ao salvar usuário:', err);  // Log do erro completo
		res.status(500).json({ erro: 'Erro ao salvar usuário' });
	}
});

app.delete('/usuarios/:id', autenticarToken, async (req, res) => {
	const { id } = req.params;

	try {
		const result = await pool.query('DELETE FROM usuarios WHERE id = $1 RETURNING *', [id]);

		if (result.rowCount === 0) {
			return res.status(404).json({ erro: 'Usuário não encontrado' });
		}

		return res.status(200).json({ mensagem: 'Usuário deletado com sucesso', usuario: result.rows[0] });
	} catch (err) {
		console.error('Erro ao deletar usuário:', err);
		res.status(500).json({ erro: 'Erro ao deletar usuário' });
	}
});

app.get('/usuarios', autenticarToken, async (req, res) => {
	try {
		const result = await pool.query('SELECT id, nome, email, tipo FROM usuarios ORDER BY id');
		res.status(200).json(result.rows);
	} catch (err) {
		console.error('Erro ao listar usuários:', err);
		res.status(500).json({ erro: 'Erro ao buscar usuários' });
	}
});

module.exports = {app,pool};
