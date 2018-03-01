function GAME(width, height, ctx) {
    var GAME = {
        width,
        height,
        ctx,
        blocks: [],
        mobs: [],
        direction: 0,
        player: null,
        drawFrom: 0,
        drawTo: 12,
        space: 7,
        minSpace: 2,
        isPaused: false,
        jump: 0,
        bullets: [],

        imageLodar: null,
        navigator: {lastUpdate: 0, forward: false, backward: false, up: false},
        sizes: {blockWidth: 111, blockHeight: 111, tableWidth: 100, tableHeight: 8},
        movement: {lastUpdate: new Date(), period: 75},
        gravity: 0.2
    }

    GAME.updateImageFrame = function() {
        var now = new Date();

        if(now - this.movement.lastUpdate >= this.movement.period) {
            this.movement.lastUpdate = now;
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

        var play = GAME.player.getMove();

        GAME.ctx.drawImage(play.image.image,
                            play.image.x, play.image.y, 
                            GAME.sizes.blockWidth, 
                            GAME.sizes.blockHeight, 
                            play.x - GAME.drawFrom * GAME.sizes.blockWidth, 
                            play.y, GAME.sizes.blockWidth, 
                            GAME.sizes.blockHeight);
    };

    GAME.round = function () {
        var now = new Date();
        var diff = (now - GAME.navigator.lastUpdate) / 1000;

        GAME.player.move(diff, GAME.navigator);

        GAME.navigator.lastUpdate = now;
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
        interval = setInterval(GAME.round, 1);
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
        GAME.player = new Player();
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