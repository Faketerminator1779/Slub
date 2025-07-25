import * as PIXI from "https://cdn.skypack.dev/pixi.js@8.1.1";
export default class LobbyState {
    constructor(game) {
        this.game = game;
    }

    async enter() {
        console.log("Wchodzisz do: LOBBY");
        this.game.app.canvas.style.display = "none";

        const ui = document.createElement("div");
        ui.id = "lobby-ui";
        ui.innerHTML = `
            <h2>Lobby</h2>
            <input type="text" id="code" placeholder="Wpisz SWÓJ kod" />
            <button id="enterBtn">Wejdź do gry</button>
        `;
        document.body.appendChild(ui);

        document.getElementById("enterBtn").onclick = () => {
            const code = document.getElementById("code").value;
            if (code) {
                this.game.playerData = { code };
                this.game.socket.emit("joinGame", code);
            }
        };

        this.game.socket.on("joinDenied", (msg) => {
            console.log(msg)
        });

        this.game.socket.on("gameJoined", (data) => {
            this.game.map = data.map;
            this.game.playerData = data.player;
            this.game.changeState("explore");
        });
    }

    exit() {
        document.getElementById("lobby-ui")?.remove();
    }

    update(delta) {
    }
}
