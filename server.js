// ======================================================
// CONFIGURAÇÃO
// ======================================================

require("dotenv").config();

const express = require("express");
const mysql = require("mysql2/promise");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 3000;

// ======================================================
// LIGAÇÃO À BASE DE DADOS
// ======================================================

const pool = mysql.createPool({

    host: process.env.DATABASE_HOST,

    port: Number(process.env.DATABASE_PORT || 3306),

    user: process.env.DATABASE_USER,

    password: process.env.DATABASE_PASSWORD,

    database: process.env.DATABASE_NAME,

    waitForConnections: true,

    connectionLimit: 10,

    queueLimit: 0

});

// ======================================================
// MIDDLEWARE
// ======================================================

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "frontend")));

app.use((req, res, next) => {

    const hora = new Date().toLocaleTimeString("pt-PT");

    console.log(`[${hora}] ${req.method} ${req.url}`);

    next();

});

// ======================================================
// VALIDAÇÃO
// ======================================================

function validarEvento(req, res, next) {

    const { nome, data } = req.body;

    if (!nome || nome.trim().length < 2) {

        return res.status(400).json({

            erro: "Nome do evento inválido."

        });

    }

    if (!data) {

        return res.status(400).json({

            erro: "Data obrigatória."

        });

    }

    req.body = {

        nome: nome.trim(),

        data

    };

    next();

}

// ======================================================
// GET - LISTAR TODOS
// ======================================================

app.get("/api/eventos", async (req, res) => {

    try {

        const [eventos] = await pool.execute(

            "SELECT * FROM eventos ORDER BY data ASC"

        );

        res.json(eventos);

    }

    catch (erro) {

        console.error(erro);

        res.status(500).json({

            erro: "Erro ao listar eventos."

        });

    }

});

// ======================================================
// GET - EVENTO POR ID
// ======================================================

app.get("/api/eventos/:id", async (req, res) => {

    try {

        const id = Number(req.params.id);

        const [evento] = await pool.execute(

            "SELECT * FROM eventos WHERE id = ?",

            [id]

        );

        if (evento.length === 0) {

            return res.status(404).json({

                erro: "Evento não encontrado."

            });

        }

        res.json(evento[0]);

    }

    catch (erro) {

        console.error(erro);

        res.status(500).json({

            erro: "Erro ao procurar evento."

        });

    }

});

// ======================================================
// POST - NOVO EVENTO
// ======================================================

app.post("/api/eventos", validarEvento, async (req, res) => {

    try {

        const { nome, data } = req.body;

        const [resultado] = await pool.execute(

            "INSERT INTO eventos (nome, data) VALUES (?, ?)",

            [nome, data]

        );

        res.status(201).json({

            mensagem: "Evento criado com sucesso.",

            id: resultado.insertId

        });

    }

    catch (erro) {

        console.error(erro);

        res.status(500).json({

            erro: "Erro ao criar evento."

        });

    }

});

// ======================================================
// PUT - ATUALIZAR EVENTO
// ======================================================

app.put("/api/eventos/:id", validarEvento, async (req, res) => {

    try {

        const id = Number(req.params.id);

        const { nome, data } = req.body;

        const [evento] = await pool.execute(

            "SELECT id FROM eventos WHERE id = ?",

            [id]

        );

        if (evento.length === 0) {

            return res.status(404).json({

                erro: "Evento não encontrado."

            });

        }

        await pool.execute(

            "UPDATE eventos SET nome = ?, data = ? WHERE id = ?",

            [nome, data, id]

        );

        res.json({

            mensagem: "Evento atualizado com sucesso."

        });

    }

    catch (erro) {

        console.error(erro);

        res.status(500).json({

            erro: "Erro ao atualizar evento."

        });

    }

});

// ======================================================
// DELETE - APAGAR EVENTO
// ======================================================

app.delete("/api/eventos/:id", async (req, res) => {

    try {

        const id = Number(req.params.id);

        const [evento] = await pool.execute(

            "SELECT id FROM eventos WHERE id = ?",

            [id]

        );

        if (evento.length === 0) {

            return res.status(404).json({

                erro: "Evento não encontrado."

            });

        }

        await pool.execute(

            "DELETE FROM eventos WHERE id = ?",

            [id]

        );

        res.json({

            mensagem: "Evento eliminado com sucesso."

        });

    }

    catch (erro) {

        console.error(erro);

        res.status(500).json({

            erro: "Erro ao eliminar evento."

        });

    }

});

// ======================================================
// ROTA 404
// ======================================================

app.use((req, res) => {

    res.status(404).json({

        erro: "Rota não encontrada."

    });

});

// ======================================================
// TRATAMENTO GLOBAL DE ERROS
// ======================================================

app.use((erro, req, res, next) => {

    console.error(erro);

    res.status(500).json({

        erro: "Erro interno do servidor."

    });

});

// ======================================================
// INICIAR SERVIDOR
// ======================================================

async function iniciarServidor() {

    try {

        await pool.execute("SELECT 1");

        console.log("Base de dados ligada com sucesso.");

        app.listen(PORT, () => {

            console.log(`Servidor iniciado na porta ${PORT}`);

        });

    }

    catch (erro) {

        console.error("Erro ao ligar à base de dados.");

        console.error(erro);

        process.exit(1);

    }

}

iniciarServidor();

