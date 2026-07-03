const app = document.getElementById("app");

let estado = {
    tela: "invite"
};

const SHEETS_URL = "https://script.google.com/macros/s/AKfycbwL4y6dE7UpUd0a39HH3eWRl7IeZqZMz_8GmkvHym1Kp0Fn791P1XzaD0LANsiMwqk-Cg/exec";

function trocarTela(renderFunction) {

    app.classList.add("fade-out");

    setTimeout(() => {

        renderFunction();

        app.classList.remove("fade-out");
        app.classList.add("fade-in");

        setTimeout(() => {
            app.classList.remove("fade-in");
        }, 250);

    }, 200);

}

const pedido = {
    filme: null,
    dia: "",
    sala: "",
    horario: "",
    poltronas: [],
    pipoca: "",
    bebida: "",
    nome: "",
    criadoEm: ""
};

function renderInvite() {

    app.innerHTML = `
        <div class="invite">

            <h1 class="title">
                CineLepolis
            </h1>

            <p class="subtitle">
                Área de acesso VIP
            </p>

            <p class="tagline">
                Digite a senha para continuar.
            </p>

            <div class="input-wrapper">

                <input
                    type="password"
                    id="invitePassword"
                    class="text-input"
                    placeholder="Digite a senha"
                    autocomplete="off"
                >

            </div>

        <div id="inviteMessage"></div>

            <button class="btn-primary" id="inviteBtn">
                Entrar
            </button>

        </div>
    `;

    const input = document.getElementById("invitePassword");
    const button = document.getElementById("inviteBtn");

    input.focus();

    function validarSenha() {

        if (input.value === CONFIG.INVITE_CODE) {

            trocarTela(renderHome);

        } else {

            document.getElementById("inviteMessage").innerHTML = `
                <p class="error-message">
                    Senha incorreta.
                </p>
            `;

            input.select();

        }

    }

    button.addEventListener("click", validarSenha);

    input.addEventListener("keydown", (e) => {

        if (e.key === "Enter") {

            validarSenha();

        }

    });

}

function renderHome() {
    app.innerHTML = `
        <div class="home">
            <h1 class="title">CineLepolis</h1>

            <p class="subtitle">
                Sua próxima sessão começa aqui.
            </p>

            <p class="tagline">
                Mais do que um filme. Uma experiência.
            </p>

            <button class="btn-primary" id="startBtn">
                Comprar Ingresso
            </button>
        </div>
    `;

    document.getElementById("startBtn").addEventListener("click", () => {
        irPara("movies");
    });
}

function renderMovies() {

    app.innerHTML = `
        <div class="movies">

            <h2 class="section-title">Filmes em Cartaz</h2>

            <div class="movies-grid">

                ${movies.map(movie => `
                    
                    <div class="movie-card" data-id="${movie.id}">
                        
                        <img src="${movie.poster}" alt="${movie.title}" />

                        <div class="movie-info">
                            <h3>${movie.title}</h3>
                            <p>${movie.genre} •</p>
                            <span>${movie.duration}</span>
                        </div>

                    </div>

                `).join("")}

            </div>

        </div>
    `;

    document.querySelectorAll(".movie-card").forEach(card => {
        card.addEventListener("click", () => {
            const id = card.getAttribute("data-id");
            const movie = movies.find(m => m.id == id);

            pedido.filme = movie;

            irPara("details");

        });
    });
}

function renderMovieDetails() {

    const movie = pedido.filme;

    app.innerHTML = `
        <div class="movie-details">

    ${renderMovieDetailsContent(movie)}

    <section class="movie-synopsis">

        <h2>Sinopse</h2>

        <p>${movie.synopsis}</p>

    </section>

    <section class="movie-trailer">

        <h2>Trailer</h2>

        <div class="trailer-container">

            <iframe
                src="https://www.youtube.com/embed/${movie.trailer}"
                title="Trailer"
                frameborder="0"
                allowfullscreen>
            </iframe>

        </div>

    </section>

    <section class="movie-sessions">

                <h2>Escolha o dia</h2>

                <div class="day-buttons">

                    ${movie.days.map(day => `

                        <button
                            class="day-btn"
                            data-day="${day.day}"
                        >
                            ${day.day}
                        </button>

                    `).join("")}

                </div>

                <div id="sessionsContainer"></div>
                <div id="nextContainer"></div>

            </section>

        </div>
    `;

    document.getElementById("backMovie").addEventListener("click", () => {
        irPara("movies");
    });

    const dayButtons = document.querySelectorAll(".day-btn");

    dayButtons.forEach(button => {

        button.addEventListener("click", () => {

            dayButtons.forEach(btn =>
                btn.classList.remove("selected")
            );

            button.classList.add("selected");

            pedido.dia = button.dataset.day;

            pedido.sala = "";
            pedido.horario = "";

            document.getElementById("nextContainer").innerHTML = "";

            const selectedDay = movie.days.find(
                d => d.day === pedido.dia
            );

            const container = document.getElementById("sessionsContainer");

            container.classList.add("fade-out");

            setTimeout(() => {

                container.innerHTML = `

                    ${selectedDay.rooms.map(room => `

                        <div class="room">

                            <h3>${room.room}</h3>

                            <div class="session-buttons">

                                ${room.sessions.map(session => `

                                    <button
                                        class="session-btn"
                                        data-room="${room.room}"
                                        data-session="${session}"
                                    >
                                        ${session}
                                    </button>

                                `).join("")}

                            </div>

                        </div>

                    `).join("")}

                `;

                container.classList.remove("fade-out");
                container.classList.add("fade-in");

                setTimeout(() => {
                    container.classList.remove("fade-in");
                }, 250);

                ativarBotoesSessao();

            }, 200);

        });

    });

}

