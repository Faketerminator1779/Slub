import GameManager from "./game/GameManager.js";
import * as PIXI from "https://cdn.skypack.dev/pixi.js@8.1.1";

const socket = io();

const app = new PIXI.Application();
await app.init({
  width: 704,
  height: 704,
  background: 0x000000
});

document.body.appendChild(app.canvas);


const game = new GameManager(app, socket);
game.changeState("lobby");

app.ticker.add((delta) => {
    game.update(delta);
});
