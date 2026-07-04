// ======================================================
// CONFIGURAÇÃO
// ======================================================

const API_URL = "http://localhost:3000";

const formulario = document.getElementById("form-evento");
const lista = document.getElementById("lista-eventos");
const mensagem = document.getElementById("mensagem");
const total = document.getElementById("stat-total");

let eventoEditando = null;

// ======================================================
// LISTAR EVENTOS
// ======================================================

async function carregarEventos() {

    try {

        const resposta = await fetch(API_URL + "/api/eventos");

        console.log("Status:", resposta.status);

        if (!resposta.ok) {
            throw new Error("HTTP " + resposta.status);
        }

        const eventos = await resposta.json();

        console.log(eventos);

        lista.innerHTML = "";

        total.textContent = eventos.length;

        if (eventos.length === 0) {

            mensagem.textContent = "Nenhum evento cadastrado.";

            return;
        }

        mensagem.textContent = "";

        // resto do código permanece igual...

        eventos.forEach(evento => {

            const card = document.createElement("article");

            card.className = "cartao";

            card.innerHTML = `

                <div class="cartao-info">

                    <h3>${evento.nome}</h3>

                    <p>${evento.data}</p>

                </div>

                <div class="cartao-acoes">

                    <button
                        class="btn-editar"
                        onclick="editarEvento(${evento.id})">

                        Editar

                    </button>

                    <button
                        class="btn-apagar"
                        onclick="apagarEvento(${evento.id})">

                        Apagar

                    </button>

                </div>

            `;

            lista.appendChild(card);

        });

    }

    catch (erro) {

        mensagem.textContent = "Erro ao carregar eventos.";

        console.error(erro);

    }

}

// ======================================================
// GUARDAR (NOVO OU EDITAR)
// ======================================================

formulario.addEventListener("submit", async (e) => {

    e.preventDefault();

    const evento = {

        nome: document.getElementById("nome").value.trim(),

        data: document.getElementById("data").value

    };

    if (evento.nome === "" || evento.data === "") {

        alert("Preencha todos os campos.");

        return;

    }

    try {

        if (eventoEditando === null) {

            await fetch(API_URL + "/api/eventos", {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify(evento)

            });

        } else {

            await fetch(API_URL + "/api/eventos/" + eventoEditando, {

                method: "PUT",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify(evento)

            });

            eventoEditando = null;

            document.getElementById("btnSalvar").textContent = "Adicionar";

        }

        formulario.reset();

        carregarEventos();

    }

    catch (erro) {

        console.error(erro);

        alert("Erro ao guardar o evento.");

    }

});

// ======================================================
// EDITAR
// ======================================================

async function editarEvento(id) {

    try {

        const resposta = await fetch(API_URL + "/api/eventos/" + id);

        const evento = await resposta.json();

        document.getElementById("nome").value = evento.nome;

        document.getElementById("data").value = evento.data;

        eventoEditando = id;

        document.getElementById("btnSalvar").textContent = "Atualizar";

        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    }

    catch (erro) {

        console.error(erro);

        alert("Erro ao carregar o evento.");

    }

}

// ======================================================
// APAGAR EVENTO
// ======================================================

async function apagarEvento(id) {

    const confirmar = confirm("Deseja realmente apagar este evento?");

    if (!confirmar) return;

    try {

        const resposta = await fetch(API_URL + "/api/eventos/" + id, {

            method: "DELETE"

        });

        if (!resposta.ok) {
            throw new Error("Erro ao apagar.");
        }

        carregarEventos();

    }

    catch (erro) {

        console.error(erro);

        alert("Não foi possível apagar o evento.");

    }

}

// ======================================================
// LIMPAR FORMULÁRIO
// ======================================================

function limparFormulario() {

    formulario.reset();

    eventoEditando = null;

    const botao = document.getElementById("btnSalvar");

    if (botao) {
        botao.textContent = "Adicionar";
    }

}

// ======================================================
// CARREGAMENTO INICIAL
// ======================================================

window.addEventListener("DOMContentLoaded", () => {

    carregarEventos();

});