function ativarBotoesSessao() {

    document.getElementById("nextContainer").innerHTML = "";
    const sessionButtons = document.querySelectorAll(".session-btn");

    sessionButtons.forEach(button => {

        button.addEventListener("click", () => {

            sessionButtons.forEach(btn =>
                btn.classList.remove("selected")
            );

            button.classList.add("selected");

            pedido.sala = button.dataset.room;
            pedido.horario = button.dataset.session;

            document.getElementById("nextContainer").innerHTML = `
                <button class="btn-primary" id="nextSeats">
                    Avançar
                </button>
            `;

            document.getElementById("nextSeats").addEventListener("click", () => {

                irPara("seats");

            });

        });

    });

}

function renderSeats() {

    const rows = "ABCDEFGHIJKL".split("");

    app.innerHTML = `
        <div class="seats">

            <button class="btn-back" id="backSeats">
                ← Voltar
            </button>

            <h1 class="seats-title">
                Escolha suas poltronas
            </h1>

            <div class="screen">
                TELA
            </div>

            <div class="seats-grid">

                ${rows.map(row => `

                    <div class="seat-row">

                        ${Array.from({ length: 13 }, (_, i) => {

                            const seatId = row + (i + 1);

                            return `
                                <div class="seat" data-seat="${seatId}">
                                    ${seatId}
                                </div>
                            `;

                        }).join("")}

                    </div>

                `).join("")}

            </div>

            <div id="seatsNextContainer"></div>

        </div>
    `;

    document.getElementById("backSeats").addEventListener("click", () => {
        irPara("details");
    });

    const seats = document.querySelectorAll(".seat");

    seats.forEach(seat => {

        seat.addEventListener("click", () => {

            seat.classList.toggle("selected");

            const selectedSeats = Array.from(document.querySelectorAll(".seat.selected"))
                .map(s => s.dataset.seat);

            pedido.poltronas = selectedSeats;

            const container = document.getElementById("seatsNextContainer");

            if (selectedSeats.length > 0) {

                container.innerHTML = `
                    <button class="btn-primary" id="nextCombo">
                        Avançar
                    </button>
                `;

                document.getElementById("nextCombo").addEventListener("click", () => {
                    irPara("combo");
                });

            } else {
                container.innerHTML = "";
            }

        });

    });

}

function renderCombo() {

    app.innerHTML = `
        <div class="combo">

            <button class="btn-back" id="backCombo">
                ← Voltar
            </button>

            <h1 class="combo-title">
                Escolha seu combo
            </h1>

            <div class="combo-section">

                <h2>Pipoca</h2>

                <div class="options" id="pipocaOptions">
                    <div class="option" data-value="Salgada">Salgada</div>
                    <div class="option" data-value="Doce">Doce</div>
                    <div class="option" data-value="Sem pipoca">Sem pipoca</div>
                </div>

            </div>

            <div class="combo-section">

                <h2>Bebida</h2>

                <div class="options" id="bebidaOptions">
                    <div class="option" data-value="Coca 300ml">Coca 300ml</div>
                    <div class="option" data-value="Coca 500ml">Coca 500ml</div>
                    <div class="option" data-value="Sem bebida">Sem bebida</div>
                </div>

            </div>

            <div id="comboNextContainer"></div>

        </div>
    `;

    document.getElementById("backCombo").addEventListener("click", () => {
        irPara("seats");
    });

    let pipoca = "";
    let bebida = "";

    document.querySelectorAll("#pipocaOptions .option").forEach(option => {

        option.addEventListener("click", () => {

            document.querySelectorAll("#pipocaOptions .option")
                .forEach(o => o.classList.remove("selected"));

            option.classList.add("selected");

            pipoca = option.dataset.value;
            pedido.pipoca = pipoca;

            updateButton();

        });

    });

    document.querySelectorAll("#bebidaOptions .option").forEach(option => {

        option.addEventListener("click", () => {

            document.querySelectorAll("#bebidaOptions .option")
                .forEach(o => o.classList.remove("selected"));

            option.classList.add("selected");

            bebida = option.dataset.value;
            pedido.bebida = bebida;

            updateButton();

        });

    });

    function updateButton() {

        if (pipoca && bebida) {

            document.getElementById("comboNextContainer").innerHTML = `
                <button class="btn-primary" id="nextName">
                    Avançar
                </button>
            `;

            document.getElementById("nextName").addEventListener("click", () => {
                irPara("name");
            });

        }

    }

}

