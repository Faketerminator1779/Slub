import LobbyState from "./LobbyState.js";
import ExploreState from "./ExploreState.js";
import CutsceneState from "./CutsceneState.js";
import BattleState from "./BattleState.js";

export default class GameManager {
    constructor(app, socket) {
        this.app = app;
        this.socket = socket;
        this.playerData = null;

        this.states = {
            lobby: new LobbyState(this),
            explore: new ExploreState(this),
            cutscene: new CutsceneState(this),
            battle: new BattleState(this),
        };

        this.currentState = null;
    }

    changeState(name) {
        if (this.currentState?.exit) {
            this.currentState.exit();
        }

        this.currentState = this.states[name];
        if (this.currentState?.enter) {
            this.currentState.enter();
        }
    }

    update(delta) {
        if (this.currentState?.update) {
            this.currentState.update(delta);
        }
    }
}
