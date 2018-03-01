function GAME(width, height, ctx) {
    var GAME = {
        width,
        height,
        ctx,
        drawFrom: 0,
        drawTo: 12,
        isPaused: false,

        imageLodar: null,
        navigator: { "player" : {lastUpdate: 0, forward: false, backward: false, up: false}, "player2": {lastUpdate: 0, forward: false, backward: false, up: false}},
        sizes: {blockWidth: 111, blockHeight: 111, tableWidth: 100, tableHeight: 8},
        movement: {lastUpdate: new Date(), period: 60},
        gravity: 0.2,

        players: [],
        blocks: [],
        npc: [],
        bullets: [],

        fps: 30
    }

    GAME.updateImageFrame = function(reset) {
        var now = new Date();

        if(now - this.movement.lastUpdate >= this.movement.period) {
            reset && (this.movement.lastUpdate = now);
            return true;
        }

        return false;
    }

    GAME.draw = function () {
        ctx.clearRect(0, 0, 1473, 888);
        var background = GAME.imageLoader.get("background");
        ctx.drawImage(background.image, 0, 0);

        var blocks = GAME.blocks.slice(GAME.drawFrom * GAME.sizes.tableHeight, (GAME.drawTo + 2) * GAME.sizes.tableHeight - GAME.drawFrom * GAME.sizes.tableHeight);

        blocks.forEach((block) => {
            if(block.getImage().image) {
                GAME.ctx.drawImage(block.getImage().image, block.getX() - GAME.drawFrom * GAME.sizes.blockWidth, block.getY());
            }
        });

        this.players.forEach((player) => {
            var play = player.getMove();
            GAME.ctx.drawImage(play.image.image,
                play.image.x, play.image.y, 
                GAME.sizes.blockWidth, 
                GAME.sizes.blockHeight, 
                play.x - GAME.drawFrom * GAME.sizes.blockWidth, 
                play.y, GAME.sizes.blockWidth, 
                GAME.sizes.blockHeight);
        })

        GAME.updateImageFrame(true);
    };

    GAME.round = function () {
        var now = new Date();

        GAME.players.forEach((player) => { 
            var diff = (now - GAME.navigator[player.player2 ? "player2" : "player"].lastUpdate) / 1000; 
            player.move(diff, GAME.navigator[player.player2 ? "player2" : "player"]) 
        });

        GAME.navigator.player.lastUpdate = now;
        GAME.navigator.player2.lastUpdate = now;
        GAME.draw();
    };

    GAME.normalizeX = function(x) {
        return Math.floor(x / GAME.sizes.blockWidth);
    }

    GAME.normalizeY = function(y) {
        return Math.floor(y / GAME.sizes.blockHeight);
    }

    var interval;

    GAME.start = function () {
        GAME.isPaused = false;
        interval = setInterval(GAME.round, 1000 / GAME.fps);
    };

    GAME.stop = function () {
        if (interval) {
            clearInterval(interval);
            GAME.isPaused = true;
        }
    };

    var createBlocks = function () {
        for (var i = 0; i < GAME.sizes.tableWidth; ++i) {
            for (var j = 0; j < GAME.sizes.tableHeight; ++j) {
                var type = j > 5 ? "ground" : "sky";
                GAME.blocks.push(new Block(type, GAME.imageLoader.get(type), i * GAME.sizes.blockWidth, j * GAME.sizes.blockHeight ));
            }
        }
    }

    var addPlayer = function () {
        GAME.players.push(new Player());
        GAME.players.push(new Player(true));
    }

    GAME.create = function () {
        return new Promise((resolve, reject) => {
            try {
                GAME.imageLoader = new imageLoader();
                GAME.imageLoader.loadAll()
                    .then(()=>{
                        createBlocks();
                        addPlayer();
                        resolve();
                    })
            } catch(err) {
                reject(err);
            }
        });
    }

    return GAME;
}