function renderName() {

    app.innerHTML = `
        <div class="name">

            <button class="btn-back" id="backName">
                ← Voltar
            </button>

            <h1 class="name-title">
                Finalizar ingresso
            </h1>

            <p class="name-subtitle">
                Digite seu nome para gerar o ingresso
            </p>

            <div class="input-wrapper">

                <input
                    type="text"
                    id="userName"
                    class="text-input"
                    placeholder="Digite seu nome"
                    autocomplete="off"
                />

            </div>

            <div id="nameNextContainer"></div>

        </div>
    `;

    document.getElementById("backName").addEventListener("click", () => {
        irPara("combo");
    });

    const input = document.getElementById("userName");

    input.focus();

    input.addEventListener("input", () => {

        const value = input.value.trim();

        pedido.nome = value;

        const container = document.getElementById("nameNextContainer");

        if (value.length > 2) {

            container.innerHTML = `
                <button class="btn-primary" id="finishTicket">
                    Finalizar ingresso
                </button>
            `;

            document.getElementById("finishTicket").addEventListener("click", async () => {

                pedido.criadoEm = new Date().toLocaleString("pt-BR");

                console.log("DEBUG criadoEm:", pedido.criadoEm);

                await enviarParaSheets();

                irPara("ticket");

            });

        } else {

            container.innerHTML = "";

        }

    });

}

function renderTicket() {

    if (!pedido.criadoEm) {
        pedido.criadoEm = new Date().toLocaleString("pt-BR");
    }

    const movie = pedido.filme;

    app.innerHTML = `
    <div class="ticket-wrapper">

        <h1 class="ticket-title">Seu ingresso está pronto 🎟️</h1>

        <div class="ticket" id="ticketCard">

            <div class="ticket-header">
                <h2 class="cinema-name">CineLepolis</h2>
                <span class="ticket-label">ADMIT ONE</span>
            </div>

            <div class="ticket-body">

                <div class="ticket-movie">
                    <h3>${movie.title}</h3>
                    <p>${movie.genre}</p>
                </div>

                <div class="ticket-info">

                    <div>
                        <span>Nome</span>
                        <strong>${pedido.nome}</strong>
                    </div>

                    <div>
                        <span>Dia</span>
                        <strong>${pedido.dia}</strong>
                    </div>

                    <div>
                        <span>Sala</span>
                        <strong>${pedido.sala}</strong>
                    </div>

                    <div>
                        <span>Horário</span>
                        <strong>${pedido.horario}</strong>
                    </div>

                    <div>
                        <span>Poltronas</span>
                        <strong>${pedido.poltronas.join(", ")}</strong>
                    </div>

                    <div>
                        <span>Combo</span>
                        <strong>${pedido.pipoca} • ${pedido.bebida}</strong>
                    </div>

                     <div>
                        <span>Gerado em</span>
                        <strong>${pedido.criadoEm || "—"}</strong>
                    </div>

                </div>

            </div>

            <div class="ticket-footer">
                <span>Apresente este ingresso na entrada</span>
            </div>

        </div>

        <button class="btn-primary" id="downloadTicket">
            Baixar ingresso
        </button>

    </div>
`;

    document.getElementById("downloadTicket").addEventListener("click", () => {
        downloadTicketImage();
    });

}

function downloadTicketImage() {

    const ticket = document.getElementById("ticketCard");

    html2canvas(ticket).then(canvas => {

        const link = document.createElement("a");

        link.download = "meu-ingresso-cinelepolis.png";
        link.href = canvas.toDataURL("image/png");

        link.click();

    });

}

function irPara(tela) {

    estado.tela = tela;

    if (tela === "invite") {
        trocarTela(renderInvite);
    }

    if (tela === "home") {
        trocarTela(renderHome);
    }

    if (tela === "movies") {
        trocarTela(renderMovies);
    }

    if (tela === "details") {
        trocarTela(renderMovieDetails);
    }

    if (tela === "seats") {
        trocarTela(renderSeats);
    }

    if (tela === "combo") {
        trocarTela(renderCombo);
    }

    if (tela === "name") {
        trocarTela(renderName);
    }

    if (tela === "ticket") {
        trocarTela(renderTicket);
    }
}

async function enviarParaSheets() {

    try {

        const resposta = await fetch(SHEETS_URL, {

            method: "POST",

            body: JSON.stringify({

                nome: pedido.nome,
                filme: pedido.filme.title,
                dia: pedido.dia,
                sala: pedido.sala,
                horario: pedido.horario,
                poltronas: pedido.poltronas.join(", "),
                pipoca: pedido.pipoca,
                bebida: pedido.bebida,
                criadoEm: pedido.criadoEm

            })

        });

        console.log(await resposta.text());

    } catch (erro) {

        console.error("Erro ao enviar:", erro);

    }

}

irPara("invite");