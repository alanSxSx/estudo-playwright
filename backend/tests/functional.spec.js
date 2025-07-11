const request = require('supertest');
const { app } = require('../app');
const db = require('../db');

jest.mock('../db', () => ({
  query: jest.fn(),
  connect: jest.fn().mockResolvedValue({
    query: jest.fn(),
    release: jest.fn()
  })
}));

const tokenValido = 'Bearer token.valido.mockado';

// Mock do middleware de autenticação para não validar o JWT real
jest.mock('jsonwebtoken', () => ({
  verify: jest.fn((token, secret, callback) => {
    callback(null, { id: 1, email: 'teste@teste.com', tipo: 'admin' });
  })
}));

describe('Rotas de /usuarios (funcionais)', () => {

  beforeEach(() => jest.clearAllMocks());

  test('POST /usuarios deve retornar 400 se campos obrigatórios faltarem', async () => {
    const res = await request(app)
      .post('/usuarios')
      .set('Authorization', tokenValido)
      .send({});

    expect(res.statusCode).toBe(400);
    expect(res.body.erro).toBe('Nome, e-mail, senha e tipo são obrigatórios');
  });

  test('POST /usuarios deve retornar 409 se e-mail já existir', async () => {
    db.query.mockResolvedValueOnce({ rows: [{ id: 1 }] }); // e-mail já existe

    const res = await request(app)
      .post('/usuarios')
      .set('Authorization', tokenValido)
      .send({
        nome: 'Fulano',
        email: 'teste@teste.com',
        senha: '1234',
        tipo: 'admin'
      });

    expect(res.statusCode).toBe(409);
    expect(res.body.erro).toBe('E-mail já cadastrado');
  });

  test('POST /usuarios deve retornar 201 se criado com sucesso', async () => {
    db.query
      .mockResolvedValueOnce({ rows: [] }) // e-mail não existe
      .mockResolvedValueOnce({
        rows: [{ id: 2, nome: 'Fulano', email: 'teste@teste.com', tipo: 'admin' }]
      });

    const res = await request(app)
      .post('/usuarios')
      .set('Authorization', tokenValido)
      .send({
        nome: 'Fulano',
        email: 'teste@teste.com',
        senha: '1234',
        tipo: 'admin'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.email).toBe('teste@teste.com');
  });

  test('GET /usuarios deve retornar lista de usuários', async () => {
    db.query.mockResolvedValueOnce({
      rows: [
        { id: 1, nome: 'Admin', email: 'admin@teste.com', tipo: 'admin' },
        { id: 2, nome: 'Aluno', email: 'aluno@teste.com', tipo: 'aluno' }
      ]
    });

    const res = await request(app)
      .get('/usuarios')
      .set('Authorization', tokenValido);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveLength(2);
    expect(res.body[0].email).toBe('admin@teste.com');
  });

  test('DELETE /usuarios/:id deve retornar 404 se usuário não existir', async () => {
    db.query.mockResolvedValueOnce({ rowCount: 0 });

    const res = await request(app)
      .delete('/usuarios/99')
      .set('Authorization', tokenValido);

    expect(res.statusCode).toBe(404);
    expect(res.body.erro).toBe('Usuário não encontrado');
  });

  test('DELETE /usuarios/:id deve retornar 200 se deletado com sucesso', async () => {
    db.query.mockResolvedValueOnce({
      rowCount: 1,
      rows: [{ id: 1, nome: 'Usuário Teste', email: 'teste@teste.com' }]
    });

    const res = await request(app)
      .delete('/usuarios/1')
      .set('Authorization', tokenValido);

    expect(res.statusCode).toBe(200);
    expect(res.body.mensagem).toBe('Usuário deletado com sucesso');
  });

});
