export default class CutsceneState {
    constructor(game) {
        this.game = game;
    }

    enter() {
        console.log("Wchodzisz do: CUTSCENE");

        const button = document.createElement("button");
        button.id = "toBattle";
        button.textContent = "Walka!";
        document.body.appendChild(button);

        button.onclick = () => this.game.changeState("battle");
    }

    exit() {
        document.getElementById("toBattle")?.remove();
        this.game.app.stage.removeChildren();
    }

    update(delta) {}
}
