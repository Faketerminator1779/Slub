import * as PIXI from "https://cdn.skypack.dev/pixi.js@8.1.1";
export default class ExploreState {
    constructor(game) {
        this.game = game;
        this.mapContainer = new PIXI.Container();
        this.tiles = [];
        this.textures = {};
        this.players = {};
        this.playerSprites = {}; 
    }

    async enter() {
        console.log("Wchodzisz do: EXPLORE");
        this.game.app.canvas.style.display = "block";

        this.game.app.view.style.imageRendering = "pixelated";
        this.game.app.stage.roundPixels = true;
        await this.loadTextures();
        this.game.app.stage.addChild(this.mapContainer);
        if (this.game.map) {
            this.renderMap(this.game.map);
        }
        this.game.socket.on("mapData", (mapData) => {
            this.renderMap(mapData);
        });
        this.game.socket.on("playersUpdate", (playersArray) => {
            this.players = {};

            for (const p of playersArray) {
                this.players[p.id] = p;
            }

            this.renderMap(this.game.map);
        });
    }

    async loadTextures() {

        const tileDefs = {
            tile: "img/tile.png",
            window: "img/window.png",
            wall_left: "img/wall_left.png",
            wall_down: "img/wall_down.png",
            wall_right: "img/wall_right.png",
            wall_down_right: "img/wall_down_right.png",
            wall_down_left: "img/wall_down_left.png",
            bench_left: "img/bench_left.png",
            bench_middle: "img/bench_middle.png",
            bench_right: "img/bench_right.png",
            carpet_top_left: "img/carpet_top_left.png",
            carpet_top: "img/carpet_top.png",
            carpet_top_right: "img/carpet_top_right.png",
            carpet_left: "img/carpet_left.png",
            carpet: "img/carpet.png",
            carpet_right: "img/carpet_right.png",
            carpet_down_left: "img/carpet_down_left.png",
            carpet_down: "img/carpet_down.png",
            carpet_down_right: "img/carpet_down_right.png",

            Fake: "img/player.png",
        };
        
        for (const [name, path] of Object.entries(tileDefs)) {
            this.textures[name] = await PIXI.Assets.load(path);
        }
    }

    renderMap(mapData) {
        this.mapContainer.removeChildren();
        this.tiles = [];
        const TILE_SIZE = 64
        mapData.forEach((row, y) => {
            row.forEach((tile, x) => {
                const floorTex = this.textures[tile.floor] || this.textures["tile"];
                const sprite = new PIXI.Sprite(floorTex);
                sprite.x = x * TILE_SIZE;
                sprite.y = y * TILE_SIZE;

                this.mapContainer.addChild(sprite);
                this.tiles.push(sprite);

                if (tile.object) {
                    const objTex = this.textures[tile.object];
                    if (objTex) {
                        const objSprite = new PIXI.Sprite(objTex);
                        objSprite.width = TILE_SIZE;
                        objSprite.height = TILE_SIZE;
                        objSprite.x = x * TILE_SIZE;
                        objSprite.y = y * TILE_SIZE;
                        this.mapContainer.addChild(objSprite);
                    }
                }
            });
        });

        for (const id in this.playerSprites) {
            this.mapContainer.removeChild(this.playerSprites[id]);
            this.playerSprites[id].destroy();
        }
        this.playerSprites = {};

        for (const id in this.players) {
            const player = this.players[id];
            const texture = this.textures[player.texture];

            if (texture) {
                const sprite = new PIXI.Sprite(texture);
                sprite.width = TILE_SIZE;
                sprite.height = TILE_SIZE;
                sprite.x = player.x * TILE_SIZE;
                sprite.y = player.y * TILE_SIZE;

                this.mapContainer.addChild(sprite);
                this.playerSprites[id] = sprite;
            }
        }

    }

    exit() {
        this.game.app.stage.removeChild(this.mapContainer);
        this.mapContainer.destroy({ children: true });
        this.mapContainer = new PIXI.Container();
    }

    update(delta) {}
}
