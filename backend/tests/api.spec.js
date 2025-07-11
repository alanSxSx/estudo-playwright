const request = require('supertest');
const { app, pool } = require('../app');

let usuarioIdCriado = null; // Variável compartilhada entre testes
let token = null;

describe('Testes da API', () => {

  test('GET /health deve retornar status 200 e JSON com status', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('API Online');
  });

  test('GET /db-health deve retornar status 200 se DB estiver ok', async () => {
    const res = await request(app).get('/db-health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('DB Conectado'); // depende do banco
  });

  let token = '';

  test('POST /login com credenciais inválidas', async () => {
    const res = await request(app)
      .post('/login')
      .send({ email: 'invalido@example.com', senha: 'senhaErrada' });
    expect(res.statusCode).toBe(401);
    expect(res.body.erro).toBe('Usuário não encontrado');
  });

  test('POST /login com usuário válido', async () => {
    const res = await request(app)
      .post('/login')
      .send({ email: 'teste@teste.com', senha: '123' }); // use um usuário real do banco

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
    token = res.body.token;
  });

  test('POST /usuarios sem token deve retornar 401', async () => {
    const res = await request(app).post('/usuarios').send({
      nome: 'Novo Usuário',
      email: 'novo@email.com',
      senha: '123456',
      tipo: 'aluno'
    });
    expect(res.statusCode).toBe(401);
		expect(res.body.erro).toBe('Token não fornecido');
  });

	test('POST /usuarios faltando informações', async () => {
    const res = await request(app)
		.post('/usuarios')
		.set('Authorization', `Bearer ${token}`)
		.send({ });
    expect(res.statusCode).toBe(400);
		expect(res.body.erro).toBe('Nome, e-mail, senha e tipo são obrigatórios');
  });

  test('POST /usuarios com token válido', async () => {
    const res = await request(app)
      .post('/usuarios')
      .set('Authorization', `Bearer ${token}`)
      .send({
        nome: 'Usuário Teste',
        email: 'teste3@teste.com',
        senha: '1234',
        tipo: 'admin'
      });

    if (res.statusCode === 201) {
    usuarioIdCriado = res.body.id;
  }
    expect([201, 409]).toContain(res.statusCode);
  });

	test('GET /usuarios Busca os usuários', async () => {
    const res = await request(app)
      .get('/usuarios')
      .set('Authorization', `Bearer ${token}`)

		expect(res.statusCode).toBe(200);

  });

	test('DELETE /usuarios sucesso', async () => {
    const res = await request(app)
      .delete(`/usuarios/${usuarioIdCriado}`)
      .set('Authorization', `Bearer ${token}`)

    expect(res.statusCode).toBe(200);
		expect(res.body.mensagem).toBe('Usuário deletado com sucesso');
  });

});

afterAll(async () => {
  await pool.end();
});
