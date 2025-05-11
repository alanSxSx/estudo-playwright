-- Criação da sequência, se necessário
CREATE SEQUENCE IF NOT EXISTS usuarios_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

-- Criação da tabela usuarios
CREATE TABLE IF NOT EXISTS public.usuarios
(
    id integer NOT NULL DEFAULT nextval('usuarios_id_seq'::regclass),
    nome text COLLATE pg_catalog."default" NOT NULL,
    email text COLLATE pg_catalog."default" NOT NULL,
    senha text COLLATE pg_catalog."default" NOT NULL,
    tipo character varying(20) COLLATE pg_catalog."default" DEFAULT 'false'::character varying,
    CONSTRAINT usuarios_pkey PRIMARY KEY (id),
    CONSTRAINT usuarios_email_key UNIQUE (email)
)
TABLESPACE pg_default;

-- Define o dono da tabela
ALTER TABLE IF EXISTS public.usuarios
    OWNER to postgres;

-- Inserção dos registros
INSERT INTO public.usuarios (id, nome, email, senha, tipo) VALUES
(1, 'Alan1', 'teste@teste.com', '$2b$10$bZAG60EAUwMFtargRwfFp.J4rIQBHvanVXuScfom9EmQhSO/V9Q56', 'false'),
(2, 'teste1', 'teste1@teste.com', '$2b$10$eGjByIqQ5EWkvlR6p2MwNOIX.UG0cHXOQcFRfEnlA2EpNpmGQeJmC', 'true')
ON CONFLICT (id) DO NOTHING;
