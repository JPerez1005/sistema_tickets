-- Database: sistema_tickets

-- DROP DATABASE IF EXISTS sistema_tickets;

CREATE DATABASE sistema_tickets
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'Spanish_Colombia.1252'
    LC_CTYPE = 'Spanish_Colombia.1252'
    LOCALE_PROVIDER = 'libc'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;

CREATE TABLE cache(
    "key" varchar(255) NOT NULL,
    "value" text NOT NULL,
    expiration integer NOT NULL,
    PRIMARY KEY(key)
);

CREATE TABLE cache_locks(
    "key" varchar(255) NOT NULL,
    owner varchar(255) NOT NULL,
    expiration integer NOT NULL,
    PRIMARY KEY(key)
);

CREATE TABLE failed_jobs(
    id SERIAL NOT NULL,
    uuid varchar(255) NOT NULL,
    connection text NOT NULL,
    queue text NOT NULL,
    payload text NOT NULL,
    exception text NOT NULL,
    failed_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(id)
);
CREATE UNIQUE INDEX failed_jobs_uuid_unique ON failed_jobs USING btree ("uuid");

CREATE TABLE historias(
    id SERIAL NOT NULL,
    accion varchar(255) NOT NULL,
    descripcion varchar(255) NOT NULL,
    entidad_afectada varchar(255) NOT NULL,
    usuario_modificado_id integer,
    tickets_id bigint,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    user_id bigint,
    PRIMARY KEY(id),
    CONSTRAINT historias_tickets_id_foreign FOREIGN key(tickets_id) REFERENCES tickets(id),
    CONSTRAINT historias_user_id_foreign FOREIGN key(user_id) REFERENCES users(id),
    CONSTRAINT historias_accion_check CHECK (((accion)::text = ANY ((ARRAY['creacion'::character varying, 'cambio_estado'::character varying, 'modificacion'::character varying])::text[]))),
    CONSTRAINT historias_entidad_afectada_check CHECK (((entidad_afectada)::text = ANY ((ARRAY['usuarios'::character varying, 'tickets'::character varying])::text[])))
);

CREATE TABLE job_batches(
    id varchar(255) NOT NULL,
    name varchar(255) NOT NULL,
    total_jobs integer NOT NULL,
    pending_jobs integer NOT NULL,
    failed_jobs integer NOT NULL,
    failed_job_ids text NOT NULL,
    options text,
    cancelled_at integer,
    created_at integer NOT NULL,
    finished_at integer,
    PRIMARY KEY(id)
);

CREATE TABLE jobs(
    id SERIAL NOT NULL,
    queue varchar(255) NOT NULL,
    payload text NOT NULL,
    attempts smallint NOT NULL,
    reserved_at integer,
    available_at integer NOT NULL,
    created_at integer NOT NULL,
    PRIMARY KEY(id)
);
CREATE INDEX jobs_queue_index ON jobs USING btree ("queue");

CREATE TABLE migrations(
    id SERIAL NOT NULL,
    migration varchar(255) NOT NULL,
    batch integer NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE password_reset_tokens(
    email varchar(255) NOT NULL,
    token varchar(255) NOT NULL,
    created_at timestamp without time zone,
    PRIMARY KEY(email)
);

CREATE TABLE personal_access_tokens(
    id SERIAL NOT NULL,
    tokenable_type varchar(255) NOT NULL,
    tokenable_id bigint NOT NULL,
    name varchar(255) NOT NULL,
    token varchar(64) NOT NULL,
    abilities text,
    last_used_at timestamp without time zone,
    expires_at timestamp without time zone,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    PRIMARY KEY(id)
);
CREATE INDEX personal_access_tokens_tokenable_type_tokenable_id_index ON personal_access_tokens USING btree ("tokenable_type","tokenable_id");
CREATE UNIQUE INDEX personal_access_tokens_token_unique ON personal_access_tokens USING btree ("token");

CREATE TABLE sessions(
    id varchar(255) NOT NULL,
    user_id bigint,
    ip_address varchar(45),
    user_agent text,
    payload text NOT NULL,
    last_activity integer NOT NULL,
    PRIMARY KEY(id)
);
CREATE INDEX sessions_user_id_index ON sessions USING btree ("user_id");
CREATE INDEX sessions_last_activity_index ON sessions USING btree ("last_activity");

CREATE TABLE tickets(
    id SERIAL NOT NULL,
    titulo varchar(255) NOT NULL,
    descripcion varchar(255) NOT NULL,
    respuesta varchar(255),
    usuario_creacion integer,
    usuario_respuesta integer,
    fecha_respuesta timestamp without time zone,
    estado varchar(255) NOT NULL,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    PRIMARY KEY(id),
    CONSTRAINT tickets_estado_check CHECK (((estado)::text = ANY ((ARRAY['abierto'::character varying, 'en_proceso'::character varying, 'cerrado'::character varying, 'cancelado'::character varying])::text[])))
);

CREATE TABLE users(
    id SERIAL NOT NULL,
    name varchar(255) NOT NULL,
    email varchar(255) NOT NULL,
    email_verified_at timestamp without time zone,
    password varchar(255) NOT NULL,
    rol varchar(255) NOT NULL,
    remember_token varchar(100),
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    PRIMARY KEY(id),
    CONSTRAINT users_rol_check CHECK (((rol)::text = ANY ((ARRAY['administrador'::character varying, 'soporte'::character varying, 'usuario'::character varying])::text[])))
);
CREATE UNIQUE INDEX users_email_unique ON users USING btree ("email");