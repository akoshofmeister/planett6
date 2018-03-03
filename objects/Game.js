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

        fps: 25
    }

    GAME.isWrongPosition = function(x, y) {
        let x2 = this.normalizeX(x + this.sizes.tableWidth);
        x = this.normalizeX(x);
        y = this.normalizeY(y);

        if(
            x != x2 &&
            this.validPos(x,y) && 
            this.validPos(x2,y) &&
            this.blocks[x * this.sizes.tableHeight + y].type != 
            this.blocks[x2 * this.sizes.tableHeight + y].type
        ) {
            if(this.blocks[x * this.sizes.tableHeight + y].type == "sky") {
                return -1;
            } else {
                return 1;
            }
        }

        return 0;
    }

    GAME.getGoodPosition = function(x,y) {
        let isWrongPosition = this.isWrongPosition(x,y);

        if(isWrongPosition == 1) {
            return (this.normalizeX(x)+1)*this.sizes.blockWidth;
        } else if(isWrongPosition == -1) {
            return this.normalizeX(x)*this.sizes.blockWidth;
        }
    }

    GAME.validPos = function(x, y, doNormalization) {
        if(doNormalization) {
            x = this.normalizeX(x);
            y = this.normalizeX(y);
        }

        return y < this.sizes.tableHeight && !!this.blocks[x * this.sizes.tableHeight + y];
    }

    GAME.canFall = function(x, y, doNormalization) {
        x += this.sizes.blockWidth / 2;
        
        if(doNormalization) {
            x = this.normalizeX(x);
            y = this.normalizeX(y);
        }

        return this.blocks[x * this.sizes.tableHeight + y + 1].type == "sky";
    }

    GAME.canGo = function(x, y, forward, doNormalization) {
        if(doNormalization) {
            x = this.normalizeX(x);
            y = this.normalizeX(y);
        }

        if(forward) {
            x++;
        }

        return !!this.blocks[x * this.sizes.tableHeight + y] && this.blocks[x * this.sizes.tableHeight + y].type == "sky";
    }

    GAME.getGround = function(x, doNormalization) {
        x += this.sizes.blockWidth / 2;

        if(doNormalization) {
            x = this.normalizeX(x);
        }

        var blocks = this.blocks.slice(x * this.sizes.tableHeight, x * this.sizes.tableHeight + this.sizes.tableHeight);

        for(var i in blocks) {
            //TODO groundTop
            if(blocks[i].type == "ground") {
                return blocks[i-1];
            }
        }
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

                if(i == 1) {
                    if(j == 5 || j == 4) {
                        type = "ground";
                    }
                } else if(i == 2) {
                    if(j == 5 || j == 4) {
                        type = "ground";
                    }
                } else if(i == 4) {
                    if(j == 5) {
                        type = "ground";
                    }
                }

                GAME.blocks.push(new Block(type, GAME.imageLoader.get(type), i * GAME.sizes.blockWidth, j * GAME.sizes.blockHeight ));
            }
        }
    }

    var addPlayer = function () {
        GAME.players.push(new Player());
        //GAME.players.push(new Player(true));
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