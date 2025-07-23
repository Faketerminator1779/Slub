import * as PIXI from "https://cdn.skypack.dev/pixi.js@8.1.1";
export default class LobbyState {
    constructor(game) {
        this.game = game;
        this.square = null;
    }

    async enter() {
        console.log("Wchodzisz do: LOBBY");
        this.game.app.canvas.style.display = "none";

        const ui = document.createElement("div");
        ui.id = "lobby-ui";
        ui.innerHTML = `
            <h2>Lobby</h2>
            <input type="text" id="player-name" placeholder="Wpisz SWÓJ kod" />
            <button id="toExplore">Wejdź do gry</button>
        `;
        document.body.appendChild(ui);

        document.getElementById("toExplore").onclick = () => {
            const name = document.getElementById("player-name").value.trim();
            if (name) {
                this.game.playerData = { name };
                this.game.changeState("explore");
            }
        };


        this.game.changeState("explore");
    }

    exit() {
        this.game.app.canvas.style.display = "block";
        document.getElementById("lobby-ui")?.remove();
    }

    update(delta) {
    }
}
