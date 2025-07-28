const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const codes = {
  "1": "Fake"
}

const playerTextures = {
    Fake: 'Fake',
};

const MAP_WIDTH = 11;
const MAP_HEIGHT = 11;

const gameMap = Array.from({ length: MAP_HEIGHT }, () =>
  Array.from({ length: MAP_WIDTH }, () => ({
    floor: 'tile',
    object: null,
  }))
);

for (let x = 0; x < MAP_WIDTH; x++) {
  gameMap[0][x].object = 'window';
}

for (let x = 0; x < MAP_WIDTH; x++) {
  gameMap[10][x].object = 'wall_down';
}

for (let y = 0; y < MAP_HEIGHT; y++) {
  gameMap[y][0].object = 'wall_left';
}

for (let y = 0; y < MAP_HEIGHT; y++) {
  gameMap[y][10].object = 'wall_right';
}
gameMap[10][0].object = 'wall_down_left';

gameMap[10][10].object = 'wall_down_right';

gameMap[9][1].object = 'bench_left';
gameMap[9][2].object = 'bench_middle';
gameMap[9][3].object = 'bench_right';

gameMap[9][7].object = 'bench_left';
gameMap[9][8].object = 'bench_middle';
gameMap[9][9].object = 'bench_right';

gameMap[7][1].object = 'bench_left';
gameMap[7][2].object = 'bench_middle';
gameMap[7][3].object = 'bench_right';

gameMap[7][7].object = 'bench_left';
gameMap[7][8].object = 'bench_middle';
gameMap[7][9].object = 'bench_right';

gameMap[5][1].object = 'bench_left';
gameMap[5][2].object = 'bench_middle';
gameMap[5][3].object = 'bench_right';

gameMap[5][7].object = 'bench_left';
gameMap[5][8].object = 'bench_middle';
gameMap[5][9].object = 'bench_right';

gameMap[3][1].object = 'bench_left';
gameMap[3][2].object = 'bench_middle';
gameMap[3][3].object = 'bench_right';

gameMap[3][7].object = 'bench_left';
gameMap[3][8].object = 'bench_middle';
gameMap[3][9].object = 'bench_right';

gameMap[2][4].object = 'carpet_top_left';
gameMap[2][5].object = 'carpet_top';
gameMap[2][6].object = 'carpet_top_right';

for (let y = 0; y < 6; y++) {
  gameMap[3+y][4].object = 'carpet_left';
}

for (let y = 0; y < 6; y++) {
  gameMap[3+y][5].object = 'carpet';
}

for (let y = 0; y < 6; y++) {
  gameMap[3+y][6].object = 'carpet_right';
}

gameMap[9][4].object = 'carpet_down_left';
gameMap[9][5].object = 'carpet_down';
gameMap[9][6].object = 'carpet_down_right';

const mapObjects = {
  window:  { walkable: false },
  wall:  { walkable: false },
};

const PORT = process.env.PORT || 3000;
const players = {};

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('joinGame', (code) => {
        const role = codes[code];

        if (!role) {
            socket.emit('joinDenied', 'Niepoprawny kod');
            return;
        }

        const spawnX = 5;
        const spawnY = 5;

        const texture = playerTextures[role];

        players[socket.id] = {
            id: socket.id,
            x: spawnX,
            y: spawnY,
            role: role,
            texture: texture,
        };

        socket.emit('gameJoined', {
            map: gameMap,
            player: {
                x: spawnX,
                y: spawnY,
                texture: texture
            },
        });

        console.log(`Gracz ${socket.id} dołączył jako ${role}`);
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
        delete players[socket.id];
        io.emit('playerDisconnected', socket.id);
    });
});

http.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});
