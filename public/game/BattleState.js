export default class BattleState {
    constructor(game) {
        this.game = game;
    }

    enter() {
        console.log("Wchodzisz do: BATTLE");

        const button = document.createElement("button");
        button.id = "backToLobby";
        button.textContent = "Zakończ i wróć do lobby";
        document.body.appendChild(button);

        button.onclick = () => this.game.changeState("lobby");
    }

    exit() {
        document.getElementById("backToLobby")?.remove();
        this.game.app.stage.removeChildren();
    }

    update(delta) {}
}
